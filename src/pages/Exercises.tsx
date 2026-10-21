import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { Membership } from '../auth/membership'
import {
  useExerciseLibrary,
  useExerciseReviews,
  type ExerciseReview,
  type LibraryExercise,
} from '../athletes/exerciseLibrary'
import {
  EQUIPMENT_LABEL,
  EXERCISE_LEVEL_LABEL,
  MOVEMENT_LABEL,
  MUSCLE_LABEL,
  TECHNIQUE_LABEL,
  ZONE_LABEL,
  labelOf,
} from '../domain/exerciseLabels'
import { messageOf } from '../lib/utils'
import ExerciseSheet from '../components/ExerciseSheet'

type Opt = { value: string; label: string }
type ReviewFilter = '' | 'todo' | 'validated'

const EMPTY_ITEMS: LibraryExercise[] = []
const EMPTY_REVIEWS: Record<string, ExerciseReview> = {}

const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function optionsFrom(
  items: LibraryExercise[],
  pick: (e: LibraryExercise) => string[],
  labels: Record<string, string>,
): Opt[] {
  const seen = new Set<string>()
  for (const e of items) for (const v of pick(e)) seen.add(v)
  return [...seen]
    .map((value) => ({ value, label: labelOf(labels, value) }))
    .sort((a, b) => a.label.localeCompare(b.label, 'fr'))
}

function FilterSelect(props: {
  value: string
  onChange: (v: string) => void
  allLabel: string
  options: Opt[]
}) {
  return (
    <select
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      className="rounded border bg-white px-3 py-2 text-sm"
    >
      <option value="">{props.allLabel}</option>
      {props.options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{children}</span>
}

export default function Exercises() {
  const membership = useOutletContext<Membership>()
  const library = useExerciseLibrary()
  const reviewsQuery = useExerciseReviews(membership.organizationId)

  const [query, setQuery] = useState('')
  const [zone, setZone] = useState('')
  const [muscle, setMuscle] = useState('')
  const [equipment, setEquipment] = useState('')
  const [level, setLevel] = useState('')
  const [movement, setMovement] = useState('')
  const [review, setReview] = useState<ReviewFilter>('')
  const [openId, setOpenId] = useState<string | null>(null)

  const items = library.data ?? EMPTY_ITEMS
  const reviews = reviewsQuery.data ?? EMPTY_REVIEWS
  const opened = openId ? items.find((x) => x.id === openId) : undefined

  const index = useMemo(() => {
    const m = new Map<string, string>()
    for (const e of items) m.set(e.id, normalize(`${e.name} ${e.name_fr ?? ''}`))
    return m
  }, [items])

  const zoneOpts = useMemo(() => optionsFrom(items, (e) => e.body_zones, ZONE_LABEL), [items])
  const muscleOpts = useMemo(
    () => optionsFrom(items, (e) => [...e.primary_muscles, ...e.secondary_muscles], MUSCLE_LABEL),
    [items],
  )
  const equipmentOpts = useMemo(() => optionsFrom(items, (e) => e.equipment, EQUIPMENT_LABEL), [items])
  const movementOpts = useMemo(
    () => optionsFrom(items, (e) => (e.movement_slug ? [e.movement_slug] : []), MOVEMENT_LABEL),
    [items],
  )
  const levelOpts: Opt[] = (['beginner', 'intermediate', 'advanced'] as const).map((v) => ({
    value: v,
    label: EXERCISE_LEVEL_LABEL[v],
  }))

  const visible = useMemo(() => {
    const q = normalize(query.trim())
    return items.filter((e) => {
      if (zone && !e.body_zones.includes(zone)) return false
      if (muscle && !e.primary_muscles.includes(muscle) && !e.secondary_muscles.includes(muscle)) return false
      if (equipment && !e.equipment.includes(equipment)) return false
      if (level && e.level !== level) return false
      if (movement && e.movement_slug !== movement) return false
      if (review === 'validated' && !reviews[e.id]) return false
      if (review === 'todo' && reviews[e.id]) return false
      return !q || (index.get(e.id) ?? '').includes(q)
    })
  }, [items, index, reviews, query, zone, muscle, equipment, level, movement, review])

  const validatedCount = useMemo(() => items.filter((e) => reviews[e.id]).length, [items, reviews])
  const hasFilter = !!(query || zone || muscle || equipment || level || movement || review)

  function reset() {
    setQuery('')
    setZone('')
    setMuscle('')
    setEquipment('')
    setLevel('')
    setMovement('')
    setReview('')
  }

  if (library.isPending) return <p className="text-slate-500">Chargement…</p>
  if (library.isError) {
    return <p role="alert" className="text-red-600">Erreur de lecture des exercices : {messageOf(library.error)}</p>
  }

  return (
    <div className="space-y-4">
      {opened && (
        <ExerciseSheet
          exercise={opened}
          organizationId={membership.organizationId}
          review={reviews[opened.id]}
          canReview={membership.role !== 'assistant'}
          onClose={() => setOpenId(null)}
        />
      )}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Exercices</h1>
        <p className="text-sm text-slate-500">
          {visible.length} fiche{visible.length > 1 ? 's' : ''} sur {items.length} ·{' '}
          {validatedCount} validée{validatedCount > 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un exercice (français ou anglais)"
          className="w-full max-w-xs rounded border bg-white px-3 py-2 text-sm"
        />
        <FilterSelect value={movement} onChange={setMovement} allLabel="Tous les mouvements" options={movementOpts} />
        <FilterSelect value={zone} onChange={setZone} allLabel="Toutes les zones" options={zoneOpts} />
        <FilterSelect value={muscle} onChange={setMuscle} allLabel="Tous les muscles" options={muscleOpts} />
        <FilterSelect value={equipment} onChange={setEquipment} allLabel="Tout le matériel" options={equipmentOpts} />
        <FilterSelect value={level} onChange={setLevel} allLabel="Tous les niveaux" options={levelOpts} />
        <select
          value={review}
          onChange={(e) => setReview(e.target.value as ReviewFilter)}
          className="rounded border bg-white px-3 py-2 text-sm"
        >
          <option value="">Toutes les fiches</option>
          <option value="todo">À relire</option>
          <option value="validated">Validées</option>
        </select>
        {hasFilter && (
          <button type="button" onClick={reset} className="rounded border bg-white px-3 py-2 text-sm">
            Réinitialiser
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="text-slate-500">Aucun exercice ne correspond à ces critères.</p>
      ) : (
        <ul className="divide-y rounded border bg-white">
          {visible.map((e) => (
            <li key={e.id} className="flex items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <button type="button" onClick={() => setOpenId(e.id)} className="text-left font-medium hover:underline">{e.name_fr ?? e.name}</button>
                {e.name_fr && <p className="text-sm text-slate-500">{e.name}</p>}
                <div className="mt-1 flex flex-wrap gap-1">
                  {e.movement_slug && <Chip>{labelOf(MOVEMENT_LABEL, e.movement_slug)}</Chip>}
                  {e.level && <Chip>{labelOf(EXERCISE_LEVEL_LABEL, e.level)}</Chip>}
                  {e.technique && <Chip>{labelOf(TECHNIQUE_LABEL, e.technique)}</Chip>}
                  {e.body_zones.map((z) => (
                    <Chip key={z}>{labelOf(ZONE_LABEL, z)}</Chip>
                  ))}
                  {e.organization_id && <Chip>Personnalisé</Chip>}
                </div>
              </div>
              <span
                className={
                  reviews[e.id]
                    ? 'shrink-0 rounded bg-green-100 px-2 py-0.5 text-xs text-green-800'
                    : 'shrink-0 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800'
                }
              >
                {reviews[e.id] ? 'Validée' : 'À relire'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}