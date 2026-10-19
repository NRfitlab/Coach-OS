import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useSetReviewed, type ExerciseReview, type LibraryExercise } from '../athletes/exerciseLibrary'
import {
  EQUIPMENT_LABEL,
  EXERCISE_LEVEL_LABEL,
  MOVEMENT_LABEL,
  MUSCLE_LABEL,
  TECHNIQUE_LABEL,
  ZONE_LABEL,
  labelOf,
} from '../domain/exerciseLabels'
import { formatDate, messageOf } from '../lib/utils'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-1">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {children}
    </section>
  )
}

function ItemList({ items, ordered }: { items: string[]; ordered?: boolean }) {
  if (items.length === 0) return null
  const className = `${ordered ? 'list-decimal' : 'list-disc'} space-y-1 pl-5 text-sm text-slate-700`
  const rows = items.map((s, i) => <li key={i}>{s}</li>)
  return ordered ? <ol className={className}>{rows}</ol> : <ul className={className}>{rows}</ul>
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{children}</span>
}

export default function ExerciseSheet(props: {
  exercise: LibraryExercise
  organizationId: string
  review: ExerciseReview | undefined
  canReview: boolean
  onClose: () => void
}) {
  const { exercise: e, organizationId, review, canReview, onClose } = props
  const setReviewed = useSetReviewed()

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const reviewed = !!review
  const muscles = (list: string[]) => list.map((m) => labelOf(MUSCLE_LABEL, m)).join(', ')

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-sheet-title"
        className="h-full w-full max-w-lg space-y-4 overflow-y-auto bg-white p-6 shadow-xl"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="exercise-sheet-title" className="text-lg font-semibold">
              {e.name_fr ?? e.name}
            </h2>
            {e.name_fr && <p className="text-sm text-slate-500">{e.name}</p>}
          </div>
          <button type="button" onClick={onClose} className="shrink-0 rounded border px-3 py-1 text-sm">
            Fermer
          </button>
        </div>

        <div className="flex flex-wrap gap-1">
          {e.movement_slug && <Chip>{labelOf(MOVEMENT_LABEL, e.movement_slug)}</Chip>}
          {e.level && <Chip>{labelOf(EXERCISE_LEVEL_LABEL, e.level)}</Chip>}
          {e.technique && <Chip>{labelOf(TECHNIQUE_LABEL, e.technique)}</Chip>}
          {e.unilateral && <Chip>Un côté à la fois</Chip>}
          {e.body_zones.map((z) => (
            <Chip key={z}>{labelOf(ZONE_LABEL, z)}</Chip>
          ))}
          {e.organization_id && <Chip>Personnalisé</Chip>}
        </div>

        <div className="rounded border bg-slate-50 p-3 text-sm">
          {reviewed ? (
            <p className="text-green-800">
              Fiche validée le {formatDate(review.reviewed_at.slice(0, 10))}.
            </p>
          ) : (
            <p className="text-amber-800">
              Fiche rédigée par Coach OS à partir de pratiques usuelles, à relire avant usage.
            </p>
          )}
          {canReview ? (
            <button
              type="button"
              disabled={setReviewed.isPending}
              onClick={() =>
                setReviewed.mutate({ organizationId, exerciseId: e.id, reviewed: !reviewed })
              }
              className="mt-2 rounded border bg-white px-3 py-1 text-sm disabled:opacity-50"
            >
              {reviewed ? 'Retirer la validation' : 'Valider la fiche'}
            </button>
          ) : (
            <p className="mt-2 text-slate-500">
              Seuls l’administrateur et les coachs valident les fiches.
            </p>
          )}
          {setReviewed.isError && (
            <p role="alert" className="mt-2 text-red-600">
              Erreur : {messageOf(setReviewed.error)}
            </p>
          )}
        </div>

        {e.description && (
          <Section title="Description">
            <p className="text-sm text-slate-700">{e.description}</p>
          </Section>
        )}

        {(e.primary_muscles.length > 0 || e.secondary_muscles.length > 0) && (
          <Section title="Muscles">
            {e.primary_muscles.length > 0 && (
              <p className="text-sm text-slate-700">Principaux : {muscles(e.primary_muscles)}</p>
            )}
            {e.secondary_muscles.length > 0 && (
              <p className="text-sm text-slate-700">Secondaires : {muscles(e.secondary_muscles)}</p>
            )}
          </Section>
        )}

        {e.equipment.length > 0 && (
          <Section title="Matériel">
            <p className="text-sm text-slate-700">
              {e.equipment.map((q) => labelOf(EQUIPMENT_LABEL, q)).join(', ')}
            </p>
          </Section>
        )}

        {e.steps.length > 0 && (
          <Section title="Étapes">
            <ItemList items={e.steps} ordered />
          </Section>
        )}
        {e.cues.length > 0 && (
          <Section title="Consignes">
            <ItemList items={e.cues} />
          </Section>
        )}
        {e.common_mistakes.length > 0 && (
          <Section title="Erreurs fréquentes">
            <ItemList items={e.common_mistakes} />
          </Section>
        )}

        {e.video_url && (
          <Section title="Vidéo">
            <a href={e.video_url} target="_blank" rel="noreferrer" className="text-sm text-blue-700 underline">
              Ouvrir la vidéo
            </a>
          </Section>
        )}
      </aside>
    </div>
  )
}