import { z } from 'zod'

export const LEVELS = ['beginner', 'intermediate', 'advanced', 'elite'] as const
export const STATUSES = ['active', 'paused', 'archived'] as const
export type Level = (typeof LEVELS)[number]
export type Status = (typeof STATUSES)[number]

export const LEVEL_LABEL: Record<Level, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
  elite: 'Élite',
}
export const STATUS_LABEL: Record<Status, string> = {
  active: 'Actif',
  paused: 'En pause',
  archived: 'Archivé',
}

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export const DAY_LABEL: Record<(typeof DAYS)[number], string> = {
  mon: 'Lun', tue: 'Mar', wed: 'Mer', thu: 'Jeu', fri: 'Ven', sat: 'Sam', sun: 'Dim',
}

export const EQUIPMENT_OPTIONS: { value: string; label: string }[] = [
  { value: 'gym:barbell', label: 'Barre' },
  { value: 'gym:rack', label: 'Rack' },
  { value: 'gym:cable', label: 'Poulie' },
  { value: 'gym:dumbbells', label: 'Haltères' },
  { value: 'gym:kettlebells', label: 'Kettlebells' },
  { value: 'gym:skierg', label: 'SkiErg' },
  { value: 'home:dumbbells', label: 'Haltères' },
  { value: 'home:bands', label: 'Élastiques' },
  { value: 'home:bench', label: 'Banc' },
]

export function equipmentLabel(value: string): string {
  const opt = EQUIPMENT_OPTIONS.find((o) => o.value === value)
  const place = value.startsWith('home:') ? 'Domicile' : value.startsWith('gym:') ? 'Salle' : ''
  return opt ? `${place} · ${opt.label}` : value
}

export const AthleteSchema = z.object({
  id: z.string(),
  organization_id: z.string(),
  coach_id: z.string(),
  full_name: z.string(),
  birth_date: z.string().nullable(),
  primary_sport: z.string().nullable(),
  secondary_sports: z.array(z.string()).nullable(),
  level: z.enum(LEVELS).nullable(),
  experience: z.string().nullable(),
  sessions_per_week: z.number().nullable(),
  available_minutes: z.number().nullable(),
  availability: z.record(z.string(), z.number()).nullable(),
  equipment: z.array(z.string()).nullable(),
  status: z.enum(STATUSES).nullable(),
})
export type Athlete = z.infer<typeof AthleteSchema>

export type AthleteInput = {
  full_name: string
  birth_date: string | null
  primary_sport: string | null
  secondary_sports: string[]
  level: Level | null
  experience: string | null
  sessions_per_week: number | null
  available_minutes: number | null
  availability: Record<string, number>
  equipment: string[]
  status: Status
}