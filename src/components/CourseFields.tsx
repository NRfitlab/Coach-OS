import ExerciseInfoButton from './ExerciseInfoButton'
import { useState, type FocusEvent, type KeyboardEvent } from 'react'
import { useDeleteExercise, useUpdateExercise, type ExerciseData } from '../athletes/builder'
import {
  courseFromFields, courseOf, courseToFields, latestMas, percentMasText,
  type CourseFields, type IntensityKind, type RecoveryKind, type TargetUnit,
} from '../domain/course'
import type { ReferenceValue } from '../domain/prescription'
import type { Reference } from '../domain/reference'
import { errMsg } from '../lib/errors'
import { CELL } from './ExerciseFields'
import { CodeCell } from './ModeBadge'

export const COURSE_GRID =
  'grid grid-cols-[6rem_minmax(9rem,1fr)_4rem_9rem_15rem_17rem_6rem] items-start gap-2'

const PLACEHOLDER: Record<IntensityKind, string> = {
  none: '', pace: '3:55', speed: '15.3', percent_mas: '105', hr: '165', rpe: '8',
}

export function CourseHeader() {
  return (
    <div className={`${COURSE_GRID} pb-1 text-xs text-slate-500`}>
      <span /><span>Exercice</span><span>Reps</span><span>Distance / durée</span><span>Intensité</span><span>Récup</span><span />
    </div>
  )
}

export function courseAbs(f: CourseFields, refId: string | null, refs: ReferenceValue[]): string {
  if (f.intensityKind !== 'percent_mas' || !refId) return ''
  const v = Number(f.intensityValue.replace(',', '.'))
  if (!Number.isFinite(v) || v <= 0) return ''
  return percentMasText(v, refId, refs)
}

export function CourseCells({ f, set, masAvailable, allowPace, abs, disabled, blurOnEnter }: {
  f: CourseFields
  set: (patch: Partial<CourseFields>) => void
  masAvailable: boolean
  allowPace: boolean
  abs: string
  disabled: boolean
  blurOnEnter: boolean
}) {
  const enter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (blurOnEnter && e.key === 'Enter') e.currentTarget.blur()
  }
  const hasIntensity = f.intensityKind !== 'none'
  const hasRecovery = f.recoveryKind !== 'none'
  return (
    <>
      <input aria-label="Nombre de répétitions" inputMode="numeric" className={CELL} disabled={disabled}
        value={f.repeats} onChange={(e) => set({ repeats: e.target.value })} onKeyDown={enter} />
      <div className="flex gap-1">
        <input aria-label="Distance ou durée" inputMode="decimal" placeholder="800" className={CELL} disabled={disabled}
          value={f.targetValue} onChange={(e) => set({ targetValue: e.target.value })} onKeyDown={enter} />
        <select aria-label="Unité" className="w-16 rounded border px-1 py-1 text-sm" disabled={disabled}
          value={f.targetUnit} onChange={(e) => set({ targetUnit: e.target.value as TargetUnit })}>
          <option value="m">m</option>
          <option value="km">km</option>
          <option value="min">min</option>
        </select>
      </div>
      <div>
        <div className="flex gap-1">
          <select aria-label="Type d'intensité" className={`${CELL} ${hasIntensity ? 'w-28' : ''}`} disabled={disabled}
            value={f.intensityKind}
            onChange={(e) => set({ intensityKind: e.target.value as IntensityKind, intensityValue: '' })}>
            <option value="none">Aucune</option>
            {allowPace && <option value="pace">Allure /km</option>}
            <option value="speed">km/h</option>
            {allowPace && <option value="percent_mas" disabled={!masAvailable}>% VMA</option>}
            <option value="hr">FC bpm</option>
            <option value="rpe">RPE</option>
          </select>
          {hasIntensity && (
            <input aria-label="Intensité" placeholder={PLACEHOLDER[f.intensityKind]} className={CELL} disabled={disabled}
              value={f.intensityValue} onChange={(e) => set({ intensityValue: e.target.value })} onKeyDown={enter} />
          )}
        </div>
        {abs && <p className="mt-0.5 text-xs text-slate-500">{abs}</p>}
      </div>
      <div className="flex gap-1">
        <select aria-label="Type de récupération" className={`${CELL} ${hasRecovery ? 'w-24' : ''}`} disabled={disabled}
          value={f.recoveryKind}
          onChange={(e) => set({ recoveryKind: e.target.value as RecoveryKind, recoverySpeed: '' })}>
          <option value="none">Aucune</option>
          <option value="ef">EF</option>
          <option value="active">Active</option>
          <option value="walk">Marche</option>
          <option value="rest">Arrêt</option>
        </select>
        {hasRecovery && (
          <input aria-label="Durée de récupération" placeholder="2:00" className={CELL} disabled={disabled}
            value={f.recoveryValue} onChange={(e) => set({ recoveryValue: e.target.value })} onKeyDown={enter} />
        )}
        {f.recoveryKind === 'active' && (
          <input aria-label="Vitesse de récupération" placeholder="km/h" inputMode="decimal" className={CELL} disabled={disabled}
            value={f.recoverySpeed} onChange={(e) => set({ recoverySpeed: e.target.value })} onKeyDown={enter} />
        )}
      </div>
    </>
  )
}

export function CourseLine({ code, ex, name, refs, refValues, canEdit, allowPace }: {
  code: string; ex: ExerciseData; name: string; refs: Reference[]; refValues: ReferenceValue[]
  canEdit: boolean; allowPace: boolean
}) {
  const upd = useUpdateExercise()
  const del = useDeleteExercise()
  const p = courseOf(ex.prescription)
  const i = p?.intensity
  const stored = i && i.unit === 'percent_mas' ? i.referenceId : null
  const refId = stored ?? latestMas(refs)?.id ?? null
  const [initial] = useState<CourseFields | null>(() => (p ? courseToFields(p) : null))
  const [f, setF] = useState<CourseFields | null>(initial)
  const [err, setErr] = useState<string | null>(null)
  const dirty = !!f && JSON.stringify(f) !== JSON.stringify(initial)

  const save = async () => {
    if (!p || !f || !dirty || upd.isPending) return
    const res = courseFromFields(f, refId, p)
    if (!res.ok) { setErr(res.error); return }
    setErr(null)
    try {
      await upd.mutateAsync({ id: ex.id, prescription: res.value })
    } catch (x) {
      setErr(errMsg(x))
    }
  }
  const onBlur = (e: FocusEvent<HTMLLIElement>) => {
    if (e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) return
    void save()
  }

  if (!p || !f) return null

  return (
    <li className="border-t py-1 text-sm" onBlur={onBlur}>
      <div className={COURSE_GRID}>
        <CodeCell code={code} mode="course" />
        <span className="pt-1 font-medium">{name} {ex.exercise_id && <ExerciseInfoButton exerciseId={ex.exercise_id} />}</span>
        <CourseCells
          f={f} set={(patch) => setF({ ...f, ...patch })} masAvailable={!!refId} allowPace={allowPace}
          abs={courseAbs(f, refId, refValues)} disabled={!canEdit} blurOnEnter
        />
        {canEdit ? (
          <button type="button" className="pt-1 text-left text-red-600" onClick={() => del.mutate(ex.id)}>Supprimer</button>
        ) : <span />}
      </div>
      {(err || del.isError) && <p role="alert" className="mt-1 text-red-600">{err ?? errMsg(del.error)}</p>}
      {dirty && !err && <p className="mt-1 text-xs text-slate-400">Modifié : enregistré en quittant la ligne.</p>}
    </li>
  )
}