import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/context'
import { WorkoutSchema, type Workout, type WorkoutInput } from '../domain/workout'
import { addDays, mondayOf } from '../lib/week'

const COLUMNS =
  'id, athlete_id, organization_id, title, scheduled_on, quality, planned_minutes, notes, context, created_at, created_by'

export type WorkoutPatch = Partial<
  Pick<Workout, 'title' | 'quality' | 'planned_minutes' | 'notes' | 'scheduled_on'>
>

export function useWeekWorkouts(athleteId: string | undefined, monday: string) {
  const userId = useAuth().session?.user.id
  return useQuery({
    queryKey: ['workouts', userId, athleteId, monday],
    enabled: !!userId && !!athleteId,
    queryFn: async (): Promise<Workout[]> => {
      const { data, error } = await supabase
        .from('workouts')
        .select(COLUMNS)
        .eq('athlete_id', athleteId!)
        .is('alternative_of', null)
        .gte('scheduled_on', monday)
        .lte('scheduled_on', addDays(monday, 6))
        .order('created_at')
      if (error) throw error
      return z.array(WorkoutSchema).parse(data)
    },
  })
}

export function useAddWorkout() {
  const queryClient = useQueryClient()
  const userId = useAuth().session?.user.id
  return useMutation({
    mutationFn: async (v: {
      athleteId: string
      organizationId: string
      day: string
      input: WorkoutInput
    }): Promise<Workout> => {
      const { data, error } = await supabase
        .from('workouts')
        .insert({
          ...v.input,
          athlete_id: v.athleteId,
          organization_id: v.organizationId,
          scheduled_on: v.day,
          created_by: userId,
        })
        .select(COLUMNS)
        .single()
      if (error) throw error
      return WorkoutSchema.parse(data)
    },
    onSuccess: (row, v) => {
      queryClient.setQueryData<Workout[]>(
        ['workouts', userId, v.athleteId, mondayOf(v.day)],
        (old) => (old ? [...old, row] : old),
      )
    },
  })
}

export function useUpdateWorkout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (v: { id: string; patch: WorkoutPatch }) => {
      const { data, error } = await supabase
        .from('workouts').update(v.patch).eq('id', v.id).select('id')
      if (error) throw error
      if (data.length === 0) throw new Error('Modification refusée ou séance introuvable.')
    },
    onMutate: async (v) => {
      await queryClient.cancelQueries({ queryKey: ['workouts'] })
      queryClient.setQueriesData<Workout[]>({ queryKey: ['workouts'] }, (old) =>
        old?.map((w) => (w.id === v.id ? { ...w, ...v.patch } : w)),
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['workouts'] }),
  })
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from('workouts').delete().eq('id', id).select('id')
      if (error) throw error
      if (data.length === 0) throw new Error('Suppression refusée ou séance introuvable.')
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['workouts'] })
      queryClient.setQueriesData<Workout[]>({ queryKey: ['workouts'] }, (old) =>
        old?.filter((w) => w.id !== id),
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['workouts'] }),
  })
}

export function useCopyWeek() {
  const queryClient = useQueryClient()
  const userId = useAuth().session?.user.id
  return useMutation({
    mutationFn: async (v: {
      items: Workout[]
      targetAthleteId: string
      organizationId: string
      shift: number
    }) => {
      const rows = v.items
        .filter((w) => w.scheduled_on)
        .map((w) => ({
          title: w.title,
          quality: w.quality,
          planned_minutes: w.planned_minutes,
          notes: w.notes,
          context: w.context,
          scheduled_on: addDays(w.scheduled_on as string, v.shift),
          athlete_id: v.targetAthleteId,
          organization_id: v.organizationId,
          created_by: userId,
        }))
      if (rows.length === 0) throw new Error('Aucune séance à copier.')
      const { data, error } = await supabase.from('workouts').insert(rows).select('id')
      if (error) throw error
      if (data.length !== rows.length) throw new Error('Copie incomplète.')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['workouts'] }),
  })
}