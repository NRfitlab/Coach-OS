import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/context'

const MovementSchema = z.object({ slug: z.string() })

const LibraryRowSchema = z.object({
  id: z.string(),
  organization_id: z.string().nullable(),
  name: z.string(),
  name_fr: z.string().nullable(),
  description: z.string().nullable(),
  steps: z.array(z.string()),
  cues: z.array(z.string()),
  common_mistakes: z.array(z.string()),
  body_zones: z.array(z.string()),
  technique: z.string().nullable(),
  level: z.string().nullable(),
  unilateral: z.boolean(),
  equipment: z.array(z.string()),
  primary_muscles: z.array(z.string()),
  secondary_muscles: z.array(z.string()),
  image_paths: z.array(z.string()),
  media_credit: z.string().nullable(),
  video_url: z.string().nullable(),
  animation_url: z.string().nullable(),
  movements: z.union([MovementSchema, z.array(MovementSchema)]).nullable(),
})

export type LibraryExercise = Omit<z.infer<typeof LibraryRowSchema>, 'movements'> & {
  movement_slug: string | null
}

const LIBRARY_COLUMNS =
  'id, organization_id, name, name_fr, description, steps, cues, common_mistakes, body_zones, technique, level, unilateral, equipment, primary_muscles, secondary_muscles, video_url, animation_url, image_paths, media_credit, movements(slug)'

// Une seule requête pour toute la bibliothèque ; filtres et recherche dans le navigateur.
export function useExerciseLibrary() {
  const userId = useAuth().session?.user.id
  return useQuery({
    queryKey: ['exercise-library', userId],
    enabled: !!userId,
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<LibraryExercise[]> => {
      const { data, error } = await supabase
        .from('exercises')
        .select(LIBRARY_COLUMNS)
        .order('name')
      if (error) throw error
      return z.array(LibraryRowSchema).parse(data).map(({ movements, ...r }) => {
        const m = Array.isArray(movements) ? movements[0] : movements
        return { ...r, movement_slug: m?.slug ?? null }
      })
    },
  })
}

const ReviewRowSchema = z.object({
  exercise_id: z.string(),
  reviewed_at: z.string(),
  reviewed_by: z.string().nullable(),
})
export type ExerciseReview = z.infer<typeof ReviewRowSchema>

// Fiches validées de l'organisation, indexées par identifiant d'exercice.
export function useExerciseReviews(organizationId: string) {
  const userId = useAuth().session?.user.id
  return useQuery({
    queryKey: ['exercise-reviews', userId, organizationId],
    enabled: !!userId && !!organizationId,
    staleTime: 60_000,
    queryFn: async (): Promise<Record<string, ExerciseReview>> => {
      const { data, error } = await supabase
        .from('exercise_reviews')
        .select('exercise_id, reviewed_at, reviewed_by')
        .eq('organization_id', organizationId)
      if (error) throw error
      const out: Record<string, ExerciseReview> = {}
      for (const r of z.array(ReviewRowSchema).parse(data)) out[r.exercise_id] = r
      return out
    },
  })
}

export function useSetReviewed() {
  const queryClient = useQueryClient()
  const userId = useAuth().session?.user.id
  return useMutation({
    mutationFn: async (v: { organizationId: string; exerciseId: string; reviewed: boolean }) => {
      if (!userId) throw new Error('Session absente')
      if (v.reviewed) {
        const { error } = await supabase
          .from('exercise_reviews')
          .insert({ organization_id: v.organizationId, exercise_id: v.exerciseId, reviewed_by: userId })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('exercise_reviews')
          .delete()
          .eq('organization_id', v.organizationId)
          .eq('exercise_id', v.exerciseId)
        if (error) throw error
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['exercise-reviews'] })
    },
  })
}