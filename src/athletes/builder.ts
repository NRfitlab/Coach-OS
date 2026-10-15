import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/context'
import { BLOCK_KINDS, type BlockKind } from '../domain/block'
import type { Prescription } from '../domain/prescription'
import { WorkoutSchema } from '../domain/workout'

const SELECT =
  'id, athlete_id, organization_id, title, scheduled_on, quality, planned_minutes, notes, context, created_at, created_by, ' +
  'workout_blocks(id, kind, label, notes, position, workout_exercises(id, exercise_id, position, notes, prescription))'

const ExerciseRow = z.object({
  id: z.string(),
  exercise_id: z.string(),
  position: z.number(),
  notes: z.string().nullable(),
  prescription: z.unknown(),
})
const BlockRow = z.object({
  id: z.string(),
  kind: z.enum(BLOCK_KINDS),
  label: z.string().nullable(),
  notes: z.string().nullable(),
  position: z.number(),
  workout_exercises: z.array(ExerciseRow),
})
const DetailSchema = WorkoutSchema.extend({ workout_blocks: z.array(BlockRow) })

export type DetailData = z.infer<typeof DetailSchema>
export type BlockData = DetailData['workout_blocks'][number]
export type ExerciseData = BlockData['workout_exercises'][number]

export function useWorkoutDetail(workoutId: string | undefined) {
  const userId = useAuth().session?.user.id
  return useQuery({
    queryKey: ['builder', userId, workoutId],
    enabled: !!userId && !!workoutId,
    queryFn: async (): Promise<DetailData | null> => {
      const { data, error } = await supabase.from('workouts').select(SELECT).eq('id', workoutId!).maybeSingle()
      if (error) throw error
      return DetailSchema.nullable().parse(data)
    },
  })
}

function useBuilderMutation<V>(fn: (v: V) => Promise<void>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['builder'] }),
  })
}

export const useAddBlock = () =>
  useBuilderMutation(async (v: { workoutId: string; organizationId: string; kind: BlockKind; position: number }) => {
    const { error } = await supabase
      .from('workout_blocks')
      .insert({ workout_id: v.workoutId, organization_id: v.organizationId, kind: v.kind, position: v.position })
      .select('id').single()
    if (error) throw error
  })

export const useDeleteBlock = () =>
  useBuilderMutation(async (id: string) => {
    const { error } = await supabase.from('workout_blocks').delete().eq('id', id)
    if (error) throw error
  })

export const useAddExercise = () =>
  useBuilderMutation(async (v: {
    blockId: string; organizationId: string; exerciseId: string; position: number; prescription: Prescription
  }) => {
    const { error } = await supabase
      .from('workout_exercises')
      .insert({
        block_id: v.blockId, organization_id: v.organizationId, exercise_id: v.exerciseId,
        position: v.position, prescription: v.prescription,
      })
      .select('id').single()
    if (error) throw error
  })

export const useUpdateExercise = () =>
  useBuilderMutation(async (v: { id: string; prescription: Prescription }) => {
    const { error } = await supabase
      .from('workout_exercises').update({ prescription: v.prescription }).eq('id', v.id)
      .select('id').single()
    if (error) throw error
  })

export const useDeleteExercise = () =>
  useBuilderMutation(async (id: string) => {
    const { error } = await supabase.from('workout_exercises').delete().eq('id', id)
    if (error) throw error
  })
  export function useReorderBlocks() {
  const queryClient = useQueryClient()
  const userId = useAuth().session?.user.id
  return useMutation({
    mutationFn: async (v: {
      workoutId: string; organizationId: string; order: { id: string; kind: BlockKind }[]
    }) => {
      const rows = v.order.map((b, i) => ({
        id: b.id, workout_id: v.workoutId, organization_id: v.organizationId, kind: b.kind, position: i + 1,
      }))
      const { error } = await supabase.from('workout_blocks').upsert(rows, { onConflict: 'id' })
      if (error) throw error
    },
    onMutate: async (v) => {
      const key = ['builder', userId, v.workoutId]
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<DetailData | null>(key)
      if (previous) {
        const pos = new Map(v.order.map((b, i) => [b.id, i + 1]))
        queryClient.setQueryData<DetailData>(key, {
          ...previous,
          workout_blocks: previous.workout_blocks.map((b) => ({ ...b, position: pos.get(b.id) ?? b.position })),
        })
      }
      return { previous, key }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(ctx.key, ctx.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['builder'] }),
  })
}