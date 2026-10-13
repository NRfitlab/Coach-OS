import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useAddReference, useDeleteReference, useExercises, useReferences } from '../athletes/references'
import {
  KINDS, KIND_LABEL, KIND_UNIT, METHODS, METHOD_LABEL, ReferenceInputSchema, type Kind, type Reference,
} from '../domain/reference'
import { errMsg } from '../lib/errors'
import { formatDate } from '../lib/utils'

const INPUT = 'w-full rounded border px-3 py-2 text-sm'
const today = () => new Date().toLocaleDateString('sv-SE')
const fmt = (n: number) => String(n).replace('.', ',')

function RefForm({
  exercises, onSubmit, onCancel,
}: {
  exercises: { id: string; name: string }[]
  onSubmit: (raw: unknown) => Promise<void>
  onCancel: () => void
}) {
  const [f, setF] = useState({
    kind: 'one_rm' as Kind, exercise_id: '', value: '', unit: 'kg',
    measured_on: today(), method: 'direct_test', estimation_formula: '', note: '',
  })
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof f) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }))
  const fixedUnit = KIND_UNIT[f.kind]

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    const value = Number(f.value.trim().replace(',', '.'))
    if (f.value.trim() === '' || Number.isNaN(value)) return setErr('Valeur numérique invalide.')
    if (f.measured_on > today()) return setErr('La date ne peut pas être dans le futur.')
    setBusy(true)
    try {
      await onSubmit({
        kind: f.kind,
        exercise_id: f.kind === 'one_rm' ? f.exercise_id || null : null,
        value,
        unit: fixedUnit ?? f.unit,
        measured_on: f.measured_on,
        method: f.method,
        estimation_formula: f.method === 'estimated' ? f.estimation_formula.trim() || null : null,
        note: f.note.trim() || null,
      })
    } catch (x) {
      setErr(errMsg(x))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border bg-white p-6">
      <label className="block text-sm">Type
        <select className={INPUT} value={f.kind}
          onChange={(e) => {
            const kind = e.target.value as Kind
            setF((p) => ({ ...p, kind, unit: KIND_UNIT[kind] ?? '' }))
          }}>
          {KINDS.map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
        </select>
      </label>
      {f.kind === 'one_rm' && (
        <label className="block text-sm">Exercice
          <select className={INPUT} value={f.exercise_id} onChange={set('exercise_id')}>
            <option value="">— choisir —</option>
            {exercises.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </label>
      )}
      <div className="grid grid-cols-3 gap-3">
        <label className="block text-sm">Valeur
          <input className={INPUT} value={f.value} onChange={set('value')} inputMode="decimal" />
        </label>
        <label className="block text-sm">Unité
          <input className={INPUT} value={fixedUnit ?? f.unit} onChange={set('unit')} disabled={fixedUnit !== null} />
        </label>
        <label className="block text-sm">Date de mesure
          <input type="date" className={INPUT} value={f.measured_on} max={today()} onChange={set('measured_on')} />
        </label>
      </div>
      <label className="block text-sm">Méthode
        <select className={INPUT} value={f.method} onChange={set('method')}>
          {METHODS.map((m) => <option key={m} value={m}>{METHOD_LABEL[m]}</option>)}
        </select>
      </label>
      {f.method === 'estimated' && (
        <label className="block text-sm">Formule d'estimation
          <input className={INPUT} value={f.estimation_formula} onChange={set('estimation_formula')}
            placeholder="ex. Epley, 5 reps à 90 kg" />
        </label>
      )}
      <label className="block text-sm">Note
        <input className={INPUT} value={f.note} onChange={set('note')} />
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

export default function ReferencesPanel({
  athleteId, organizationId, canManage,
}: { athleteId: string; organizationId: string; canManage: boolean }) {
  const refs = useReferences(athleteId)
  const exercises = useExercises()
  const add = useAddReference()
  const del = useDeleteReference()
  const [adding, setAdding] = useState(false)
  const [delErr, setDelErr] = useState<string | null>(null)

  if (refs.isPending) return <p className="text-slate-500">Chargement…</p>
  if (refs.isError) return <p role="alert" className="text-red-600">Erreur : {refs.error.message}</p>

  const exName = new Map((exercises.data ?? []).map((x) => [x.id, x.name]))

  if (adding) {
    return (
      <RefForm
        exercises={exercises.data ?? []}
        onCancel={() => setAdding(false)}
        onSubmit={async (raw) => {
          const parsed = ReferenceInputSchema.safeParse(raw)
          if (!parsed.success) throw new Error(parsed.error.issues[0].message)
          await add.mutateAsync({ athleteId, organizationId, input: parsed.data })
          setAdding(false)
        }}
      />
    )
  }

  const groups = new Map<string, Reference[]>()
  for (const r of refs.data) {
    const key = `${r.kind}:${r.exercise_id ?? ''}`
    groups.set(key, [...(groups.get(key) ?? []), r])
  }
  const title = (r: Reference) =>
    r.kind === 'one_rm' ? `1RM · ${exName.get(r.exercise_id ?? '') ?? '…'}` : KIND_LABEL[r.kind]
  const ordered = [...groups.values()].sort(
    (a, b) => KINDS.indexOf(a[0].kind) - KINDS.indexOf(b[0].kind) || title(a[0]).localeCompare(title(b[0])),
  )

  const line = (r: Reference, current: boolean) => (
    <div key={r.id} className={`flex items-start justify-between gap-3 ${current ? '' : 'text-slate-500'}`}>
      <div>
        <span className={current ? 'font-semibold' : ''}>{fmt(r.value)} {r.unit}</span>
        <span className="ml-2">{formatDate(r.measured_on)}</span>
        <span className={`ml-2 rounded px-2 py-0.5 text-xs ${r.method === 'estimated' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100'}`}>
          {METHOD_LABEL[r.method]}
        </span>
        {r.estimation_formula && <span className="ml-2">({r.estimation_formula})</span>}
        {r.note && <p>{r.note}</p>}
      </div>
      {canManage && (
        <button
          className="whitespace-nowrap text-red-600 underline"
          onClick={async () => {
            if (!window.confirm(`Supprimer la valeur ${fmt(r.value)} ${r.unit} du ${formatDate(r.measured_on)} ? À utiliser pour corriger une erreur de saisie.`)) return
            setDelErr(null)
            try { await del.mutateAsync(r.id) } catch (x) { setDelErr(errMsg(x)) }
          }}
        >
          Supprimer
        </button>
      )}
    </div>
  )

  return (
    <div className="space-y-3">
      {ordered.length === 0 && <p className="text-sm text-slate-500">Aucune valeur de référence.</p>}
      {ordered.map((rows) => (
        <div key={`${rows[0].kind}:${rows[0].exercise_id ?? ''}`} className="space-y-2 rounded-lg border bg-white p-4 text-sm">
          <p className="text-xs uppercase text-slate-500">{title(rows[0])}</p>
          {line(rows[0], true)}
          {rows.length > 1 && (
            <div className="space-y-1 border-t pt-2">
              {rows.slice(1).map((r) => line(r, false))}
            </div>
          )}
        </div>
      ))}
      {delErr && <p role="alert" className="text-sm text-red-600">{delErr}</p>}
      {canManage && (
        <button onClick={() => setAdding(true)} className="rounded border px-4 py-2 text-sm">
          Ajouter une valeur
        </button>
      )}
    </div>
  )
}