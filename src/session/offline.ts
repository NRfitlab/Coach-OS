import { useMemo, useSyncExternalStore } from 'react'
import { z } from 'zod'
import { SessionError, SessionSchema, saveSession, type Session, type SetInput, type SetRow } from './api'

const SetInputSchema = z.object({
  lineId: z.string(),
  setIndex: z.number(),
  reps: z.number().optional(),
  loadKg: z.number().optional(),
  rpe: z.number().optional(),
  durationS: z.number().optional(),
  distanceM: z.number().optional(),
  note: z.string().optional(),
  performedAt: z.string().optional(),
})

const FinalSchema = z.object({
  sessionRpe: z.number().nullable(),
  comment: z.string().nullable(),
  complete: z.boolean(),
})

const PendingSchema = z.object({
  sets: z.record(z.string(), SetInputSchema),
  rejected: z.record(z.string(), SetInputSchema).optional(),
  final: FinalSchema.optional(),
})

export type Pending = z.infer<typeof PendingSchema>
export type Final = z.infer<typeof FinalSchema>
export type SyncState = 'idle' | 'sending' | 'offline' | 'closed' | 'error'
export type SyncStatus = { state: SyncState; message?: string }
export type RowState = 'pending' | 'rejected'

// ---------- stockage (localStorage, repli mémoire si indisponible) ----------

const mem = new Map<string, string>()

function read(key: string): string | null {
  try {
    return localStorage.getItem(key) ?? mem.get(key) ?? null
  } catch {
    return mem.get(key) ?? null
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
    mem.delete(key)
  } catch {
    if (value === null) mem.delete(key)
    else mem.set(key, value)
  }
}

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
function subscribe(l: () => void): () => void {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

const qKey = (token: string) => `coachos:q:${token}`
const sKey = (token: string) => `coachos:s:${token}`

function parsePending(raw: string | null): Pending {
  if (!raw) return { sets: {} }
  try {
    const r = PendingSchema.safeParse(JSON.parse(raw))
    return r.success ? r.data : { sets: {} }
  } catch {
    return { sets: {} }
  }
}

function readPending(token: string): Pending {
  return parsePending(read(qKey(token)))
}

function writePending(token: string, p: Pending): void {
  const empty = Object.keys(p.sets).length === 0 && Object.keys(p.rejected ?? {}).length === 0 && !p.final
  write(qKey(token), empty ? null : JSON.stringify(p))
  emit()
}

export function pendingCount(p: Pending): number {
  return Object.keys(p.sets).length + (p.final ? 1 : 0)
}

export function usePending(token: string): Pending {
  const raw = useSyncExternalStore(subscribe, () => read(qKey(token)) ?? '')
  return useMemo(() => parsePending(raw || null), [raw])
}

// ---------- cache de la séance ----------

export function saveCachedSession(token: string, s: Session): void {
  write(sKey(token), JSON.stringify(s))
}

export function loadCachedSession(token: string): Session | null {
  const raw = read(sKey(token))
  if (!raw) return null
  try {
    const r = SessionSchema.safeParse(JSON.parse(raw))
    return r.success ? r.data : null
  } catch {
    return null
  }
}

// ---------- actions locales ----------

export function queueSet(token: string, set: SetInput): void {
  const p = readPending(token)
  const key = `${set.lineId}:${set.setIndex}`
  p.sets[key] = set
  if (p.rejected) delete p.rejected[key]
  writePending(token, p)
}

export function queueFinal(token: string, f: Final): void {
  const p = readPending(token)
  p.final = { ...f, complete: f.complete || p.final?.complete === true }
  writePending(token, p)
}

// ---------- affichage : serveur + file locale ----------

function toRow(s: SetInput): SetRow {
  return {
    lineId: s.lineId,
    setIndex: s.setIndex,
    reps: s.reps ?? null,
    loadKg: s.loadKg ?? null,
    rpe: s.rpe ?? null,
    durationS: s.durationS ?? null,
    distanceM: s.distanceM ?? null,
    note: s.note ?? null,
    performedAt: s.performedAt ?? new Date().toISOString(),
  }
}

export function overlay(server: SetRow[], p: Pending): { rows: SetRow[]; states: Record<string, RowState> } {
  const map = new Map<string, SetRow>()
  const states: Record<string, RowState> = {}
  for (const s of server) map.set(`${s.lineId}:${s.setIndex}`, s)
  for (const [k, s] of Object.entries(p.rejected ?? {})) {
    map.set(k, toRow(s))
    states[k] = 'rejected'
  }
  for (const [k, s] of Object.entries(p.sets)) {
    map.set(k, toRow(s))
    states[k] = 'pending'
  }
  return { rows: [...map.values()], states }
}

// ---------- synchronisation ----------

let status: SyncStatus = { state: 'idle' }
let lastMessage: string | undefined
let running = false
let again = false

function setStatus(next: SyncStatus): void {
  if (next.state === status.state && next.message === status.message) return
  status = next
  emit()
}

export function getSyncStatus(): SyncStatus {
  return status
}

export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(subscribe, () => status)
}

export function useOnline(): boolean {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener('online', cb)
      window.addEventListener('offline', cb)
      return () => {
        window.removeEventListener('online', cb)
        window.removeEventListener('offline', cb)
      }
    },
    () => navigator.onLine,
  )
}

const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b)

function pick(p: Pending, keys: string[]): SetInput[] {
  return keys.flatMap((k) => {
    const s = p.sets[k]
    return s ? [s] : []
  })
}

function clearSent(token: string, sent: Pending, keys: string[]): void {
  const cur = readPending(token)
  for (const k of keys) {
    if (same(cur.sets[k], sent.sets[k])) delete cur.sets[k]
  }
  writePending(token, cur)
}

function reject(token: string, sent: Pending, key: string): void {
  const cur = readPending(token)
  const s = cur.sets[key]
  if (s && same(s, sent.sets[key])) {
    delete cur.sets[key]
    cur.rejected = { ...(cur.rejected ?? {}), [key]: s }
    writePending(token, cur)
  }
}

async function flushOnce(token: string): Promise<'ok' | SyncState> {
  lastMessage = undefined
  try {
    const p0 = readPending(token)
    const keys = Object.keys(p0.sets)
    if (keys.length > 0) {
      try {
        for (let i = 0; i < keys.length; i += 100) {
          await saveSession(token, { sets: pick(p0, keys.slice(i, i + 100)) })
        }
        clearSent(token, p0, keys)
      } catch (e) {
        if (!(e instanceof SessionError) || e.kind !== 'invalid') throw e
        for (const k of keys) {
          try {
            await saveSession(token, { sets: pick(p0, [k]) })
            clearSent(token, p0, [k])
          } catch (e2) {
            if (e2 instanceof SessionError && e2.kind === 'invalid') reject(token, p0, k)
            else throw e2
          }
        }
      }
    }
    const fin = readPending(token).final
    if (fin) {
      await saveSession(token, {
        sessionRpe: fin.sessionRpe,
        comment: fin.comment,
        ...(fin.complete ? { complete: true } : {}),
      })
      const cur = readPending(token)
      if (cur.final && same(cur.final, fin)) {
        delete cur.final
        writePending(token, cur)
      }
    }
    return 'ok'
  } catch (e) {
    if (e instanceof SessionError) {
      if (e.kind === 'expired' || e.kind === 'unknown') return 'closed'
      if (e.kind === 'invalid') {
        lastMessage =
          e.code === 'no_sets'
            ? 'Fin de séance refusée : aucune série acceptée par le serveur.'
            : 'Envoi refusé par le serveur. Contactez votre coach.'
        return 'error'
      }
    }
    return 'offline'
  }
}

/** Envoie la file. Retourne true si au moins un envoi a abouti. */
export async function flush(token: string): Promise<boolean> {
  if (running) {
    again = true
    return false
  }
  running = true
  let sent = false
  try {
    do {
      again = false
      if (pendingCount(readPending(token)) === 0) {
        setStatus({ state: 'idle' })
        break
      }
      setStatus({ state: 'sending' })
      const r = await flushOnce(token)
      if (r === 'ok') {
        sent = true
        setStatus({ state: 'idle' })
      } else {
        setStatus({ state: r, message: lastMessage })
        break
      }
    } while (again)
  } finally {
    running = false
  }
  return sent
}