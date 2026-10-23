import type { KeyboardEvent } from 'react'
import type { ExerciseData } from '../athletes/builder'
import {
  QUANTITY_LABEL, conditioningFromFields, conditioningOf, conditioningToFields,
  type ConditioningFields, type QuantityKind,
} from '../domain/conditioning'
import { EditableRow } from './EditableRow'
import { CELL } from './ExerciseFields'
import ExerciseInfoButton from './ExerciseInfoButton'

export const COND_GRID = 'grid grid-cols-[6rem_minmax(12rem,1fr)_8rem_6rem_6rem_5rem_6rem] items-start gap-2'

const PLACEHOLDER: Record<QuantityKind, string> = { reps: '15', meters: '500', calories: '12', seconds: '40 ou 1:00' }

export function ConditioningHeader() {
  return (
    <div className={`${COND_GRID} pb-1 text-xs text-slate-500`}>
      <span /><span>Exercice</span><span>Unité</span><span>Quantité</span><span>Charge (kg)</span><span>RPE</span><span />
    </div>
  )
}

export function ConditioningCells({ f, set, disabled, blurOnEnter }: {
  f: ConditioningFields
  set: (patch: Partial<ConditioningFields>) => void
  disabled: boolean
  blurOnEnter: boolean
}) {
  const enter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (blurOnEnter && e.key === 'Enter') e.currentTarget.blur()
  }
  return (
    <>
      <select aria-label="Unité de la quantité" className={CELL} disabled={disabled} value={f.kind}
        onChange={(e) => set({ kind: e.target.value as QuantityKind })}>
        {(Object.keys(QUANTITY_LABEL) as QuantityKind[]).map((k) => (
          <option key={k} value={k}>{QUANTITY_LABEL[k]}</option>
        ))}
      </select>
      <input aria-label="Quantité" inputMode={f.kind === 'seconds' ? 'text' : 'numeric'}
        placeholder={PLACEHOLDER[f.kind]} className={CELL} disabled={disabled}
        value={f.quantity} onChange={(e) => set({ quantity: e.target.value })} onKeyDown={enter} />
      <input aria-label="Charge en kilogrammes" inputMode="decimal" placeholder="20" className={CELL}
        disabled={disabled} value={f.load} onChange={(e) => set({ load: e.target.value })} onKeyDown={enter} />
      <input aria-label="RPE" inputMode="decimal" className={CELL} disabled={disabled}
        value={f.rpe} onChange={(e) => set({ rpe: e.target.value })} onKeyDown={enter} />
    </>
  )
}

export function ConditioningLine({ code, ex, name, canEdit }: {
  code: string; ex: ExerciseData; name: string; canEdit: boolean
}) {
  const p = conditioningOf(ex.prescription)
  if (!p) return null
  return (
    <EditableRow<ConditioningFields> mode="conditioning"
      code={code} ex={ex} grid={COND_GRID} canEdit={canEdit}
      initial={conditioningToFields(p)}
      build={(f) => conditioningFromFields(f, p)}
      lead={
        <span className="pt-1 font-medium">
          {name} {ex.exercise_id && <ExerciseInfoButton exerciseId={ex.exercise_id} />}
        </span>
      }
      render={(f, set) => <ConditioningCells f={f} set={set} disabled={!canEdit} blurOnEnter />}
    />
  )
}
