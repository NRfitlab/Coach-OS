import { librePrescription, type Prescription } from './prescription'
import { optNum, parseRpe } from './prescriptionFields'

export type LibrePrescription = Extract<Prescription, { mode: 'libre' }>
export type LibreResult = { ok: true; value: LibrePrescription } | { ok: false; error: string }
export type LibreFields = { instruction: string; minutes: string; rpe: string }

export const defaultLibreFields = (): LibreFields => ({ instruction: '', minutes: '', rpe: '' })

export function libreOf(raw: unknown): LibrePrescription | null {
  const r = librePrescription.safeParse(raw)
  return r.success ? r.data : null
}

export function libreToFields(p: LibrePrescription): LibreFields {
  return {
    instruction: p.instruction,
    minutes: p.durationMinutes === undefined ? '' : String(p.durationMinutes),
    rpe: p.targetRpe === undefined ? '' : String(p.targetRpe),
  }
}

export function libreFromFields(f: LibreFields, base?: LibrePrescription): LibreResult {
  const fail = (error: string): LibreResult => ({ ok: false, error })
  const instruction = f.instruction.trim()
  if (!instruction || instruction.length > 500) return fail('Consigne requise (500 caractères au plus)')
  const minutes = optNum(f.minutes, 0.01, 600)
  if (minutes === 'invalid') return fail('Durée : minutes (20)')
  const rpe = parseRpe(f.rpe)
  if (rpe === 'invalid') return fail('RPE cible : 1 à 10 par pas de 0,5')

  const res = librePrescription.safeParse({
    mode: 'libre',
    instruction,
    ...(minutes !== undefined ? { durationMinutes: minutes } : {}),
    ...(rpe !== undefined ? { targetRpe: rpe } : {}),
    ...(base?.intention ? { intention: base.intention } : {}),
    ...(base?.note ? { note: base.note } : {}),
  })
  return res.success ? { ok: true, value: res.data } : fail(res.error.issues[0]?.message ?? 'Prescription invalide')
}

export function describeLibre(p: LibrePrescription): string {
  const parts = [p.instruction]
  if (p.durationMinutes !== undefined) parts.push(`${p.durationMinutes} min`)
  if (p.targetRpe !== undefined) parts.push(`RPE ${p.targetRpe}`)
  return parts.join('  ·  ')
}

export const libreSeconds = (p: LibrePrescription): number => (p.durationMinutes ?? 0) * 60