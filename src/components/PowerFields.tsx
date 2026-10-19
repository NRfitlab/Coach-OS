import ExerciseInfoButton from './ExerciseInfoButton'
import type { KeyboardEvent } from 'react'
import type { ExerciseData } from '../athletes/builder'
import {
  powerFromFields, powerOf, powerToFields, type PowerFields, type PowerLoadMode, type PowerUnit,
} from '../domain/power'
import { absoluteLoadKg, type ReferenceValue } from '../domain/prescription'
import { latestOneRm } from '../domain/prescriptionFields'
import type { Reference } from '../domain/reference'
import { EditableRow } from './EditableRow'
import { CELL } from './ExerciseFields'

export const POWER_GRID =
  'grid grid-cols-[6rem_minmax(9rem,1fr)_4rem_9rem_14rem_5rem_5rem_5rem_5rem_4rem_6rem] items-start gap-2'

export function powerAbs(f: PowerFields, refId: string | null, refs: ReferenceValue[]): string {
  if (f.loadMode !== 'percent' || !refId) return ''
  const v = Number(f.loadValue.replace(',', '.'))
  if (!Number.isFinite(v) || v <= 0) return ''
  const a = absoluteLoadKg({ type: 'percent_reference', value: v, referenceId: refId }, refs)
  if (!a) return 'référence introuvable'
  return a.estimated ? `≈ ${a.kg} kg (estimé)` : `= ${a.kg} kg`
}

export function PowerHeader() {
  return (
    <div className={`${POWER_GRID} pb-1 text-xs text-slate-500`}>
      <span /><span>Exercice</span><span>Séries</span><span>Reps / contacts</span><span>Charge</span>
      <span>Vitesse (m/s)</span><span>Perte vit. (%)</span><span>Hauteur (cm)</span><span>Récup (s)</span><span>RPE</span><span />
    </div>
  )
}

export function PowerCells({ f, set, percentAvailable, abs, disabled, blurOnEnter }: {
  f: PowerFields
  set: (patch: Partial<PowerFields>) => void
  percentAvailable: boolean
  abs: string
  disabled: boolean
  blurOnEnter: boolean
}) {
  const enter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (blurOnEnter && e.key === 'Enter') e.currentTarget.blur()
  }
  const showValue = f.loadMode === 'kg' || f.loadMode === 'percent'
  return (
    <>
      <input aria-label="Séries" inputMode="numeric" className={CELL} disabled={disabled}
        value={f.sets} onChange={(e) => set({ sets: e.target.value })} onKeyDown={enter} />
      <div className="flex gap-1">
        <input aria-label="Répétitions ou contacts" inputMode="numeric" className={CELL} disabled={disabled}
          value={f.reps} onChange={(e) => set({ reps: e.target.value })} onKeyDown={enter} />
        <select aria-label="Unité" className="w-20 rounded border px-1 py-1 text-sm" disabled={disabled}
          value={f.unit} onChange={(e) => set({ unit: e.target.value as PowerUnit })}>
          <option value="reps">reps</option>
          <option value="contacts">contacts</option>
        </select>
      </div>
      <div>
        <div className="flex gap-1">
          <select aria-label="Type de charge" className={`${CELL} ${showValue ? 'w-24' : ''}`} disabled={disabled}
            value={f.loadMode} onChange={(e) => set({ loadMode: e.target.value as PowerLoadMode, loadValue: '' })}>
            <option value="none">Aucune</option>
            <option value="percent" disabled={!percentAvailable}>% 1RM</option>
            <option value="kg">kg</option>
            <option value="bodyweight">PC</option>
          </select>
          {showValue && (
            <input aria-label="Charge" inputMode="decimal" className={CELL} disabled={disabled}
              value={f.loadValue} onChange={(e) => set({ loadValue: e.target.value })} onKeyDown={enter} />
          )}
        </div>
        {abs && <p className="mt-0.5 text-xs text-slate-500">{abs}</p>}
      </div>
      <input aria-label="Vitesse cible" placeholder="0,8" inputMode="decimal" className={CELL} disabled={disabled}
        value={f.velocity} onChange={(e) => set({ velocity: e.target.value })} onKeyDown={enter} />
      <input aria-label="Perte de vitesse max" placeholder="20" inputMode="decimal" className={CELL} disabled={disabled}
        value={f.velocityLoss} onChange={(e) => set({ velocityLoss: e.target.value })} onKeyDown={enter} />
      <input aria-label="Hauteur" placeholder="60" inputMode="decimal" className={CELL} disabled={disabled}
        value={f.height} onChange={(e) => set({ height: e.target.value })} onKeyDown={enter} />
      <input aria-label="Récupération" className={CELL} disabled={disabled}
        value={f.rest} onChange={(e) => set({ rest: e.target.value })} onKeyDown={enter} />
      <input aria-label="RPE" inputMode="decimal" className={CELL} disabled={disabled}
        value={f.rpe} onChange={(e) => set({ rpe: e.target.value })} onKeyDown={enter} />
    </>
  )
}

export function PowerLine({ code, ex, name, refs, refValues, canEdit }: {
  code: string; ex: ExerciseData; name: string; refs: Reference[]; refValues: ReferenceValue[]; canEdit: boolean
}) {
  const p = powerOf(ex.prescription)
  if (!p) return null
  const l = p.load
  const stored = l && l.type === 'percent_reference' ? l.referenceId : null
  const oneRm = ex.exercise_id ? latestOneRm(refs, ex.exercise_id) : undefined
  const refId = stored ?? oneRm?.id ?? null
  return (
    <EditableRow<PowerFields> mode="puissance"
      code={code} ex={ex} grid={POWER_GRID} canEdit={canEdit}
      initial={powerToFields(p)}
      build={(f) => powerFromFields(f, refId, p)}
      lead={<span className="pt-1 font-medium">{name} {ex.exercise_id && <ExerciseInfoButton exerciseId={ex.exercise_id} />}</span>}
      render={(f, set) => (
        <PowerCells
          f={f} set={set} percentAvailable={!!refId} abs={powerAbs(f, refId, refValues)}
          disabled={!canEdit} blurOnEnter
        />
      )}
    />
  )
}