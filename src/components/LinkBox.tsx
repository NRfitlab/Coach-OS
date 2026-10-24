import { useState } from 'react'

export function LinkBox({ url, expiresAt }: { url: string; expiresAt: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }
  return (
    <div className="space-y-1 rounded-lg border bg-white p-3 text-sm">
      <p className="font-medium">Lien de la séance (affiché une seule fois)</p>
      <div className="flex gap-2">
        <input
          readOnly aria-label="Lien de la séance" value={url} onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 rounded border px-2 py-1 font-mono text-xs"
        />
        <button type="button" onClick={copy} className="rounded border px-3 py-1">
          {copied ? 'Copié' : 'Copier'}
        </button>
      </div>
      <p className="text-xs text-slate-500">
        Valable jusqu'au {new Date(expiresAt).toLocaleDateString('fr-FR')}. Seul un hachage du jeton est conservé :
        pour obtenir un autre lien, utilisez « Renvoyer » dans l'écran des liens.
      </p>
      <p className="text-xs text-slate-500">La page athlète arrive à l'itération 5c : avant, ce lien ne s'ouvre pas.</p>
    </div>
  )
}
