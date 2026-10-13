import { useState, type ReactNode } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { useAuth } from '../auth/context'
import type { Membership } from '../auth/membership'
import { useAthlete, useUpdateAthlete } from '../athletes/api'
import AthleteForm from '../components/AthleteForm'
import GoalsPanel from '../components/GoalsPanel'
import SensitivePanel from '../components/SensitivePanel'
import {
  DAYS, DAY_LABEL, LEVEL_LABEL, STATUS_LABEL, equipmentLabel,
} from '../domain/athlete'
import { formatDate } from '../lib/utils'

type Tab = 'profil' | 'objectifs' | 'sensible'
const TABS: { key: Tab; label: string; managerOnly?: boolean }[] = [
  { key: 'profil', label: 'Profil' },
  { key: 'objectifs', label: 'Objectifs' },
  { key: 'sensible', label: 'Sensible', managerOnly: true },
]

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="col-span-2">{children}</dd>
    </div>
  )
}

export default function AthleteDetail() {
  const { id } = useParams()
  const membership = useOutletContext<Membership>()
  const userId = useAuth().session?.user.id
  const { data: athlete, isPending, isError, error } = useAthlete(id)
  const update = useUpdateAthlete()
  const [tab, setTab] = useState<Tab>('profil')
  const [editing, setEditing] = useState(false)

  if (isPending) return <p className="text-slate-500">Chargement…</p>
  if (isError) return <p role="alert" className="text-red-600">Erreur : {error.message}</p>
  if (!athlete) {
    return (
      <div className="space-y-2">
        <p>Athlète introuvable ou accès refusé.</p>
        <Link to="/athletes" className="underline">Retour à la liste</Link>
      </div>
    )
  }

  const canManage =
    membership.role === 'admin' || (membership.role === 'coach' && athlete.coach_id === userId)
  const availability = athlete.availability ?? {}
  const days = DAYS.filter((d) => availability[d] !== undefined)

  return (
    <div className="max-w-2xl space-y-4">
      <Link to="/athletes" className="text-sm text-slate-500 underline">← Athlètes</Link>
      <h1 className="text-xl font-semibold">{athlete.full_name}</h1>

      <div className="flex gap-4 border-b text-sm">
        {TABS.filter((t) => !t.managerOnly || canManage).map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={tab === t.key ? 'border-b-2 border-slate-900 pb-2 font-semibold' : 'pb-2 text-slate-500'}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profil' && !editing && (
        <div className="rounded-lg border bg-white p-6">
          <dl className="divide-y">
            <Row label="Date de naissance">{athlete.birth_date ? formatDate(athlete.birth_date) : '—'}</Row>
            <Row label="Sport principal">{athlete.primary_sport ?? '—'}</Row>
            <Row label="Sports secondaires">{athlete.secondary_sports?.join(', ') || '—'}</Row>
            <Row label="Niveau">{athlete.level ? LEVEL_LABEL[athlete.level] : '—'}</Row>
            <Row label="Expérience">{athlete.experience ?? '—'}</Row>
            <Row label="Séances par semaine">{athlete.sessions_per_week ?? '—'}</Row>
            <Row label="Durée disponible">
              {athlete.available_minutes !== null ? `${athlete.available_minutes} min` : '—'}
            </Row>
            <Row label="Disponibilités">
              {days.length
                ? days.map((d) => `${DAY_LABEL[d]} ${availability[d] === 0 ? 'repos' : `${availability[d]} min`}`).join(' · ')
                : '—'}
            </Row>
            <Row label="Matériel">
              {athlete.equipment?.length ? athlete.equipment.map(equipmentLabel).join(' · ') : '—'}
            </Row>
            <Row label="Statut">{athlete.status ? STATUS_LABEL[athlete.status] : '—'}</Row>
          </dl>
          {canManage && (
            <button onClick={() => setEditing(true)} className="mt-4 rounded border px-4 py-2 text-sm">
              Modifier
            </button>
          )}
        </div>
      )}

      {tab === 'profil' && editing && canManage && (
        <AthleteForm
          initial={athlete}
          submitLabel="Enregistrer"
          onCancel={() => setEditing(false)}
          onSubmit={async (input) => {
            await update.mutateAsync({ id: athlete.id, input })
            setEditing(false)
          }}
        />
      )}

      {tab === 'objectifs' && (
        <GoalsPanel athleteId={athlete.id} organizationId={athlete.organization_id} canManage={canManage} />
      )}

      {tab === 'sensible' && canManage && (
        <SensitivePanel athleteId={athlete.id} organizationId={athlete.organization_id} />
      )}
    </div>
  )
}