create or replace function public.can_edit_workout(p_org uuid, p_athlete uuid, p_created_by uuid)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select case
    when p_athlete is null then public.org_role(p_org) in ('admin', 'coach')
    else p_created_by = auth.uid() and public.can_manage_athlete(p_athlete)
  end;
$$;

revoke all on function public.can_edit_workout(uuid, uuid, uuid) from public, anon;
grant execute on function public.can_edit_workout(uuid, uuid, uuid) to authenticated;

drop policy if exists workouts_insert on public.workouts;
create policy workouts_insert on public.workouts
  for insert to authenticated
  with check (public.can_edit_workout(organization_id, athlete_id, created_by));

drop policy if exists workouts_update on public.workouts;
create policy workouts_update on public.workouts
  for update to authenticated
  using (public.can_edit_workout(organization_id, athlete_id, created_by))
  with check (public.can_edit_workout(organization_id, athlete_id, created_by));

drop policy if exists workouts_delete on public.workouts;
create policy workouts_delete on public.workouts
  for delete to authenticated
  using (public.can_edit_workout(organization_id, athlete_id, created_by));