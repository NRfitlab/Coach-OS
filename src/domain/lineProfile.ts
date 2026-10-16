import type { BlockKind } from './block'
import type { LineMode } from './modes'

export type LineProfile = { mode: LineMode; suggestion: Partial<Record<BlockKind, string>> }

/** Mode de ligne proposé par défaut selon la qualité de la séance. Les autres qualités arrivent en 4e et 4f. */
export function lineProfile(quality: string | null): LineProfile | null {
  if (quality === 'running') {
    return {
      mode: 'course',
      suggestion: {
        warmup: 'Easy run', drills: 'Strides', continuous: 'Easy run', interval: 'Interval run', cooldown: 'Easy run',
      },
    }
  }
  if (quality === 'mobility') return { mode: 'mobilite', suggestion: {} }
  return null
}