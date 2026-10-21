import { useState } from 'react'
import {
  Link, useNavigate, useOutletContext, useParams, useSearchParams,
} from 'react-router-dom'
import { useAthlete, useAthletes } from '../athletes/api'
import { useCopyWeek, useWeekWorkouts } from '../athletes/workouts'
import { useAuth } from '../auth/context'
import type { Membership } from '../auth/membership'
import WeekBoard from '../components/WeekBoard'
import type { Athlete } from '../domain/athlete'
import type { Workout } from '../domain/workout'
import { errMsg } from '../lib/errors'
import { formatDate } from '../lib/utils'
import { addDays, diffDays, isIsoDate, mondayOf, toISO } from '../lib/week'

const INPUT = 'rounded border px-2 py-1 text-sm'

function CopyWeekPanel({
  athlete, monday, workouts, canPlanFor, onClose,
}: {
  athlete: Athlete
  monday: string
  workouts: Workout[]
  canPlanFor: (a: Athlete) => boolean
  onClose: () => void
}) {
  const navigate = useNavigate()
  const athletes = useAthletes()
  const copy = useCopyWeek()
  const [targetId, setTargetId] = useState(athlete.id)
  const [dest, setDest] = useState(addDays(monday, 7))
  const [err, setErr] = useState<string | null>(null)

  const targets = (athletes.data ?? []).filter(
    (a) => canPlanFor(a) && a.organization_id === athlete.organization_id && a.status !== 'archived',
  )

  const run = async () => {
    setErr(null)
    if (!isIsoDate(dest)) return setErr('Date de destination invalide.')
    const destMonday = mondayOf(dest)
    const shift = diffDays(monday, destMonday)
    if (targetId === athlete.id && shift === 0) {
      return setErr('Choisissez un autre athlète ou une autre semaine.')
    }
    try {
      await copy.mutateAsync({
        items: workouts, targetAthleteId: targetId, organizationId: athlete.organization_id, shift,
      })
      onClose()
      navigate(`/athletes/${targetId}/semaine?s=${destMonday}`)
    } catch (x) {
      setErr(errMsg(x))
    }
  }

  return (
    <div className="space-y-3 rounded-lg border bg-white p-4 text-sm">
      <p className="text-slate-600">
        Copie les {workouts.length} séance(s) de cette semaine. Les copies vous appartiennent.
        Les séances existantes de la destination sont conservées, rien n'est écrasé.
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <label className="block">Athlète de destination
          <select className={`${INPUT} mt-1 block`} value={targetId} onChange={(e) => setTargetId(e.target.value)}>
            {targets.map((a) => <option key={a.id} value={a.id}>{a.full_name}</option>)}
          </select>
        </label>
        <label className="block">Semaine de destination (un jour au choix)
          <input type="date" className={`${INPUT} mt-1 block`} value={dest} onChange={(e) => setDest(e.target.value)} />
        </label>
        <button
          disabled={copy.isPending || workouts.length === 0 || targets.length === 0}
          onClick={run}
          className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
        >
          Copier
        </button>
        <button onClick={onClose} className="rounded border px-4 py-2">Annuler</button>
      </div>
      {err && <p role="alert" className="text-red-600">{err}</p>}
    </div>
  )
}

export default function AthleteWeek() {
  const { id } = useParams()
  const [sp, setSp] = useSearchParams()
  const [copying, setCopying] = useState(false)
  const membership = useOutletContext<Membership>()
  const userId = useAuth().session?.user.id
  const raw = sp.get('s')
  const monday = mondayOf(raw && isIsoDate(raw) ? raw : toISO(new Date()))
  const athlete = useAthlete(id)
  const week = useWeekWorkouts(id, monday)

  if (athlete.isPending || week.isPending) return <p className="text-slate-500">Chargement…</p>
  if (athlete.isError) return <p role="alert" className="text-red-600">Erreur : {athlete.error.message}</p>
  if (week.isError) return <p role="alert" className="text-red-600">Erreur : {week.error.message}</p>
  if (!athlete.data) {
    return (
      <div className="space-y-2">
        <p>Athlète introuvable ou accès refusé.</p>
        <Link to="/athletes" className="underline">Retour à la liste</Link>
      </div>
    )
  }

  const a = athlete.data
  const workouts = week.data
  const canPlanFor = (x: Athlete) =>
    membership.role === 'admin' || (membership.role === 'coach' && x.coach_id === userId)
  const canCreate = canPlanFor(a)
  const total = workouts.reduce((s, w) => s + (w.planned_minutes ?? 0), 0)
  const go = (n: number) => setSp({ s: addDays(monday, n) })

  return (
    <div className="space-y-4">
      <Link to={`/athletes/${a.id}`} className="text-sm text-slate-500 underline">← {a.full_name}</Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight">Semaine du {formatDate(monday)}</h1>
        <button onClick={() => go(-7)} aria-label="Semaine précédente" className="rounded border px-3 py-1 text-sm">◀</button>
        <button onClick={() => setSp({})} className="rounded border px-3 py-1 text-sm">Cette semaine</button>
        <button onClick={() => go(7)} aria-label="Semaine suivante" className="rounded border px-3 py-1 text-sm">▶</button>
        {membership.role !== 'assistant' && (
          <button onClick={() => setCopying((v) => !v)} className="ml-auto rounded border px-3 py-1 text-sm">
            Copier la semaine
          </button>
        )}
      </div>
      <p className="text-sm text-slate-500">
        {a.full_name}{total > 0 ? ` · durée prévue (saisie) : ${total} min` : ''}
      </p>
      {copying && membership.role !== 'assistant' && (
        <CopyWeekPanel
          athlete={a} monday={monday} workouts={workouts} canPlanFor={canPlanFor}
          onClose={() => setCopying(false)}
        />
      )}
      <WeekBoard
        athleteId={a.id} organizationId={a.organization_id} monday={monday}
        workouts={workouts} canCreate={canCreate}
      />
    </div>
  )
}