import { mobilityPrescription, type Prescription } from './prescription'

export type MobilityPrescription = Extract<Prescription, { mode: 'mobilite' }>
export type MobilityResult = { ok: true; value: MobilityPrescription } | { ok: false; error: string }
export type Side = 'both' | 'left' | 'right'

export type MobilityFields = { duration: string; reps: string; breaths: string; side: Side }

export const SIDE_LABEL: Record<Side, string> = { both: 'Les deux côtés', left: 'Gauche', right: 'Droit' }

/** Hypothèse de durée d'une respiration, en secondes. */
export const SEC_PER_BREATH = 5

export const defaultMobilityFields = (): MobilityFields => ({ duration: '', reps: '', breaths: '', side: 'both' })

export function mobilityOf(raw: unknown): MobilityPrescription | null {
  const r = mobilityPrescription.safeParse(raw)
  return r.success ? r.data : null
}

const parseSeconds = (raw: string): number | null => {
  const s = raw.trim()
  if (/^\d+$/.test(s)) return Number(s)
  const m = s.match(/^(\d+):([0-5]\d)$/)
  return m ? Number(m[1]) * 60 + Number(m[2]) : null
}

export function mobilityToFields(p: MobilityPrescription): MobilityFields {
  return {
    duration: p.durationSeconds === undefined ? '' : String(p.durationSeconds),
    reps: p.reps === undefined ? '' : String(p.reps),
    breaths: p.breaths === undefined ? '' : String(p.breaths),
    side: p.side,
  }
}

/** `base` conserve l'intention et la note d'une prescription existante. */
export function mobilityFromFields(f: MobilityFields, base?: MobilityPrescription): MobilityResult {
  const fail = (error: string): MobilityResult => ({ ok: false, error })

  let durationSeconds: number | undefined
  if (f.duration.trim()) {
    const d = parseSeconds(f.duration)
    if (d === null || d < 1) return fail('Durée : secondes (30) ou min:sec (1:00)')
    durationSeconds = d
  }
  let reps: number | undefined
  if (f.reps.trim()) {
    if (!/^\d+$/.test(f.reps.trim()) || Number(f.reps) < 1) return fail('Répétitions : entier ≥ 1')
    reps = Number(f.reps)
  }
  let breaths: number | undefined
  if (f.breaths.trim()) {
    if (!/^\d+$/.test(f.breaths.trim()) || Number(f.breaths) < 1) return fail('Respirations : entier ≥ 1')
    breaths = Number(f.breaths)
  }
  if (durationSeconds === undefined && reps === undefined && breaths === undefined) {
    return fail('Durée, répétitions ou respirations requis')
  }

  const res = mobilityPrescription.safeParse({
    mode: 'mobilite',
    side: f.side,
    ...(durationSeconds !== undefined ? { durationSeconds } : {}),
    ...(reps !== undefined ? { reps } : {}),
    ...(breaths !== undefined ? { breaths } : {}),
    ...(base?.intention ? { intention: base.intention } : {}),
    ...(base?.note ? { note: base.note } : {}),
  })
  return res.success ? { ok: true, value: res.data } : fail(res.error.issues[0]?.message ?? 'Prescription invalide')
}

export function describeMobility(p: MobilityPrescription): string {
  const parts: string[] = []
  if (p.durationSeconds !== undefined) parts.push(`${p.durationSeconds} s`)
  if (p.reps !== undefined) parts.push(`${p.reps} reps`)
  if (p.breaths !== undefined) parts.push(`${p.breaths} respirations`)
  parts.push(SIDE_LABEL[p.side])
  return parts.join('  ·  ')
}

/** Durée d'une ligne : durée prescrite, sinon répétitions × secPerRep, sinon respirations × 5 s ; ×2 pour les deux côtés. */
export function mobilitySeconds(p: MobilityPrescription, secPerRep: number): number {
  const one =
    p.durationSeconds ?? (p.reps !== undefined ? p.reps * secPerRep : p.breaths !== undefined ? p.breaths * SEC_PER_BREATH : 0)
  return p.side === 'both' ? one * 2 : one
}