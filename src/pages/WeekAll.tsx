import { useMemo, useState } from 'react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import type { Membership } from '../auth/membership'
import { useAthletes } from '../athletes/api'
import { useOrgWeekWorkouts, type WeekRow } from '../athletes/weekAll'
import { QUALITY_LABEL, QUALITY_STYLE } from '../domain/workout'
import { addDays, isIsoDate, mondayOf, parseISO, toISO, weekDays } from '../lib/week'

const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const dm = (iso: string) => parseISO(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
const dayName = (iso: string) => parseISO(iso).toLocaleDateString('fr-FR', { weekday: 'short' })

export default function WeekAll() {
  const membership = useOutletContext<Membership>()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const today = toISO(new Date())
  const raw = params.get('s')
  const monday = mondayOf(raw && isIsoDate(raw) ? raw : today)
  const days = weekDays(monday)
  const go = (s: string) => setParams({ s }, { replace: true })

  const athletes = useAthletes()
  const workouts = useOrgWeekWorkouts(membership.organizationId, monday)

  const rows = useMemo(() => {
    const q = normalize(query.trim())
    const byAthlete = new Map<string, Map<string, WeekRow[]>>()
    for (const w of workouts.data ?? []) {
      if (!w.athlete_id || !w.scheduled_on) continue
      const perDay = byAthlete.get(w.athlete_id) ?? new Map<string, WeekRow[]>()
      perDay.set(w.scheduled_on, [...(perDay.get(w.scheduled_on) ?? []), w])
      byAthlete.set(w.athlete_id, perDay)
    }
    return (athletes.data ?? [])
      .filter((a) => a.status === 'active' && (!q || normalize(a.full_name).includes(q)))
      .map((a) => {
        const perDay = byAthlete.get(a.id) ?? new Map<string, WeekRow[]>()
        let count = 0
        let minutes = 0
        perDay.forEach((list) => list.forEach((w) => { count += 1; minutes += w.planned_minutes ?? 0 }))
        return { a, perDay, count, minutes }
      })
  }, [athletes.data, workouts.data, query])

  if (athletes.isPending || workouts.isPending) return <p className="text-slate-500">Chargement…</p>
  if (athletes.isError || workouts.isError) {
    const e = athletes.error ?? workouts.error
    return <p role="alert" className="text-red-600">Erreur : {e?.message}</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold">Semaine de tous mes athlètes</h1>
        <div className="flex items-center gap-2 text-sm">
          <button className="rounded border bg-white px-2 py-1" onClick={() => go(addDays(monday, -7))}>←</button>
          <span>{dm(monday)} – {dm(addDays(monday, 6))}</span>
          <button className="rounded border bg-white px-2 py-1" onClick={() => go(addDays(monday, 7))}>→</button>
          <button className="rounded border bg-white px-2 py-1" onClick={() => go(mondayOf(today))}>Aujourd'hui</button>
        </div>
        <input
          className="ml-auto rounded border px-2 py-1 text-sm"
          placeholder="Rechercher un athlète"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {rows.length === 0 ? (
        <p className="text-slate-500">Aucun athlète actif.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[64rem] border-collapse bg-white text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="w-40 p-2">Athlète</th>
                {days.map((d) => (
                  <th key={d} className={`p-2 font-medium ${d === today ? 'bg-amber-50' : ''}`}>
                    <span className="capitalize">{dayName(d)}</span> {dm(d)}
                  </th>
                ))}
                <th className="w-24 p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ a, perDay, count, minutes }) => (
                <tr key={a.id} className="border-b align-top">
                  <td className="p-2 font-medium">
                    <Link to={`/athletes/${a.id}/semaine?s=${monday}`} className="underline">{a.full_name}</Link>
                  </td>
                  {days.map((d) => (
                    <td key={d} className={`p-1 ${d === today ? 'bg-amber-50' : ''}`}>
                      <Link to={`/athletes/${a.id}/semaine?s=${monday}`} className="block min-h-10 space-y-1 rounded p-1 hover:bg-slate-50">
                        {(perDay.get(d) ?? []).map((w) => (
                          <span key={w.id} className="block">
                            <span className="block truncate">{w.title}</span>
                            <span className="flex gap-1 text-xs text-slate-500">
                              {w.quality && (
                                <span className={`rounded px-1 ${QUALITY_STYLE[w.quality]}`}>{QUALITY_LABEL[w.quality]}</span>
                              )}
                              {w.planned_minutes != null && <span>{w.planned_minutes} min</span>}
                            </span>
                          </span>
                        ))}
                      </Link>
                    </td>
                  ))}
                  <td className="p-2 text-slate-600">
                    {count} séance{count > 1 ? 's' : ''}
                    {minutes > 0 && <><br />{minutes} min prévues</>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}