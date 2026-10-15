import { useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { useAthlete } from '../athletes/api'
import {
  useAddBlock, useAddExercise, useDeleteBlock, useDeleteExercise, useUpdateExercise, useWorkoutDetail,
  type DetailData, type ExerciseData,
} from '../athletes/builder'
import { useExercises, useReferences, type ExerciseOption } from '../athletes/references'
import { useAuth } from '../auth/context'
import type { Membership } from '../auth/membership'
import type { Athlete } from '../domain/athlete'
import { BLOCK_KINDS, BLOCK_LABEL } from '../domain/block'
import { prescriptionSchema, type ForcePrescription, type ReferenceValue } from '../domain/prescription'
import {
  describeForce, estimatedSeconds, FORCE_SYNTAX, parseForce, prescriptionToText,
} from '../domain/prescriptionText'
import type { Reference } from '../domain/reference'
import { errMsg } from '../lib/errors'
import { formatDate } from '../lib/utils'
import { mondayOf } from '../lib/week'

const INPUT = 'rounded border px-2 py-1 text-sm'
const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const latestOneRm = (refs: Reference[], exerciseId: string) =>
  refs.find((r) => r.kind === 'one_rm' && r.exercise_id === exerciseId)

function forceOf(x: ExerciseData): ForcePrescription | null {
  const r = prescriptionSchema.safeParse(x.prescription)
  return r.success && r.data.mode === 'force' ? r.data : null
}

function Line({ code, ex, name, refs, refValues, canEdit }: {
  code: string; ex: ExerciseData; name: string; refs: Reference[]; refValues: ReferenceValue[]; canEdit: boolean
}) {
  const upd = useUpdateExercise()
  const del = useDeleteExercise()
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const p = forceOf(ex)

  const startEdit = () => {
    if (!p) return
    setText(prescriptionToText(p))
    setErr(null)
    setEditing(true)
  }
  const save = async (e: FormEvent) => {
    e.preventDefault()
    const stored = p?.load.type === 'percent_reference' ? p.load.referenceId : null
    const res = parseForce(text, stored ?? latestOneRm(refs, ex.exercise_id)?.id ?? null)
    if (!res.ok) return setErr(res.error)
    try {
      await upd.mutateAsync({ id: ex.id, prescription: res.value })
      setEditing(false)
    } catch (x) {
      setErr(errMsg(x))
    }
  }

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b py-1 text-sm">
      <span className="w-8 font-mono text-slate-500">{code}</span>
      <span className="min-w-40 font-medium">{name}</span>
      {editing ? (
        <form onSubmit={save} className="flex flex-1 gap-2">
          <input autoFocus className={`${INPUT} flex-1 font-mono`} value={text} onChange={(e) => setText(e.target.value)} />
          <button className="rounded bg-slate-900 px-3 py-1 text-white">OK</button>
          <button type="button" className="rounded border px-3 py-1" onClick={() => setEditing(false)}>Annuler</button>
        </form>
      ) : (
        <button disabled={!canEdit || !p} onClick={startEdit} className="text-left font-mono disabled:cursor-default">
          {p ? describeForce(p, refValues) : `Mode « ${String((ex.prescription as { mode?: unknown } | null)?.mode ?? 'inconnu')} » (non modifiable en 4a)`}
        </button>
      )}
      {canEdit && !editing && (
        <button className="ml-auto text-red-600" onClick={() => del.mutate(ex.id)}>Supprimer</button>
      )}
      {(err || del.isError) && (
        <p role="alert" className="w-full text-red-600">{err ?? errMsg(del.error)}</p>
      )}
    </li>
  )
}

function AddLine({ blockId, organizationId, nextPosition, exercises, refs }: {
  blockId: string; organizationId: string; nextPosition: number; exercises: ExerciseOption[]; refs: Reference[]
}) {
  const add = useAddExercise()
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<ExerciseOption | null>(null)
  const [text, setText] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const prescRef = useRef<HTMLInputElement>(null)

  const matches = useMemo(() => {
    const n = normalize(q.trim())
    if (!n || picked) return []
    return exercises.filter((e) => normalize(e.name).includes(n)).slice(0, 6)
  }, [q, picked, exercises])

  const pick = (e: ExerciseOption) => {
    setPicked(e)
    setQ(e.name)
    prescRef.current?.focus()
  }
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (!picked) return setErr('Choisissez un exercice dans la liste.')
    const res = parseForce(text, latestOneRm(refs, picked.id)?.id ?? null)
    if (!res.ok) return setErr(res.error)
    try {
      await add.mutateAsync({
        blockId, organizationId, exerciseId: picked.id, position: nextPosition, prescription: res.value,
      })
      setQ(''); setPicked(null); setText('')
      searchRef.current?.focus()
    } catch (x) {
      setErr(errMsg(x))
    }
  }

  return (
    <form onSubmit={submit} className="mt-2 space-y-1">
      <div className="flex flex-wrap gap-2">
        <input
          ref={searchRef}
          className={`${INPUT} w-64`}
          placeholder="Exercice (recherche)"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPicked(null) }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (matches[0]) pick(matches[0])
            }
          }}
        />
        <input
          ref={prescRef}
          className={`${INPUT} w-64 font-mono`}
          placeholder={FORCE_SYNTAX}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button disabled={add.isPending} className="rounded bg-slate-900 px-3 py-1 text-sm text-white disabled:opacity-50">
          Ajouter
        </button>
      </div>
      {matches.length > 0 && (
        <ul className="w-64 rounded border bg-white text-sm">
          {matches.map((m) => (
            <li key={m.id}>
              <button type="button" className="block w-full px-2 py-1 text-left hover:bg-slate-100" onClick={() => pick(m)}>
                {m.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
    </form>
  )
}

function Builder({ athlete, w, refs, exercises, canEdit }: {
  athlete: Athlete; w: DetailData; refs: Reference[]; exercises: ExerciseOption[]; canEdit: boolean
}) {
  const [secPerRep, setSecPerRep] = useState(3)
  const addBlock = useAddBlock()
  const delBlock = useDeleteBlock()
  const names = useMemo(() => new Map(exercises.map((e) => [e.id, e.name])), [exercises])
  const refValues: ReferenceValue[] = useMemo(
    () => refs.map((r) => ({
      id: r.id, value: Number(r.value), unit: r.unit, measuredOn: r.measured_on, method: r.method,
    })),
    [refs],
  )
  const blocks = [...w.workout_blocks].sort((a, b) => a.position - b.position)
  const nextBlock = blocks.reduce((m, b) => Math.max(m, b.position), 0) + 1

  let seconds = 0
  let working = 0
  for (const b of blocks) {
    for (const x of b.workout_exercises) {
      const p = forceOf(x)
      if (!p) continue
      seconds += estimatedSeconds(p, secPerRep)
      if (b.kind !== 'warmup') working += p.sets
    }
  }
  const back = `/athletes/${athlete.id}/semaine${w.scheduled_on ? `?s=${mondayOf(w.scheduled_on)}` : ''}`

  return (
    <div className="space-y-4">
      <Link to={back} className="text-sm text-slate-500 underline">← Semaine de {athlete.full_name}</Link>
      <h1 className="text-xl font-semibold">
        {w.title}{w.scheduled_on ? ` · ${formatDate(w.scheduled_on)}` : ''}
      </h1>
      <p className="text-sm text-slate-600">
        Séries de travail : {working} (hors échauffement) · Durée : ≈ {Math.round(seconds / 60)} min (estimé, repos prescrits inclus, hypothèse{' '}
        <input
          type="number" min={1} max={10} value={secPerRep} aria-label="Secondes par répétition"
          onChange={(e) => setSecPerRep(Math.min(10, Math.max(1, Number(e.target.value) || 3)))}
          className="w-14 rounded border px-1"
        />{' '}s par répétition)
      </p>
      {!canEdit && <p className="text-sm text-slate-500">Lecture seule.</p>}
      {blocks.map((b, i) => {
        const letter = String.fromCharCode(65 + i)
        const lines = [...b.workout_exercises].sort((x, y) => x.position - y.position)
        const nextEx = lines.reduce((m, x) => Math.max(m, x.position), 0) + 1
        return (
          <section key={b.id} className="rounded-lg border bg-white p-3">
            <div className="mb-1 flex items-center gap-2">
              <h2 className="font-semibold">{letter} · {BLOCK_LABEL[b.kind]}</h2>
              {b.kind === 'warmup' && <span className="text-xs text-slate-500">hors séries de travail</span>}
              {canEdit && (
                <button
                  className="ml-auto text-sm text-red-600"
                  onClick={() => { if (window.confirm('Supprimer ce bloc et ses exercices ?')) delBlock.mutate(b.id) }}
                >
                  Supprimer le bloc
                </button>
              )}
            </div>
            <ul>
              {lines.map((x, j) => (
                <Line
                  key={x.id} code={`${letter}${j + 1}`} ex={x} name={names.get(x.exercise_id) ?? 'Exercice inconnu'}
                  refs={refs} refValues={refValues} canEdit={canEdit}
                />
              ))}
            </ul>
            {canEdit && (
              <AddLine
                blockId={b.id} organizationId={w.organization_id} nextPosition={nextEx}
                exercises={exercises} refs={refs}
              />
            )}
          </section>
        )
      })}
      {canEdit && (
        <div className="flex flex-wrap gap-2">
          {BLOCK_KINDS.map((k) => (
            <button
              key={k} disabled={addBlock.isPending}
              className="rounded border bg-white px-2 py-1 text-xs disabled:opacity-50"
              onClick={() => addBlock.mutate({ workoutId: w.id, organizationId: w.organization_id, kind: k, position: nextBlock })}
            >
              + {BLOCK_LABEL[k]}
            </button>
          ))}
        </div>
      )}
      {(addBlock.isError || delBlock.isError) && (
        <p role="alert" className="text-sm text-red-600">{errMsg(addBlock.error ?? delBlock.error)}</p>
      )}
    </div>
  )
}

export default function WorkoutBuilder() {
  const { id, workoutId } = useParams()
  const membership = useOutletContext<Membership>()
  const userId = useAuth().session?.user.id
  const athlete = useAthlete(id)
  const detail = useWorkoutDetail(workoutId)
  const refs = useReferences(id ?? '')
  const exercises = useExercises()

  if (athlete.isPending || detail.isPending || refs.isPending || exercises.isPending) {
    return <p className="text-slate-500">Chargement…</p>
  }
  const failed = athlete.error ?? detail.error ?? refs.error ?? exercises.error
  if (failed) return <p role="alert" className="text-red-600">Erreur : {failed.message}</p>
    if (!refs.data || !exercises.data) return <p className="text-slate-500">Chargement…</p>
  if (!athlete.data || !detail.data || detail.data.athlete_id !== id) {
    return (
      <div className="space-y-2">
        <p>Séance introuvable ou accès refusé.</p>
        <Link to="/athletes" className="underline">Retour à la liste</Link>
      </div>
    )
  }
  const a = athlete.data
  const canEdit =
    detail.data.created_by === userId &&
    (membership.role === 'admin' || (membership.role === 'coach' && a.coach_id === userId))

  return <Builder athlete={a} w={detail.data} refs={refs.data} exercises={exercises.data} canEdit={canEdit} />
}