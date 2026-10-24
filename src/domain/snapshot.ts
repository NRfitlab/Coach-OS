import { z } from 'zod'
import type { DetailData } from '../athletes/builder'
import { BLOCK_KINDS } from './block'
import type { Reference } from './reference'

export const SNAPSHOT_VERSION = 1

export const SnapshotSchema = z.object({
  v: z.literal(SNAPSHOT_VERSION),
  builtAt: z.string(),
  workout: z.object({
    title: z.string(),
    scheduledOn: z.string().nullable(),
    quality: z.string().nullable(),
    plannedMinutes: z.number().nullable(),
  }),
  blocks: z.array(z.object({
    id: z.string(),
    kind: z.enum(BLOCK_KINDS),
    params: z.unknown(),
    lines: z.array(z.object({
      id: z.string(),
      exerciseId: z.string().nullable(),
      name: z.string().nullable(),
      nameFr: z.string().nullable(),
      prescription: z.unknown(),
    })),
  })),
  references: z.array(z.object({
    id: z.string(),
    kind: z.string(),
    exerciseId: z.string().nullable(),
    value: z.number(),
    unit: z.string().nullable(),
    measuredOn: z.string(),
    method: z.string(),
  })),
})
export type Snapshot = z.infer<typeof SnapshotSchema>
export type ExerciseName = { name: string; nameFr: string | null }

/** Toutes les chaînes d'une valeur JSON (les identifiants de références y figurent). */
function collectStrings(x: unknown, out: Set<string>): void {
  if (typeof x === 'string') out.add(x)
  else if (Array.isArray(x)) x.forEach((v) => collectStrings(v, out))
  else if (x && typeof x === 'object') Object.values(x).forEach((v) => collectStrings(v, out))
}

/** Les notes du coach ne quittent pas l'organisation : le snapshot est immuable et visible de l'athlète. */
function withoutNote(p: unknown): unknown {
  if (!p || typeof p !== 'object' || Array.isArray(p)) return p
  const copy = { ...(p as Record<string, unknown>) }
  delete copy.note
  return copy
}

export function buildSnapshot(input: {
  workout: DetailData
  names: Map<string, ExerciseName>
  refs: Reference[]
}): Snapshot {
  const { workout: w, names, refs } = input
  const used = new Set<string>()
  const blocks = [...w.workout_blocks]
    .sort((a, b) => a.position - b.position)
    .map((b) => ({
      id: b.id,
      kind: b.kind,
      params: b.params ?? null,
      lines: [...b.workout_exercises]
        .sort((x, y) => x.position - y.position)
        .map((x) => {
          const prescription = withoutNote(x.prescription)
          collectStrings(prescription, used)
          const n = x.exercise_id ? names.get(x.exercise_id) : undefined
          return {
            id: x.id,
            exerciseId: x.exercise_id,
            name: n?.name ?? null,
            nameFr: n?.nameFr ?? null,
            prescription,
          }
        }),
    }))
  return SnapshotSchema.parse({
    v: SNAPSHOT_VERSION,
    builtAt: new Date().toISOString(),
    workout: {
      title: w.title,
      scheduledOn: w.scheduled_on ?? null,
      quality: w.quality ?? null,
      plannedMinutes: w.planned_minutes ?? null,
    },
    blocks,
    references: refs
      .filter((r) => used.has(r.id))
      .map((r) => ({
        id: r.id,
        kind: r.kind,
        exerciseId: r.exercise_id ?? null,
        value: Number(r.value),
        unit: r.unit ?? null,
        measuredOn: r.measured_on,
        method: r.method,
      })),
  })
}
