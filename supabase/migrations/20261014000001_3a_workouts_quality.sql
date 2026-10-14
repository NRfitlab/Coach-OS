alter table public.workouts
  add column if not exists quality text,
  add column if not exists planned_minutes integer;

alter table public.workouts drop constraint if exists workouts_quality_check;
alter table public.workouts add constraint workouts_quality_check
  check (quality is null or quality in
    ('strength','power','running','conditioning','mobility','recovery','other'));

alter table public.workouts drop constraint if exists workouts_planned_minutes_check;
alter table public.workouts add constraint workouts_planned_minutes_check
  check (planned_minutes is null or planned_minutes between 1 and 600);

drop policy if exists assignments_delete on public.assignments;
create policy assignments_delete on public.assignments
  for delete to authenticated
  using (public.can_manage_athlete(athlete_id));