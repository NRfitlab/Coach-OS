import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/context'
import { AthleteSchema, type Athlete, type AthleteInput } from '../domain/athlete'

const COLUMNS =
  'id, organization_id, coach_id, full_name, birth_date, primary_sport, secondary_sports, level, experience, sessions_per_week, available_minutes, availability, equipment, status'

export function useAthletes() {
  const userId = useAuth().session?.user.id
  return useQuery({
    queryKey: ['athletes', userId],
    enabled: !!userId,
    queryFn: async (): Promise<Athlete[]> => {
      const { data, error } = await supabase.from('athletes').select(COLUMNS).order('full_name')
      if (error) throw error
      return z.array(AthleteSchema).parse(data)
    },
  })
}

export function useAthlete(id: string | undefined) {
  const userId = useAuth().session?.user.id
  return useQuery({
    queryKey: ['athletes', userId, id],
    enabled: !!userId && !!id,
    queryFn: async (): Promise<Athlete | null> => {
      const { data, error } = await supabase
        .from('athletes').select(COLUMNS).eq('id', id!).maybeSingle()
      if (error) throw error
      return data ? AthleteSchema.parse(data) : null
    },
  })
}

export function useCreateAthlete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (vars: { input: AthleteInput; organizationId: string; coachId: string }) => {
      const { data, error } = await supabase
        .from('athletes')
        .insert({ ...vars.input, organization_id: vars.organizationId, coach_id: vars.coachId })
        .select('id')
        .single()
      if (error) throw error
      return z.object({ id: z.string() }).parse(data).id
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['athletes'] }),
  })
}

export function useUpdateAthlete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (vars: { id: string; input: AthleteInput }) => {
      const { data, error } = await supabase
        .from('athletes').update(vars.input).eq('id', vars.id).select('id')
      if (error) throw error
      if (data.length === 0) throw new Error('Modification refusée ou athlète introuvable.')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['athletes'] }),
  })
}