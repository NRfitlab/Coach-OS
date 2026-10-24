import { Link, useOutletContext } from 'react-router-dom'
import { useCreateAssignment } from '../athletes/assignments'
import { useAuth } from '../auth/context'
import type { Membership } from '../auth/membership'
import type { Athlete } from '../domain/athlete'
import type { Reference } from '../domain/reference'
import { errMsg } from '../lib/errors'
import { linkFor } from '../lib/token'
import { LinkBox } from './LinkBox'

export function AssignPanel({ athlete, workoutId, refs }: { athlete: Athlete; workoutId: string; refs: Reference[] }) {
  const membership = useOutletContext<Membership>()
  const userId = useAuth().session?.user.id
  const create = useCreateAssignment()
  const canAssign = membership.role === 'admin' || (membership.role === 'coach' && athlete.coach_id === userId)
  if (!canAssign) return null
  const created = create.data
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button" disabled={create.isPending}
          onClick={() => create.mutate({ workoutId, athlete, refs })}
          className="rounded bg-slate-900 px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          {create.isPending ? 'Création du lien…' : `Assigner à ${athlete.full_name}`}
        </button>
        <Link to={`/athletes/${athlete.id}/liens`} className="text-sm text-slate-500 underline">
          Liens de {athlete.full_name}
        </Link>
      </div>
      {create.isError && <p role="alert" className="text-sm text-red-600">{errMsg(create.error)}</p>}
      {created && (
        <>
          <LinkBox url={linkFor(created.token)} expiresAt={created.expiresAt} />
          {created.revoked > 0 && (
            <p className="text-sm text-slate-600">
              Ancien lien révoqué : {created.revoked} assignation de cette séance sans série saisie.
            </p>
          )}
          {created.revokeError && (
            <p role="alert" className="text-sm text-amber-700">Ancien lien non révoqué : {created.revokeError}</p>
          )}
        </>
      )}
    </div>
  )
}
