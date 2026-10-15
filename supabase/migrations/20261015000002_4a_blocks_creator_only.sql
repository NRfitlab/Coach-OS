create or replace function public.can_write_workout(p_workout uuid)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select exists (
    select 1 from public.workouts w
    where w.id = p_workout
      and public.can_edit_workout(w.organization_id, w.athlete_id, w.created_by)
  );
$$;