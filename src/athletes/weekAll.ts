import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/context'
import { WorkoutSchema } from '../domain/workout'
import { addDays } from '../lib/week'

const RowSchema = WorkoutSchema.pick({
  id: true, athlete_id: true, title: true, scheduled_on: true, quality: true, planned_minutes: true,
})
export type WeekRow = z.infer<typeof RowSchema>

export function useOrgWeekWorkouts(organizationId: string | undefined, monday: string) {
  const userId = useAuth().session?.user.id
  return useQuery({
    queryKey: ['workouts', userId, 'org', organizationId, monday],
    enabled: !!userId && !!organizationId,
    queryFn: async (): Promise<WeekRow[]> => {
      const { data, error } = await supabase
        .from('workouts')
        .select('id, athlete_id, title, scheduled_on, quality, planned_minutes')
        .eq('organization_id', organizationId!)
        .not('athlete_id', 'is', null)
        .is('alternative_of', null)
        .gte('scheduled_on', monday)
        .lte('scheduled_on', addDays(monday, 6))
        .order('created_at')
      if (error) throw error
      return z.array(RowSchema).parse(data)
    },
  })
}