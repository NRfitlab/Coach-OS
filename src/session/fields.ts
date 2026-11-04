import { absoluteLoadKg, prescriptionSchema, type ReferenceValue } from '../domain/prescription'
import type { SetInput, SetRow } from './api'

export type FieldKey = 'reps' | 'loadKg' | 'durationS' | 'distanceM' | 'rpe' | 'note'
export type Field = { key: FieldKey; label: string; unit?: string; scale?: number }
export type Draft = Partial<Record<FieldKey, string>>
export type Plan = {
  sets: number
  fields: Field[]
  prefill: Draft
  hint?: string
  rpeHint?: string
}

const repsField = (label = 'Rép.'): Field => ({ key: 'reps', label })
const loadField: Field = { key: 'loadKg', label: 'Charge', unit: 'kg' }
const durS: Field = { key: 'durationS', label: 'Durée', unit: 's' }
const durMin: Field = { key: 'durationS', label: 'Durée', unit: 'min', scale: 60 }
const dist: Field = { key: 'distanceM', label: 'Distance', unit: 'm' }
const kcal: Field = { key: 'note', label: 'Calories', unit: 'cal' }
const rpeField: Field = { key: 'rpe', label: 'RPE' }

const disp = (n: number, scale = 1): string => String(Math.round((n / scale) * 10) / 10)

function dateFr(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

type LoadArg = Parameters<typeof absoluteLoadKg>[0]

function loadInfo(load: LoadArg | undefined, refs: ReferenceValue[]): { value?: string; hint?: string } {
  if (!load) return {}
  const abs = absoluteLoadKg(load, refs)
  if (load.type === 'percent_reference') {
    if (!abs) return { hint: 'Référence introuvable : saisissez la charge.' }
    return {
      value: String(abs.kg),
      hint: `${load.value} % → ${abs.kg} kg${abs.estimated ? ' (estimé)' : ''}, référence du ${dateFr(abs.referenceDate)}.`,
    }
  }
  return abs ? { value: String(abs.kg) } : {}
}

export function planOf(raw: unknown, refs: ReferenceValue[]): Plan | null {
  const parsed = prescriptionSchema.safeParse(raw)
  if (!parsed.success) return null
  const rx = parsed.data
  switch (rx.mode) {
    case 'force': {
      const l = loadInfo(rx.load, refs)
      return {
        sets: rx.sets,
        fields: [repsField(), loadField, rpeField],
        prefill: {
          reps: String(typeof rx.reps === 'number' ? rx.reps : rx.reps.min),
          ...(l.value ? { loadKg: l.value } : {}),
        },
        hint: l.hint,
        rpeHint: rx.rpe !== undefined ? `cible ${rx.rpe}` : undefined,
      }
    }
    case 'puissance': {
      const l = loadInfo(rx.load, refs)
      const withLoad = rx.load !== undefined && rx.load.type !== 'bodyweight' && rx.load.type !== 'rpe_only'
      return {
        sets: rx.sets,
        fields: [repsField(rx.unit === 'contacts' ? 'Contacts' : 'Rép.'), ...(withLoad ? [loadField] : []), rpeField],
        prefill: { reps: String(rx.reps), ...(l.value ? { loadKg: l.value } : {}) },
        hint: l.hint,
        rpeHint: rx.rpe !== undefined ? `cible ${rx.rpe}` : undefined,
      }
    }
    case 'course': {
      const i = rx.intensity
      const isDist = rx.target.type === 'distance_m'
      return {
        sets: rx.repeats,
        fields: [isDist ? dist : durMin, rpeField],
        prefill: isDist ? { distanceM: disp(rx.target.value) } : { durationS: disp(rx.target.value, 60) },
        rpeHint: i && i.unit === 'rpe' ? `cible ${i.value}` : undefined,
      }
    }
    case 'conditioning': {
      const main: Field =
        rx.quantityKind === 'reps' ? repsField()
        : rx.quantityKind === 'meters' ? dist
        : rx.quantityKind === 'seconds' ? durS
        : kcal
      const key = main.key
      return {
        sets: 1,
        fields: [main, ...(rx.loadKg !== undefined ? [loadField] : []), rpeField],
        prefill: {
          [key]: key === 'note' ? `${rx.quantity}` : disp(rx.quantity),
          ...(rx.loadKg !== undefined ? { loadKg: disp(rx.loadKg) } : {}),
        },
        rpeHint: rx.rpe !== undefined ? `cible ${rx.rpe}` : undefined,
      }
    }
    case 'mobilite': {
      if (rx.durationSeconds !== undefined) {
        return { sets: 1, fields: [durS], prefill: { durationS: disp(rx.durationSeconds) } }
      }
      if (rx.reps !== undefined) {
        return { sets: 1, fields: [repsField()], prefill: { reps: String(rx.reps) } }
      }
      return { sets: 1, fields: [durS], prefill: {} }
    }
    case 'recuperation':
      return {
        sets: rx.rounds,
        fields: [durMin, rpeField],
        prefill: { durationS: disp(rx.roundMinutes * 60, 60) },
        rpeHint: rx.maxRpe !== undefined ? `max ${rx.maxRpe}` : undefined,
      }
    case 'libre':
      return {
        sets: 1,
        fields: [durMin, rpeField],
        prefill: rx.durationMinutes !== undefined ? { durationS: disp(rx.durationMinutes) } : {},
        rpeHint: rx.targetRpe !== undefined ? `cible ${rx.targetRpe}` : undefined,
      }
  }
}

export function draftOfSaved(s: SetRow, fields: Field[]): Draft {
  const d: Draft = {}
  for (const f of fields) {
    switch (f.key) {
      case 'reps': if (s.reps !== null) d.reps = disp(s.reps); break
      case 'loadKg': if (s.loadKg !== null) d.loadKg = disp(s.loadKg); break
      case 'durationS': if (s.durationS !== null) d.durationS = disp(s.durationS, f.scale ?? 1); break
      case 'distanceM': if (s.distanceM !== null) d.distanceM = disp(s.distanceM); break
      case 'rpe': if (s.rpe !== null) d.rpe = disp(s.rpe); break
      case 'note': if (s.note !== null) d.note = s.note.replace(/\s*cal$/, ''); break
    }
  }
  return d
}

const norm = (s?: string): string => {
  const t = (s ?? '').trim().replace(',', '.')
  if (t === '') return ''
  const n = Number(t)
  return Number.isFinite(n) ? String(n) : t
}

export function sameDraft(a: Draft, b: Draft, fields: Field[]): boolean {
  return fields.every((f) => norm(a[f.key]) === norm(b[f.key]))
}

export function toSet(
  lineId: string,
  setIndex: number,
  draft: Draft,
  fields: Field[],
  performedAt: string,
): { ok: true; set: SetInput } | { ok: false; error: string } {
  const set: SetInput = { lineId, setIndex, performedAt }
  let any = false
  for (const f of fields) {
    const raw = (draft[f.key] ?? '').trim().replace(',', '.')
    if (raw === '') continue
    const n = Number(raw)
    if (!Number.isFinite(n) || n < 0) return { ok: false, error: `${f.label} : valeur invalide.` }
    if (f.key === 'loadKg' && n === 0) continue
    switch (f.key) {
      case 'reps': set.reps = Math.round(n); break
      case 'loadKg':
        if (n > 1000) return { ok: false, error: 'Charge : valeur invalide.' }
        set.loadKg = n
        break
      case 'durationS': set.durationS = Math.round(n * (f.scale ?? 1)); break
      case 'distanceM': set.distanceM = Math.round(n); break
      case 'rpe':
        if (n < 1 || n > 10 || (n * 2) % 1 !== 0) return { ok: false, error: 'RPE : de 1 à 10, par pas de 0,5.' }
        set.rpe = n
        break
      case 'note': set.note = `${Math.round(n)} cal`; break
    }
    any = true
  }
  if (!any) return { ok: false, error: 'Renseignez au moins une valeur.' }
  return { ok: true, set }
}