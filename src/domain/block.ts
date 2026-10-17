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

const DEFAULT_BLOCKS: readonly BlockKind[] = [
  'warmup', 'straight', 'superset', 'circuit', 'emom', 'amrap', 'interval', 'cooldown',
]

const BY_QUALITY: Record<string, readonly BlockKind[]> = {
  strength: ['warmup', 'straight', 'superset', 'circuit', 'cooldown'],
  power: ['warmup', 'straight', 'superset', 'circuit', 'emom', 'cooldown'],
  running: ['warmup', 'drills', 'continuous', 'interval', 'cooldown'],
  conditioning: ['warmup', 'amrap', 'emom', 'circuit', 'interval', 'cooldown'],
  mobility: ['circuit', 'straight', 'cooldown'],
  recovery: ['circuit', 'continuous', 'cooldown'],
  other: BLOCK_KINDS,
}

export const blockKindsFor = (quality: string | null): readonly BlockKind[] =>
  (quality ? BY_QUALITY[quality] : undefined) ?? DEFAULT_BLOCKS