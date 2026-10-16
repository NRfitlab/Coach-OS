import { useUpdateBlockParams } from '../athletes/builder'
import { BLOCK_CONTEXTS, CONTEXT_LABEL, contextOf } from '../domain/blockContext'
import { errMsg } from '../lib/errors'

export function BlockContext({ blockId, params, canEdit }: { blockId: string; params: unknown; canEdit: boolean }) {
  const upd = useUpdateBlockParams()
  const value = contextOf(params)
  const change = (v: string) => {
    const next: Record<string, unknown> =
      params && typeof params === 'object' && !Array.isArray(params) ? { ...(params as Record<string, unknown>) } : {}
    delete next.context
    if (v) next.context = v
    upd.mutate({ id: blockId, params: next })
  }
  return (
    <label className="flex items-center gap-1 text-xs text-slate-500">
      Contexte
      <select
        aria-label="Contexte du bloc" className="rounded border px-1 py-0.5 text-xs"
        disabled={!canEdit || upd.isPending} value={value} onChange={(e) => change(e.target.value)}
      >
        <option value="">—</option>
        {BLOCK_CONTEXTS.map((c) => <option key={c} value={c}>{CONTEXT_LABEL[c]}</option>)}
      </select>
      {upd.isError && <span role="alert" className="text-red-600">{errMsg(upd.error)}</span>}
    </label>
  )
}