import { z } from 'zod'

export const QUALITIES = [
  'strength', 'power', 'running', 'conditioning', 'mobility', 'recovery', 'other',
] as const
export type Quality = (typeof QUALITIES)[number]

export const QUALITY_LABEL: Record<Quality, string> = {
  strength: 'Force',
  power: 'Puissance',
  running: 'Course',
  conditioning: 'Conditioning',
  mobility: 'Mobilité',
  recovery: 'Récupération',
  other: 'Autre',
}

export const QUALITY_STYLE: Record<Quality, string> = {
  strength: 'bg-blue-100 text-blue-800',
  power: 'bg-red-100 text-red-800',
  running: 'bg-green-100 text-green-800',
  conditioning: 'bg-orange-100 text-orange-800',
  mobility: 'bg-purple-100 text-purple-800',
  recovery: 'bg-teal-100 text-teal-800',
  other: 'bg-slate-100 text-slate-700',
}

export const WorkoutSchema = z.object({
  id: z.string(),
  athlete_id: z.string().nullable(),
  organization_id: z.string(),
  title: z.string(),
  scheduled_on: z.string().nullable(),
  quality: z.enum(QUALITIES).nullable(),
  planned_minutes: z.number().nullable(),
  notes: z.string().nullable(),
  context: z.enum(['gym', 'home', 'hotel']),
  created_at: z.string(),
    created_by: z.string().nullable(),
})
export type Workout = z.infer<typeof WorkoutSchema>

export const WorkoutInputSchema = z.object({
  title: z.string().trim().min(1, 'Titre requis').max(200, 'Titre trop long'),
  quality: z.enum(QUALITIES).nullable(),
  planned_minutes: z.number().int().min(1, 'Durée : 1 à 600 min').max(600, 'Durée : 1 à 600 min').nullable(),
  notes: z.string().trim().max(1000, 'Note trop longue').nullable(),
})
export type WorkoutInput = z.infer<typeof WorkoutInputSchema>