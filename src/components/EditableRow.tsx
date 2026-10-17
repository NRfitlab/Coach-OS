import { useState, type FocusEvent, type ReactNode } from 'react'
import { useDeleteExercise, useUpdateExercise, type ExerciseData } from '../athletes/builder'
import type { LineMode } from '../domain/modes'
import type { Prescription } from '../domain/prescription'
import { errMsg } from '../lib/errors'
import { CodeCell } from './ModeBadge'

/** Ligne éditable générique : enregistrement quand le focus quitte la ligne, si elle est valide et modifiée. */
export function EditableRow<F extends object>({ code, mode, ex, grid, canEdit, initial, build, lead, render }: {
  code: string
  mode: LineMode
  ex: ExerciseData
  grid: string
  canEdit: boolean
  initial: F
  build: (f: F) => { ok: true; value: Prescription } | { ok: false; error: string }
  lead: ReactNode
  render: (f: F, set: (patch: Partial<F>) => void) => ReactNode
}) {
  const upd = useUpdateExercise()
  const del = useDeleteExercise()
  const [start] = useState<F>(initial)
  const [f, setF] = useState<F>(initial)
  const [err, setErr] = useState<string | null>(null)
  const dirty = JSON.stringify(f) !== JSON.stringify(start)

  const save = async () => {
    if (!dirty || upd.isPending) return
    const res = build(f)
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

  return (
    <li className="border-t py-1 text-sm" onBlur={onBlur}>
      <div className={grid}>
        <CodeCell code={code} mode={mode} />
        {lead}
        {render(f, (patch) => setF({ ...f, ...patch }))}
        {canEdit ? (
          <button type="button" className="pt-1 text-left text-red-600" onClick={() => del.mutate(ex.id)}>Supprimer</button>
        ) : <span />}
      </div>
      {(err || del.isError) && <p role="alert" className="mt-1 text-red-600">{err ?? errMsg(del.error)}</p>}
      {dirty && !err && <p className="mt-1 text-xs text-slate-400">Modifié : enregistré en quittant la ligne.</p>}
    </li>
  )
}