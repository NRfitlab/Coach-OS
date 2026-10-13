import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteAthlete, useExportAthlete } from '../athletes/gdpr'
import type { Athlete } from '../domain/athlete'
import { errMsg } from '../lib/errors'

export default function AthleteDataPanel({ athlete }: { athlete: Athlete }) {
  const navigate = useNavigate()
  const exportAthlete = useExportAthlete()
  const remove = useDeleteAthlete()
  const [typed, setTyped] = useState('')
  const [exportErr, setExportErr] = useState<string | null>(null)
  const [deleteErr, setDeleteErr] = useState<string | null>(null)

  const matches = typed.trim() === athlete.full_name.trim()

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-lg border bg-white p-6 text-sm">
        <h2 className="font-semibold">Exporter les données</h2>
        <p className="text-slate-600">
          Fichier JSON contenant le profil, les objectifs, les valeurs de référence et, s'il existe,
          le contenu de la section Sensible.
        </p>
        <button
          disabled={exportAthlete.isPending}
          className="rounded border px-4 py-2 disabled:opacity-50"
          onClick={async () => {
            setExportErr(null)
            try {
              await exportAthlete.mutateAsync({ athleteId: athlete.id, fullName: athlete.full_name })
            } catch (x) {
              setExportErr(errMsg(x))
            }
          }}
        >
          {exportAthlete.isPending ? 'Export…' : 'Exporter en JSON'}
        </button>
        {exportErr && <p role="alert" className="text-red-600">{exportErr}</p>}
      </div>

      <div className="space-y-3 rounded-lg border border-red-300 bg-white p-6 text-sm">
        <h2 className="font-semibold text-red-700">Supprimer l'athlète</h2>
        <p className="text-slate-600">
          Suppression définitive de {athlete.full_name} et de toutes les données liées : profil,
          objectifs, références, section Sensible, séances, assignations et accès des assistants.
          Exportez les données avant de supprimer si elles doivent être conservées.
        </p>
        <label className="block">
          Pour confirmer, saisissez le nom exact : <strong>{athlete.full_name}</strong>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
          />
        </label>
        <button
          disabled={!matches || remove.isPending}
          className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-40"
          onClick={async () => {
            setDeleteErr(null)
            try {
              await remove.mutateAsync(athlete.id)
              navigate('/athletes')
            } catch (x) {
              setDeleteErr(errMsg(x))
            }
          }}
        >
          Supprimer définitivement
        </button>
        {deleteErr && <p role="alert" className="text-red-600">{deleteErr}</p>}
      </div>
    </div>
  )
}