import { courseOf } from './course'
import { mobilityOf } from './mobility'

export type LineMode = 'force' | 'course' | 'mobilite'

export const MODE_LABEL: Record<LineMode, string> = { force: 'Force', course: 'Course', mobilite: 'Mobilité' }

/** Mouvements proposés dans le menu d'exercices d'un mode (null : tous les exercices, par recherche). */
export const POOLS: Record<LineMode, readonly string[] | null> = {
  force: null,
  course: ['running', 'machine_cardio'],
  mobilite: ['mobility'],
}

export function modeOf(raw: unknown): LineMode {
  if (courseOf(raw)) return 'course'
  if (mobilityOf(raw)) return 'mobilite'
  return 'force'
}

export function modeForMovement(slug: string | null): LineMode {
  if (slug === 'running') return 'course'
  if (slug === 'mobility') return 'mobilite'
  return 'force'
}