import { z } from 'zod'

export const KINDS = ['one_rm', 'mas', 'critical_speed', 'hr_max', 'hr_rest', 'ftp', 'other'] as const
export const METHODS = ['direct_test', 'estimated', 'declared'] as const
export type Kind = (typeof KINDS)[number]

export const KIND_LABEL: Record<Kind, string> = {
  one_rm: '1RM', mas: 'MAS (VMA)', critical_speed: 'Vitesse critique',
  hr_max: 'FC max', hr_rest: 'FC repos', ftp: 'FTP', other: 'Autre',
}
export const KIND_UNIT: Record<Kind, string | null> = {
  one_rm: 'kg', mas: 'km/h', critical_speed: 'km/h', hr_max: 'bpm', hr_rest: 'bpm', ftp: 'W', other: null,
}
export const METHOD_LABEL: Record<(typeof METHODS)[number], string> = {
  direct_test: 'Test direct', estimated: 'Estimé', declared: 'Déclaré',
}

export const ReferenceSchema = z.object({
  id: z.string(),
  athlete_id: z.string(),
  organization_id: z.string(),
  kind: z.enum(KINDS),
  exercise_id: z.string().nullable(),
  value: z.number(),
  unit: z.string(),
  measured_on: z.string(),
  method: z.enum(METHODS),
  estimation_formula: z.string().nullable(),
  note: z.string().nullable(),
  created_at: z.string(),
})
export type Reference = z.infer<typeof ReferenceSchema>

export const ReferenceInputSchema = z
  .object({
    kind: z.enum(KINDS),
    exercise_id: z.string().nullable(),
    value: z.number().positive('La valeur doit être positive'),
    unit: z.string().trim().min(1, 'Unité requise').max(20),
    measured_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date requise'),
    method: z.enum(METHODS),
    estimation_formula: z.string().trim().max(100).nullable(),
    note: z.string().trim().max(500).nullable(),
  })
  .superRefine((v, ctx) => {
    if (v.kind === 'one_rm' && !v.exercise_id) {
      ctx.addIssue({ code: 'custom', message: 'Exercice requis pour un 1RM' })
    }
    if (v.method === 'estimated' && !v.estimation_formula) {
      ctx.addIssue({ code: 'custom', message: 'Formule requise pour une valeur estimée' })
    }
  })
export type ReferenceInput = z.infer<typeof ReferenceInputSchema>