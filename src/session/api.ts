import { z } from 'zod'
import { SnapshotSchema } from '../domain/snapshot'

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/athlete-session`

const SetRowSchema = z.object({
  lineId: z.string(),
  setIndex: z.number().int(),
  reps: z.number().nullable(),
  loadKg: z.number().nullable(),
  rpe: z.number().nullable(),
  durationS: z.number().nullable(),
  distanceM: z.number().nullable(),
  note: z.string().nullable(),
  performedAt: z.string(),
})

export const SessionSchema = z.object({
  assignment: z.object({
    id: z.string(),
    scheduledOn: z.string().nullable(),
    status: z.string(),
    completedAt: z.string().nullable(),
    sessionRpe: z.number().nullable(),
    comment: z.string().nullable(),
    expiresAt: z.string(),
  }),
  snapshot: SnapshotSchema,
  sets: z.array(SetRowSchema),
  images: z.record(z.string(), z.array(z.string())),
})
export type Session = z.infer<typeof SessionSchema>
export type SetRow = z.infer<typeof SetRowSchema>

export type SetInput = {
  lineId: string
  setIndex: number
  reps?: number
  loadKg?: number
  rpe?: number
  durationS?: number
  distanceM?: number
  note?: string
  performedAt?: string
}

export type SaveBody = {
  sets?: SetInput[]
  sessionRpe?: number | null
  comment?: string | null
  complete?: boolean
}

export type SessionErrorKind = 'expired' | 'unknown' | 'invalid' | 'network' | 'server'

export class SessionError extends Error {
  kind: SessionErrorKind
  code?: string
  constructor(kind: SessionErrorKind, message: string, code?: string) {
    super(message)
    this.kind = kind
    this.code = code
  }
}

function kindOfStatus(status: number): SessionErrorKind {
  if (status === 410) return 'expired'
  if (status === 404) return 'unknown'
  if (status === 400) return 'invalid'
  return 'server'
}

async function call(body: unknown): Promise<unknown> {
  let res: Response
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new SessionError('network', 'Connexion impossible')
  }
  const json: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    const code =
      json && typeof json === 'object' && 'error' in json && typeof json.error === 'string'
        ? json.error
        : undefined
    throw new SessionError(kindOfStatus(res.status), `HTTP ${res.status}`, code)
  }
  return json
}

export async function fetchSession(token: string): Promise<Session> {
  const json = await call({ action: 'get', token })
  const parsed = SessionSchema.safeParse(json)
  if (!parsed.success) throw new SessionError('server', 'Réponse illisible')
  return parsed.data
}

export async function saveSession(token: string, body: SaveBody): Promise<void> {
  await call({ action: 'save', token, ...body })
}