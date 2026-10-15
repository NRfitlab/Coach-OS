import {
  absoluteLoadKg, forcePrescription, type ForcePrescription, type ReferenceValue,
} from './prescription'

export type ParseResult = { ok: true; value: ForcePrescription } | { ok: false; error: string }
const fail = (error: string): ParseResult => ({ ok: false, error })

export const FORCE_SYNTAX = '4x5 @80% rpe8 r180'

export function parseForce(text: string, referenceId: string | null): ParseResult {
  let sets: number | undefined
  let reps: ForcePrescription['reps'] | undefined
  let load: ForcePrescription['load'] | undefined
  let rpe: number | undefined
  let rest: number | undefined
  let tempo: string | undefined

  for (const t of text.trim().replace(/,/g, '.').split(/\s+/).filter(Boolean)) {
    const sr = t.match(/^(\d+)[x×](\d+)(?:-(\d+))?$/i)
    if (sr) {
      sets = Number(sr[1])
      reps = sr[3] ? { min: Number(sr[2]), max: Number(sr[3]) } : Number(sr[2])
      continue
    }
    const pct = t.match(/^@(\d+(?:\.\d+)?)%$/)
    if (pct) {
      if (!referenceId) {
        return fail('Aucun 1RM enregistré pour cet exercice : saisissez la charge en kg (@80kg) ou ajoutez un 1RM dans la fiche athlète.')
      }
      load = { type: 'percent_reference', value: Number(pct[1]), referenceId }
      continue
    }
    const kg = t.match(/^@(\d+(?:\.\d+)?)kg$/i)
    if (kg) { load = { type: 'kg', value: Number(kg[1]) }; continue }
    if (/^@pc$/i.test(t)) { load = { type: 'bodyweight' }; continue }
    const r = t.match(/^rpe(\d+(?:\.\d+)?)$/i)
    if (r) { rpe = Number(r[1]); continue }
    const rs = t.match(/^r(\d+)(m|min|')?$/i)
    if (rs) { rest = rs[2] ? Number(rs[1]) * 60 : Number(rs[1]); continue }
    if (/^[0-9X]-[0-9X]-[0-9X]-[0-9X]$/i.test(t)) { tempo = t.toUpperCase(); continue }
    return fail(`Élément non reconnu : « ${t} ». Format : ${FORCE_SYNTAX}`)
  }

  if (sets === undefined || reps === undefined) return fail('Séries × répétitions requis, exemple : 4x5')
  if (!load) {
    if (rpe === undefined) return fail('Charge requise : @80%, @80kg, @pc ou RPE')
    load = { type: 'rpe_only' }
  }
  const res = forcePrescription.safeParse({ mode: 'force', sets, reps, load, rpe, tempo, restSeconds: rest })
  return res.success ? { ok: true, value: res.data } : fail(res.error.issues[0]?.message ?? 'Prescription invalide')
}

const repsText = (r: ForcePrescription['reps']): string => (typeof r === 'number' ? String(r) : `${r.min}-${r.max}`)

export function prescriptionToText(p: ForcePrescription): string {
  const parts = [`${p.sets}x${repsText(p.reps)}`]
  if (p.load.type === 'kg') parts.push(`@${p.load.value}kg`)
  if (p.load.type === 'percent_reference') parts.push(`@${p.load.value}%`)
  if (p.load.type === 'bodyweight') parts.push('@pc')
  if (p.rpe !== undefined) parts.push(`rpe${p.rpe}`)
  if (p.tempo) parts.push(p.tempo)
  if (p.restSeconds !== undefined) parts.push(`r${p.restSeconds}`)
  return parts.join(' ')
}

export function describeForce(p: ForcePrescription, refs: ReferenceValue[]): string {
  const parts = [`${p.sets}×${repsText(p.reps)}`]
  const l = p.load
  if (l.type === 'kg') parts.push(`${l.value} kg`)
  if (l.type === 'bodyweight') parts.push('PC')
  if (l.type === 'percent_reference') {
    const abs = absoluteLoadKg(l, refs)
    parts.push(
      abs
        ? `${l.value}% (${abs.estimated ? '≈' : '='} ${abs.kg} kg${abs.estimated ? ', estimé' : ''})`
        : `${l.value}% (référence introuvable)`,
    )
  }
  if (p.rpe !== undefined) parts.push(`RPE ${p.rpe}`)
  if (p.tempo) parts.push(p.tempo)
  if (p.restSeconds !== undefined) parts.push(`${p.restSeconds}"`)
  return parts.join('  ·  ')
}

/** Durée estimée : séries × (répétitions × secondes par répétition + repos prescrit). */
export function estimatedSeconds(p: ForcePrescription, secPerRep: number): number {
  const reps = typeof p.reps === 'number' ? p.reps : (p.reps.min + p.reps.max) / 2
  return p.sets * (reps * secPerRep + (p.restSeconds ?? 0))
}