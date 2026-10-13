import { z } from 'zod'

export const PRIORITIES = ['primary', 'secondary', 'maintenance'] as const
export const GOAL_STATUSES = ['active', 'achieved', 'abandoned'] as const

export const PRIORITY_LABEL: Record<(typeof PRIORITIES)[number], string> = {
  primary: 'Principal',
  secondary: 'Secondaire',
  maintenance: 'Maintien',
}
export const GOAL_STATUS_LABEL: Record<(typeof GOAL_STATUSES)[number], string> = {
  active: 'Actif',
  achieved: 'Atteint',
  abandoned: 'Abandonné',
}

export const GoalSchema = z.object({
  id: z.string(),
  athlete_id: z.string(),
  organization_id: z.string(),
  title: z.string(),
  priority: z.enum(PRIORITIES),
  status: z.enum(GOAL_STATUSES),
  target_date: z.string().nullable(),
  metric: z.string().nullable(),
  current_value: z.number().nullable(),
  target_value: z.number().nullable(),
  unit: z.string().nullable(),
})
export type Goal = z.infer<typeof GoalSchema>

export const GoalInputSchema = z.object({
  title: z.string().trim().min(1, 'Titre requis').max(200),
  priority: z.enum(PRIORITIES),
  status: z.enum(GOAL_STATUSES),
  target_date: z.string().nullable(),
  metric: z.string().trim().max(100).nullable(),
  current_value: z.number().nullable(),
  target_value: z.number().nullable(),
  unit: z.string().trim().max(30).nullable(),
})
export type GoalInput = z.infer<typeof GoalInputSchema>