import type { BlockKind } from './block'
import type { LineMode } from './modes'

export type LineProfile = { mode: LineMode; suggestion: Partial<Record<BlockKind, string>> }

/** Mode de ligne proposé par défaut selon la qualité de la séance. Le conditioning arrive en 4f. */
export function lineProfile(quality: string | null): LineProfile | null {
  switch (quality) {
    case 'running':
      return {
        mode: 'course',
        suggestion: {
          warmup: 'Easy run', drills: 'Strides', continuous: 'Easy run', interval: 'Interval run', cooldown: 'Easy run',
        },
      }
    case 'mobility': return { mode: 'mobilite', suggestion: {} }
    case 'power': return { mode: 'puissance', suggestion: {} }
    case 'recovery': return { mode: 'recuperation', suggestion: {} }
    case 'other': return { mode: 'libre', suggestion: {} }
    default: return null
  }
}