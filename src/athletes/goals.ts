import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/context'
import { GoalSchema, PRIORITIES, type Goal, type GoalInput } from '../domain/goal'

const COLUMNS =
  'id, athlete_id, organization_id, title, priority, status, target_date, metric, current_value, target_value, unit'

export function useGoals(athleteId: string) {
  const userId = useAuth().session?.user.id
  return useQuery({
    queryKey: ['goals', userId, athleteId],
    enabled: !!userId,
    queryFn: async (): Promise<Goal[]> => {
      const { data, error } = await supabase
        .from('athlete_goals').select(COLUMNS).eq('athlete_id', athleteId)
      if (error) throw error
      const rows = z.array(GoalSchema).parse(data)
      const rank = (g: Goal) => (g.status === 'active' ? 0 : 10) + PRIORITIES.indexOf(g.priority)
      return rows.sort((a, b) => rank(a) - rank(b))
    },
  })
}

type SaveVars = {
  id?: string
  athleteId: string
  organizationId: string
  input: GoalInput
  demoteId?: string
}

export function useSaveGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (v: SaveVars) => {
      if (v.demoteId) {
        const { data, error } = await supabase
          .from('athlete_goals').update({ priority: 'secondary' }).eq('id', v.demoteId).select('id')
        if (error) throw error
        if (data.length === 0) throw new Error('Rétrogradation de l\'objectif principal refusée.')
      }
      let failure: unknown = null
      if (v.id) {
        const { data, error } = await supabase
          .from('athlete_goals').update(v.input).eq('id', v.id).select('id')
        if (error) failure = error
        else if (data.length === 0) failure = new Error('Modification refusée ou objectif introuvable.')
      } else {
        const { error } = await supabase
          .from('athlete_goals')
          .insert({ ...v.input, athlete_id: v.athleteId, organization_id: v.organizationId })
          .select('id').single()
        if (error) failure = error
      }
      if (failure) {
        if (v.demoteId) {
          await supabase.from('athlete_goals').update({ priority: 'primary' }).eq('id', v.demoteId)
        }
        throw failure
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from('athlete_goals').delete().eq('id', id).select('id')
      if (error) throw error
      if (data.length === 0) throw new Error('Suppression refusée ou objectif introuvable.')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  })
}