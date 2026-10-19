import { lazy, Suspense, useState } from 'react'

const ExerciseInfoModal = lazy(() => import('./ExerciseInfoModal'))

/** Bouton « i » : ouvre la fiche de l’exercice. La bibliothèque complète n’est chargée qu’au premier clic. */
export default function ExerciseInfoButton({ exerciseId }: { exerciseId: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Fiche de l’exercice"
        title="Fiche de l’exercice"
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs text-slate-500 hover:bg-slate-100"
      >
        i
      </button>
      {open && (
        <Suspense fallback={null}>
          <ExerciseInfoModal exerciseId={exerciseId} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  )
}