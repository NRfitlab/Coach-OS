import type { BlockKind } from './block'

export type LineMode = 'force' | 'course'

export type LineProfile = {
  movements: readonly string[]
  mode: LineMode
  suggestion: Partial<Record<BlockKind, string>>
}

/** Profil de saisie imposé par la qualité de la séance. Les autres qualités arrivent en 4d à 4f. */
export function lineProfile(quality: string | null): LineProfile | null {
  if (quality === 'running') {
    return {
      movements: ['running', 'machine_cardio'],
      mode: 'course',
      suggestion: {
        warmup: 'Easy run', drills: 'Strides', continuous: 'Easy run', interval: 'Interval run', cooldown: 'Easy run',
      },
    }
  }
  return null
}