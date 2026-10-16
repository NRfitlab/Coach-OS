export const BLOCK_CONTEXTS = ['pre', 'post', 'recovery', 'rom', 'skill'] as const
export type BlockContextValue = (typeof BLOCK_CONTEXTS)[number]

export const CONTEXT_LABEL: Record<BlockContextValue, string> = {
  pre: "Avant l'entraînement",
  post: "Après l'entraînement",
  recovery: 'Récupération',
  rom: 'Amplitude',
  skill: 'Technique',
}

export function contextOf(params: unknown): BlockContextValue | '' {
  const c = (params as { context?: unknown } | null)?.context
  return typeof c === 'string' && (BLOCK_CONTEXTS as readonly string[]).includes(c) ? (c as BlockContextValue) : ''
}