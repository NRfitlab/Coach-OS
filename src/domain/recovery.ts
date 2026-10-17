import { recuperationPrescription, type Prescription } from './prescription'
import { dec, optNum, parseRpe } from './prescriptionFields'

export type RecoveryPrescription = Extract<Prescription, { mode: 'recuperation' }>
export type RecoveryResult = { ok: true; value: RecoveryPrescription } | { ok: false; error: string }
export type Modality = RecoveryPrescription['modality']

export const MODALITY_LABEL: Record<Modality, string> = {
  walk: 'Marche',
  easy_run: 'Footing léger',
  easy_bike: 'Vélo léger',
  swim: 'Natation',
  self_massage: 'Auto-massage',
  stretching: 'Étirements',
  sauna: 'Sauna',
  cold_bath: 'Bain froid',
  other: 'Autre',
}

export type RecoveryFields = { modality: Modality; rounds: string; minutes: string; maxRpe: string; temperature: string }

export const defaultRecoveryFields = (): RecoveryFields => ({
  modality: 'walk', rounds: '1', minutes: '', maxRpe: '', temperature: '',
})

export function recoveryOf(raw: unknown): RecoveryPrescription | null {
  const r = recuperationPrescription.safeParse(raw)
  return r.success ? r.data : null
}

export function recoveryToFields(p: RecoveryPrescription): RecoveryFields {
  return {
    modality: p.modality,
    rounds: String(p.rounds),
    minutes: String(p.roundMinutes),
    maxRpe: p.maxRpe === undefined ? '' : String(p.maxRpe),
    temperature: p.temperatureC === undefined ? '' : String(p.temperatureC),
  }
}

export function recoveryFromFields(f: RecoveryFields, base?: RecoveryPrescription): RecoveryResult {
  const fail = (error: string): RecoveryResult => ({ ok: false, error })
  if (!/^\d+$/.test(f.rounds.trim()) || Number(f.rounds) < 1) return fail('Tours : entier ≥ 1')
  const minutes = dec(f.minutes)
  if (minutes === null || minutes <= 0 || minutes > 600) return fail('Durée par tour : minutes (10)')
  const maxRpe = parseRpe(f.maxRpe)
  if (maxRpe === 'invalid') return fail('RPE max : 1 à 10 par pas de 0,5')
  const temp = optNum(f.temperature, 0, 120)
  if (temp === 'invalid') return fail('Température : 0 à 120 °C')

  const res = recuperationPrescription.safeParse({
    mode: 'recuperation',
    modality: f.modality,
    rounds: Number(f.rounds),
    roundMinutes: minutes,
    ...(maxRpe !== undefined ? { maxRpe } : {}),
    ...(temp !== undefined ? { temperatureC: temp } : {}),
    ...(base?.intention ? { intention: base.intention } : {}),
    ...(base?.note ? { note: base.note } : {}),
  })
  return res.success ? { ok: true, value: res.data } : fail(res.error.issues[0]?.message ?? 'Prescription invalide')
}

export function describeRecovery(p: RecoveryPrescription): string {
  const parts = [MODALITY_LABEL[p.modality], `${p.rounds}×${p.roundMinutes} min`]
  if (p.maxRpe !== undefined) parts.push(`RPE ≤ ${p.maxRpe}`)
  if (p.temperatureC !== undefined) parts.push(`${p.temperatureC} °C`)
  return parts.join('  ·  ')
}

export const recoverySeconds = (p: RecoveryPrescription): number => p.rounds * p.roundMinutes * 60