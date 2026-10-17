import type { KeyboardEvent } from 'react'
import type { ExerciseData } from '../athletes/builder'
import {
  MODALITY_LABEL, recoveryFromFields, recoveryOf, recoveryToFields, type Modality, type RecoveryFields,
} from '../domain/recovery'
import { EditableRow } from './EditableRow'
import { CELL } from './ExerciseFields'

export const REC_GRID = 'grid grid-cols-[6rem_minmax(10rem,1fr)_4rem_7rem_5rem_6rem_6rem] items-start gap-2'

export function RecoveryHeader() {
  return (
    <div className={`${REC_GRID} pb-1 text-xs text-slate-500`}>
      <span /><span>Modalité</span><span>Tours</span><span>Durée par tour (min)</span><span>RPE max</span><span>Temp. (°C)</span><span />
    </div>
  )
}

export function RecoveryCells({ f, set, disabled, blurOnEnter }: {
  f: RecoveryFields
  set: (patch: Partial<RecoveryFields>) => void
  disabled: boolean
  blurOnEnter: boolean
}) {
  const enter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (blurOnEnter && e.key === 'Enter') e.currentTarget.blur()
  }
  return (
    <>
      <select aria-label="Modalité" className={CELL} disabled={disabled}
        value={f.modality} onChange={(e) => set({ modality: e.target.value as Modality })}>
        {(Object.keys(MODALITY_LABEL) as Modality[]).map((m) => <option key={m} value={m}>{MODALITY_LABEL[m]}</option>)}
      </select>
      <input aria-label="Tours" inputMode="numeric" className={CELL} disabled={disabled}
        value={f.rounds} onChange={(e) => set({ rounds: e.target.value })} onKeyDown={enter} />
      <input aria-label="Durée par tour" placeholder="10" inputMode="decimal" className={CELL} disabled={disabled}
        value={f.minutes} onChange={(e) => set({ minutes: e.target.value })} onKeyDown={enter} />
      <input aria-label="RPE max" inputMode="decimal" className={CELL} disabled={disabled}
        value={f.maxRpe} onChange={(e) => set({ maxRpe: e.target.value })} onKeyDown={enter} />
      <input aria-label="Température" inputMode="decimal" className={CELL} disabled={disabled}
        value={f.temperature} onChange={(e) => set({ temperature: e.target.value })} onKeyDown={enter} />
    </>
  )
}

export function RecoveryLine({ code, ex, canEdit }: { code: string; ex: ExerciseData; canEdit: boolean }) {
  const p = recoveryOf(ex.prescription)
  if (!p) return null
  return (
    <EditableRow<RecoveryFields> mode="recuperation"
      code={code} ex={ex} grid={REC_GRID} canEdit={canEdit}
      initial={recoveryToFields(p)}
      build={(f) => recoveryFromFields(f, p)}
      lead={null}
      render={(f, set) => <RecoveryCells f={f} set={set} disabled={!canEdit} blurOnEnter />}
    />
  )
}