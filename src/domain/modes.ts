import { conditioningOf } from './conditioning'
import { courseOf } from './course'
import { libreOf } from './libre'
import { mobilityOf } from './mobility'
import { powerOf } from './power'
import { recoveryOf } from './recovery'

export type LineMode =
  | 'force' | 'puissance' | 'course' | 'mobilite' | 'recuperation' | 'libre' | 'conditioning'

export const MODE_LABEL: Record<LineMode, string> = {
  force: 'Force',
  puissance: 'Puissance',
  course: 'Course',
  mobilite: 'Mobilité',
  recuperation: 'Récupération',
  libre: 'Libre',
  conditioning: 'Conditioning',
}

/** Modes dont les lignes n'ont pas d'exercice. */
export const NO_EXERCISE: readonly LineMode[] = ['recuperation', 'libre']

/** Mouvements proposés dans le menu d'exercices d'un mode (null : tous les exercices, par recherche). */
export const POOLS: Record<LineMode, readonly string[] | null> = {
  force: null,
  puissance: ['jump_plyo', 'olympic'],
  course: ['running', 'machine_cardio'],
  mobilite: ['mobility'],
  recuperation: null,
  libre: null,
  conditioning: ['conditioning', 'carry', 'machine_cardio', 'olympic', 'jump_plyo'],
}

export function modeOf(raw: unknown): LineMode {
  if (courseOf(raw)) return 'course'
  if (mobilityOf(raw)) return 'mobilite'
  if (powerOf(raw)) return 'puissance'
  if (recoveryOf(raw)) return 'recuperation'
  if (libreOf(raw)) return 'libre'
  if (conditioningOf(raw)) return 'conditioning'
  return 'force'
}

/** Mode imposé par le mouvement d'un exercice : seulement la course et la mobilité. */
export function modeForMovement(slug: string | null): LineMode {
  if (slug === 'running') return 'course'
  if (slug === 'mobility') return 'mobilite'
  return 'force'
}