import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { describeLine } from '../domain/describe'
import { MODE_LABEL, modeOf } from '../domain/modes'
import type { ReferenceValue } from '../domain/prescription'
import { fetchSession, SessionError, type SessionErrorKind } from '../session/api'

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

const STATUS_LABEL: Record<string, string> = {
  assigned: 'À faire',
  in_progress: 'En cours',
  completed: 'Terminée',
}

function formatDay(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function AthleteSession() {
  const { token } = useParams<{ token: string }>()
  const q = useQuery({
    queryKey: ['athlete-session', token],
    queryFn: () => fetchSession(token ?? ''),
    enabled: !!token,
    retry: false,
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

  const { assignment, snapshot, sets, images } = q.data
  const refs: ReferenceValue[] = snapshot.references.map((r) => ({
    id: r.id,
    value: r.value,
    unit: r.unit ?? '',
    measuredOn: r.measuredOn,
    method: r.method as ReferenceValue['method'],
  }))

  return (
    <main className="mx-auto max-w-md space-y-6 p-4 pb-16">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-bold tracking-tight">{snapshot.workout.title}</h1>
        <p className="text-slate-600">
          {formatDay(assignment.scheduledOn ?? snapshot.workout.scheduledOn)}
          {snapshot.workout.plannedMinutes ? ` · ${snapshot.workout.plannedMinutes} min prévues` : ''}
        </p>
        <p className="text-sm text-slate-500">
          {STATUS_LABEL[assignment.status] ?? assignment.status} · {sets.length} série{sets.length > 1 ? 's' : ''} enregistrée{sets.length > 1 ? 's' : ''}
        </p>
      </header>

      {snapshot.blocks.map((b) => (
        <section key={b.id} className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {BLOCK_LABEL[b.kind] ?? b.kind}
          </h2>
          <ul className="space-y-2">
            {b.lines.map((line) => {
              const mode = modeOf(line.prescription)
              const name = line.nameFr ?? line.name ?? MODE_LABEL[mode]
              const text = describeLine(line.prescription, refs)
              const img = line.exerciseId ? images[line.exerciseId]?.[0] : undefined
              return (
                <li key={line.id} className="flex gap-3 rounded-lg border p-3">
                  {img && (
                    <img src={img} alt={name} loading="lazy" className="h-16 w-16 flex-none rounded object-cover" />
                  )}
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs text-slate-500">{MODE_LABEL[mode]}</p>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-slate-600">{text ?? 'Prescription non lisible'}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </main>
  )
}