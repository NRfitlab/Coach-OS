import { useState, type FocusEvent, type KeyboardEvent } from 'react'
import { useUpdateBlockParams } from '../athletes/builder'
import type { BlockKind } from '../domain/block'
import {
  mergeParams, paramKeysFor, paramLabel, paramsFromFields, paramsToFields, type ParamFields,
} from '../domain/blockParams'
import { errMsg } from '../lib/errors'

export function BlockParams({ blockId, kind, params, canEdit }: {
  blockId: string; kind: BlockKind; params: unknown; canEdit: boolean
}) {
  const upd = useUpdateBlockParams()
  const keys = paramKeysFor(kind)
  const [start] = useState<ParamFields>(() => paramsToFields(kind, params))
  const [f, setF] = useState<ParamFields>(start)
  const [err, setErr] = useState<string | null>(null)
  const dirty = JSON.stringify(f) !== JSON.stringify(start)

  const save = () => {
    if (!dirty || upd.isPending) return
    const res = paramsFromFields(kind, f)
    if (!res.ok) { setErr(res.error); return }
    setErr(null)
    upd.mutate({ id: blockId, params: mergeParams(params, res.values) })
  }
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) return
    save()
  }
  const enter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.currentTarget.blur()
  }

  return (
    <div className="mb-2 flex flex-wrap items-end gap-3 text-xs text-slate-500" onBlur={onBlur}>
      {keys.map((k) => (
        <label key={k} className="flex flex-col gap-0.5">
          {paramLabel(kind, k)}
          <input
            aria-label={paramLabel(kind, k)} inputMode="decimal" disabled={!canEdit}
            className="w-24 rounded border px-2 py-1 text-sm text-slate-900"
            value={f[k] ?? ''} onChange={(e) => setF({ ...f, [k]: e.target.value })} onKeyDown={enter}
          />
        </label>
      ))}
      {kind === 'fortime' && <span>Le time cap borne la durée (estimé).</span>}
      {err && <span role="alert" className="text-red-600">{err}</span>}
      {upd.isError && <span role="alert" className="text-red-600">{errMsg(upd.error)}</span>}
      {dirty && !err && <span className="text-slate-400">Enregistré en quittant le champ.</span>}
    </div>
  )
}
