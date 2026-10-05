import { useState, type FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export default function CreateOrganization() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await supabase.rpc('create_organization', { p_name: name.trim() })
    if (error) setError('Création impossible : ' + error.message)
    else await queryClient.invalidateQueries({ queryKey: ['memberships'] })
    setBusy(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-lg border bg-white p-6">
        <h1 className="text-xl font-semibold">Créer votre organisation</h1>
        <p className="text-sm text-slate-600">
          Votre compte n'appartient à aucune organisation. Créez la vôtre pour commencer.
        </p>
        <label className="block text-sm">
          Nom de l'organisation
          <input required minLength={2} value={name} onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={busy || name.trim().length < 2}
          className="w-full rounded bg-slate-900 px-3 py-2 text-white disabled:opacity-50">
          {busy ? 'Création…' : 'Créer'}
        </button>
        <button type="button" onClick={() => void supabase.auth.signOut()}
          className="w-full text-sm text-slate-500 underline">
          Se déconnecter
        </button>
      </form>
    </div>
  )
}