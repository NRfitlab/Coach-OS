-- =====================================================================
-- Coach OS — Migration 2 : sécurité (RLS multi-coach)
-- Rôles : admin (toute l'organisation), coach (ses athlètes),
--         assistant (athlètes listés dans athlete_access, jamais le sensible)
-- =====================================================================

-- ---------- Fonctions d'aide (SECURITY DEFINER : évitent la récursion) ----
create or replace function public.is_org_member(p_org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = p_org and m.user_id = auth.uid()
  );
$$;

create or replace function public.org_role(p_org uuid)
returns text language sql stable security definer set search_path = public as $$
  select m.role from public.organization_members m
  where m.organization_id = p_org and m.user_id = auth.uid();
$$;

-- Lecture : admin, coach responsable, ou assistant autorisé
create or replace function public.can_access_athlete(p_athlete uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.athletes a
    join public.organization_members m
      on m.organization_id = a.organization_id and m.user_id = auth.uid()
    where a.id = p_athlete
      and (
        m.role = 'admin'
        or a.coach_id = auth.uid()
        or exists (select 1 from public.athlete_access x
                   where x.athlete_id = a.id and x.user_id = auth.uid())
      )
  );
$$;

-- Gestion (profil, objectifs, références, sensible) : admin ou coach responsable
create or replace function public.can_manage_athlete(p_athlete uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.athletes a
    join public.organization_members m
      on m.organization_id = a.organization_id and m.user_id = auth.uid()
    where a.id = p_athlete
      and (m.role = 'admin' or (a.coach_id = auth.uid() and m.role in ('admin','coach')))
  );
$$;

-- Portée d'une séance : modèle d'organisation (athlete NULL) ou séance d'athlète
create or replace function public.can_read_scope(p_org uuid, p_athlete uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select case when p_athlete is null then public.is_org_member(p_org)
              else public.can_access_athlete(p_athlete) end;
$$;

create or replace function public.can_write_scope(p_org uuid, p_athlete uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select case when p_athlete is null then public.org_role(p_org) in ('admin','coach')
              else public.can_access_athlete(p_athlete) end;
$$;

create or replace function public.can_read_workout(p_workout uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.workouts w
                 where w.id = p_workout and public.can_read_scope(w.organization_id, w.athlete_id));
$$;

create or replace function public.can_write_workout(p_workout uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.workouts w
                 where w.id = p_workout and public.can_write_scope(w.organization_id, w.athlete_id));
$$;

create or replace function public.can_read_block(p_block uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.workout_blocks b
                 where b.id = p_block and public.can_read_workout(b.workout_id));
$$;

create or replace function public.can_write_block(p_block uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.workout_blocks b
                 where b.id = p_block and public.can_write_workout(b.workout_id));
$$;

create or replace function public.can_access_assignment(p_assignment uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.assignments s
                 where s.id = p_assignment and public.can_access_athlete(s.athlete_id));
$$;

-- ---------- RPC : création d'une organisation -----------------------------
create or replace function public.create_organization(p_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_org uuid;
begin
  if auth.uid() is null then
    raise exception 'authentification requise' using errcode = '28000';
  end if;
  insert into public.organizations (name, created_by) values (p_name, auth.uid())
    returning id into v_org;
  insert into public.organization_members (organization_id, user_id, role)
    values (v_org, auth.uid(), 'admin');
  return v_org;
end $$;

-- ---------- Droits d'exécution et accès anonyme ---------------------------
revoke all on all tables in schema public from anon;
revoke execute on all functions in schema public from anon, public;
grant execute on all functions in schema public to authenticated;
alter default privileges in schema public revoke all on tables from anon;

-- ---------- Activation de la RLS partout ----------------------------------
alter table public.organizations         enable row level security;
alter table public.profiles              enable row level security;
alter table public.organization_members  enable row level security;
alter table public.athletes              enable row level security;
alter table public.athlete_access        enable row level security;
alter table public.athlete_sensitive     enable row level security;
alter table public.athlete_goals         enable row level security;
alter table public.athlete_references    enable row level security;
alter table public.movements             enable row level security;
alter table public.exercises             enable row level security;
alter table public.workouts              enable row level security;
alter table public.workout_blocks        enable row level security;
alter table public.workout_exercises     enable row level security;
alter table public.assignments           enable row level security;
alter table public.performed_sets        enable row level security;

-- ---------- organizations (création uniquement via create_organization) ---
create policy org_select on public.organizations
  for select to authenticated using (public.is_org_member(id));
create policy org_update on public.organizations
  for update to authenticated
  using (public.org_role(id) = 'admin') with check (public.org_role(id) = 'admin');

-- ---------- profiles -------------------------------------------------------
create policy profiles_select on public.profiles
  for select to authenticated using (
    id = auth.uid()
    or exists (
      select 1 from public.organization_members a
      join public.organization_members b on a.organization_id = b.organization_id
      where a.user_id = auth.uid() and b.user_id = profiles.id
    )
  );
create policy profiles_update on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- ---------- organization_members -------------------------------------------
create policy members_select on public.organization_members
  for select to authenticated using (public.is_org_member(organization_id));
create policy members_insert on public.organization_members
  for insert to authenticated with check (public.org_role(organization_id) = 'admin');
create policy members_update on public.organization_members
  for update to authenticated
  using (public.org_role(organization_id) = 'admin')
  with check (public.org_role(organization_id) = 'admin');
create policy members_delete on public.organization_members
  for delete to authenticated using (public.org_role(organization_id) = 'admin');

-- ---------- athletes ---------------------------------------------------------
create policy athletes_select on public.athletes
  for select to authenticated using (public.can_access_athlete(id));
create policy athletes_insert on public.athletes
  for insert to authenticated with check (
    public.org_role(organization_id) = 'admin'
    or (public.org_role(organization_id) = 'coach' and coach_id = auth.uid())
  );
create policy athletes_update on public.athletes
  for update to authenticated
  using (public.can_manage_athlete(id))
  with check (
    public.org_role(organization_id) = 'admin'
    or (public.org_role(organization_id) = 'coach' and coach_id = auth.uid())
  );
create policy athletes_delete on public.athletes
  for delete to authenticated using (public.can_manage_athlete(id));

-- ---------- athlete_access ---------------------------------------------------
create policy access_select on public.athlete_access
  for select to authenticated
  using (public.can_manage_athlete(athlete_id) or user_id = auth.uid());
create policy access_insert on public.athlete_access
  for insert to authenticated with check (public.can_manage_athlete(athlete_id));
create policy access_delete on public.athlete_access
  for delete to authenticated using (public.can_manage_athlete(athlete_id));

-- ---------- athlete_sensitive (coach responsable et admin uniquement) -------
create policy sensitive_select on public.athlete_sensitive
  for select to authenticated using (public.can_manage_athlete(athlete_id));
create policy sensitive_insert on public.athlete_sensitive
  for insert to authenticated
  with check (public.can_manage_athlete(athlete_id) and consent_at is not null);
create policy sensitive_update on public.athlete_sensitive
  for update to authenticated
  using (public.can_manage_athlete(athlete_id))
  with check (public.can_manage_athlete(athlete_id) and consent_at is not null);
create policy sensitive_delete on public.athlete_sensitive
  for delete to authenticated using (public.can_manage_athlete(athlete_id));

-- ---------- athlete_goals -----------------------------------------------------
create policy goals_select on public.athlete_goals
  for select to authenticated using (public.can_access_athlete(athlete_id));
create policy goals_insert on public.athlete_goals
  for insert to authenticated with check (public.can_manage_athlete(athlete_id));
create policy goals_update on public.athlete_goals
  for update to authenticated
  using (public.can_manage_athlete(athlete_id)) with check (public.can_manage_athlete(athlete_id));
create policy goals_delete on public.athlete_goals
  for delete to authenticated using (public.can_manage_athlete(athlete_id));

-- ---------- athlete_references (pas de policy UPDATE : historique conservé) -
create policy refs_select on public.athlete_references
  for select to authenticated using (public.can_access_athlete(athlete_id));
create policy refs_insert on public.athlete_references
  for insert to authenticated with check (public.can_manage_athlete(athlete_id));
create policy refs_delete on public.athlete_references
  for delete to authenticated using (public.can_manage_athlete(athlete_id));

-- ---------- movements : lecture seule ----------------------------------------
create policy movements_select on public.movements
  for select to authenticated using (true);

-- ---------- exercises : communs en lecture seule, personnalisés par org ------
create policy exercises_select on public.exercises
  for select to authenticated
  using (organization_id is null or public.is_org_member(organization_id));
create policy exercises_insert on public.exercises
  for insert to authenticated
  with check (organization_id is not null and public.org_role(organization_id) in ('admin','coach'));
create policy exercises_update on public.exercises
  for update to authenticated
  using (organization_id is not null and public.org_role(organization_id) in ('admin','coach'))
  with check (organization_id is not null and public.org_role(organization_id) in ('admin','coach'));
create policy exercises_delete on public.exercises
  for delete to authenticated
  using (organization_id is not null and public.org_role(organization_id) in ('admin','coach'));

-- ---------- workouts / blocks / workout_exercises -----------------------------
create policy workouts_select on public.workouts
  for select to authenticated using (public.can_read_scope(organization_id, athlete_id));
create policy workouts_insert on public.workouts
  for insert to authenticated with check (public.can_write_scope(organization_id, athlete_id));
create policy workouts_update on public.workouts
  for update to authenticated
  using (public.can_write_scope(organization_id, athlete_id))
  with check (public.can_write_scope(organization_id, athlete_id));
create policy workouts_delete on public.workouts
  for delete to authenticated using (public.can_write_scope(organization_id, athlete_id));

create policy blocks_select on public.workout_blocks
  for select to authenticated using (public.can_read_workout(workout_id));
create policy blocks_insert on public.workout_blocks
  for insert to authenticated with check (public.can_write_workout(workout_id));
create policy blocks_update on public.workout_blocks
  for update to authenticated
  using (public.can_write_workout(workout_id)) with check (public.can_write_workout(workout_id));
create policy blocks_delete on public.workout_blocks
  for delete to authenticated using (public.can_write_workout(workout_id));

create policy wex_select on public.workout_exercises
  for select to authenticated using (public.can_read_block(block_id));
create policy wex_insert on public.workout_exercises
  for insert to authenticated with check (public.can_write_block(block_id));
create policy wex_update on public.workout_exercises
  for update to authenticated
  using (public.can_write_block(block_id)) with check (public.can_write_block(block_id));
create policy wex_delete on public.workout_exercises
  for delete to authenticated using (public.can_write_block(block_id));

-- ---------- assignments --------------------------------------------------------
create policy assignments_select on public.assignments
  for select to authenticated using (public.can_access_athlete(athlete_id));
create policy assignments_insert on public.assignments
  for insert to authenticated with check (public.can_access_athlete(athlete_id));
create policy assignments_update on public.assignments
  for update to authenticated
  using (public.can_access_athlete(athlete_id)) with check (public.can_access_athlete(athlete_id));
create policy assignments_delete on public.assignments
  for delete to authenticated using (public.can_access_athlete(athlete_id));

-- ---------- performed_sets : lecture côté coach ; écriture par Edge Function ---
create policy performed_select on public.performed_sets
  for select to authenticated using (public.can_access_assignment(assignment_id));
