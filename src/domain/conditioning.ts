import { conditioningPrescription, type Prescription } from './prescription'
import { optNum, parseRpe } from './prescriptionFields'

export type ConditioningPrescription = Extract<Prescription, { mode: 'conditioning' }>
export type ConditioningResult = { ok: true; value: ConditioningPrescription } | { ok: false; error: string }
export type QuantityKind = ConditioningPrescription['quantityKind']

export const QUANTITY_LABEL: Record<QuantityKind, string> = {
  reps: 'Répétitions',
  meters: 'Mètres',
  calories: 'Calories',
  seconds: 'Secondes',
}
const UNIT: Record<QuantityKind, string> = { reps: 'reps', meters: 'm', calories: 'cal', seconds: 's' }

export type ConditioningFields = { kind: QuantityKind; quantity: string; load: string; rpe: string }

export const defaultConditioningFields = (): ConditioningFields => ({
  kind: 'reps', quantity: '', load: '', rpe: '',
})

export function conditioningOf(raw: unknown): ConditioningPrescription | null {
  const r = conditioningPrescription.safeParse(raw)
  return r.success ? r.data : null
}

const parseSeconds = (raw: string): number | null => {
  const s = raw.trim()
  if (/^\d+$/.test(s)) return Number(s)
  const m = s.match(/^(\d+):([0-5]\d)$/)
  return m ? Number(m[1]) * 60 + Number(m[2]) : null
}

export function conditioningToFields(p: ConditioningPrescription): ConditioningFields {
  return {
    kind: p.quantityKind,
    quantity: String(p.quantity),
    load: p.loadKg === undefined ? '' : String(p.loadKg),
    rpe: p.rpe === undefined ? '' : String(p.rpe),
  }
}

/** `base` conserve l'intention et la note d'une prescription existante. */
export function conditioningFromFields(f: ConditioningFields, base?: ConditioningPrescription): ConditioningResult {
  const fail = (error: string): ConditioningResult => ({ ok: false, error })
  const raw = f.quantity.trim()
  const quantity = f.kind === 'seconds' ? parseSeconds(raw) : /^\d+$/.test(raw) ? Number(raw) : null
  if (quantity === null || quantity < 1) {
    return fail(f.kind === 'seconds' ? 'Durée : secondes (40) ou min:sec (1:00)' : 'Quantité : entier ≥ 1')
  }
  const load = optNum(f.load, 0.01, 1000)
  if (load === 'invalid') return fail('Charge : kg (20 ou 22,5)')
  const rpe = parseRpe(f.rpe)
  if (rpe === 'invalid') return fail('RPE : 1 à 10 par pas de 0,5')

  const res = conditioningPrescription.safeParse({
    mode: 'conditioning',
    quantityKind: f.kind,
    quantity,
    ...(load !== undefined ? { loadKg: load } : {}),
    ...(rpe !== undefined ? { rpe } : {}),
    ...(base?.intention ? { intention: base.intention } : {}),
    ...(base?.note ? { note: base.note } : {}),
  })
  return res.success ? { ok: true, value: res.data } : fail(res.error.issues[0]?.message ?? 'Prescription invalide')
}

export function describeConditioning(p: ConditioningPrescription): string {
  const parts = [`${p.quantity} ${UNIT[p.quantityKind]}`]
  if (p.loadKg !== undefined) parts.push(`${p.loadKg} kg`)
  if (p.rpe !== undefined) parts.push(`RPE ${p.rpe}`)
  return parts.join('  ·  ')
}

/** Durée d'une ligne : répétitions × secPerRep, ou secondes prescrites. Mètres et calories : null (durée inconnue). */
export function conditioningSeconds(p: ConditioningPrescription, secPerRep: number): number | null {
  if (p.quantityKind === 'reps') return p.quantity * secPerRep
  if (p.quantityKind === 'seconds') return p.quantity
  return null
}
