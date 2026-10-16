import { useState, type FocusEvent, type KeyboardEvent } from 'react'
import { useDeleteExercise, useUpdateExercise, type ExerciseData } from '../athletes/builder'
import {
  mobilityFromFields, mobilityOf, mobilityToFields, SIDE_LABEL, type MobilityFields, type Side,
} from '../domain/mobility'
import { errMsg } from '../lib/errors'
import { CELL } from './ExerciseFields'

export const MOB_GRID = 'grid grid-cols-[2rem_minmax(9rem,1fr)_6rem_4rem_6rem_9rem_6rem] items-start gap-2'

export function MobilityHeader() {
  return (
    <div className={`${MOB_GRID} pb-1 text-xs text-slate-500`}>
      <span /><span>Exercice</span><span>Durée (s)</span><span>Reps</span><span>Respirations</span><span>Côté</span><span />
    </div>
  )
}

export function MobilityCells({ f, set, disabled, blurOnEnter }: {
  f: MobilityFields
  set: (patch: Partial<MobilityFields>) => void
  disabled: boolean
  blurOnEnter: boolean
}) {
  const enter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (blurOnEnter && e.key === 'Enter') e.currentTarget.blur()
  }
  return (
    <>
      <input aria-label="Durée" placeholder="30" className={CELL} disabled={disabled}
        value={f.duration} onChange={(e) => set({ duration: e.target.value })} onKeyDown={enter} />
      <input aria-label="Reps" inputMode="numeric" className={CELL} disabled={disabled}
        value={f.reps} onChange={(e) => set({ reps: e.target.value })} onKeyDown={enter} />
      <input aria-label="Respirations" inputMode="numeric" className={CELL} disabled={disabled}
        value={f.breaths} onChange={(e) => set({ breaths: e.target.value })} onKeyDown={enter} />
      <select aria-label="Côté" className={CELL} disabled={disabled}
        value={f.side} onChange={(e) => set({ side: e.target.value as Side })}>
        {(Object.keys(SIDE_LABEL) as Side[]).map((s) => <option key={s} value={s}>{SIDE_LABEL[s]}</option>)}
      </select>
    </>
  )
}

export function MobilityLine({ code, ex, name, canEdit }: {
  code: string; ex: ExerciseData; name: string; canEdit: boolean
}) {
  const upd = useUpdateExercise()
  const del = useDeleteExercise()
  const p = mobilityOf(ex.prescription)
  const [initial] = useState<MobilityFields | null>(() => (p ? mobilityToFields(p) : null))
  const [f, setF] = useState<MobilityFields | null>(initial)
  const [err, setErr] = useState<string | null>(null)
  const dirty = !!f && JSON.stringify(f) !== JSON.stringify(initial)

  const save = async () => {
    if (!p || !f || !dirty || upd.isPending) return
    const res = mobilityFromFields(f, p)
    if (!res.ok) { setErr(res.error); return }
    setErr(null)
    try {
      await upd.mutateAsync({ id: ex.id, prescription: res.value })
    } catch (x) {
      setErr(errMsg(x))
    }
  }
  const onBlur = (e: FocusEvent<HTMLLIElement>) => {
    if (e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) return
    void save()
  }

  if (!p || !f) return null

  return (
    <li className="border-t py-1 text-sm" onBlur={onBlur}>
      <div className={MOB_GRID}>
        <span className="pt-1 font-mono text-slate-500">{code}</span>
        <span className="pt-1 font-medium">{name}</span>
        <MobilityCells f={f} set={(patch) => setF({ ...f, ...patch })} disabled={!canEdit} blurOnEnter />
        {canEdit ? (
          <button type="button" className="pt-1 text-left text-red-600" onClick={() => del.mutate(ex.id)}>Supprimer</button>
        ) : <span />}
      </div>
      {(err || del.isError) && <p role="alert" className="mt-1 text-red-600">{err ?? errMsg(del.error)}</p>}
      {dirty && !err && <p className="mt-1 text-xs text-slate-400">Modifié : enregistré en quittant la ligne.</p>}
    </li>
  )
}