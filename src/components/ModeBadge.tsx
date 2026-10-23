import type { LineMode } from '../domain/modes'

const BADGE: Record<LineMode, { label: string; style: string }> = {
  force: { label: 'Force', style: 'bg-blue-100 text-blue-800' },
  puissance: { label: 'Puiss.', style: 'bg-red-100 text-red-800' },
  course: { label: 'Course', style: 'bg-green-100 text-green-800' },
  mobilite: { label: 'Mobil.', style: 'bg-purple-100 text-purple-800' },
  recuperation: { label: 'Récup.', style: 'bg-teal-100 text-teal-800' },
  libre: { label: 'Libre', style: 'bg-slate-100 text-slate-700' },
  conditioning: { label: 'Cond.', style: 'bg-orange-100 text-orange-800' },
}

export function ModeBadge({ mode }: { mode: LineMode }) {
  const b = BADGE[mode]
  return <span className={`rounded px-1 text-[10px] font-medium ${b.style}`}>{b.label}</span>
}

export function CodeCell({ code, mode }: { code: string; mode: LineMode }) {
  return (
    <span className="flex items-center gap-1 pt-1">
      <span className="font-mono text-slate-500">{code}</span>
      <ModeBadge mode={mode} />
    </span>
  )
}