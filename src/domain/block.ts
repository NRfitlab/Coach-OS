export const BLOCK_KINDS = [
  'warmup', 'straight', 'superset', 'circuit', 'emom', 'amrap', 'interval', 'cooldown',
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
}