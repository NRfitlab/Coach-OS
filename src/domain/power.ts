import { absoluteLoadKg, puissancePrescription, type Prescription, type ReferenceValue } from './prescription'
import { dec, optNum, parseRest, parseRpe } from './prescriptionFields'

export type PowerPrescription = Extract<Prescription, { mode: 'puissance' }>
export type PowerResult = { ok: true; value: PowerPrescription } | { ok: false; error: string }
export type PowerLoadMode = 'none' | 'kg' | 'percent' | 'bodyweight'
export type PowerUnit = 'reps' | 'contacts'

export type PowerFields = {
  sets: string
  reps: string
  unit: PowerUnit
  loadMode: PowerLoadMode
  loadValue: string
  velocity: string
  velocityLoss: string
  height: string
  rest: string
  rpe: string
}

export const defaultPowerFields = (): PowerFields => ({
  sets: '', reps: '', unit: 'reps', loadMode: 'none', loadValue: '',
  velocity: '', velocityLoss: '', height: '', rest: '', rpe: '',
})

export function powerOf(raw: unknown): PowerPrescription | null {
  const r = puissancePrescription.safeParse(raw)
  return r.success ? r.data : null
}

export function powerToFields(p: PowerPrescription): PowerFields {
  const l = p.load
  return {
    sets: String(p.sets),
    reps: String(p.reps),
    unit: p.unit,
    loadMode: !l ? 'none' : l.type === 'kg' ? 'kg' : l.type === 'percent_reference' ? 'percent' : l.type === 'bodyweight' ? 'bodyweight' : 'none',
    loadValue: l && (l.type === 'kg' || l.type === 'percent_reference') ? String(l.value) : '',
    velocity: p.targetVelocity === undefined ? '' : String(p.targetVelocity),
    velocityLoss: p.maxVelocityLossPercent === undefined ? '' : String(p.maxVelocityLossPercent),
    height: p.heightCm === undefined ? '' : String(p.heightCm),
    rest: String(p.restSeconds),
    rpe: p.rpe === undefined ? '' : String(p.rpe),
  }
}

/** `referenceId` : 1RM de l'exercice pour une charge en %. `base` conserve l'intention et la note. */
export function powerFromFields(f: PowerFields, referenceId: string | null, base?: PowerPrescription): PowerResult {
  const fail = (error: string): PowerResult => ({ ok: false, error })

  if (!/^\d+$/.test(f.sets.trim()) || Number(f.sets) < 1) return fail('Séries : entier ≥ 1')
  if (!/^\d+$/.test(f.reps.trim()) || Number(f.reps) < 1) return fail('Répétitions ou contacts : entier ≥ 1')

  let load: PowerPrescription['load'] = undefined
  if (f.loadMode === 'kg') {
    const v = dec(f.loadValue)
    if (v === null || v <= 0) return fail('Charge : kg supérieur à 0')
    load = { type: 'kg', value: v }
  } else if (f.loadMode === 'percent') {
    if (!referenceId) return fail('Aucun 1RM enregistré pour cet exercice : choisissez kg ou aucune charge.')
    const v = dec(f.loadValue)
    if (v === null || v <= 0 || v > 150) return fail('Charge : pourcentage entre 1 et 150')
    load = { type: 'percent_reference', value: v, referenceId }
  } else if (f.loadMode === 'bodyweight') {
    load = { type: 'bodyweight' }
  }

  const velocity = optNum(f.velocity, 0.01, 10)
  if (velocity === 'invalid') return fail('Vitesse cible : m/s (0,8)')
  const loss = optNum(f.velocityLoss, 1, 60)
  if (loss === 'invalid') return fail('Perte de vitesse max : 1 à 60 %')
  const height = optNum(f.height, 1, 300)
  if (height === 'invalid') return fail('Hauteur : cm (60)')
  const rest = parseRest(f.rest)
  if (rest === undefined || rest === 'invalid') return fail('Récup requise : secondes (120) ou min:sec (2:00)')
  const rpe = parseRpe(f.rpe)
  if (rpe === 'invalid') return fail('RPE : 1 à 10 par pas de 0,5')

  const res = puissancePrescription.safeParse({
    mode: 'puissance',
    sets: Number(f.sets),
    reps: Number(f.reps),
    unit: f.unit,
    restSeconds: rest,
    ...(load ? { load } : {}),
    ...(velocity !== undefined ? { targetVelocity: velocity } : {}),
    ...(loss !== undefined ? { maxVelocityLossPercent: loss } : {}),
    ...(height !== undefined ? { heightCm: height } : {}),
    ...(rpe !== undefined ? { rpe } : {}),
    ...(base?.intention ? { intention: base.intention } : {}),
    ...(base?.note ? { note: base.note } : {}),
  })
  return res.success ? { ok: true, value: res.data } : fail(res.error.issues[0]?.message ?? 'Prescription invalide')
}

export function describePower(p: PowerPrescription, refs: ReferenceValue[]): string {
  const parts = [`${p.sets}×${p.reps}${p.unit === 'contacts' ? ' contacts' : ''}`]
  const l = p.load
  if (l?.type === 'kg') parts.push(`${l.value} kg`)
  if (l?.type === 'bodyweight') parts.push('PC')
  if (l?.type === 'percent_reference') {
    const a = absoluteLoadKg(l, refs)
    parts.push(a ? `${l.value}% (${a.estimated ? '≈' : '='} ${a.kg} kg${a.estimated ? ', estimé' : ''})` : `${l.value}% (référence introuvable)`)
  }
  if (p.heightCm !== undefined) parts.push(`${p.heightCm} cm`)
  if (p.targetVelocity !== undefined) parts.push(`≥ ${p.targetVelocity} m/s`)
  if (p.maxVelocityLossPercent !== undefined) parts.push(`perte max ${p.maxVelocityLossPercent} %`)
  if (p.rpe !== undefined) parts.push(`RPE ${p.rpe}`)
  parts.push(`${p.restSeconds}"`)
  return parts.join('  ·  ')
}

/** Durée : séries × (répétitions × secondes par répétition + récupération). */
export const powerSeconds = (p: PowerPrescription, secPerRep: number): number =>
  p.sets * (p.reps * secPerRep + p.restSeconds)