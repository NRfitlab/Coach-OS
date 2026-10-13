import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/context'

const SensitiveSchema = z.object({
  id: z.string(),
  injuries_limitations: z.string().nullable(),
  consent_at: z.string(),
})
export type Sensitive = z.infer<typeof SensitiveSchema>

export function useSensitive(athleteId: string) {
  const userId = useAuth().session?.user.id
  return useQuery({
    queryKey: ['sensitive', userId, athleteId],
    enabled: !!userId,
    queryFn: async (): Promise<Sensitive | null> => {
      const { data, error } = await supabase
        .from('athlete_sensitive')
        .select('id, injuries_limitations, consent_at')
        .eq('athlete_id', athleteId)
        .maybeSingle()
      if (error) throw error
      return data ? SensitiveSchema.parse(data) : null
    },
  })
}

// consent_at et consent_by ne sont jamais envoyés : le trigger les fixe côté serveur.
export function useCreateSensitive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (v: { athleteId: string; organizationId: string; text: string }) => {
      const { error } = await supabase.from('athlete_sensitive').insert({
        athlete_id: v.athleteId,
        organization_id: v.organizationId,
        injuries_limitations: v.text,
      })
      if (error) throw error
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['sensitive'] }),
  })
}

export function useUpdateSensitive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (v: { athleteId: string; text: string }) => {
      const { data, error } = await supabase
        .from('athlete_sensitive')
        .update({ injuries_limitations: v.text })
        .eq('athlete_id', v.athleteId)
        .select('id')
      if (error) throw error
      if (data.length === 0) throw new Error('Modification refusée ou introuvable.')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['sensitive'] }),
  })
}

export function useDeleteSensitive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (athleteId: string) => {
      const { data, error } = await supabase
        .from('athlete_sensitive').delete().eq('athlete_id', athleteId).select('id')
      if (error) throw error
      if (data.length === 0) throw new Error('Suppression refusée ou introuvable.')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['sensitive'] }),
  })
}