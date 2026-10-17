alter table public.exercises
  add column if not exists name_fr text,
  add column if not exists description text,
  add column if not exists steps text[] not null default '{}',
  add column if not exists cues text[] not null default '{}',
  add column if not exists common_mistakes text[] not null default '{}',
  add column if not exists body_zones text[] not null default '{}',
  add column if not exists technique text,
  add column if not exists animation_url text,
  add column if not exists media_credit text,
  add column if not exists source text not null default 'Coach OS, rédaction originale';

alter table public.exercises drop constraint if exists exercises_technique_check;
alter table public.exercises add constraint exercises_technique_check
  check (technique is null or technique in (
    'static_stretch', 'dynamic_stretch', 'active_mobility', 'loaded_mobility',
    'pnf', 'articular_rotation', 'activation', 'self_massage'
  ));

alter table public.exercises drop constraint if exists exercises_body_zones_check;
alter table public.exercises add constraint exercises_body_zones_check
  check (body_zones <@ array[
    'ankle', 'foot', 'knee', 'hip', 'pelvis_lumbar', 'thoracic', 'cervical',
    'shoulder', 'scapula', 'elbow_forearm', 'wrist_hand', 'full_body'
  ]::text[]);

create unique index if not exists exercises_name_org_uniq
  on public.exercises (coalesce(organization_id, '00000000-0000-0000-0000-000000000000'::uuid), lower(name));
create index if not exists exercises_body_zones_idx on public.exercises using gin (body_zones);