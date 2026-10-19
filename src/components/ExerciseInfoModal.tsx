import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useOutletContext } from 'react-router-dom'
import type { Membership } from '../auth/membership'
import { useExerciseLibrary, useExerciseReviews } from '../athletes/exerciseLibrary'
import { messageOf } from '../lib/utils'
import ExerciseSheet from './ExerciseSheet'

function Message({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="space-y-3 rounded bg-white p-6 text-sm shadow-xl"
        onClick={(ev) => ev.stopPropagation()}
      >
        {children}
        <button type="button" onClick={onClose} className="rounded border px-3 py-1 text-sm">
          Fermer
        </button>
      </div>
    </div>
  )
}

export default function ExerciseInfoModal({ exerciseId, onClose }: { exerciseId: string; onClose: () => void }) {
  const membership = useOutletContext<Membership>()
  const library = useExerciseLibrary()
  const reviews = useExerciseReviews(membership.organizationId)

  let body: ReactNode
  if (library.isPending) {
    body = <Message onClose={onClose}><p className="text-slate-500">Chargement de la fiche…</p></Message>
  } else if (library.isError) {
    body = (
      <Message onClose={onClose}>
        <p role="alert" className="text-red-600">Erreur de lecture : {messageOf(library.error)}</p>
      </Message>
    )
  } else {
    const exercise = library.data.find((x) => x.id === exerciseId)
    body = exercise ? (
      <ExerciseSheet
        exercise={exercise}
        organizationId={membership.organizationId}
        review={reviews.data?.[exerciseId]}
        canReview={membership.role !== 'assistant'}
        onClose={onClose}
      />
    ) : (
      <Message onClose={onClose}><p>Fiche introuvable.</p></Message>
    )
  }
  return createPortal(body, document.body)
}