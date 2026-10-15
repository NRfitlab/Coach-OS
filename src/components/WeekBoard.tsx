import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  useAddWorkout, useDeleteWorkout, useUpdateWorkout, type WorkoutPatch,
} from '../athletes/workouts'
import {
  QUALITIES, QUALITY_LABEL, QUALITY_STYLE, WorkoutInputSchema, type Quality, type Workout,
} from '../domain/workout'
import { errMsg } from '../lib/errors'
import { isIsoDate, parseISO, toISO, weekDays } from '../lib/week'
import { useAuth } from '../auth/context'

const INPUT = 'w-full rounded border px-2 py-1 text-sm'

function QualitySelect({
  value, onChange,
}: { value: Quality | ''; onChange: (q: Quality | '') => void }) {
  return (
    <select
      className={`${INPUT} text-xs`}
      value={value}
      aria-label="Qualité"
      onChange={(e) => onChange(e.target.value as Quality | '')}
    >
      <option value="">Qualité</option>
      {QUALITIES.map((q) => <option key={q} value={q}>{QUALITY_LABEL[q]}</option>)}
    </select>
  )
}

function QuickAdd({
  onAdd,
}: { onAdd: (title: string, quality: Quality | null) => Promise<void> }) {
  const [title, setTitle] = useState('')
  const [quality, setQuality] = useState<Quality | ''>('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (title.trim() === '' || busy) return
    setBusy(true)
    try {
      await onAdd(title, quality || null)
      setTitle('')
    } catch {
      // l'erreur est affichée par le parent ; le titre saisi est conservé
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-1 pt-1">
      <input
        className={INPUT}
        value={title}
        readOnly={busy}
        placeholder="+ séance"
        aria-label="Nouvelle séance"
        onChange={(e) => setTitle(e.target.value)}
      />
      <QualitySelect value={quality} onChange={setQuality} />
    </form>
  )
}

function EditForm({
  w, onSave, onDelete, onCancel,
}: {
  w: Workout
  onSave: (patch: WorkoutPatch) => Promise<void>
  onDelete: () => Promise<void>
  onCancel: () => void
}) {
  const [title, setTitle] = useState(w.title)
  const [quality, setQuality] = useState<Quality | ''>(w.quality ?? '')
  const [minutes, setMinutes] = useState(w.planned_minutes?.toString() ?? '')
  const [notes, setNotes] = useState(w.notes ?? '')
  const [day, setDay] = useState(w.scheduled_on ?? '')
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    const m = minutes.trim() === '' ? null : Number(minutes.trim().replace(',', '.'))
    if (m !== null && Number.isNaN(m)) return setErr('Durée invalide.')
    if (!isIsoDate(day)) return setErr('Jour invalide.')
    const parsed = WorkoutInputSchema.safeParse({
      title, quality: quality || null, planned_minutes: m, notes: notes.trim() || null,
    })
    if (!parsed.success) return setErr(parsed.error.issues[0].message)
    setBusy(true)
    try {
      await onSave({ ...parsed.data, scheduled_on: day })
    } catch (x) {
      setErr(errMsg(x))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2 text-sm">
      <input className={INPUT} value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Titre" />
      <QualitySelect value={quality} onChange={setQuality} />
      <div className="grid grid-cols-2 gap-1">
        <input className={INPUT} value={minutes} inputMode="numeric" placeholder="Durée (min)"
          aria-label="Durée prévue en minutes" onChange={(e) => setMinutes(e.target.value)} />
        <input type="date" className={INPUT} value={day} aria-label="Jour"
          onChange={(e) => setDay(e.target.value)} />
      </div>
      <textarea className={INPUT} rows={2} value={notes} placeholder="Note"
        onChange={(e) => setNotes(e.target.value)} />
      {err && <p role="alert" className="text-xs text-red-600">{err}</p>}
      <div className="flex flex-wrap gap-2">
        <button disabled={busy} className="rounded bg-slate-900 px-3 py-1 text-white disabled:opacity-50">
          Enregistrer
        </button>
        <button type="button" onClick={onCancel} className="rounded border px-3 py-1">Annuler</button>
        <button
          type="button"
          disabled={busy}
          className="ml-auto rounded border px-3 py-1 text-red-600"
          onClick={async () => {
            if (!window.confirm(`Supprimer la séance « ${w.title} » ?`)) return
            setErr(null)
            try { await onDelete() } catch (x) { setErr(errMsg(x)) }
          }}
        >
          Supprimer
        </button>
      </div>
    </form>
  )
}

function Card({
  w, editable, editing, onEdit, onSave, onDelete, onCancel,
}: {
  w: Workout
  editable: boolean
  editing: boolean
  onEdit: () => void
  onSave: (patch: WorkoutPatch) => Promise<void>
  onDelete: () => Promise<void>
  onCancel: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: w.id,
    disabled: editing || !editable,
  })
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  if (editing && editable) {
    return (
      <div ref={setNodeRef} className="rounded border bg-white p-2">
        <EditForm w={w} onSave={onSave} onDelete={onDelete} onCancel={onCancel} />
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded border bg-slate-50 p-2 text-sm ${isDragging ? 'relative z-20 opacity-80 shadow-lg' : ''}`}
    >
      <div className="flex items-start gap-1">
        {editable ? (
          <>
            <button
              type="button"
              {...listeners}
              {...attributes}
              aria-label="Déplacer la séance"
              className="cursor-grab touch-none px-1 text-slate-400"
            >
              ⠿
            </button>
            <button type="button" onClick={onEdit} className="flex-1 text-left font-medium">
              {w.title}
            </button>
          </>
        ) : (
          <span className="flex-1 font-medium">{w.title}</span>
        )}
      </div>
      <div className="mt-1 flex flex-wrap gap-1 text-xs">
        {w.quality && (
          <span className={`rounded px-1.5 py-0.5 ${QUALITY_STYLE[w.quality]}`}>
            {QUALITY_LABEL[w.quality]}
          </span>
        )}
        {w.planned_minutes !== null && <span className="text-slate-500">{w.planned_minutes} min</span>}
      </div>
      {w.notes && <p className="mt-1 line-clamp-2 text-xs text-slate-500">{w.notes}</p>}
           {w.athlete_id && (
        <Link to={`/athletes/${w.athlete_id}/semaine/${w.id}`} className="mt-1 inline-block text-xs underline">
          Ouvrir la séance
        </Link>
      )} 
      {!editable && <p className="mt-1 text-xs text-slate-400">Lecture seule</p>}
    </div>
  )
}

function DayColumn({ day, today, children }: { day: string; today: boolean; children: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: day })
  const label = parseISO(day).toLocaleDateString('fr-FR', {
    weekday: 'short', day: '2-digit', month: '2-digit',
  })
  return (
    <div
      ref={setNodeRef}
      className={`min-h-48 space-y-2 rounded-lg border p-2 ${isOver ? 'border-blue-300 bg-blue-50' : 'bg-white'}`}
    >
      <p className={`text-xs uppercase ${today ? 'font-bold text-blue-700' : 'text-slate-500'}`}>{label}</p>
      {children}
    </div>
  )
}

export default function WeekBoard({
  athleteId, organizationId, monday, workouts, canCreate,
}: {
  athleteId: string
  organizationId: string
  monday: string
  workouts: Workout[]
  canCreate: boolean
}) {
  const userId = useAuth().session?.user.id
  const add = useAddWorkout()
  const update = useUpdateWorkout()
  const del = useDeleteWorkout()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const days = weekDays(monday)
  const today = toISO(new Date())

  const addTo = (day: string) => async (title: string, quality: Quality | null) => {
    setErr(null)
    const parsed = WorkoutInputSchema.safeParse({ title, quality, planned_minutes: null, notes: null })
    if (!parsed.success) {
      setErr(parsed.error.issues[0].message)
      throw new Error('invalid')
    }
    try {
      await add.mutateAsync({ athleteId, organizationId, day, input: parsed.data })
    } catch (x) {
      setErr(errMsg(x))
      throw x
    }
  }

  const onDragEnd = (e: DragEndEvent) => {
    const day = e.over ? String(e.over.id) : null
    const w = workouts.find((x) => x.id === e.active.id)
    if (!w || w.created_by !== userId || !day || day === w.scheduled_on || !days.includes(day)) return
    setErr(null)
    update.mutate({ id: w.id, patch: { scheduled_on: day } }, { onError: (x) => setErr(errMsg(x)) })
  }

  return (
    <div className="space-y-2">
      {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
      <div className="overflow-x-auto">
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <div className="grid min-w-[60rem] grid-cols-7 gap-2">
            {days.map((day) => (
              <DayColumn key={day} day={day} today={day === today}>
                {workouts
                  .filter((w) => w.scheduled_on === day)
                  .map((w) => (
                    <Card
                      key={w.id}
                      w={w}
                      editable={w.created_by === userId}
                      editing={editingId === w.id}
                      onEdit={() => setEditingId(w.id)}
                      onCancel={() => setEditingId(null)}
                      onSave={async (patch) => {
                        await update.mutateAsync({ id: w.id, patch })
                        setEditingId(null)
                      }}
                      onDelete={async () => {
                        await del.mutateAsync(w.id)
                        setEditingId(null)
                      }}
                    />
                  ))}
                {canCreate && <QuickAdd onAdd={addTo(day)} />}
              </DayColumn>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  )
}
