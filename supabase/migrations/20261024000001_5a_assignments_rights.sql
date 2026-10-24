-- 5a : droits d'écriture sur assignments, suppression protégée, index (rejouable)
create or replace function public.assignment_has_sets(p_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.performed_sets where assignment_id = p_id)
$$;

revoke all on function public.assignment_has_sets(uuid) from public, anon;
grant execute on function public.assignment_has_sets(uuid) to authenticated;

drop policy if exists assignments_insert on public.assignments;
create policy assignments_insert on public.assignments
  for insert to authenticated
  with check (public.can_manage_athlete(athlete_id) and assigned_by = auth.uid());

drop policy if exists assignments_update on public.assignments;
create policy assignments_update on public.assignments
  for update to authenticated
  using (public.can_manage_athlete(athlete_id))
  with check (public.can_manage_athlete(athlete_id));

drop policy if exists assignments_delete on public.assignments;
create policy assignments_delete on public.assignments
  for delete to authenticated
  using (
    public.can_manage_athlete(athlete_id)
    and status = 'assigned'
    and completed_at is null
    and not public.assignment_has_sets(id)
  );

create index if not exists assignments_org_scheduled_on_idx
  on public.assignments (organization_id, scheduled_on);
