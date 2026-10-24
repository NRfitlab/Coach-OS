import { useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { useAthlete } from '../athletes/api'
import {
  STATE_LABEL, assignmentState, linkActive, setsOf,
  useAthleteAssignments, useDeleteAssignment, useRenewAssignment, useRevokeAssignment,
} from '../athletes/assignments'
import { useAuth } from '../auth/context'
import type { Membership } from '../auth/membership'
import { LinkBox } from '../components/LinkBox'
import { errMsg } from '../lib/errors'
import { formatDate } from '../lib/utils'
import { linkFor } from '../lib/token'

export default function AthleteLinks() {
  const { id } = useParams()
  const membership = useOutletContext<Membership>()
  const userId = useAuth().session?.user.id
  const athlete = useAthlete(id)
  const list = useAthleteAssignments(id)
  const renew = useRenewAssignment()
  const revoke = useRevokeAssignment()
  const del = useDeleteAssignment()
  const [fresh, setFresh] = useState<{ token: string; expiresAt: string } | null>(null)

  if (athlete.isPending || list.isPending) return <p className="text-slate-500">Chargement…</p>
  const failed = athlete.error ?? list.error
  if (failed) return <p role="alert" className="text-red-600">Erreur : {failed.message}</p>
  if (!athlete.data || !list.data) {
    return (
      <div className="space-y-2">
        <p>Athlète introuvable ou accès refusé.</p>
        <Link to="/athletes" className="underline">Retour à la liste</Link>
      </div>
    )
  }
  const a = athlete.data
  const canManage = membership.role === 'admin' || (membership.role === 'coach' && a.coach_id === userId)
  const now = Date.now()
  const actionError = renew.error ?? revoke.error ?? del.error

  return (
    <div className="space-y-4">
      <Link to={`/athletes/${a.id}`} className="text-sm text-slate-500 underline">← {a.full_name}</Link>
      <h1 className="font-display text-3xl font-bold tracking-tight">Liens de {a.full_name}</h1>
      {fresh && <LinkBox url={linkFor(fresh.token)} expiresAt={fresh.expiresAt} />}
      {actionError && <p role="alert" className="text-sm text-red-600">{errMsg(actionError)}</p>}
      {list.data.length === 0 ? (
        <p className="text-slate-500">Aucune assignation. Ouvrez une séance dans le builder, puis « Assigner ».</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] border-collapse bg-white text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Séance</th>
                <th className="p-2">Date</th>
                <th className="p-2">État</th>
                <th className="p-2">Expire le</th>
                <th className="p-2">Séries saisies</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((r) => {
                const state = assignmentState(r, now)
                const sets = setsOf(r)
                const done = state === 'completed'
                const active = linkActive(r, now)
                const deletable = !done && r.status === 'assigned' && sets === 0
                return (
                  <tr key={r.id} className="border-b align-top">
                    <td className="p-2 font-medium">{r.title ?? 'Séance supprimée'}</td>
                    <td className="p-2">{r.scheduled_on ? formatDate(r.scheduled_on) : '—'}</td>
                    <td className="p-2">{STATE_LABEL[state]}</td>
                    <td className="p-2">
                      {r.token_expires_at ? new Date(r.token_expires_at).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="p-2">{sets}</td>
                    <td className="space-x-3 p-2">
                      {canManage && !done && (
                        <button
                          type="button" className="underline" disabled={renew.isPending}
                          onClick={() => renew.mutate({ id: r.id, scheduledOn: r.scheduled_on }, { onSuccess: setFresh })}
                        >
                          Renvoyer
                        </button>
                      )}
                      {canManage && !done && active && (
                        <button
                          type="button" className="underline" disabled={revoke.isPending}
                          onClick={() => revoke.mutate(r.id)}
                        >
                          Révoquer
                        </button>
                      )}
                      {canManage && deletable && (
                        <button
                          type="button" className="text-red-600 underline" disabled={del.isPending}
                          onClick={() => { if (window.confirm('Supprimer cette assignation ?')) del.mutate(r.id) }}
                        >
                          Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
