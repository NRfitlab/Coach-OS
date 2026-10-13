import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/context'

function slugify(s: string): string {
  const t = s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return t || 'athlete'
}

async function rowsOf(table: string, athleteId: string): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase.from(table).select('*').eq('athlete_id', athleteId)
  if (error) throw error
  return data ?? []
}

export function useExportAthlete() {
  const userId = useAuth().session?.user.id
  return useMutation({
    mutationFn: async (v: { athleteId: string; fullName: string }) => {
      const { data: athlete, error } = await supabase
        .from('athletes').select('*').eq('id', v.athleteId).maybeSingle()
      if (error) throw error
      if (!athlete) throw new Error('Athlète introuvable ou accès refusé.')

      const [goals, references, sensitive] = await Promise.all([
        rowsOf('athlete_goals', v.athleteId),
        rowsOf('athlete_references', v.athleteId),
        rowsOf('athlete_sensitive', v.athleteId),
      ])

      const ids = [...new Set(references.map((r) => r.exercise_id).filter((x): x is string => typeof x === 'string'))]
      const names = new Map<string, string>()
      if (ids.length > 0) {
        const { data, error: exErr } = await supabase.from('exercises').select('id, name').in('id', ids)
        if (exErr) throw exErr
        for (const e of data ?? []) names.set(e.id as string, e.name as string)
      }

      const payload = {
        export_version: 1,
        exported_at: new Date().toISOString(),
        exported_by: userId ?? null,
        athlete,
        goals,
        references: references.map((r) => ({
          ...r,
          exercise_name: typeof r.exercise_id === 'string' ? names.get(r.exercise_id) ?? null : null,
        })),
        sensitive: sensitive[0] ?? null,
      }

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `export-${slugify(v.fullName)}-${new Date().toLocaleDateString('sv-SE')}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    },
  })
}

export function useDeleteAthlete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from('athletes').delete().eq('id', id).select('id')
      if (error) throw error
      if (data.length === 0) throw new Error('Suppression refusée ou athlète introuvable.')
    },
    onSuccess: () => {
      for (const k of ['goals', 'references', 'sensitive']) {
        queryClient.removeQueries({ queryKey: [k] })
      }
      void queryClient.invalidateQueries({ queryKey: ['athletes'], refetchType: 'none' })
    },
  })
}