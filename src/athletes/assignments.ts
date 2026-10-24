import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useAuth } from '../auth/context'
import type { Athlete } from '../domain/athlete'
import type { Reference } from '../domain/reference'
import { SNAPSHOT_VERSION, buildSnapshot, type ExerciseName } from '../domain/snapshot'
import { errMsg } from '../lib/errors'
import { supabase } from '../lib/supabase'
import { hashToken, newToken } from '../lib/token'
import { addDays, parseISO, toISO } from '../lib/week'
import { fetchWorkoutDetail } from './builder'

/** Durée de validité d'un lien après la date de la séance, en jours. */
export const VALID_DAYS = 7

/** Fin de journée (heure locale) de max(date de séance, aujourd'hui) + VALID_DAYS. */
export function expiryFor(scheduledOn: string | null, today: string = toISO(new Date())): string {
  const base = scheduledOn && scheduledOn > today ? scheduledOn : today
  const d = parseISO(addDays(base, VALID_DAYS))
  d.setHours(23, 59, 59, 0)
  return d.toISOString()
}

const LIST_SELECT =
  'id, workout_id, scheduled_on, status, token_expires_at, completed_at, session_rpe, created_at, ' +
  'title:snapshot->workout->>title, performed_sets(count)'

const RowSchema = z.object({
  id: z.string(),
  workout_id: z.string().nullable(),
  scheduled_on: z.string().nullable(),
  status: z.string(),
  token_expires_at: z.string().nullable(),
  completed_at: z.string().nullable(),
  session_rpe: z.number().nullable(),
  created_at: z.string(),
  title: z.string().nullable(),
  performed_sets: z.array(z.object({ count: z.number() })),
})
export type AssignmentRow = z.infer<typeof RowSchema>

export type AssignState = 'sent' | 'in_progress' | 'completed' | 'expired'
export const STATE_LABEL: Record<AssignState, string> = {
  sent: 'Envoyée',
  in_progress: 'En cours',
  completed: 'Terminée',
  expired: 'Lien expiré ou révoqué',
}

export const setsOf = (a: AssignmentRow): number => a.performed_sets[0]?.count ?? 0
export const linkActive = (a: AssignmentRow, now: number = Date.now()): boolean =>
  !!a.token_expires_at && Date.parse(a.token_expires_at) > now

export function assignmentState(a: AssignmentRow, now: number = Date.now()): AssignState {
  if (a.completed_at || a.status === 'completed') return 'completed'
  if (setsOf(a) > 0 || a.status === 'in_progress') return 'in_progress'
  return linkActive(a, now) ? 'sent' : 'expired'
}

export function useAthleteAssignments(athleteId: string | undefined) {
  const userId = useAuth().session?.user.id
  return useQuery({
    queryKey: ['assignments', userId, athleteId],
    enabled: !!userId && !!athleteId,
    queryFn: async (): Promise<AssignmentRow[]> => {
      const { data, error } = await supabase
        .from('assignments').select(LIST_SELECT).eq('athlete_id', athleteId!)
        .order('created_at', { ascending: false })
      if (error) throw error
      return z.array(RowSchema).parse(data)
    },
  })
}

const NameRow = z.object({ id: z.string(), name: z.string(), name_fr: z.string().nullable() })
const PrevRow = z.object({
  id: z.string(),
  status: z.string(),
  token_expires_at: z.string().nullable(),
  completed_at: z.string().nullable(),
  performed_sets: z.array(z.object({ count: z.number() })),
})

export type CreateResult = {
  token: string
  expiresAt: string
  assignmentId: string
  revoked: number
  revokeError: string | null
}

export function useCreateAssignment() {
  const qc = useQueryClient()
  const userId = useAuth().session?.user.id
  return useMutation({
    mutationKey: ['assign'],
    mutationFn: async (v: { workoutId: string; athlete: Athlete; refs: Reference[] }): Promise<CreateResult> => {
      if (!userId) throw new Error('Session expirée : reconnectez-vous.')
      // Attend l'enregistrement d'une ligne en cours de saisie (enregistrement au départ du champ).
      const pending = () => qc.isMutating({ predicate: (m) => m.options.mutationKey?.[0] !== 'assign' })
      for (let i = 0; i < 30 && pending() > 0; i += 1) await new Promise((r) => setTimeout(r, 100))

      const w = await fetchWorkoutDetail(v.workoutId)
      if (!w) throw new Error('Séance introuvable.')
      const ids = [...new Set(
        w.workout_blocks.flatMap((b) => b.workout_exercises.map((x) => x.exercise_id).filter((x): x is string => !!x)),
      )]
      const names = new Map<string, ExerciseName>()
      if (ids.length > 0) {
        const { data, error } = await supabase.from('exercises').select('id, name, name_fr').in('id', ids)
        if (error) throw error
        for (const e of z.array(NameRow).parse(data)) names.set(e.id, { name: e.name, nameFr: e.name_fr })
      }
      const snapshot = buildSnapshot({ workout: w, names, refs: v.refs })
      if (snapshot.blocks.every((b) => b.lines.length === 0)) throw new Error('Séance vide : ajoutez un exercice.')

      const token = newToken()
      const expiresAt = expiryFor(w.scheduled_on)
      const { data: created, error } = await supabase
        .from('assignments')
        .insert({
          athlete_id: v.athlete.id,
          organization_id: w.organization_id,
          workout_id: w.id,
          scheduled_on: w.scheduled_on,
          status: 'assigned',
          snapshot,
          snapshot_version: SNAPSHOT_VERSION,
          token_hash: await hashToken(token),
          token_expires_at: expiresAt,
          assigned_by: userId,
        })
        .select('id').single()
      if (error) throw error

      // Réassignation : révoque les liens précédents de cette séance si aucune série n'a été saisie.
      let revoked = 0
      let revokeError: string | null = null
      try {
        const { data: prev, error: e2 } = await supabase
          .from('assignments')
          .select('id, status, token_expires_at, completed_at, performed_sets(count)')
          .eq('workout_id', w.id).eq('athlete_id', v.athlete.id).neq('id', created.id)
        if (e2) throw e2
        const now = Date.now()
        for (const p of z.array(PrevRow).parse(prev)) {
          const active = !!p.token_expires_at && Date.parse(p.token_expires_at) > now
          const started = (p.performed_sets[0]?.count ?? 0) > 0
          if (p.status !== 'assigned' || p.completed_at || started || !active) continue
          const { error: e3 } = await supabase
            .from('assignments').update({ token_expires_at: new Date().toISOString() }).eq('id', p.id)
          if (e3) throw e3
          revoked += 1
        }
      } catch (x) {
        revokeError = errMsg(x)
      }
      return { token, expiresAt, assignmentId: created.id, revoked, revokeError }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['assignments'] }),
  })
}

export function useRenewAssignment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (v: { id: string; scheduledOn: string | null }): Promise<{ token: string; expiresAt: string }> => {
      const token = newToken()
      const expiresAt = expiryFor(v.scheduledOn)
      const { error } = await supabase
        .from('assignments')
        .update({ token_hash: await hashToken(token), token_expires_at: expiresAt })
        .eq('id', v.id).is('completed_at', null)
        .select('id').single()
      if (error) throw error
      return { token, expiresAt }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['assignments'] }),
  })
}

export function useRevokeAssignment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('assignments').update({ token_expires_at: new Date().toISOString() })
        .eq('id', id).is('completed_at', null)
        .select('id').single()
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['assignments'] }),
  })
}

export function useDeleteAssignment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('assignments').delete().eq('id', id).select('id').single()
      if (error) {
        throw new Error(
          error.code === 'PGRST116' ? 'Suppression refusée : assignation commencée ou terminée.' : error.message,
        )
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['assignments'] }),
  })
}
