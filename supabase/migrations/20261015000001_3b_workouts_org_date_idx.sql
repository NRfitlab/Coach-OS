create index if not exists workouts_org_scheduled_on_idx
  on public.workouts (organization_id, scheduled_on);