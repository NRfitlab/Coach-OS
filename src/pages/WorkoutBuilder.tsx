import ExerciseInfoButton from '../components/ExerciseInfoButton'
import { ModeBadge } from '../components/ModeBadge'
import { Fragment, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import {
  DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAthlete } from '../athletes/api'
import {
  useAddBlock, useAddExercise, useDeleteBlock, useDeleteExercise, useReorderBlocks, useUpdateExercise,
  useWorkoutDetail, type BlockData, type DetailData, type ExerciseData,
} from '../athletes/builder'
import { useExercises, useReferences, type ExerciseOption } from '../athletes/references'
import { useAuth } from '../auth/context'
import type { Membership } from '../auth/membership'
import { BlockContext } from '../components/BlockContext'
import { CourseLine } from '../components/CourseFields'
import { FieldsLine } from '../components/ExerciseFields'
import { LibreLine } from '../components/LibreFields'
import { LineAdd, ModeHeader } from '../components/LineAdd'
import { MobilityLine } from '../components/MobilityFields'
import { PowerLine } from '../components/PowerFields'
import { RecoveryLine } from '../components/RecoveryFields'
import type { Athlete } from '../domain/athlete'
import { BLOCK_KINDS, BLOCK_LABEL, blockKindsFor } from '../domain/block'
import { contextOf } from '../domain/blockContext'
import { courseOf, courseTotals, parseClock } from '../domain/course'
import { describeLine } from '../domain/describe'
import { libreOf, libreSeconds } from '../domain/libre'
import { mobilityOf, mobilitySeconds } from '../domain/mobility'
import { modeForMovement, modeOf, type LineMode } from '../domain/modes'
import { powerOf, powerSeconds } from '../domain/power'
import type { ReferenceValue } from '../domain/prescription'
import { forceOfPrescription, latestOneRm } from '../domain/prescriptionFields'
import {
  describeForce, estimatedSeconds, FORCE_SYNTAX, parseForce, prescriptionToText,
} from '../domain/prescriptionText'
import { recoveryOf, recoverySeconds } from '../domain/recovery'
import type { Reference } from '../domain/reference'
import { errMsg } from '../lib/errors'
import { formatDate } from '../lib/utils'
import { mondayOf } from '../lib/week'

type View = 'fields' | 'text'
const VIEW_KEY = 'coachos.builderView'
const INPUT = 'rounded border px-2 py-1 text-sm'
const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const forceOf = (x: ExerciseData) => forceOfPrescription(x.prescription)
const typeOf = (x: ExerciseData): LineMode => modeOf(x.prescription)

function readView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === 'text' ? 'text' : 'fields'
  } catch {
    return 'fields'
  }
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
  const other = p ? null : describeLine(ex.prescription, refValues)

  const startEdit = () => {
    if (!p) return
    setText(prescriptionToText(p))
    setErr(null)
    setEditing(true)
  }
  const save = async (e: FormEvent) => {
    e.preventDefault()
    const stored = p?.load.type === 'percent_reference' ? p.load.referenceId : null
    const oneRm = ex.exercise_id ? latestOneRm(refs, ex.exercise_id) : undefined
    const res = parseForce(text, stored ?? oneRm?.id ?? null, p ?? undefined)
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
      <span className="flex w-24 items-center gap-1"><span className="font-mono text-slate-500">{code}</span><ModeBadge mode={typeOf(ex)} /></span>
      <span className="min-w-40 font-medium">{name} {ex.exercise_id && <ExerciseInfoButton exerciseId={ex.exercise_id} />}</span>
      {editing ? (
        <form onSubmit={save} className="flex flex-1 gap-2">
          <input autoFocus className={`${INPUT} flex-1 font-mono`} value={text} onChange={(e) => setText(e.target.value)} />
          <button className="rounded bg-slate-900 px-3 py-1 text-white">OK</button>
          <button type="button" className="rounded border px-3 py-1" onClick={() => setEditing(false)}>Annuler</button>
        </form>
      ) : (
        <button disabled={!canEdit || !p} onClick={startEdit} className="text-left font-mono disabled:cursor-default">
          {p
            ? describeForce(p, refValues)
            : other
              ? `${other} (modifiable en vue Champs)`
              : `Mode « ${String((ex.prescription as { mode?: unknown } | null)?.mode ?? 'inconnu')} » (non modifiable ici)`}
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
    if (modeForMovement(picked.movement_slug) !== 'force') {
      return setErr('Les lignes de course et de mobilité se saisissent en vue Champs.')
    }
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

function BlockSection({
  b, letter, organizationId, quality, names, exercises, refs, refValues, canEdit, view, onDelete,
}: {
  b: BlockData; letter: string; organizationId: string; quality: string | null; names: Map<string, string>
  exercises: ExerciseOption[]; refs: Reference[]; refValues: ReferenceValue[]
  canEdit: boolean; view: View; onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: b.id,
    disabled: !canEdit,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const runningIds = new Set(exercises.filter((e) => e.movement_slug === 'running').map((e) => e.id))
  const lines = [...b.workout_exercises].sort((x, y) => x.position - y.position)
  const nextEx = lines.reduce((m, x) => Math.max(m, x.position), 0) + 1
  const last = lines[lines.length - 1]
  const lastType: LineMode | null = last ? typeOf(last) : null
  const showContext = quality === 'mobility' || lines.some((x) => typeOf(x) === 'mobilite')
  let prev: LineMode | null = null

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={`overflow-x-auto rounded-lg border bg-white p-3 ${isDragging ? 'relative z-20 opacity-80 shadow-lg' : ''}`}
    >
      <div className="mb-1 flex items-center gap-2">
        {canEdit && (
          <button
            type="button" {...attributes} {...listeners} aria-label="Déplacer le bloc"
            className="cursor-grab touch-none px-1 text-slate-400"
          >
            ⠿
          </button>
        )}
        <h2 className="font-semibold">{letter} · {BLOCK_LABEL[b.kind]}</h2>
        {b.kind === 'warmup' && <span className="text-xs text-slate-500">hors séries de travail</span>}
        {showContext && (canEdit || contextOf(b.params)) && (
          <BlockContext blockId={b.id} params={b.params} canEdit={canEdit} />
        )}
        {canEdit && (
          <button className="ml-auto text-sm text-red-600" onClick={onDelete}>Supprimer le bloc</button>
        )}
      </div>
      <ul>
        {lines.map((x, j) => {
          const type = typeOf(x)
          const head = view === 'fields' && type !== prev
          prev = type
          const code = `${letter}${j + 1}`
          const name = x.exercise_id ? (names.get(x.exercise_id) ?? 'Exercice inconnu') : ''
          return (
            <Fragment key={view === 'fields' ? `${x.id}:${JSON.stringify(x.prescription)}` : x.id}>
              {head && <li aria-hidden><ModeHeader type={type} /></li>}
              {view === 'text' ? (
                <Line code={code} ex={x} name={name} refs={refs} refValues={refValues} canEdit={canEdit} />
              ) : type === 'course' ? (
                <CourseLine
                  code={code} ex={x} name={name} refs={refs} refValues={refValues} canEdit={canEdit}
                  allowPace={x.exercise_id ? runningIds.has(x.exercise_id) : false}
                />
              ) : type === 'mobilite' ? (
                <MobilityLine code={code} ex={x} name={name} canEdit={canEdit} />
              ) : type === 'puissance' ? (
                <PowerLine code={code} ex={x} name={name} refs={refs} refValues={refValues} canEdit={canEdit} />
              ) : type === 'recuperation' ? (
                <RecoveryLine code={code} ex={x} canEdit={canEdit} />
              ) : type === 'libre' ? (
                <LibreLine code={code} ex={x} canEdit={canEdit} />
              ) : (
                <FieldsLine code={code} ex={x} name={name} refs={refs} refValues={refValues} canEdit={canEdit} />
              )}
            </Fragment>
          )
        })}
      </ul>
      {canEdit && (view === 'fields' ? (
        <LineAdd
          blockId={b.id} blockKind={b.kind} organizationId={organizationId} quality={quality} nextPosition={nextEx}
          exercises={exercises} refs={refs} refValues={refValues} lastType={lastType}
        />
      ) : (
        <AddLine blockId={b.id} organizationId={organizationId} nextPosition={nextEx} exercises={exercises} refs={refs} />
      ))}
    </section>
  )
}

function Builder({ athlete, w, refs, exercises, canEdit }: {
  athlete: Athlete; w: DetailData; refs: Reference[]; exercises: ExerciseOption[]; canEdit: boolean
}) {
  const [secPerRep, setSecPerRep] = useState(3)
  const [footing, setFooting] = useState('6:00')
  const [view, setView] = useState<View>(readView)
  const [allKinds, setAllKinds] = useState(false)
  const addBlock = useAddBlock()
  const delBlock = useDeleteBlock()
  const reorder = useReorderBlocks()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const names = useMemo(() => new Map(exercises.map((e) => [e.id, e.name])), [exercises])
  const runningIds = useMemo(
    () => new Set(exercises.filter((e) => e.movement_slug === 'running').map((e) => e.id)),
    [exercises],
  )
  const refValues: ReferenceValue[] = useMemo(
    () => refs.map((r) => ({
      id: r.id, value: Number(r.value), unit: r.unit, measuredOn: r.measured_on, method: r.method,
    })),
    [refs],
  )
  const blocks = [...w.workout_blocks].sort((a, b) => a.position - b.position)
  const nextBlock = blocks.reduce((m, b) => Math.max(m, b.position), 0) + 1
  const footingSec = parseClock(footing) ?? 360

  const chooseView = (v: View) => {
    setView(v)
    try { localStorage.setItem(VIEW_KEY, v) } catch { /* stockage indisponible */ }
  }
  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const from = blocks.findIndex((b) => b.id === active.id)
    const to = blocks.findIndex((b) => b.id === over.id)
    if (from < 0 || to < 0) return
    reorder.mutate({
      workoutId: w.id,
      organizationId: w.organization_id,
      order: arrayMove(blocks, from, to).map((b) => ({ id: b.id, kind: b.kind })),
    })
  }

  let seconds = 0
  let working = 0
  let meters = 0
  let distanceEstimated = false
  let hasCourse = false
  let hasMobility = false
  let incomplete = false
  for (const b of blocks) {
    for (const x of b.workout_exercises) {
      const raw = x.prescription
      const p = forceOf(x)
      if (p) {
        seconds += estimatedSeconds(p, secPerRep)
        if (b.kind !== 'warmup') working += p.sets
        continue
      }
      const c = courseOf(raw)
      if (c) {
        hasCourse = true
        const t = courseTotals(c, refValues, footingSec, x.exercise_id ? runningIds.has(x.exercise_id) : false)
        seconds += t.seconds
        meters += t.meters
        if (t.distanceEstimated) distanceEstimated = true
        if (t.incomplete) incomplete = true
        continue
      }
      const m = mobilityOf(raw)
      if (m) {
        hasMobility = true
        seconds += mobilitySeconds(m, secPerRep)
        continue
      }
      const pw = powerOf(raw)
      if (pw) {
        seconds += powerSeconds(pw, secPerRep)
        if (b.kind !== 'warmup') working += pw.sets
        continue
      }
      const rc = recoveryOf(raw)
      if (rc) {
        seconds += recoverySeconds(rc)
        continue
      }
      const lb = libreOf(raw)
      if (lb) seconds += libreSeconds(lb)
    }
  }
  const back = `/athletes/${athlete.id}/semaine${w.scheduled_on ? `?s=${mondayOf(w.scheduled_on)}` : ''}`

  return (
    <div className="space-y-4">
      <Link to={back} className="text-sm text-slate-500 underline">← Semaine de {athlete.full_name}</Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {w.title}{w.scheduled_on ? ` · ${formatDate(w.scheduled_on)}` : ''}
        </h1>
        <div className="ml-auto inline-flex overflow-hidden rounded border text-sm" role="group" aria-label="Affichage">
          {(['fields', 'text'] as const).map((v) => (
            <button
              key={v} type="button" onClick={() => chooseView(v)}
              className={`px-3 py-1 ${view === v ? 'bg-slate-900 text-white' : 'bg-white'}`}
            >
              {v === 'fields' ? 'Champs' : 'Texte'}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-slate-600">
        Séries de travail : {working} (hors échauffement) · Durée : ≈ {Math.round(seconds / 60)} min (estimé, repos et récupérations prescrits inclus, hypothèse{' '}
        <input
          type="number" min={1} max={10} value={secPerRep} aria-label="Secondes par répétition"
          onChange={(e) => setSecPerRep(Math.min(10, Math.max(1, Number(e.target.value) || 3)))}
          className="w-14 rounded border px-1"
        />{' '}s par répétition
        {hasMobility && ', 5 s par respiration'}
        {hasCourse && (
          <>
            {' '}et allure de footing{' '}
            <input
              value={footing} aria-label="Allure de footing (min:sec par km)" onChange={(e) => setFooting(e.target.value)}
              className="w-16 rounded border px-1"
            />{' '}/km
          </>
        )})
      </p>
      {meters > 0 && (
        <p className="text-sm text-slate-600">
          Distance de course : {(meters / 1000).toFixed(1).replace('.', ',')} km{distanceEstimated ? ' (estimé)' : ''}
        </p>
      )}
      {incomplete && (
        <p className="text-sm text-amber-700">
          Durée incomplète : une ligne de vélo, rameur ou ski en distance, sans vitesse, n'est pas comptée.
        </p>
      )}
      {!canEdit && <p className="text-sm text-slate-500">Lecture seule.</p>}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {blocks.map((b, i) => (
              <BlockSection
                key={b.id} b={b} letter={String.fromCharCode(65 + i)} organizationId={w.organization_id}
                quality={w.quality} names={names} exercises={exercises} refs={refs} refValues={refValues}
                canEdit={canEdit} view={view}
                onDelete={() => { if (window.confirm('Supprimer ce bloc et ses exercices ?')) delBlock.mutate(b.id) }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {canEdit && (
        <div className="flex flex-wrap gap-2">
          {(allKinds ? BLOCK_KINDS : blockKindsFor(w.quality)).map((k) => (
            <button
              key={k} disabled={addBlock.isPending}
              className="rounded border bg-white px-2 py-1 text-xs disabled:opacity-50"
              onClick={() => addBlock.mutate({ workoutId: w.id, organizationId: w.organization_id, kind: k, position: nextBlock })}
            >
              + {BLOCK_LABEL[k]}
            </button>
          ))}
          <button
            type="button" className="rounded border border-dashed px-2 py-1 text-xs text-slate-500"
            onClick={() => setAllKinds((v) => !v)}
          >
            {allKinds ? 'Types de la qualité' : 'Tous les types de blocs'}
          </button>
        </div>
      )}
      {(addBlock.isError || delBlock.isError || reorder.isError) && (
        <p role="alert" className="text-sm text-red-600">{errMsg(addBlock.error ?? delBlock.error ?? reorder.error)}</p>
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