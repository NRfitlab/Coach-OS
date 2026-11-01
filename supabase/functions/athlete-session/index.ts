import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, apikey, authorization, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

const TOKEN_RE = /^[A-Za-z0-9_-]{22}$/
const MAX_BODY = 1_000_000
const IMAGE_BUCKET = 'exercise-images'
const SIGNED_SECONDS = 3600
const DAY_MS = 86_400_000

async function sha256Hex(s: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

const halfStep = (v: number) => Math.round(v * 2) === v * 2

const SnapshotLite = z.object({
  blocks: z.array(z.object({
    lines: z.array(z.object({ id: z.string(), exerciseId: z.string().nullable() })),
  })),
})

const SetSchema = z.object({
  lineId: z.string().min(1).max(100),
  setIndex: z.number().int().min(1).max(200),
  reps: z.number().int().min(0).max(1000).nullable().optional(),
  loadKg: z.number().min(0).max(1000).nullable().optional(),
  rpe: z.number().min(1).max(10).refine(halfStep).nullable().optional(),
  durationS: z.number().int().min(0).max(86400).nullable().optional(),
  distanceM: z.number().min(0).max(1_000_000).nullable().optional(),
  note: z.string().max(500).nullable().optional(),
  performedAt: z.string().max(40).optional(),
})

const Body = z.discriminatedUnion('action', [
  z.object({ action: z.literal('get'), token: z.string() }),
  z.object({
    action: z.literal('save'),
    token: z.string(),
    sets: z.array(SetSchema).max(500).default([]),
    sessionRpe: z.number().min(1).max(10).refine(halfStep).nullable().optional(),
    comment: z.string().max(1000).nullable().optional(),
    complete: z.boolean().optional(),
  }),
])

/** Date de saisie fournie par le client (saisie hors-ligne) : bornée à [maintenant − 30 jours, maintenant + 5 min]. */
function clampDate(raw: string | undefined, now: number): string {
  const t = raw ? Date.parse(raw) : NaN
  if (Number.isNaN(t) || t > now + 300_000 || t < now - 30 * DAY_MS) return new Date(now).toISOString()
  return new Date(t).toISOString()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
  if (req.method !== 'POST') return json(405, { error: 'method' })
  if (Number(req.headers.get('content-length') ?? '0') > MAX_BODY) return json(413, { error: 'too_large' })

  let raw: unknown
  try {
    const text = await req.text()
    if (text.length > MAX_BODY) return json(413, { error: 'too_large' })
    raw = JSON.parse(text)
  } catch {
    return json(400, { error: 'bad_json' })
  }
  const parsed = Body.safeParse(raw)
  if (!parsed.success) return json(400, { error: 'bad_request' })
  const body = parsed.data
  if (!TOKEN_RE.test(body.token)) return json(400, { error: 'bad_token' })

  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SB_SECRET_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) {
    console.error('athlete-session : configuration manquante')
    return json(500, { error: 'config' })
  }
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

  try {
    const { data: a, error } = await db
      .from('assignments')
      .select('id, organization_id, scheduled_on, status, snapshot, token_expires_at, completed_at, session_rpe, athlete_comment')
      .eq('token_hash', await sha256Hex(body.token))
      .maybeSingle()
    if (error) throw error
    if (!a) return json(404, { error: 'unknown_link' })
    if (!a.token_expires_at || Date.parse(a.token_expires_at) <= Date.now()) return json(410, { error: 'expired_link' })

    const lite = SnapshotLite.safeParse(a.snapshot)
    if (!lite.success) {
      console.error('athlete-session : snapshot illisible', a.id)
      return json(500, { error: 'bad_snapshot' })
    }

    if (body.action === 'get') {
      const { data: sets, error: e1 } = await db
        .from('performed_sets')
        .select('snapshot_exercise_id, set_index, reps, load_kg, rpe, duration_s, distance_m, note, performed_at')
        .eq('assignment_id', a.id)
        .order('performed_at')
      if (e1) throw e1

      const exerciseIds = [...new Set(
        lite.data.blocks.flatMap((b) => b.lines.map((l) => l.exerciseId).filter((x): x is string => !!x)),
      )]
      const images: Record<string, string[]> = {}
      if (exerciseIds.length > 0) {
        const { data: ex, error: e2 } = await db.from('exercises').select('id, image_paths').in('id', exerciseIds)
        if (e2) throw e2
        const paths = [...new Set((ex ?? []).flatMap((e) => (e.image_paths as string[] | null) ?? []))]
        const urls = new Map<string, string>()
        if (paths.length > 0) {
          const { data: signed, error: e3 } = await db.storage.from(IMAGE_BUCKET).createSignedUrls(paths, SIGNED_SECONDS)
          if (e3) throw e3
          for (const s of signed ?? []) if (s.signedUrl && s.path) urls.set(s.path, s.signedUrl)
        }
        for (const e of ex ?? []) {
          const list = ((e.image_paths as string[] | null) ?? [])
            .map((p) => urls.get(p))
            .filter((u): u is string => !!u)
          if (list.length > 0) images[e.id as string] = list
        }
      }

      return json(200, {
        assignment: {
          id: a.id,
          scheduledOn: a.scheduled_on,
          status: a.status,
          completedAt: a.completed_at,
          sessionRpe: a.session_rpe,
          comment: a.athlete_comment,
          expiresAt: a.token_expires_at,
        },
        snapshot: a.snapshot,
        sets: (sets ?? []).map((s) => ({
          lineId: s.snapshot_exercise_id,
          setIndex: s.set_index,
          reps: s.reps,
          loadKg: s.load_kg,
          rpe: s.rpe,
          durationS: s.duration_s,
          distanceM: s.distance_m,
          note: s.note,
          performedAt: s.performed_at,
        })),
        images,
      })
    }

    // action === 'save'
    if (a.completed_at || a.status === 'completed') return json(409, { error: 'completed' })
    const validLines = new Set(lite.data.blocks.flatMap((b) => b.lines.map((l) => l.id)))
    const unique = new Map<string, (typeof body.sets)[number]>()
    for (const s of body.sets) {
      if (!validLines.has(s.lineId)) return json(400, { error: 'invalid_line' })
      unique.set(`${s.lineId}:${s.setIndex}`, s)
    }
    const now = Date.now()
    const rows = [...unique.values()].map((s) => ({
      assignment_id: a.id,
      organization_id: a.organization_id,
      snapshot_exercise_id: s.lineId,
      set_index: s.setIndex,
      reps: s.reps ?? null,
      load_kg: s.loadKg ?? null,
      rpe: s.rpe ?? null,
      duration_s: s.durationS ?? null,
      distance_m: s.distanceM ?? null,
      note: s.note ?? null,
      performed_at: clampDate(s.performedAt, now),
    }))

    if (body.complete) {
      const { count, error: ec } = await db
        .from('performed_sets').select('id', { count: 'exact', head: true }).eq('assignment_id', a.id)
      if (ec) throw ec
      if ((count ?? 0) + rows.length === 0) return json(400, { error: 'no_sets' })
    }
    if (rows.length > 0) {
      const { error: eu } = await db
        .from('performed_sets').upsert(rows, { onConflict: 'assignment_id,snapshot_exercise_id,set_index' })
      if (eu) throw eu
    }

    const patch: Record<string, unknown> = {}
    if (body.sessionRpe !== undefined) patch.session_rpe = body.sessionRpe
    if (body.comment !== undefined) patch.athlete_comment = body.comment
    if (body.complete) {
      patch.status = 'completed'
      patch.completed_at = new Date().toISOString()
    } else if (rows.length > 0 && a.status === 'assigned') {
      patch.status = 'in_progress'
    }
    if (Object.keys(patch).length > 0) {
      const { error: ep } = await db.from('assignments').update(patch).eq('id', a.id).is('completed_at', null)
      if (ep) throw ep
    }
    return json(200, { ok: true, saved: rows.length, status: (patch.status as string | undefined) ?? a.status })
  } catch (e) {
    console.error('athlete-session :', e instanceof Error ? e.message : e)
    return json(500, { error: 'server' })
  }
})
