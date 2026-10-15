import { useMemo, useRef, useState, type FocusEvent, type FormEvent, type KeyboardEvent } from 'react'
import { useAddExercise, useDeleteExercise, useUpdateExercise, type ExerciseData } from '../athletes/builder'
import type { ExerciseOption } from '../athletes/references'
import { absoluteLoadKg, type ReferenceValue } from '../domain/prescription'
import {
  defaultFields, forceOfPrescription, fromFields, latestOneRm, toFields, type ForceFields, type LoadMode,
} from '../domain/prescriptionFields'
import type { Reference } from '../domain/reference'
import { errMsg } from '../lib/errors'

export const GRID = 'grid grid-cols-[2rem_minmax(9rem,1fr)_4rem_5rem_16rem_4rem_5rem_6rem] items-start gap-2'
export const CELL = 'w-full rounded border px-2 py-1 text-sm'
const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

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
      <span /><span>Exercice</span><span>Séries</span><span>Reps</span><span>Charge</span><span>RPE</span><span>Récup (s)</span><span />
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
      <input aria-label="Récupération" className={CELL} disabled={disabled}
        value={f.rest} onChange={(e) => set({ rest: e.target.value })} onKeyDown={enter} />
    </>
  )
}

export function FieldsLine({ code, ex, name, refs, refValues, canEdit }: {
  code: string; ex: ExerciseData; name: string; refs: Reference[]; refValues: ReferenceValue[]; canEdit: boolean
}) {
  const upd = useUpdateExercise()
  const del = useDeleteExercise()
  const p = forceOfPrescription(ex.prescription)
  const oneRm = latestOneRm(refs, ex.exercise_id)
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
        <span className="pt-1 font-mono text-slate-500">{code}</span>
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

export function FieldsAdd({ blockId, organizationId, nextPosition, exercises, refs, refValues }: {
  blockId: string; organizationId: string; nextPosition: number
  exercises: ExerciseOption[]; refs: Reference[]; refValues: ReferenceValue[]
}) {
  const add = useAddExercise()
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<ExerciseOption | null>(null)
  const [f, setF] = useState<ForceFields>(defaultFields(false))
  const [err, setErr] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const oneRm = picked ? latestOneRm(refs, picked.id) : undefined
  const focus = (label: string) =>
    formRef.current?.querySelector<HTMLInputElement>(`input[aria-label="${label}"]`)?.focus()

  const matches = useMemo(() => {
    const n = normalize(q.trim())
    if (!n || picked) return []
    return exercises.filter((e) => normalize(e.name).includes(n)).slice(0, 6)
  }, [q, picked, exercises])

  const pick = (e: ExerciseOption) => {
    setPicked(e)
    setQ(e.name)
    setF((s) => ({ ...s, loadMode: latestOneRm(refs, e.id) ? 'percent' : 'kg', loadValue: '' }))
    focus('Séries')
  }
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (!picked) return setErr('Choisissez un exercice dans la liste.')
    const res = fromFields(f, oneRm?.id ?? null)
    if (!res.ok) return setErr(res.error)
    try {
      await add.mutateAsync({
        blockId, organizationId, exerciseId: picked.id, position: nextPosition, prescription: res.value,
      })
      setQ(''); setPicked(null); setF(defaultFields(false))
      focus('Exercice')
    } catch (x) {
      setErr(errMsg(x))
    }
  }

  return (
    <div className="mt-2">
      <form ref={formRef} onSubmit={submit} className={GRID}>
        <span />
        <input
          aria-label="Exercice" placeholder="Exercice (recherche)" className={CELL} value={q}
          onChange={(e) => { setQ(e.target.value); setPicked(null) }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !picked && matches[0]) { e.preventDefault(); pick(matches[0]) }
          }}
        />
        <FieldCells
          f={f} set={(patch) => setF({ ...f, ...patch })} percentAvailable={!!oneRm}
          abs={absText(f, oneRm?.id ?? null, refValues)} disabled={false} blurOnEnter={false}
        />
        <button disabled={add.isPending} className="rounded bg-slate-900 px-3 py-1 text-white disabled:opacity-50">
          Ajouter
        </button>
      </form>
      {matches.length > 0 && (
        <ul className="mt-1 w-64 rounded border bg-white text-sm">
          {matches.map((m) => (
            <li key={m.id}>
              <button type="button" className="block w-full px-2 py-1 text-left hover:bg-slate-100" onClick={() => pick(m)}>
                {m.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {err && <p role="alert" className="mt-1 text-sm text-red-600">{err}</p>}
    </div>
  )
}