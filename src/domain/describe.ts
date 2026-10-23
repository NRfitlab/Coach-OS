import { conditioningOf, describeConditioning } from './conditioning'
import { courseOf, describeCourse } from './course'
import { describeLibre, libreOf } from './libre'
import { describeMobility, mobilityOf } from './mobility'
import { describePower, powerOf } from './power'
import type { ReferenceValue } from './prescription'
import { forceOfPrescription } from './prescriptionFields'
import { describeForce } from './prescriptionText'
import { describeRecovery, recoveryOf } from './recovery'

/** Description lisible d'une prescription, quel que soit son mode (null si le mode est inconnu). */
export function describeLine(raw: unknown, refs: ReferenceValue[]): string | null {
  const f = forceOfPrescription(raw)
  if (f) return describeForce(f, refs)
  const c = courseOf(raw)
  if (c) return describeCourse(c, refs)
  const k = conditioningOf(raw)
  if (k) return describeConditioning(k)
  const m = mobilityOf(raw)
  if (m) return describeMobility(m)
  const p = powerOf(raw)
  if (p) return describePower(p, refs)
  const r = recoveryOf(raw)
  if (r) return describeRecovery(r)
  const l = libreOf(raw)
  return l ? describeLibre(l) : null
}