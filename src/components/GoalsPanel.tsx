import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useDeleteGoal, useGoals, useSaveGoal } from '../athletes/goals'
import {
  GOAL_STATUSES, GOAL_STATUS_LABEL, GoalInputSchema, PRIORITIES, PRIORITY_LABEL,
  type Goal, type GoalInput,
} from '../domain/goal'
import { errMsg } from '../lib/errors'
import { formatDate } from '../lib/utils'

const INPUT = 'w-full rounded border px-3 py-2 text-sm'
const fmt = (n: number | null) => (n === null ? '—' : String(n).replace('.', ','))
const num = (s: string): number | null => {
  const t = s.trim().replace(',', '.')
  return t === '' ? null : Number(t)
}

function GoalForm({
  initial, primaryOther, onSubmit, onCancel,
}: {
  initial?: Goal
  primaryOther?: Goal
  onSubmit: (input: GoalInput, demoteId?: string) => Promise<void>
  onCancel: () => void
}) {
  const [f, setF] = useState({
    title: initial?.title ?? '',
    priority: initial?.priority ?? 'secondary',
    status: initial?.status ?? 'active',
    target_date: initial?.target_date ?? '',
    metric: initial?.metric ?? '',
    current_value: initial?.current_value?.toString() ?? '',
    target_value: initial?.target_value?.toString() ?? '',
    unit: initial?.unit ?? '',
  })
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof f) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }))

  const willDemote = f.priority === 'primary' && f.status === 'active' ? primaryOther : undefined

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    const cur = num(f.current_value)
    const tgt = num(f.target_value)
    if (Number.isNaN(cur) || Number.isNaN(tgt)) return setErr('Valeur numérique invalide.')
    const parsed = GoalInputSchema.safeParse({
      title: f.title,
      priority: f.priority,
      status: f.status,
      target_date: f.target_date || null,
      metric: f.metric.trim() || null,
      current_value: cur,
      target_value: tgt,
      unit: f.unit.trim() || null,
    })
    if (!parsed.success) return setErr(parsed.error.issues[0].message)
    setBusy(true)
    try {
      await onSubmit(parsed.data, willDemote?.id)
    } catch (x) {
      setErr(errMsg(x))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border bg-white p-6">
      <label className="block text-sm">Titre
        <input className={INPUT} value={f.title} onChange={set('title')} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">Priorité
          <select className={INPUT} value={f.priority} onChange={set('priority')}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>)}
          </select>
        </label>
        <label className="block text-sm">Statut
          <select className={INPUT} value={f.status} onChange={set('status')}>
            {GOAL_STATUSES.map((s) => <option key={s} value={s}>{GOAL_STATUS_LABEL[s]}</option>)}
          </select>
        </label>
      </div>
      {willDemote && (
        <p className="text-sm text-amber-700">
          L'objectif principal actuel « {willDemote.title} » passera en secondaire.
        </p>
      )}
      <label className="block text-sm">Date cible
        <input type="date" className={INPUT} value={f.target_date} onChange={set('target_date')} />
      </label>
      <div className="grid grid-cols-4 gap-3">
        <label className="col-span-2 block text-sm">Métrique
          <input className={INPUT} value={f.metric} onChange={set('metric')} placeholder="ex. 5 km" />
        </label>
        <label className="block text-sm">Actuel
          <input className={INPUT} value={f.current_value} onChange={set('current_value')} inputMode="decimal" />
        </label>
        <label className="block text-sm">Cible
          <input className={INPUT} value={f.target_value} onChange={set('target_value')} inputMode="decimal" />
        </label>
      </div>
      <label className="block text-sm">Unité
        <input className={INPUT} value={f.unit} onChange={set('unit')} placeholder="ex. s, kg" />
      </label>
      {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
      <div className="flex gap-3">
        <button disabled={busy} className="rounded bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50">
          Enregistrer
        </button>
        <button type="button" onClick={onCancel} className="rounded border px-4 py-2 text-sm">Annuler</button>
      </div>
    </form>
  )
}

export default function GoalsPanel({
  athleteId, organizationId, canManage,
}: { athleteId: string; organizationId: string; canManage: boolean }) {
  const goals = useGoals(athleteId)
  const save = useSaveGoal()
  const del = useDeleteGoal()
  const [editing, setEditing] = useState<Goal | 'new' | null>(null)
  const [delErr, setDelErr] = useState<string | null>(null)

  if (goals.isPending) return <p className="text-slate-500">Chargement…</p>
  if (goals.isError) return <p role="alert" className="text-red-600">Erreur : {goals.error.message}</p>

  if (editing) {
    const editedId = editing === 'new' ? undefined : editing.id
    const primaryOther = goals.data.find(
      (g) => g.priority === 'primary' && g.status === 'active' && g.id !== editedId,
    )
    return (
      <GoalForm
        initial={editing === 'new' ? undefined : editing}
        primaryOther={primaryOther}
        onCancel={() => setEditing(null)}
        onSubmit={async (input, demoteId) => {
          await save.mutateAsync({ id: editedId, athleteId, organizationId, input, demoteId })
          setEditing(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-3">
      {goals.data.length === 0 && <p className="text-sm text-slate-500">Aucun objectif.</p>}
      {goals.data.map((g) => (
        <div key={g.id} className="rounded-lg border bg-white p-4 text-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="mr-2 rounded bg-slate-100 px-2 py-0.5 text-xs">{PRIORITY_LABEL[g.priority]}</span>
              <span className={g.status === 'active' ? 'font-semibold' : 'font-semibold text-slate-500'}>
                {g.title}
              </span>
              <span className="ml-2 text-slate-500">{GOAL_STATUS_LABEL[g.status]}</span>
            </div>
            {canManage && (
              <div className="flex gap-3 whitespace-nowrap">
                <button onClick={() => setEditing(g)} className="underline">Modifier</button>
                <button
                  className="text-red-600 underline"
                  onClick={async () => {
                    if (!window.confirm(`Supprimer l'objectif « ${g.title} » ?`)) return
                    setDelErr(null)
                    try { await del.mutateAsync(g.id) } catch (x) { setDelErr(errMsg(x)) }
                  }}
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
          {(g.current_value !== null || g.target_value !== null) && (
            <p className="mt-1 text-slate-600">
              {g.metric ? `${g.metric} : ` : ''}{fmt(g.current_value)} → {fmt(g.target_value)} {g.unit ?? ''}
            </p>
          )}
          {g.target_date && <p className="text-slate-600">Date cible : {formatDate(g.target_date)}</p>}
        </div>
      ))}
      {delErr && <p role="alert" className="text-sm text-red-600">{delErr}</p>}
      {canManage && (
        <button onClick={() => setEditing('new')} className="rounded border px-4 py-2 text-sm">
          Ajouter un objectif
        </button>
      )}
    </div>
  )
}