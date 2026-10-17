import type { KeyboardEvent } from 'react'
import type { ExerciseData } from '../athletes/builder'
import { libreFromFields, libreOf, libreToFields, type LibreFields } from '../domain/libre'
import { EditableRow } from './EditableRow'
import { CELL } from './ExerciseFields'

export const LIBRE_GRID = 'grid grid-cols-[6rem_minmax(16rem,1fr)_6rem_5rem_6rem] items-start gap-2'

export function LibreHeader() {
  return (
    <div className={`${LIBRE_GRID} pb-1 text-xs text-slate-500`}>
      <span /><span>Consigne</span><span>Durée (min)</span><span>RPE cible</span><span />
    </div>
  )
}

export function LibreCells({ f, set, disabled, blurOnEnter }: {
  f: LibreFields
  set: (patch: Partial<LibreFields>) => void
  disabled: boolean
  blurOnEnter: boolean
}) {
  const enter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (blurOnEnter && e.key === 'Enter') e.currentTarget.blur()
  }
  return (
    <>
      <input aria-label="Consigne" placeholder="Consigne libre" maxLength={500} className={CELL} disabled={disabled}
        value={f.instruction} onChange={(e) => set({ instruction: e.target.value })} onKeyDown={enter} />
      <input aria-label="Durée en minutes" inputMode="decimal" placeholder="20" className={CELL} disabled={disabled}
        value={f.minutes} onChange={(e) => set({ minutes: e.target.value })} onKeyDown={enter} />
      <input aria-label="RPE cible" inputMode="decimal" className={CELL} disabled={disabled}
        value={f.rpe} onChange={(e) => set({ rpe: e.target.value })} onKeyDown={enter} />
    </>
  )
}

export function LibreLine({ code, ex, canEdit }: { code: string; ex: ExerciseData; canEdit: boolean }) {
  const p = libreOf(ex.prescription)
  if (!p) return null
  return (
    <EditableRow<LibreFields> mode="libre"
      code={code} ex={ex} grid={LIBRE_GRID} canEdit={canEdit}
      initial={libreToFields(p)}
      build={(f) => libreFromFields(f, p)}
      lead={null}
      render={(f, set) => <LibreCells f={f} set={set} disabled={!canEdit} blurOnEnter />}
    />
  )
}