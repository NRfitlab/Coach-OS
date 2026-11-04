import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { describeLine } from '../domain/describe'
import { MODE_LABEL, modeOf } from '../domain/modes'
import type { ReferenceValue } from '../domain/prescription'
import { fetchSession, SessionError, type Session, type SessionErrorKind, type SetRow } from '../session/api'
import { draftOfSaved, planOf, sameDraft, toSet, type Draft, type Plan } from '../session/fields'
import {
  flush,
  getSyncStatus,
  loadCachedSession,
  overlay,
  queueFinal,
  queueSet,
  saveCachedSession,
  usePending,
  useOnline,
  useSyncStatus,
  type Final,
  type Pending,
  type RowState,
  type SyncStatus,
} from '../session/offline'

const MESSAGES: Record<SessionErrorKind, { title: string; text: string }> = {
  expired: { title: 'Lien inactif', text: 'Ce lien n’est plus actif. Demandez-en un nouveau à votre coach.' },
  unknown: { title: 'Lien inconnu', text: 'Ce lien n’existe pas. Vérifiez qu’il est complet ou demandez-en un nouveau à votre coach.' },
  invalid: { title: 'Lien invalide', text: 'Ce lien est incomplet. Demandez-en un nouveau à votre coach.' },
  network: { title: 'Connexion impossible', text: 'Vérifiez votre connexion, puis rechargez la page.' },
  server: { title: 'Erreur', text: 'La séance ne peut pas être chargée pour le moment. Réessayez dans quelques minutes.' },
}

const BLOCK_LABEL: Record<string, string> = {
  warmup: 'Échauffement',
  straight: 'Séries',
  superset: 'Superset',
  circuit: 'Circuit',
  emom: 'EMOM',
  amrap: 'AMRAP',
  interval: 'Intervalles',
  cooldown: 'Retour au calme',
  drills: 'Éducatifs',
  continuous: 'Continu',
  fortime: 'For time',
}

const RPE_OPTIONS = Array.from({ length: 19 }, (_, i) => 1 + i * 0.5)
const COLS: Record<number, string> = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' }

function formatDay(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function SyncBanner(props: { pending: Pending; status: SyncStatus; online: boolean }) {
  const { pending, status, online } = props
  const n = Object.keys(pending.sets).length + (pending.final ? 1 : 0)
  const rejected = Object.keys(pending.rejected ?? {}).length
  let text: string | null = null
  if (status.state === 'closed') {
    text = `Lien clos : ${n} élément${n > 1 ? 's' : ''} non envoyé${n > 1 ? 's' : ''}. Contactez votre coach.`
  } else if (status.state === 'error') {
    text = status.message ?? 'Envoi refusé par le serveur.'
  } else if (!online) {
    text = n > 0 ? `Hors ligne · ${n} à envoyer` : 'Hors ligne'
  } else if (status.state === 'offline') {
    text = `Envoi impossible pour le moment · ${n} à envoyer`
  } else if (status.state === 'sending') {
    text = 'Envoi en cours…'
  } else if (n > 0) {
    text = `${n} à envoyer`
  }
  if (!text && rejected === 0) return null
  return (
    <div role="status" className="sticky top-0 z-10 -mx-4 space-y-1 border-b bg-amber-100 px-4 py-2 text-sm text-amber-900">
      {text && <p>{text}</p>}
      {rejected > 0 && (
        <p>
          {rejected} série{rejected > 1 ? 's' : ''} refusée{rejected > 1 ? 's' : ''} par le serveur : vérifiez les
          valeurs et validez à nouveau.
        </p>
      )}
    </div>
  )
}

function SetEditor(props: {
  token: string
  lineId: string
  index: number
  plan: Plan
  saved: SetRow | undefined
  rowState: RowState | undefined
  onQueued: () => void
}) {
  const { token, lineId, index, plan, saved, rowState, onQueued } = props
  const [draft, setDraft] = useState<Draft>(() => (saved ? draftOfSaved(saved, plan.fields) : plan.prefill))
  const [localError, setLocalError] = useState<string | null>(null)

  const dirty = !saved || rowState === 'rejected' || !sameDraft(draft, draftOfSaved(saved, plan.fields), plan.fields)

  function submit() {
    const performedAt = saved ? new Date(saved.performedAt).toISOString() : new Date().toISOString()
    const r = toSet(lineId, index, draft, plan.fields, performedAt)
    if (!r.ok) {
      setLocalError(r.error)
      return
    }
    setLocalError(null)
    queueSet(token, r.set)
    onQueued()
  }

  const label = !saved
    ? 'Valider'
    : rowState === 'rejected'
      ? 'Réessayer'
      : dirty
        ? 'Mettre à jour'
        : 'Validée ✓'

  return (
    <div className="space-y-2 rounded-md bg-slate-50 p-2">
      <p className="text-xs font-medium text-slate-500">Série {index}</p>
      <div className={`grid gap-2 ${COLS[Math.min(plan.fields.length, 3)]}`}>
        {plan.fields.map((f) => (
          <label key={f.key} className="flex min-w-0 flex-col gap-1 text-xs text-slate-500">
            {f.label}
            {f.unit ? ` (${f.unit})` : ''}
            <input
              inputMode="decimal"
              className="h-11 w-full rounded-md border bg-white px-2 text-base text-slate-900"
              value={draft[f.key] ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
            />
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={!!saved && !dirty}
        className="h-11 w-full rounded-md bg-slate-900 text-base font-medium text-white disabled:bg-slate-300 disabled:text-slate-600"
      >
        {label}
      </button>
      {rowState === 'pending' && !dirty && <p className="text-xs text-amber-700">À envoyer</p>}
      {rowState === 'rejected' && <p className="text-sm text-red-600">Refusée par le serveur : vérifiez les valeurs.</p>}
      {localError && <p role="alert" className="text-sm text-red-600">{localError}</p>}
    </div>
  )
}

function LineSets(props: {
  token: string
  lineId: string
  plan: Plan
  sets: SetRow[]
  states: Record<string, RowState>
  onQueued: () => void
}) {
  const { token, lineId, plan, sets, states, onQueued } = props
  const [extra, setExtra] = useState(0)
  const mine = sets.filter((s) => s.lineId === lineId)
  const maxSaved = mine.reduce((n, s) => Math.max(n, s.setIndex), 0)
  const rows = Math.max(plan.sets + extra, maxSaved)
  return (
    <div className="space-y-2">
      {plan.hint && <p className="text-xs text-slate-500">{plan.hint}</p>}
      {Array.from({ length: rows }, (_, i) => i + 1).map((idx) => (
        <SetEditor
          key={idx}
          token={token}
          lineId={lineId}
          index={idx}
          plan={plan}
          saved={mine.find((s) => s.setIndex === idx)}
          rowState={states[`${lineId}:${idx}`]}
          onQueued={onQueued}
        />
      ))}
      <button
        type="button"
        onClick={() => setExtra(rows - plan.sets + 1)}
        className="h-10 w-full rounded-md border text-sm text-slate-700"
      >
        + série
      </button>
    </div>
  )
}

function FinalPanel(props: {
  token: string
  assignment: Session['assignment']
  hasSets: boolean
  pendingFinal: Final | undefined
  onQueued: () => void
}) {
  const { token, assignment, hasSets, pendingFinal, onQueued } = props
  const done = assignment.status === 'completed' || pendingFinal?.complete === true
  const [rpe, setRpe] = useState(() => {
    const v = pendingFinal?.sessionRpe ?? assignment.sessionRpe
    return v !== null && v !== undefined ? String(v) : ''
  })
  const [comment, setComment] = useState(() => pendingFinal?.comment ?? assignment.comment ?? '')
  const [submitted, setSubmitted] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  function submit() {
    if (rpe === '') {
      setLocalError('Indiquez le RPE de la séance.')
      return
    }
    if (!hasSets) {
      setLocalError('Validez au moins une série avant de terminer.')
      return
    }
    setLocalError(null)
    queueFinal(token, {
      sessionRpe: Number(rpe),
      comment: comment.trim() === '' ? null : comment.trim(),
      complete: assignment.status !== 'completed',
    })
    setSubmitted(true)
    onQueued()
  }

  return (
    <section className="space-y-3 rounded-lg border-2 border-slate-900 p-3">
      <h2 className="text-lg font-semibold">{done ? 'Séance terminée' : 'Terminer la séance'}</h2>
      <label className="flex flex-col gap-1 text-sm text-slate-600">
        RPE de la séance (1 à 10)
        <select
          className="h-11 rounded-md border bg-white px-2 text-base text-slate-900"
          value={rpe}
          onChange={(e) => setRpe(e.target.value)}
        >
          <option value="">Choisir</option>
          {RPE_OPTIONS.map((v) => (
            <option key={v} value={String(v)}>{String(v).replace('.', ',')}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-600">
        Commentaire pour le coach
        <textarea
          className="min-h-24 rounded-md border bg-white p-2 text-base text-slate-900"
          maxLength={1000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </label>
      <button
        type="button"
        onClick={submit}
        className="h-12 w-full rounded-md bg-slate-900 text-base font-medium text-white"
      >
        {done ? 'Mettre à jour' : 'Terminer la séance'}
      </button>
      {pendingFinal ? (
        <p className="text-sm text-amber-700">Enregistré sur ce téléphone, envoi en attente.</p>
      ) : (
        submitted && <p className="text-sm text-green-700">Enregistré.</p>
      )}
      {localError && <p role="alert" className="text-sm text-red-600">{localError}</p>}
    </section>
  )
}

function SessionView({ token, data }: { token: string; data: Session }) {
  const qc = useQueryClient()
  const { assignment, snapshot, sets, images } = data
  const pending = usePending(token)
  const status = useSyncStatus()
  const online = useOnline()
  const merged = useMemo(() => overlay(sets, pending), [sets, pending])

  const runFlush = useCallback(() => {
    void flush(token).then((sent) => {
      if (sent) void qc.invalidateQueries({ queryKey: ['athlete-session', token] })
    })
  }, [token, qc])

  useEffect(() => {
    runFlush()
    const onVisible = () => {
      if (document.visibilityState === 'visible') runFlush()
    }
    const id = window.setInterval(() => {
      const s = getSyncStatus().state
      if (s !== 'closed' && s !== 'error') runFlush()
    }, 20000)
    window.addEventListener('online', runFlush)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('online', runFlush)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [runFlush])

  const refs: ReferenceValue[] = snapshot.references.map((r) => ({
    id: r.id,
    value: r.value,
    unit: r.unit ?? '',
    measuredOn: r.measuredOn,
    method: r.method as ReferenceValue['method'],
  }))

  const done = assignment.status === 'completed' || pending.final?.complete === true
  const statusLabel = done ? 'Terminée' : assignment.status === 'in_progress' || merged.rows.length > 0 ? 'En cours' : 'À faire'

  return (
    <main className="mx-auto max-w-md space-y-6 p-4 pb-16">
      <SyncBanner pending={pending} status={status} online={online} />
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-bold tracking-tight">{snapshot.workout.title}</h1>
        <p className="text-slate-600">
          {formatDay(assignment.scheduledOn ?? snapshot.workout.scheduledOn)}
          {snapshot.workout.plannedMinutes ? ` · ${snapshot.workout.plannedMinutes} min prévues` : ''}
        </p>
        <p className="text-sm text-slate-500">
          {statusLabel} · {merged.rows.length} série{merged.rows.length > 1 ? 's' : ''} validée
          {merged.rows.length > 1 ? 's' : ''}
        </p>
      </header>

      {snapshot.blocks.map((b) => (
        <section key={b.id} className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {BLOCK_LABEL[b.kind] ?? b.kind}
          </h2>
          <ul className="space-y-3">
            {b.lines.map((line) => {
              const mode = modeOf(line.prescription)
              const name = line.nameFr ?? line.name ?? MODE_LABEL[mode]
              const text = describeLine(line.prescription, refs)
              const img = line.exerciseId ? images[line.exerciseId]?.[0] : undefined
              const plan = planOf(line.prescription, refs)
              return (
                <li key={line.id} className="space-y-3 rounded-lg border p-3">
                  <div className="flex gap-3">
                    {img && (
                      <img
                        src={img}
                        alt={name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                        className="h-16 w-16 flex-none rounded object-cover"
                      />
                    )}
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs text-slate-500">{MODE_LABEL[mode]}</p>
                      <p className="font-medium">{name}</p>
                      <p className="text-sm text-slate-600">{text ?? 'Prescription non lisible'}</p>
                    </div>
                  </div>
                  {plan && (
                    <LineSets
                      token={token}
                      lineId={line.id}
                      plan={plan}
                      sets={merged.rows}
                      states={merged.states}
                      onQueued={runFlush}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <FinalPanel
        token={token}
        assignment={assignment}
        hasSets={merged.rows.length > 0}
        pendingFinal={pending.final}
        onQueued={runFlush}
      />
    </main>
  )
}

export default function AthleteSession() {
  const { token } = useParams<{ token: string }>()
  const q = useQuery({
    queryKey: ['athlete-session', token],
    queryFn: async () => {
      const t = token ?? ''
      try {
        const s = await fetchSession(t)
        saveCachedSession(t, s)
        return s
      } catch (e) {
        if (e instanceof SessionError && e.kind === 'network') {
          const cached = loadCachedSession(t)
          if (cached) return cached
        }
        throw e
      }
    },
    enabled: !!token,
    retry: false,
    networkMode: 'always',
  })

  if (!token || q.isPending) {
    return <p className="p-6 text-slate-500">Chargement…</p>
  }

  if (q.isError) {
    const kind: SessionErrorKind = q.error instanceof SessionError ? q.error.kind : 'server'
    const m = MESSAGES[kind]
    return (
      <main className="mx-auto max-w-md p-6">
        <h1 className="font-display text-2xl font-bold">{m.title}</h1>
        <p role="alert" className="mt-2 text-slate-600">{m.text}</p>
      </main>
    )
  }

  return <SessionView token={token} data={q.data} />
}