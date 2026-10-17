import { coursePrescription, prescriptionSchema, type Prescription, type ReferenceValue } from './prescription'
import type { Reference } from './reference'

export type CoursePrescription = Extract<Prescription, { mode: 'course' }>
export type CourseResult = { ok: true; value: CoursePrescription } | { ok: false; error: string }
export type TargetUnit = 'm' | 'km' | 'min'
export type IntensityKind = 'none' | 'pace' | 'speed' | 'percent_mas' | 'hr' | 'rpe'
export type RecoveryKind = 'none' | 'ef' | 'active' | 'walk' | 'rest'

export type CourseFields = {
  repeats: string
  targetUnit: TargetUnit
  targetValue: string
  intensityKind: IntensityKind
  intensityValue: string
  recoveryKind: RecoveryKind
  recoveryValue: string
  recoverySpeed: string
}

export const RECOVERY_LABEL = { ef: 'EF', active: 'active', jog: 'EF', walk: 'marche', rest: 'arrêt' } as const

export function defaultCourseFields(): CourseFields {
  return {
    repeats: '1', targetUnit: 'm', targetValue: '',
    intensityKind: 'none', intensityValue: '', recoveryKind: 'none', recoveryValue: '', recoverySpeed: '',
  }
}

export function courseOf(raw: unknown): CoursePrescription | null {
  const r = prescriptionSchema.safeParse(raw)
  return r.success && r.data.mode === 'course' ? r.data : null
}

export const latestMas = (refs: Reference[]): Reference | undefined => refs.find((r) => r.kind === 'mas')

const pad = (n: number) => String(n).padStart(2, '0')

export function fmtClock(seconds: number): string {
  const t = Math.round(seconds)
  return `${Math.floor(t / 60)}:${pad(t % 60)}`
}

function fmtMinutes(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const r = Math.round(seconds % 60)
  return r === 0 ? String(m) : `${m}:${pad(r)}`
}

export function parseClock(raw: string): number | null {
  const m = raw.trim().match(/^(\d+):([0-5]\d)$/)
  return m ? Number(m[1]) * 60 + Number(m[2]) : null
}

const dec = (s: string): number | null => {
  const t = s.trim()
  return /^\d+([.,]\d+)?$/.test(t) ? Number(t.replace(',', '.')) : null
}

/** VMA (MAS) en km/h ; une unité en m/s est convertie. */
const masKmh = (ref: ReferenceValue): number => (/m\/s/i.test(ref.unit) ? ref.value * 3.6 : ref.value)

export function percentMasText(percent: number, refId: string, refs: ReferenceValue[]): string {
  const ref = refs.find((r) => r.id === refId)
  if (!ref) return 'référence introuvable'
  const kmh = (masKmh(ref) * percent) / 100
  const est = ref.method !== 'direct_test'
  return `${est ? '≈' : '='} ${kmh.toFixed(1)} km/h · ${fmtClock(3600 / kmh)}/km${est ? ' (estimé)' : ''}`
}

export function intensitySpeed(
  p: CoursePrescription, refs: ReferenceValue[],
): { kmh: number; estimated: boolean } | null {
  const i = p.intensity
  if (!i) return null
  if (i.unit === 'pace_s_per_km') return { kmh: 3600 / i.value, estimated: false }
  if (i.unit === 'speed_kmh') return { kmh: i.value, estimated: false }
  if (i.unit === 'percent_mas') {
    const ref = refs.find((r) => r.id === i.referenceId)
    return ref ? { kmh: (masKmh(ref) * i.value) / 100, estimated: ref.method !== 'direct_test' } : null
  }
  return null
}

/**
 * Durée et distance d'une ligne. En course à pied, sans vitesse prescrite, l'allure de footing (s/km)
 * est une hypothèse. Hors course à pied, aucune hypothèse : la valeur inconnue n'est pas comptée (`incomplete`).
 * Une récupération active avec vitesse ajoute sa distance (prescrite, sans hypothèse).
 */
export function courseTotals(
  p: CoursePrescription, refs: ReferenceValue[], footingSecPerKm: number, running: boolean,
) {
  const s = intensitySpeed(p, refs)
  const kmh = s ? s.kmh : running ? 3600 / footingSecPerKm : null
  const ms = kmh === null ? null : kmh / 3.6
  const t = p.target
  const rec = p.recovery?.durationSeconds ?? 0
  const recMeters =
    p.recovery?.kind === 'active' && p.recovery.speedKmh !== undefined ? (rec * p.recovery.speedKmh) / 3.6 : 0
  const workSeconds = t.type === 'duration_s' ? t.value : ms === null ? 0 : t.value / ms
  const workMeters = t.type === 'distance_m' ? t.value : ms === null ? 0 : t.value * ms
  return {
    seconds: p.repeats * workSeconds + Math.max(0, p.repeats - 1) * rec,
    meters: running ? p.repeats * workMeters + Math.max(0, p.repeats - 1) * recMeters : 0,
    distanceEstimated: running && t.type === 'duration_s' && (!s || s.estimated),
    incomplete: t.type === 'distance_m' && ms === null,
  }
}

export function describeCourse(p: CoursePrescription, refs: ReferenceValue[]): string {
  const t = p.target
  const target =
    t.type === 'distance_m'
      ? t.value >= 1000 && t.value % 100 === 0 ? `${t.value / 1000} km` : `${t.value} m`
      : `${fmtMinutes(t.value)} min`
  const parts = [`${p.repeats}×${target}`]
  const i = p.intensity
  if (i) {
    if (i.unit === 'pace_s_per_km') parts.push(`${fmtClock(i.value)}/km`)
    else if (i.unit === 'speed_kmh') parts.push(`${i.value} km/h`)
    else if (i.unit === 'hr_bpm') parts.push(`${i.value} bpm`)
    else if (i.unit === 'rpe') parts.push(`RPE ${i.value}`)
    else parts.push(`${i.value}% VMA (${percentMasText(i.value, i.referenceId, refs)})`)
  }
  const r = p.recovery
  if (r) {
    const speed = r.speedKmh !== undefined ? ` ${r.speedKmh} km/h` : ''
    parts.push(`récup ${fmtClock(r.durationSeconds)} ${RECOVERY_LABEL[r.kind]}${speed}`)
  }
  return parts.join('  ·  ')
}

export function courseToFields(p: CoursePrescription): CourseFields {
  const t = p.target
  const km = t.type === 'distance_m' && t.value >= 2000 && t.value % 1000 === 0
  const i = p.intensity
  const rk = p.recovery?.kind
  return {
    repeats: String(p.repeats),
    targetUnit: t.type === 'duration_s' ? 'min' : km ? 'km' : 'm',
    targetValue: t.type === 'duration_s' ? fmtMinutes(t.value) : km ? String(t.value / 1000) : String(t.value),
    intensityKind: !i ? 'none'
      : i.unit === 'pace_s_per_km' ? 'pace'
      : i.unit === 'speed_kmh' ? 'speed'
      : i.unit === 'percent_mas' ? 'percent_mas'
      : i.unit === 'hr_bpm' ? 'hr' : 'rpe',
    intensityValue: !i ? '' : i.unit === 'pace_s_per_km' ? fmtClock(i.value) : String(i.value),
    recoveryKind: !rk ? 'none' : rk === 'jog' ? 'ef' : rk,
    recoveryValue: p.recovery ? fmtClock(p.recovery.durationSeconds) : '',
    recoverySpeed: p.recovery?.speedKmh !== undefined ? String(p.recovery.speedKmh) : '',
  }
}

/** `base` conserve l'intention et la note d'une prescription existante. */
export function courseFromFields(f: CourseFields, masRefId: string | null, base?: CoursePrescription): CourseResult {
  const fail = (error: string): CourseResult => ({ ok: false, error })

  if (!/^\d+$/.test(f.repeats.trim()) || Number(f.repeats) < 1) return fail('Répétitions : entier ≥ 1')

  let target: CoursePrescription['target']
  if (f.targetUnit === 'min') {
    const minutes = dec(f.targetValue)
    const secs = parseClock(f.targetValue) ?? (minutes !== null ? Math.round(minutes * 60) : null)
    if (secs === null || secs <= 0) return fail('Durée : minutes (12) ou min:sec (12:30)')
    target = { type: 'duration_s', value: secs }
  } else {
    const v = dec(f.targetValue)
    if (v === null || v <= 0) return fail('Distance : nombre supérieur à 0')
    target = { type: 'distance_m', value: f.targetUnit === 'km' ? Math.round(v * 1000) : v }
  }

  let intensity: CoursePrescription['intensity'] = undefined
  const iv = f.intensityValue
  switch (f.intensityKind) {
    case 'none':
      break
    case 'pace': {
      const s = parseClock(iv)
      if (s === null || s <= 0) return fail('Allure : min:sec par km (3:55)')
      intensity = { unit: 'pace_s_per_km', value: s }
      break
    }
    case 'speed': {
      const v = dec(iv)
      if (v === null || v <= 0) return fail('Vitesse : km/h supérieur à 0')
      intensity = { unit: 'speed_kmh', value: v }
      break
    }
    case 'percent_mas': {
      if (!masRefId) return fail('Aucune VMA enregistrée : ajoutez-la dans la fiche athlète ou choisissez une autre intensité.')
      const v = dec(iv)
      if (v === null || v <= 0 || v > 200) return fail('% VMA : entre 1 et 200')
      intensity = { unit: 'percent_mas', value: v, referenceId: masRefId }
      break
    }
    case 'hr': {
      if (!/^\d+$/.test(iv.trim()) || Number(iv) < 1) return fail('FC : bpm entier')
      intensity = { unit: 'hr_bpm', value: Number(iv) }
      break
    }
    default: {
      const v = dec(iv)
      if (v === null || v < 1 || v > 10 || !Number.isInteger(v * 2)) return fail('RPE : 1 à 10 par pas de 0,5')
      intensity = { unit: 'rpe', value: v }
    }
  }

  let recovery: CoursePrescription['recovery'] = undefined
  if (f.recoveryKind !== 'none') {
    const s = parseClock(f.recoveryValue) ?? (/^\d+$/.test(f.recoveryValue.trim()) ? Number(f.recoveryValue) : null)
    if (s === null) return fail('Récup : secondes (90) ou min:sec (2:00)')
    let speedKmh: number | undefined
    if (f.recoveryKind === 'active') {
      const v = dec(f.recoverySpeed)
      if (v === null || v <= 0 || v > 40) return fail('Récup active : vitesse en km/h (10)')
      speedKmh = v
    }
    recovery = {
      kind: f.recoveryKind,
      durationSeconds: s,
      ...(speedKmh !== undefined ? { speedKmh } : {}),
    }
  }

  const res = coursePrescription.safeParse({
    mode: 'course',
    repeats: Number(f.repeats),
    target,
    ...(intensity ? { intensity } : {}),
    ...(recovery ? { recovery } : {}),
    ...(base?.intention ? { intention: base.intention } : {}),
    ...(base?.note ? { note: base.note } : {}),
  })
  return res.success ? { ok: true, value: res.data } : fail(res.error.issues[0]?.message ?? 'Prescription invalide')
}