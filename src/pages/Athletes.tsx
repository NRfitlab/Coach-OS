import { useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useAthletes } from '../athletes/api'
import type { Membership } from '../auth/membership'
import { LEVEL_LABEL, STATUSES, STATUS_LABEL, type Status } from '../domain/athlete'

type StatusFilter = Status | 'all'

function normalize(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export default function Athletes() {
  const membership = useOutletContext<Membership>()
  const { data, isPending, isError, error } = useAthletes()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('active')
  const canCreate = membership.role !== 'assistant'

  const visible = useMemo(() => {
    const q = normalize(query.trim())
    return (data ?? []).filter((a) => {
      if (status !== 'all' && (a.status ?? 'active') !== status) return false
      if (!q) return true
      return normalize(`${a.full_name} ${a.primary_sport ?? ''}`).includes(q)
    })
  }, [data, query, status])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Athlètes</h1>
        {canCreate && (
          <Link to="/athletes/new" className="rounded bg-slate-900 px-3 py-2 text-sm text-white">
            Nouvel athlète
          </Link>
        )}
      </div>
      {membership.role === 'assistant' && (
        <p className="text-sm text-slate-500">Vous voyez les athlètes qui vous sont attribués.</p>
      )}

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un nom ou un sport"
          className="w-full max-w-xs rounded border bg-white px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="rounded border bg-white px-3 py-2 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
          <option value="all">Tous</option>
        </select>
      </div>

      {isPending && <p className="text-slate-500">Chargement…</p>}
      {isError && <p role="alert" className="text-red-600">Erreur : {error.message}</p>}
      {data && data.length === 0 && <p className="text-slate-500">Aucun athlète.</p>}
      {data && data.length > 0 && visible.length === 0 && (
        <p className="text-slate-500">Aucun résultat pour ces filtres.</p>
      )}
      {data && visible.length > 0 && (
        <>
          <p className="text-sm text-slate-500">{visible.length} sur {data.length} athlète(s)</p>
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-2">Nom</th>
                  <th className="px-4 py-2">Sport</th>
                  <th className="px-4 py-2">Niveau</th>
                  <th className="px-4 py-2">Séances/sem.</th>
                  <th className="px-4 py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((a) => (
                  <tr key={a.id} className="border-b last:border-0">
                    <td className="px-4 py-2">
                      <Link to={`/athletes/${a.id}`} className="font-medium underline">{a.full_name}</Link>
                    </td>
                    <td className="px-4 py-2">{a.primary_sport ?? '—'}</td>
                    <td className="px-4 py-2">{a.level ? LEVEL_LABEL[a.level] : '—'}</td>
                    <td className="px-4 py-2">{a.sessions_per_week ?? '—'}</td>
                    <td className="px-4 py-2">{a.status ? STATUS_LABEL[a.status] : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}