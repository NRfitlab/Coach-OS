import { CodeCell } from './ModeBadge'
import { useState, type FocusEvent, type KeyboardEvent } from 'react'
import { useDeleteExercise, useUpdateExercise, type ExerciseData } from '../athletes/builder'
import { absoluteLoadKg, type ReferenceValue } from '../domain/prescription'
import {
  forceOfPrescription, fromFields, latestOneRm, toFields, type ForceFields, type LoadMode,
} from '../domain/prescriptionFields'
import type { Reference } from '../domain/reference'
import { errMsg } from '../lib/errors'

export const GRID =
  'grid grid-cols-[6rem_minmax(9rem,1fr)_4rem_5rem_14rem_4rem_5rem_5rem_8rem_6rem] items-start gap-2'
export const CELL = 'w-full rounded border px-2 py-1 text-sm'

const INTENTION_LABEL: Record<string, string> = {
  max_strength: 'Force max',
  strength: 'Force',
  hypertrophy: 'Hypertrophie',
  power: 'Puissance',
  speed: 'Vitesse',
  aerobic: 'Aérobie',
  anaerobic: 'Anaérobie',
  technique: 'Technique',
  mobility: 'Mobilité',
  recovery: 'Récupération',
}
const FORCE_INTENTIONS = ['max_strength', 'strength', 'hypertrophy', 'power', 'technique']

export function absText(f: ForceFields, refId: string | null, refs: ReferenceValue[]): string {
  if (f.loadMode !== 'percent' || !refId) return ''
  const v = Number(f.loadValue.replace(',', '.'))
  if (!Number.isFinite(v) || v <= 0) return ''
  const a = absoluteLoadKg({ type: 'percent_reference', value: v, referenceId: refId }, refs)
  if (!a) return 'référence introuvable'
  return a.estimated ? `≈ ${a.kg} kg (estimé)` : `= ${a.kg} kg`
}

export function FieldsHeader() {
  return (
    <div className={`${GRID} pb-1 text-xs text-slate-500`}>
      <span /><span>Exercice</span><span>Séries</span><span>Reps</span><span>Charge</span><span>RPE</span>
      <span>Tempo</span><span>Récup (s)</span><span>Intention</span><span />
    </div>
  )
}

export function FieldCells({ f, set, percentAvailable, abs, disabled, blurOnEnter }: {
  f: ForceFields
  set: (patch: Partial<ForceFields>) => void
  percentAvailable: boolean
  abs: string
  disabled: boolean
  blurOnEnter: boolean
}) {
  const enter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (blurOnEnter && e.key === 'Enter') e.currentTarget.blur()
  }
  const showValue = f.loadMode === 'percent' || f.loadMode === 'kg'
  const extraIntention = f.intention && !FORCE_INTENTIONS.includes(f.intention) ? f.intention : null
  return (
    <>
      <input aria-label="Séries" inputMode="numeric" className={CELL} disabled={disabled}
        value={f.sets} onChange={(e) => set({ sets: e.target.value })} onKeyDown={enter} />
      <input aria-label="Répétitions" className={CELL} disabled={disabled}
        value={f.reps} onChange={(e) => set({ reps: e.target.value })} onKeyDown={enter} />
      <div>
        <div className="flex gap-1">
          <select aria-label="Type de charge" className={`${CELL} ${showValue ? 'w-24' : ''}`} disabled={disabled}
            value={f.loadMode} onChange={(e) => set({ loadMode: e.target.value as LoadMode, loadValue: '' })}>
            <option value="percent" disabled={!percentAvailable}>% 1RM</option>
            <option value="kg">kg</option>
            <option value="bodyweight">PC</option>
            <option value="rpe_only">RPE seul</option>
          </select>
          {showValue && (
            <input aria-label="Charge" inputMode="decimal" className={CELL} disabled={disabled}
              value={f.loadValue} onChange={(e) => set({ loadValue: e.target.value })} onKeyDown={enter} />
          )}
        </div>
        {abs && <p className="mt-0.5 text-xs text-slate-500">{abs}</p>}
      </div>
      <input aria-label="RPE" inputMode="decimal" className={CELL} disabled={disabled}
        value={f.rpe} onChange={(e) => set({ rpe: e.target.value })} onKeyDown={enter} />
      <input aria-label="Tempo" placeholder="3-1-X-1" className={CELL} disabled={disabled}
        value={f.tempo} onChange={(e) => set({ tempo: e.target.value })} onKeyDown={enter} />
      <input aria-label="Récupération" className={CELL} disabled={disabled}
        value={f.rest} onChange={(e) => set({ rest: e.target.value })} onKeyDown={enter} />
      <select aria-label="Intention" className={CELL} disabled={disabled}
        value={f.intention} onChange={(e) => set({ intention: e.target.value })}>
        <option value="">—</option>
        {FORCE_INTENTIONS.map((k) => <option key={k} value={k}>{INTENTION_LABEL[k]}</option>)}
        {extraIntention && <option value={extraIntention}>{INTENTION_LABEL[extraIntention] ?? extraIntention}</option>}
      </select>
    </>
  )
}

export function FieldsLine({ code, ex, name, refs, refValues, canEdit }: {
  code: string; ex: ExerciseData; name: string; refs: Reference[]; refValues: ReferenceValue[]; canEdit: boolean
}) {
  const upd = useUpdateExercise()
  const del = useDeleteExercise()
  const p = forceOfPrescription(ex.prescription)
  const oneRm = ex.exercise_id ? latestOneRm(refs, ex.exercise_id) : undefined
  const stored = p?.load.type === 'percent_reference' ? p.load.referenceId : null
  const refId = stored ?? oneRm?.id ?? null
  const [initial] = useState<ForceFields | null>(() => (p ? toFields(p) : null))
  const [f, setF] = useState<ForceFields | null>(initial)
  const [err, setErr] = useState<string | null>(null)
  const dirty = !!f && JSON.stringify(f) !== JSON.stringify(initial)

  const save = async () => {
    if (!p || !f || !dirty || upd.isPending) return
    const res = fromFields(f, refId, p)
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

  if (!p || !f) {
    const mode = String((ex.prescription as { mode?: unknown } | null)?.mode ?? 'inconnu')
    return (
      <li className="flex gap-3 border-t py-1 text-sm">
        <span className="w-8 font-mono text-slate-500">{code}</span>
        <span className="font-medium">{name}</span>
        <span className="text-slate-500">Mode « {mode} » (non modifiable ici)</span>
        {canEdit && <button className="ml-auto text-red-600" onClick={() => del.mutate(ex.id)}>Supprimer</button>}
      </li>
    )
  }

  return (
    <li className="border-t py-1 text-sm" onBlur={onBlur}>
      <div className={GRID}>
        <CodeCell code={code} mode="force" />
        <span className="pt-1 font-medium">{name}</span>
        <FieldCells
          f={f} set={(patch) => setF({ ...f, ...patch })} percentAvailable={!!refId}
          abs={absText(f, refId, refValues)} disabled={!canEdit} blurOnEnter
        />
        {canEdit ? (
          <button type="button" className="pt-1 text-left text-red-600" onClick={() => del.mutate(ex.id)}>Supprimer</button>
        ) : <span />}
      </div>
      {(err || del.isError) && <p role="alert" className="mt-1 text-red-600">{err ?? errMsg(del.error)}</p>}
      {dirty && !err && <p className="mt-1 text-xs text-slate-400">Modifié : enregistré en quittant la ligne.</p>}
    </li>
  )
}