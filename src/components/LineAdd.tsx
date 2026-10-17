import { useMemo, useRef, useState, type FormEvent } from 'react'
import { useAddExercise } from '../athletes/builder'
import type { ExerciseOption } from '../athletes/references'
import type { BlockKind } from '../domain/block'
import { courseFromFields, defaultCourseFields, latestMas, type CourseFields } from '../domain/course'
import { defaultLibreFields, libreFromFields, type LibreFields } from '../domain/libre'
import { lineProfile } from '../domain/lineProfile'
import { defaultMobilityFields, mobilityFromFields, type MobilityFields } from '../domain/mobility'
import { MODE_LABEL, NO_EXERCISE, POOLS, modeForMovement, type LineMode } from '../domain/modes'
import { defaultPowerFields, powerFromFields, type PowerFields } from '../domain/power'
import type { ReferenceValue } from '../domain/prescription'
import { defaultFields, fromFields, latestOneRm, type ForceFields } from '../domain/prescriptionFields'
import { defaultRecoveryFields, recoveryFromFields, type RecoveryFields } from '../domain/recovery'
import type { Reference } from '../domain/reference'
import { errMsg } from '../lib/errors'
import { COURSE_GRID, CourseCells, CourseHeader, courseAbs } from './CourseFields'
import { absText, CELL, FieldCells, FieldsHeader, GRID } from './ExerciseFields'
import { LIBRE_GRID, LibreCells, LibreHeader } from './LibreFields'
import { MOB_GRID, MobilityCells, MobilityHeader } from './MobilityFields'
import { POWER_GRID, PowerCells, PowerHeader, powerAbs } from './PowerFields'
import { REC_GRID, RecoveryCells, RecoveryHeader } from './RecoveryFields'

const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const FIRST: Record<LineMode, string> = {
  force: 'input[aria-label="Séries"]',
  puissance: 'input[aria-label="Séries"]',
  course: 'input[aria-label="Nombre de répétitions"]',
  mobilite: 'input[aria-label="Durée"]',
  recuperation: 'select[aria-label="Modalité"]',
  libre: 'input[aria-label="Consigne"]',
}
const SEARCH = 'input[aria-label="Exercice"]'

export function gridFor(mode: LineMode): string {
  switch (mode) {
    case 'course': return COURSE_GRID
    case 'mobilite': return MOB_GRID
    case 'puissance': return POWER_GRID
    case 'recuperation': return REC_GRID
    case 'libre': return LIBRE_GRID
    default: return GRID
  }
}

export function ModeHeader({ type }: { type: LineMode }) {
  switch (type) {
    case 'course': return <CourseHeader />
    case 'mobilite': return <MobilityHeader />
    case 'puissance': return <PowerHeader />
    case 'recuperation': return <RecoveryHeader />
    case 'libre': return <LibreHeader />
    default: return <FieldsHeader />
  }
}

export function LineAdd({
  blockId, blockKind, organizationId, quality, nextPosition, exercises, refs, refValues, lastType,
}: {
  blockId: string; blockKind: BlockKind; organizationId: string; quality: string | null; nextPosition: number
  exercises: ExerciseOption[]; refs: Reference[]; refValues: ReferenceValue[]
  lastType: LineMode | null
}) {
  const add = useAddExercise()
  const profile = lineProfile(quality)
  const sessionMode: LineMode = profile?.mode ?? 'force'
  const [override, setOverride] = useState<LineMode | null>(null)
  const [allExercises, setAllExercises] = useState(false)
  const selected: LineMode = override ?? sessionMode
  const direct = NO_EXERCISE.includes(selected)
  const movements = POOLS[selected]
  const pool = useMemo(
    () => (movements ? exercises.filter((e) => movements.includes(e.movement_slug ?? '')) : exercises),
    [movements, exercises],
  )
  const dropdown = !direct && !!movements && !allExercises && pool.length > 0
  const suggestion = (): ExerciseOption | null => {
    const name = override === null ? profile?.suggestion[blockKind] : undefined
    return (dropdown && name ? pool.find((e) => e.name === name) : undefined) ?? null
  }
  const modeFor = (slug: string | null): LineMode => {
    const m = modeForMovement(slug)
    return m === 'force' && selected === 'puissance' ? 'puissance' : m
  }

  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<ExerciseOption | null>(suggestion)
  const [ff, setFf] = useState<ForceFields>(defaultFields(false))
  const [pf, setPf] = useState<PowerFields>(defaultPowerFields())
  const [cf, setCf] = useState<CourseFields>(defaultCourseFields())
  const [mf, setMf] = useState<MobilityFields>(defaultMobilityFields())
  const [rf, setRf] = useState<RecoveryFields>(defaultRecoveryFields())
  const [lf, setLf] = useState<LibreFields>(defaultLibreFields())
  const [err, setErr] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const focus = (selector: string) => formRef.current?.querySelector<HTMLElement>(selector)?.focus()

  const mode: LineMode = direct
    ? selected
    : dropdown
      ? selected
      : picked
        ? modeFor(picked.movement_slug)
        : selected === 'puissance' ? 'puissance' : 'force'
  const allowPace = picked ? picked.movement_slug === 'running' : true
  const oneRm = picked && (mode === 'force' || mode === 'puissance') ? latestOneRm(refs, picked.id) : undefined
  const mas = latestMas(refs)

  const matches = useMemo(() => {
    const n = normalize(q.trim())
    if (direct || dropdown || !n || picked) return []
    return exercises.filter((e) => normalize(e.name).includes(n)).slice(0, 6)
  }, [q, picked, exercises, dropdown, direct])

  const pick = (e: ExerciseOption) => {
    setPicked(e)
    setQ(e.name)
    const m: LineMode = dropdown ? selected : modeFor(e.movement_slug)
    if (m === 'course') {
      const running = e.movement_slug === 'running'
      setCf((s) =>
        !running && (s.intensityKind === 'pace' || s.intensityKind === 'percent_mas')
          ? { ...s, intensityKind: 'none', intensityValue: '' }
          : s,
      )
    } else if (m === 'force') {
      setFf((s) => ({ ...s, loadMode: latestOneRm(refs, e.id) ? 'percent' : 'kg', loadValue: '' }))
    }
    setTimeout(() => focus(FIRST[m]), 0)
  }
  const changeType = (m: LineMode) => {
    setOverride(m === sessionMode ? null : m)
    setAllExercises(false)
    setPicked(null)
    setQ('')
    setErr(null)
    if (NO_EXERCISE.includes(m)) setTimeout(() => focus(FIRST[m]), 0)
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
    if (!direct && !picked) return setErr('Choisissez un exercice.')
    const res =
      mode === 'course' ? courseFromFields(cf, mas?.id ?? null)
      : mode === 'mobilite' ? mobilityFromFields(mf)
      : mode === 'puissance' ? powerFromFields(pf, oneRm?.id ?? null)
      : mode === 'recuperation' ? recoveryFromFields(rf)
      : mode === 'libre' ? libreFromFields(lf)
      : fromFields(ff, oneRm?.id ?? null)
    if (!res.ok) return setErr(res.error)
    try {
      await add.mutateAsync({
        blockId, organizationId, exerciseId: direct ? null : picked?.id ?? null,
        position: nextPosition, prescription: res.value,
      })
      setQ('')
      setFf(defaultFields(false)); setPf(defaultPowerFields()); setCf(defaultCourseFields())
      setMf(defaultMobilityFields()); setRf(defaultRecoveryFields()); setLf(defaultLibreFields())
      setPicked(suggestion())
      setTimeout(() => focus(direct || dropdown ? FIRST[mode] : SEARCH), 0)
    } catch (x) {
      setErr(errMsg(x))
    }
  }

  const showHeader = lastType !== mode

  return (
    <div className="mt-2">
      <div className="mb-1 flex items-center gap-3 text-xs text-slate-500">
        <label className="flex items-center gap-1">
          Type de ligne
          <select
            aria-label="Type de ligne" className="rounded border px-1 py-0.5 text-xs" value={selected}
            onChange={(e) => changeType(e.target.value as LineMode)}
          >
            {(Object.keys(MODE_LABEL) as LineMode[]).map((m) => <option key={m} value={m}>{MODE_LABEL[m]}</option>)}
          </select>
        </label>
        {movements && !direct && (
          <button type="button" className="underline" onClick={toggleAll}>
            {allExercises ? 'Exercices du type' : 'Tous les exercices'}
          </button>
        )}
      </div>
      {showHeader && <ModeHeader type={mode} />}
      <form ref={formRef} onSubmit={submit} className={gridFor(mode)}>
        <span />
        {direct ? null : dropdown ? (
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
        ) : mode === 'mobilite' ? (
          <MobilityCells f={mf} set={(patch) => setMf({ ...mf, ...patch })} disabled={false} blurOnEnter={false} />
        ) : mode === 'puissance' ? (
          <PowerCells
            f={pf} set={(patch) => setPf({ ...pf, ...patch })} percentAvailable={!!oneRm}
            abs={powerAbs(pf, oneRm?.id ?? null, refValues)} disabled={false} blurOnEnter={false}
          />
        ) : mode === 'recuperation' ? (
          <RecoveryCells f={rf} set={(patch) => setRf({ ...rf, ...patch })} disabled={false} blurOnEnter={false} />
        ) : mode === 'libre' ? (
          <LibreCells f={lf} set={(patch) => setLf({ ...lf, ...patch })} disabled={false} blurOnEnter={false} />
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
      {err && <p role="alert" className="mt-1 text-sm text-red-600">{err}</p>}
    </div>
  )
}