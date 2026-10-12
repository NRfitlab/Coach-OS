import { useState, type FormEvent } from 'react'
import {
  DAYS, DAY_LABEL, EQUIPMENT_OPTIONS, LEVELS, LEVEL_LABEL, STATUSES, STATUS_LABEL,
  type Athlete, type AthleteInput, type Status,
} from '../domain/athlete'
import { messageOf } from '../lib/utils'

type Props = {
  initial?: Athlete
  submitLabel: string
  onSubmit: (input: AthleteInput) => Promise<void>
  onCancel?: () => void
}

const field = 'mt-1 w-full rounded border px-3 py-2'

export default function AthleteForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.full_name ?? '')
  const [birth, setBirth] = useState(initial?.birth_date ?? '')
  const [sport, setSport] = useState(initial?.primary_sport ?? '')
  const [secondary, setSecondary] = useState((initial?.secondary_sports ?? []).join(', '))
  const [level, setLevel] = useState<string>(initial?.level ?? '')
  const [experience, setExperience] = useState(initial?.experience ?? '')
  const [sessions, setSessions] = useState(initial?.sessions_per_week?.toString() ?? '')
  const [minutes, setMinutes] = useState(initial?.available_minutes?.toString() ?? '')
  const [availability, setAvailability] = useState<Record<string, string>>(
    Object.fromEntries(DAYS.map((d) => [d, initial?.availability?.[d]?.toString() ?? ''])),
  )
  const [equipment, setEquipment] = useState<string[]>(initial?.equipment ?? [])
  const [status, setStatus] = useState<Status>(initial?.status ?? 'active')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const toggle = (v: string) =>
    setEquipment((eq) => (eq.includes(v) ? eq.filter((x) => x !== v) : [...eq, v]))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const toInt = (s: string) => (s.trim() === '' ? null : Number.parseInt(s, 10))
    const avail: Record<string, number> = {}
    for (const d of DAYS) {
      const n = toInt(availability[d] ?? '')
      if (n !== null && !Number.isNaN(n)) avail[d] = n
    }
    setBusy(true)
    try {
      await onSubmit({
        full_name: name.trim(),
        birth_date: birth === '' ? null : birth,
        primary_sport: sport.trim() === '' ? null : sport.trim(),
        secondary_sports: secondary.split(',').map((s) => s.trim()).filter(Boolean),
        level: LEVELS.find((l) => l === level) ?? null,
        experience: experience.trim() === '' ? null : experience.trim(),
        sessions_per_week: toInt(sessions),
        available_minutes: toInt(minutes),
        availability: avail,
        equipment,
        status,
      })
    } catch (err) {
      setError(messageOf(err))
    } finally {
      setBusy(false)
    }
  }

  const group = (prefix: string, title: string) => (
    <fieldset className="space-y-1">
      <legend className="text-sm text-slate-500">{title}</legend>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {EQUIPMENT_OPTIONS.filter((o) => o.value.startsWith(prefix)).map((o) => (
          <label key={o.value} className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={equipment.includes(o.value)}
              onChange={() => toggle(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-6">
      <label className="block text-sm">
        Nom complet *
        <input required value={name} onChange={(e) => setName(e.target.value)} className={field} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Date de naissance
          <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className={field} />
        </label>
        <label className="block text-sm">
          Niveau
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={field}>
            <option value="">—</option>
            {LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}
          </select>
        </label>
        <label className="block text-sm">
          Sport principal
          <input value={sport} onChange={(e) => setSport(e.target.value)} className={field} />
        </label>
        <label className="block text-sm">
          Sports secondaires (séparés par des virgules)
          <input value={secondary} onChange={(e) => setSecondary(e.target.value)} className={field} />
        </label>
        <label className="block text-sm sm:col-span-2">
          Expérience d'entraînement
          <input value={experience} onChange={(e) => setExperience(e.target.value)} className={field} />
        </label>
        <label className="block text-sm">
          Séances par semaine (0 à 14)
          <input type="number" min={0} max={14} value={sessions}
            onChange={(e) => setSessions(e.target.value)} className={field} />
        </label>
        <label className="block text-sm">
          Durée disponible par séance (min, 0 à 600)
          <input type="number" min={0} max={600} value={minutes}
            onChange={(e) => setMinutes(e.target.value)} className={field} />
        </label>
      </div>

      <fieldset>
        <legend className="text-sm text-slate-500">Disponibilités (minutes par jour, 0 = repos)</legend>
        <div className="mt-1 grid grid-cols-7 gap-2">
          {DAYS.map((d) => (
            <label key={d} className="block text-center text-xs">
              {DAY_LABEL[d]}
              <input type="number" min={0} max={600} value={availability[d] ?? ''}
                onChange={(e) => setAvailability((a) => ({ ...a, [d]: e.target.value }))}
                className="mt-1 w-full rounded border px-1 py-1 text-center text-sm" />
            </label>
          ))}
        </div>
      </fieldset>

      {group('gym:', 'Matériel en salle')}
      {group('home:', 'Matériel à domicile')}

      {initial && (
        <label className="block text-sm">
          Statut
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className={field}>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </label>
      )}

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={busy || name.trim() === ''}
          className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50">
          {busy ? 'Enregistrement…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded border px-4 py-2">
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}