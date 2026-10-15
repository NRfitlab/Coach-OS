import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/context'
import { ReferenceSchema, type Reference, type ReferenceInput } from '../domain/reference'

const COLUMNS =
  'id, athlete_id, organization_id, kind, exercise_id, value, unit, measured_on, method, estimation_formula, note, created_at'

const MovementSchema = z.object({ slug: z.string() })
const ExerciseRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  movements: z.union([MovementSchema, z.array(MovementSchema)]).nullable(),
})
export type ExerciseOption = { id: string; name: string; movement_slug: string | null }

export function useExercises() {
  const userId = useAuth().session?.user.id
  return useQuery({
    queryKey: ['exercises', userId],
    enabled: !!userId,
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<ExerciseOption[]> => {
            const { data, error } = await supabase.from('exercises').select('id, name, movements(slug)').order('name')
      if (error) throw error
      return z.array(ExerciseRowSchema).parse(data).map((r) => {
        const m = Array.isArray(r.movements) ? r.movements[0] : r.movements
        return { id: r.id, name: r.name, movement_slug: m?.slug ?? null }
      })
    },
  })
}

export function useReferences(athleteId: string) {
  const userId = useAuth().session?.user.id
  return useQuery({
    queryKey: ['references', userId, athleteId],
    enabled: !!userId,
    queryFn: async (): Promise<Reference[]> => {
      const { data, error } = await supabase
        .from('athlete_references').select(COLUMNS).eq('athlete_id', athleteId)
        .order('measured_on', { ascending: false })
        .order('created_at', { ascending: false })
      if (error) throw error
      return z.array(ReferenceSchema).parse(data)
    },
  })
}

export function useAddReference() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (v: { athleteId: string; organizationId: string; input: ReferenceInput }) => {
      const { error } = await supabase
        .from('athlete_references')
        .insert({ ...v.input, athlete_id: v.athleteId, organization_id: v.organizationId })
        .select('id').single()
      if (error) throw error
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['references'] }),
  })
}

export function useDeleteReference() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('athlete_references').delete().eq('id', id).select('id')
      if (error) throw error
      if (data.length === 0) throw new Error('Suppression refusée ou valeur introuvable.')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['references'] }),
  })
}