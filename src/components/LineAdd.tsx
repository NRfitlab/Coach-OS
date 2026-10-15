import { useMemo, useRef, useState, type FormEvent } from 'react'
import { useAddExercise } from '../athletes/builder'
import type { ExerciseOption } from '../athletes/references'
import type { BlockKind } from '../domain/block'
import { courseFromFields, defaultCourseFields, latestMas, type CourseFields } from '../domain/course'
import { lineProfile, type LineMode } from '../domain/lineProfile'
import type { ReferenceValue } from '../domain/prescription'
import { defaultFields, fromFields, latestOneRm, type ForceFields } from '../domain/prescriptionFields'
import type { Reference } from '../domain/reference'
import { errMsg } from '../lib/errors'
import { COURSE_GRID, CourseCells, CourseHeader, courseAbs } from './CourseFields'
import { absText, CELL, FieldCells, FieldsHeader, GRID } from './ExerciseFields'

const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const REPS_COURSE = 'input[aria-label="Nombre de répétitions"]'

export function LineAdd({
  blockId, blockKind, organizationId, quality, nextPosition, exercises, refs, refValues, lastType,
}: {
  blockId: string; blockKind: BlockKind; organizationId: string; quality: string | null; nextPosition: number
  exercises: ExerciseOption[]; refs: Reference[]; refValues: ReferenceValue[]
  lastType: LineMode | null
}) {
  const add = useAddExercise()
  const profile = lineProfile(quality)
  const [allExercises, setAllExercises] = useState(false)
  const restricted = !!profile && !allExercises
  const pool = useMemo(() => {
    const p = lineProfile(quality)
    return p && !allExercises ? exercises.filter((e) => p.movements.includes(e.movement_slug ?? '')) : exercises
  }, [quality, allExercises, exercises])
  const suggestion = (): ExerciseOption | null => {
    const name = profile?.suggestion[blockKind]
    return (restricted && name ? pool.find((e) => e.name === name) : undefined) ?? null
  }

  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<ExerciseOption | null>(suggestion)
  const [ff, setFf] = useState<ForceFields>(defaultFields(false))
  const [cf, setCf] = useState<CourseFields>(defaultCourseFields())
  const [err, setErr] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const focus = (selector: string) => formRef.current?.querySelector<HTMLElement>(selector)?.focus()

  const mode: LineMode = restricted && profile ? profile.mode : picked?.movement_slug === 'running' ? 'course' : 'force'
  const allowPace = picked ? picked.movement_slug === 'running' : true
  const oneRm = picked && mode === 'force' ? latestOneRm(refs, picked.id) : undefined
  const mas = latestMas(refs)

  const matches = useMemo(() => {
    const n = normalize(q.trim())
    if (restricted || !n || picked) return []
    return pool.filter((e) => normalize(e.name).includes(n)).slice(0, 6)
  }, [q, picked, pool, restricted])

  const pick = (e: ExerciseOption) => {
    setPicked(e)
    setQ(e.name)
    const running = e.movement_slug === 'running'
    if (restricted || running) {
      setCf((s) =>
        !running && (s.intensityKind === 'pace' || s.intensityKind === 'percent_mas')
          ? { ...s, intensityKind: 'none', intensityValue: '' }
          : s,
      )
      setTimeout(() => focus(REPS_COURSE), 0)
    } else {
      setFf((s) => ({ ...s, loadMode: latestOneRm(refs, e.id) ? 'percent' : 'kg', loadValue: '' }))
      setTimeout(() => focus('input[aria-label="Séries"]'), 0)
    }
  }
  const toggleAll = () => {
    setAllExercises((v) => !v)
    setPicked(null)
    setQ('')
    setErr(null)
  }
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (!picked) return setErr('Choisissez un exercice.')
    const res = mode === 'course' ? courseFromFields(cf, mas?.id ?? null) : fromFields(ff, oneRm?.id ?? null)
    if (!res.ok) return setErr(res.error)
    try {
      await add.mutateAsync({
        blockId, organizationId, exerciseId: picked.id, position: nextPosition, prescription: res.value,
      })
      setQ(''); setFf(defaultFields(false)); setCf(defaultCourseFields())
      setPicked(suggestion())
      setTimeout(() => focus(restricted ? REPS_COURSE : 'input[aria-label="Exercice"]'), 0)
    } catch (x) {
      setErr(errMsg(x))
    }
  }

  const showHeader = lastType !== mode

  return (
    <div className="mt-2">
      {showHeader && (mode === 'course' ? <CourseHeader /> : <FieldsHeader />)}
      <form ref={formRef} onSubmit={submit} className={mode === 'course' ? COURSE_GRID : GRID}>
        <span />
        {restricted ? (
          <select
            aria-label="Exercice" className={CELL} value={picked?.id ?? ''}
            onChange={(e) => {
              const x = pool.find((p) => p.id === e.target.value)
              if (x) pick(x)
              else setPicked(null)
            }}
          >
            <option value="">Choisir un exercice</option>
            {pool.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        ) : (
          <input
            aria-label="Exercice" placeholder="Exercice (recherche)" className={CELL} value={q}
            onChange={(e) => { setQ(e.target.value); setPicked(null) }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !picked && matches[0]) { e.preventDefault(); pick(matches[0]) }
            }}
          />
        )}
        {mode === 'course' ? (
          <CourseCells
            f={cf} set={(patch) => setCf({ ...cf, ...patch })} masAvailable={!!mas} allowPace={allowPace}
            abs={courseAbs(cf, mas?.id ?? null, refValues)} disabled={false} blurOnEnter={false}
          />
        ) : (
          <FieldCells
            f={ff} set={(patch) => setFf({ ...ff, ...patch })} percentAvailable={!!oneRm}
            abs={absText(ff, oneRm?.id ?? null, refValues)} disabled={false} blurOnEnter={false}
          />
        )}
        <button disabled={add.isPending} className="rounded bg-slate-900 px-3 py-1 text-white disabled:opacity-50">
          Ajouter
        </button>
      </form>
      {matches.length > 0 && (
        <ul className="mt-1 w-64 rounded border bg-white text-sm">
          {matches.map((m) => (
            <li key={m.id}>
              <button type="button" className="block w-full px-2 py-1 text-left hover:bg-slate-100" onClick={() => pick(m)}>
                {m.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {profile && (
        <button type="button" className="mt-1 text-xs text-slate-500 underline" onClick={toggleAll}>
          {allExercises ? 'Exercices de la qualité' : 'Tous les exercices'}
        </button>
      )}
      {err && <p role="alert" className="mt-1 text-sm text-red-600">{err}</p>}
    </div>
  )
}