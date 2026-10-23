import type { BlockKind } from './block'
import { dec } from './prescriptionFields'

export type ParamKey = 'minutes' | 'intervalSeconds' | 'capMinutes' | 'rounds' | 'restSeconds' | 'workSeconds'
export type BlockParamValues = Partial<Record<ParamKey, number>>
export type ParamFields = Partial<Record<ParamKey, string>>

const ALL_KEYS: readonly ParamKey[] = [
  'minutes', 'intervalSeconds', 'capMinutes', 'rounds', 'restSeconds', 'workSeconds',
]

const KEYS: Partial<Record<BlockKind, readonly ParamKey[]>> = {
  amrap: ['minutes'],
  emom: ['intervalSeconds', 'minutes'],
  fortime: ['capMinutes', 'rounds'],
  circuit: ['rounds', 'restSeconds'],
  interval: ['workSeconds', 'restSeconds', 'rounds'],
}

const LABEL: Record<ParamKey, string> = {
  minutes: 'Durée (min)',
  intervalSeconds: 'Toutes les (s)',
  capMinutes: 'Time cap (min)',
  rounds: 'Tours',
  restSeconds: 'Repos (s)',
  workSeconds: 'Travail (s)',
}

const SPEC: Record<ParamKey, { min: number; max: number; int: boolean; err: string }> = {
  minutes: { min: 0.5, max: 240, int: false, err: 'Durée : minutes (12)' },
  capMinutes: { min: 0.5, max: 240, int: false, err: 'Time cap : minutes (15)' },
  intervalSeconds: { min: 1, max: 3600, int: true, err: 'Intervalle : secondes (60)' },
  workSeconds: { min: 1, max: 3600, int: true, err: 'Travail : secondes (40)' },
  restSeconds: { min: 0, max: 3600, int: true, err: 'Repos : secondes (20)' },
  rounds: { min: 1, max: 99, int: true, err: 'Tours : entier de 1 à 99' },
}

export const paramKeysFor = (kind: BlockKind): readonly ParamKey[] => KEYS[kind] ?? []

export function paramLabel(kind: BlockKind, k: ParamKey): string {
  if (k === 'restSeconds' && kind === 'circuit') return 'Repos entre tours (s)'
  return LABEL[k]
}

/** Paramètres affichés : AMRAP, EMOM, For Time ; Circuit et Intervalles seulement en séance de conditioning. */
export const hasBlockParams = (kind: BlockKind, quality: string | null): boolean =>
  kind === 'amrap' || kind === 'emom' || kind === 'fortime' ||
  ((kind === 'circuit' || kind === 'interval') && quality === 'conditioning')

const asObject = (raw: unknown): Record<string, unknown> =>
  raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {}

export function paramsOf(raw: unknown): BlockParamValues {
  const o = asObject(raw)
  const out: BlockParamValues = {}
  for (const k of ALL_KEYS) {
    const v = o[k]
    if (typeof v === 'number' && Number.isFinite(v)) out[k] = v
  }
  return out
}

export function paramsToFields(kind: BlockKind, raw: unknown): ParamFields {
  const p = paramsOf(raw)
  const out: ParamFields = {}
  for (const k of paramKeysFor(kind)) out[k] = p[k] === undefined ? '' : String(p[k])
  return out
}

export function paramsFromFields(
  kind: BlockKind, f: ParamFields,
): { ok: true; values: BlockParamValues } | { ok: false; error: string } {
  const values: BlockParamValues = {}
  for (const k of paramKeysFor(kind)) {
    const raw = (f[k] ?? '').trim()
    if (!raw) continue
    const s = SPEC[k]
    const n = s.int ? (/^\d+$/.test(raw) ? Number(raw) : null) : dec(raw)
    if (n === null || n < s.min || n > s.max) return { ok: false, error: s.err }
    values[k] = n
  }
  return { ok: true, values }
}

/** Conserve les autres clés de `params` (par exemple `context`), remplace les paramètres de durée. */
export function mergeParams(raw: unknown, values: BlockParamValues): Record<string, unknown> {
  const next = { ...asObject(raw) }
  for (const k of ALL_KEYS) delete next[k]
  return { ...next, ...values }
}

/**
 * Durée imposée par le bloc, en secondes.
 * null : le bloc n'impose rien (somme des lignes) ; 'missing' : paramètre requis absent.
 */
export function blockSeconds(
  kind: BlockKind, raw: unknown, quality: string | null, lineSeconds: number,
): number | 'missing' | null {
  if (!hasBlockParams(kind, quality)) return null
  const p = paramsOf(raw)
  switch (kind) {
    case 'amrap':
    case 'emom':
      return p.minutes === undefined ? 'missing' : p.minutes * 60
    case 'fortime':
      return p.capMinutes === undefined ? 'missing' : p.capMinutes * 60
    case 'circuit':
      return p.rounds === undefined ? 'missing' : p.rounds * lineSeconds + (p.rounds - 1) * (p.restSeconds ?? 0)
    case 'interval':
      return p.workSeconds === undefined || p.restSeconds === undefined || p.rounds === undefined
        ? 'missing'
        : p.rounds * (p.workSeconds + p.restSeconds)
    default:
      return null
  }
}
