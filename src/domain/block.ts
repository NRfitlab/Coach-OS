export const BLOCK_KINDS = [
  'warmup', 'straight', 'superset', 'circuit', 'emom', 'amrap', 'interval', 'cooldown', 'drills', 'continuous',
] as const
export type BlockKind = (typeof BLOCK_KINDS)[number]

export const BLOCK_LABEL: Record<BlockKind, string> = {
  warmup: 'Échauffement',
  straight: 'Séries classiques',
  superset: 'Superset',
  circuit: 'Circuit',
  emom: 'EMOM',
  amrap: 'AMRAP',
  interval: 'Intervalles',
  cooldown: 'Retour au calme',
  drills: 'Éducatifs',
  continuous: 'Footing continu',
}

const STRENGTH_BLOCKS: readonly BlockKind[] = [
  'warmup', 'straight', 'superset', 'circuit', 'emom', 'amrap', 'interval', 'cooldown',
]
const RUNNING_BLOCKS: readonly BlockKind[] = ['warmup', 'drills', 'continuous', 'interval', 'cooldown']

export const blockKindsFor = (quality: string | null): readonly BlockKind[] =>
  quality === 'running' ? RUNNING_BLOCKS : STRENGTH_BLOCKS