import { Navigate, useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../auth/context'
import type { Membership } from '../auth/membership'
import { useCreateAthlete } from '../athletes/api'
import AthleteForm from '../components/AthleteForm'

export default function AthleteNew() {
  const membership = useOutletContext<Membership>()
  const { session } = useAuth()
  const navigate = useNavigate()
  const create = useCreateAthlete()

  if (membership.role === 'assistant' || !session) return <Navigate to="/athletes" replace />

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Nouvel athlète</h1>
      <AthleteForm
        submitLabel="Créer l'athlète"
        onCancel={() => navigate('/athletes')}
        onSubmit={async (input) => {
          const id = await create.mutateAsync({
            input,
            organizationId: membership.organizationId,
            coachId: session.user.id,
          })
          navigate(`/athletes/${id}`)
        }}
      />
    </div>
  )
}