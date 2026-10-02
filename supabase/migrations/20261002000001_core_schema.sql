-- =====================================================================
-- Coach OS — Migration 1 : schéma de base (15 tables)
-- Invariants garantis ici :
--   (8) aucune référence inter-organisations (clés composites + triggers)
--   (3) le snapshot d'une assignation est immuable (trigger)
--   (1) movement -> exercise -> prescription séparés
-- =====================================================================

-- ---------- Fonctions utilitaires ------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- Organisations, membres, profils --------------------------
create table public.organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (length(trim(name)) > 0),
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

create table public.organization_members (
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  user_id          uuid not null references auth.users(id) on delete cascade,
  role             text not null check (role in ('admin','coach','assistant')),
  created_at       timestamptz not null default now(),
  primary key (organization_id, user_id)
);
create index on public.organization_members (user_id);

-- Création automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Athlètes --------------------------------------------------
create table public.athletes (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references public.organizations(id) on delete cascade,
  coach_id            uuid not null,
  full_name           text not null check (length(trim(full_name)) > 0),
  birth_date          date,
  primary_sport       text,
  secondary_sports    text[] not null default '{}',
  level               text check (level in ('beginner','intermediate','advanced','elite')),
  experience          text,
  sessions_per_week   int check (sessions_per_week between 0 and 14),
  available_minutes   int check (available_minutes between 0 and 600),
  availability        jsonb not null default '{}'::jsonb,  -- minutes par jour, jours interdits
  equipment           text[] not null default '{}',        -- ex. {'gym:barbell','home:dumbbells'}
  status              text not null default 'active' check (status in ('active','paused','archived')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (id, organization_id),
  -- le coach responsable doit être membre de la même organisation ;
  -- NO ACTION => impossible de retirer un membre qui a encore des athlètes
  -- (invariant 10 : réassigner d'abord)
  foreign key (organization_id, coach_id)
    references public.organization_members (organization_id, user_id)
);
create index on public.athletes (organization_id);
create index on public.athletes (coach_id);
create trigger trg_athletes_updated before update on public.athletes
  for each row execute function public.set_updated_at();

create table public.athlete_access (
  athlete_id       uuid not null,
  organization_id  uuid not null,
  user_id          uuid not null,
  created_at       timestamptz not null default now(),
  primary key (athlete_id, user_id),
  foreign key (athlete_id, organization_id) references public.athletes (id, organization_id) on delete cascade,
  foreign key (organization_id, user_id) references public.organization_members (organization_id, user_id) on delete cascade
);

-- Données sensibles : table séparée, consentement obligatoire
create table public.athlete_sensitive (
  id                    uuid primary key default gen_random_uuid(),
  organization_id       uuid not null,
  athlete_id            uuid not null unique,
  injuries_limitations  text,
  consent_at            timestamptz not null,
  consent_by            uuid references auth.users(id) on delete set null,
  updated_at            timestamptz not null default now(),
  foreign key (athlete_id, organization_id) references public.athletes (id, organization_id) on delete cascade
);
create trigger trg_sensitive_updated before update on public.athlete_sensitive
  for each row execute function public.set_updated_at();

create table public.athlete_goals (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null,
  athlete_id       uuid not null,
  priority         text not null check (priority in ('primary','secondary','maintenance')),
  type             text,
  title            text not null,
  metric           text,
  current_value    numeric,
  target_value     numeric,
  unit             text,
  target_date      date,
  status           text not null default 'active' check (status in ('active','achieved','abandoned')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  foreign key (athlete_id, organization_id) references public.athletes (id, organization_id) on delete cascade
);
create index on public.athlete_goals (athlete_id);
-- un seul objectif principal actif par athlète
create unique index uq_one_active_primary_goal
  on public.athlete_goals (athlete_id) where priority = 'primary' and status = 'active';
create trigger trg_goals_updated before update on public.athlete_goals
  for each row execute function public.set_updated_at();

-- ---------- Bibliothèque : movement -> exercise ----------------------
create table public.movements (       -- commune à toutes les organisations, lecture seule
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  description  text
);

create table public.exercises (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid references public.organizations(id) on delete cascade, -- NULL = commun
  movement_id         uuid references public.movements(id),
  parent_exercise_id  uuid references public.exercises(id) on delete set null,   -- variante de...
  name                text not null,
  primary_muscles     text[] not null default '{}',
  secondary_muscles   text[] not null default '{}',
  equipment           text[] not null default '{}',
  level               text check (level in ('beginner','intermediate','advanced')),
  unilateral          boolean not null default false,
  video_url           text,
  created_at          timestamptz not null default now()
);
create index on public.exercises (organization_id);
create index on public.exercises (movement_id);

-- Valeurs de référence : une ligne par test, jamais d'écrasement (invariant 2)
create table public.athlete_references (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null,
  athlete_id       uuid not null,
  kind             text not null check (kind in ('one_rm','mas','critical_speed','hr_max','hr_rest','ftp','other')),
  exercise_id      uuid references public.exercises(id),
  value            numeric not null,
  unit             text not null,
  measured_on      date not null,
  method           text not null check (method in ('direct_test','estimated','declared')),
  estimation_formula text,            -- ex. 'epley' si method = 'estimated'
  note             text,
  created_at       timestamptz not null default now(),
  foreign key (athlete_id, organization_id) references public.athletes (id, organization_id) on delete cascade,
  check (kind <> 'one_rm' or exercise_id is not null)
);
create index on public.athlete_references (athlete_id, kind, measured_on desc);

-- ---------- Séances ---------------------------------------------------
create table public.workouts (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  athlete_id       uuid,                                  -- NULL = modèle de l'organisation
  title            text not null,
  scheduled_on     date,
  context          text not null default 'gym' check (context in ('gym','home','hotel')),
  alternative_of   uuid references public.workouts(id) on delete set null,
  version          int not null default 1,
  notes            text,
  created_by       uuid references auth.users(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (id, organization_id),
  foreign key (athlete_id, organization_id) references public.athletes (id, organization_id) on delete cascade
);
create index on public.workouts (athlete_id, scheduled_on);
create trigger trg_workouts_updated before update on public.workouts
  for each row execute function public.set_updated_at();

create table public.workout_blocks (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null,
  workout_id       uuid not null,
  position         int not null,
  kind             text not null check (kind in ('warmup','straight','superset','circuit','emom','amrap','interval','cooldown')),
  label            text,
  notes            text,
  params           jsonb not null default '{}'::jsonb,
  unique (id, organization_id),
  foreign key (workout_id, organization_id) references public.workouts (id, organization_id) on delete cascade
);
create index on public.workout_blocks (workout_id, position);

create table public.workout_exercises (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null,
  block_id         uuid not null,
  position         int not null,
  exercise_id      uuid not null references public.exercises(id),
  prescription     jsonb not null,
  notes            text,
  foreign key (block_id, organization_id) references public.workout_blocks (id, organization_id) on delete cascade,
  -- garde-fou minimal ; la validation complète est faite par Zod (src/domain)
  check (jsonb_typeof(prescription) = 'object'
         and prescription->>'mode' in ('force','course','conditioning','mobilite'))
);
create index on public.workout_exercises (block_id, position);

-- Cohérence d'organisation pour les exercices (communs ou de la même org)
create or replace function public.check_exercise_same_org()
returns trigger language plpgsql as $$
begin
  if new.exercise_id is not null and not exists (
    select 1 from public.exercises e
    where e.id = new.exercise_id
      and (e.organization_id is null or e.organization_id = new.organization_id)
  ) then
    raise exception 'exercise % n''appartient pas à l''organisation %', new.exercise_id, new.organization_id
      using errcode = '23514';
  end if;
  return new;
end $$;

create trigger trg_wex_same_org before insert or update on public.workout_exercises
  for each row execute function public.check_exercise_same_org();
create trigger trg_ref_same_org before insert or update on public.athlete_references
  for each row execute function public.check_exercise_same_org();

-- ---------- Assignation, réalisation ---------------------------------
create table public.assignments (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null,
  athlete_id        uuid not null,
  workout_id        uuid references public.workouts(id) on delete set null,   -- source, informatif
  snapshot          jsonb not null,                    -- copie immuable de la séance (invariant 3)
  snapshot_version  int not null default 1,
  scheduled_on      date,
  status            text not null default 'assigned' check (status in ('assigned','in_progress','completed','missed')),
  token_hash        text unique,                       -- haché ; jamais le jeton en clair
  token_expires_at  timestamptz,
  assigned_by       uuid references auth.users(id) on delete set null,
  athlete_comment   text,
  session_rpe       numeric check (session_rpe between 1 and 10),
  completed_at      timestamptz,
  created_at        timestamptz not null default now(),
  unique (id, organization_id),
  foreign key (athlete_id, organization_id) references public.athletes (id, organization_id) on delete cascade
);
create index on public.assignments (athlete_id, scheduled_on);

create or replace function public.prevent_snapshot_change()
returns trigger language plpgsql as $$
begin
  if new.snapshot is distinct from old.snapshot then
    raise exception 'assignments.snapshot est immuable' using errcode = '23514';
  end if;
  return new;
end $$;
create trigger trg_assignments_snapshot_immutable before update on public.assignments
  for each row execute function public.prevent_snapshot_change();

create table public.performed_sets (
  id                    uuid primary key default gen_random_uuid(),
  organization_id       uuid not null,
  assignment_id         uuid not null,
  snapshot_exercise_id  text not null,      -- id de la ligne d'exercice dans le snapshot
  set_index             int not null check (set_index >= 1),
  load_kg               numeric,
  reps                  int check (reps >= 0),
  rpe                   numeric check (rpe between 1 and 10 and (rpe * 2) = floor(rpe * 2)),
  duration_s            int,
  distance_m            numeric,
  note                  text,
  performed_at          timestamptz not null default now(),
  unique (assignment_id, snapshot_exercise_id, set_index),
  foreign key (assignment_id, organization_id) references public.assignments (id, organization_id) on delete cascade
);
