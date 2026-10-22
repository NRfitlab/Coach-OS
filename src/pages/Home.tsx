import { useMemo } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import type { Membership } from '../auth/membership'
import { useAthletes } from '../athletes/api'
import { useOrgWeekWorkouts, type WeekRow } from '../athletes/weekAll'
import { QUALITY_LABEL, QUALITY_STYLE } from '../domain/workout'
import { addDays, diffDays, mondayOf, parseISO, toISO } from '../lib/week'

type A = NonNullable<ReturnType<typeof useAthletes>['data']>[number]

const dm = (iso: string) => parseISO(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('')

function dayLabel(iso: string, today: string): string {
  const n = diffDays(today, iso)
  if (n === 0) return "Aujourd'hui"
  if (n === 1) return 'Demain'
  return `${parseISO(iso).toLocaleDateString('fr-FR', { weekday: 'long' })} ${dm(iso)}`
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border bg-white px-4 py-2">
      <div className="font-display text-3xl font-bold leading-none">{value}</div>
      <div className="mt-1 font-mono text-xs uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  )
}

export default function Home() {
  const membership = useOutletContext<Membership>()
  const today = toISO(new Date())
  const monday = mondayOf(today)
  const athletes = useAthletes()
  const workouts = useOrgWeekWorkouts(membership.organizationId, monday)
  const canPlan = membership.role !== 'assistant'

  const { todo, idle, total } = useMemo(() => {
    const byAthlete = new Map<string, WeekRow[]>()
    for (const w of workouts.data ?? []) {
      if (!w.athlete_id || !w.scheduled_on || w.scheduled_on < today) continue
      byAthlete.set(w.athlete_id, [...(byAthlete.get(w.athlete_id) ?? []), w])
    }
    const todo: { a: A; list: WeekRow[] }[] = []
    const idle: A[] = []
    let total = 0
    for (const a of (athletes.data ?? []).filter((x) => x.status === 'active')) {
      const list = (byAthlete.get(a.id) ?? []).sort((x, y) =>
        (x.scheduled_on ?? '').localeCompare(y.scheduled_on ?? ''),
      )
      if (list.length > 0) {
        todo.push({ a, list })
        total += list.length
      } else {
        idle.push(a)
      }
    }
    todo.sort(
      (x, y) =>
        (x.list[0]?.scheduled_on ?? '').localeCompare(y.list[0]?.scheduled_on ?? '') ||
        x.a.full_name.localeCompare(y.a.full_name, 'fr'),
    )
    idle.sort((x, y) => x.full_name.localeCompare(y.full_name, 'fr'))
    return { todo, idle, total }
  }, [athletes.data, workouts.data, today])

  if (athletes.isPending || workouts.isPending) return <p className="text-slate-500">Chargement…</p>
  if (athletes.isError || workouts.isError) {
    const e = athletes.error ?? workouts.error
    return <p role="alert" className="text-red-600">Erreur : {e?.message}</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">À traiter cette semaine</h1>
        <p className="font-mono text-xs uppercase tracking-wide text-slate-500">
          Semaine du {dm(monday)} au {dm(addDays(monday, 6))}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Stat value={total} label="séances à faire" />
        <Stat value={idle.length} label="athlètes sans séance à venir" />
      </div>

      {todo.length === 0 && idle.length === 0 && (
        <p className="text-slate-500">
          Aucun athlète actif.{' '}
          {canPlan && <Link to="/athletes/new" className="underline">Créer un athlète</Link>}
        </p>
      )}

      {todo.length > 0 && (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {todo.map(({ a, list }) => (
            <article key={a.id} className="rounded-xl border bg-white p-3">
              <header className="mb-2 flex items-center gap-2">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-medium">
                  {initials(a.full_name)}
                </span>
                <Link to={`/athletes/${a.id}`} className="truncate font-medium underline">{a.full_name}</Link>
                <span className="ml-auto shrink-0 text-xs text-slate-500">{list.length} à faire</span>
              </header>
              <ul className="space-y-1">
                {list.map((w) => (
                  <li key={w.id}>
                    <Link
                      to={`/athletes/${a.id}/semaine/${w.id}`}
                      className={`block rounded p-2 hover:bg-slate-50 ${w.scheduled_on === today ? 'bg-amber-50' : ''}`}
                    >
                      <span className="block text-xs capitalize text-slate-500">
                        {w.scheduled_on ? dayLabel(w.scheduled_on, today) : ''}
                      </span>
                      <span className="block truncate">{w.title}</span>
                      <span className="flex gap-1 text-xs text-slate-500">
                        {w.quality && (
                          <span className={`rounded px-1 ${QUALITY_STYLE[w.quality]}`}>{QUALITY_LABEL[w.quality]}</span>
                        )}
                        {w.planned_minutes != null && <span>{w.planned_minutes} min</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to={`/athletes/${a.id}/semaine?s=${monday}`}
                className="mt-2 block text-xs text-slate-500 underline"
              >
                Calendrier de la semaine
              </Link>
            </article>
          ))}
        </section>
      )}

      {todo.length === 0 && idle.length > 0 && (
        <p className="text-slate-500">Aucune séance à venir cette semaine.</p>
      )}

      {idle.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-mono text-xs uppercase tracking-wide text-slate-500">
            Sans séance à venir cette semaine
          </h2>
          <ul className="divide-y rounded-xl border bg-white">
            {idle.map((a) => (
              <li key={a.id} className="flex items-center gap-2 p-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium">
                  {initials(a.full_name)}
                </span>
                <Link to={`/athletes/${a.id}`} className="truncate font-medium underline">{a.full_name}</Link>
                <Link
                  to={`/athletes/${a.id}/semaine?s=${monday}`}
                  className="ml-auto shrink-0 rounded border px-2 py-1 text-sm hover:bg-slate-50"
                >
                  {canPlan ? 'Planifier' : 'Calendrier'}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}