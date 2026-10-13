import { useState } from 'react'
import {
  useCreateSensitive, useDeleteSensitive, useSensitive, useUpdateSensitive,
} from '../athletes/sensitive'
import { errMsg } from '../lib/errors'

export default function SensitivePanel({
  athleteId, organizationId,
}: { athleteId: string; organizationId: string }) {
  const q = useSensitive(athleteId)
  const create = useCreateSensitive()
  const update = useUpdateSensitive()
  const remove = useDeleteSensitive()
  const [text, setText] = useState('')
  const [consent, setConsent] = useState(false)
  const [editing, setEditing] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  if (q.isPending) return <p className="text-slate-500">Chargement…</p>
  if (q.isError) return <p role="alert" className="text-red-600">Erreur : {q.error.message}</p>

  const run = async (fn: () => Promise<unknown>, after?: () => void) => {
    setErr(null)
    try {
      await fn()
      after?.()
    } catch (x) {
      setErr(errMsg(x))
    }
  }
  const errorBlock = err && <p role="alert" className="text-sm text-red-600">{err}</p>

  if (!q.data) {
    return (
      <div className="space-y-3 rounded-lg border bg-white p-6 text-sm">
        <p className="text-slate-600">
          Blessures et limitations : données de santé. Réservées au coach responsable et à
          l'administrateur. Le consentement de l'athlète est requis avant toute saisie.
        </p>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
          <span>L'athlète a consenti au recueil et à la conservation de ces informations.</span>
        </label>
        <textarea
          className="w-full rounded border px-3 py-2" rows={5} value={text}
          onChange={(e) => setText(e.target.value)} disabled={!consent}
          placeholder="Blessures, limitations, précautions"
        />
        {errorBlock}
        <button
          disabled={!consent || text.trim() === '' || create.isPending}
          className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
          onClick={() => run(
            () => create.mutateAsync({ athleteId, organizationId, text: text.trim() }),
            () => { setText(''); setConsent(false) },
          )}
        >
          Enregistrer
        </button>
      </div>
    )
  }

  const when = new Date(q.data.consent_at).toLocaleString('fr-FR')

  return (
    <div className="space-y-3 rounded-lg border bg-white p-6 text-sm">
      <p className="text-slate-500">Consentement enregistré le {when}.</p>
      {!editing ? (
        <>
          <p className="whitespace-pre-wrap">{q.data.injuries_limitations || '—'}</p>
          <div className="flex gap-3">
            <button className="rounded border px-4 py-2"
              onClick={() => { setText(q.data?.injuries_limitations ?? ''); setEditing(true) }}>
              Modifier
            </button>
            <button
              className="rounded border px-4 py-2 text-red-600"
              onClick={() => {
                if (!window.confirm('Supprimer ces informations et le consentement ? Action définitive.')) return
                void run(() => remove.mutateAsync(athleteId))
              }}
            >
              Supprimer
            </button>
          </div>
        </>
      ) : (
        <>
          <textarea className="w-full rounded border px-3 py-2" rows={5} value={text}
            onChange={(e) => setText(e.target.value)} />
          <div className="flex gap-3">
            <button
              disabled={text.trim() === '' || update.isPending}
              className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
              onClick={() => run(() => update.mutateAsync({ athleteId, text: text.trim() }), () => setEditing(false))}
            >
              Enregistrer
            </button>
            <button className="rounded border px-4 py-2" onClick={() => setEditing(false)}>Annuler</button>
          </div>
        </>
      )}
      {errorBlock}
    </div>
  )
}