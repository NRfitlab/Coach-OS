import { forcePrescription, prescriptionSchema, type ForcePrescription } from './prescription'
import type { ParseResult } from './prescriptionText'
import type { Reference } from './reference'

export type LoadMode = 'percent' | 'kg' | 'bodyweight' | 'rpe_only'

export type ForceFields = {
  sets: string
  reps: string
  loadMode: LoadMode
  loadValue: string
  rpe: string
  rest: string
}

export function defaultFields(hasOneRm: boolean): ForceFields {
  return { sets: '', reps: '', loadMode: hasOneRm ? 'percent' : 'kg', loadValue: '', rpe: '', rest: '' }
}

export function forceOfPrescription(raw: unknown): ForcePrescription | null {
  const r = prescriptionSchema.safeParse(raw)
  return r.success && r.data.mode === 'force' ? r.data : null
}

export const latestOneRm = (refs: Reference[], exerciseId: string): Reference | undefined =>
  refs.find((r) => r.kind === 'one_rm' && r.exercise_id === exerciseId)

export function toFields(p: ForcePrescription): ForceFields {
  const l = p.load
  return {
    sets: String(p.sets),
    reps: typeof p.reps === 'number' ? String(p.reps) : `${p.reps.min}-${p.reps.max}`,
    loadMode:
      l.type === 'percent_reference' ? 'percent' : l.type === 'kg' ? 'kg' : l.type === 'bodyweight' ? 'bodyweight' : 'rpe_only',
    loadValue: l.type === 'percent_reference' || l.type === 'kg' ? String(l.value) : '',
    rpe: p.rpe === undefined ? '' : String(p.rpe),
    rest: p.restSeconds === undefined ? '' : String(p.restSeconds),
  }
}

const dec = (s: string): number | null => {
  const t = s.trim()
  return /^\d+([.,]\d+)?$/.test(t) ? Number(t.replace(',', '.')) : null
}

function parseRest(raw: string): number | undefined | 'invalid' {
  const s = raw.trim().replace(/"/g, '')
  if (!s) return undefined
  const mmss = s.match(/^(\d+):([0-5]\d)$/)
  if (mmss) return Number(mmss[1]) * 60 + Number(mmss[2])
  const min = s.match(/^(\d+(?:[.,]\d+)?)\s*(?:m|min|')$/i)
  if (min) return Math.round(Number(min[1].replace(',', '.')) * 60)
  if (/^\d+$/.test(s)) return Number(s)
  return 'invalid'
}

/** `base` conserve tempo, intention et note d'une prescription existante. */
export function fromFields(f: ForceFields, referenceId: string | null, base?: ForcePrescription): ParseResult {
  const fail = (error: string): ParseResult => ({ ok: false, error })

  if (!/^\d+$/.test(f.sets.trim()) || Number(f.sets) < 1) return fail('Séries : entier ≥ 1')
  const sr = f.reps.trim().match(/^(\d+)(?:-(\d+))?$/)
  if (!sr || Number(sr[1]) < 1) return fail('Répétitions : 8 ou 8-10')
  const reps = sr[2] ? { min: Number(sr[1]), max: Number(sr[2]) } : Number(sr[1])

  let load: ForcePrescription['load']
  if (f.loadMode === 'percent') {
    if (!referenceId) return fail('Aucun 1RM enregistré pour cet exercice : choisissez kg.')
    const v = dec(f.loadValue)
    if (v === null || v <= 0) return fail('Charge : pourcentage supérieur à 0')
    load = { type: 'percent_reference', value: v, referenceId }
  } else if (f.loadMode === 'kg') {
    const v = dec(f.loadValue)
    if (v === null || v <= 0) return fail('Charge : kg supérieur à 0')
    load = { type: 'kg', value: v }
  } else if (f.loadMode === 'bodyweight') {
    load = { type: 'bodyweight' }
  } else {
    load = { type: 'rpe_only' }
  }

  let rpe: number | undefined
  if (f.rpe.trim()) {
    const v = dec(f.rpe)
    if (v === null || v < 1 || v > 10 || !Number.isInteger(v * 2)) return fail('RPE : 1 à 10 par pas de 0,5')
    rpe = v
  }
  if (load.type === 'rpe_only' && rpe === undefined) return fail('RPE requis quand la charge est « RPE seul »')

  const rest = parseRest(f.rest)
  if (rest === 'invalid') return fail('Récup : secondes (120) ou min:sec (2:00)')

  const res = forcePrescription.safeParse({
    mode: 'force',
    sets: Number(f.sets),
    reps,
    load,
    ...(rpe !== undefined ? { rpe } : {}),
    ...(rest !== undefined ? { restSeconds: rest } : {}),
    ...(base?.tempo ? { tempo: base.tempo } : {}),
    ...(base?.intention ? { intention: base.intention } : {}),
    ...(base?.note ? { note: base.note } : {}),
  })
  return res.success ? { ok: true, value: res.data } : fail(res.error.issues[0]?.message ?? 'Prescription invalide')
}