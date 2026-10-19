-- 4h-1 : statut « fiche validée » des exercices, par organisation.
-- Une ligne = fiche validée. Pas de ligne = « à relire ». Rejouable.

create table if not exists public.exercise_reviews (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz not null default now(),
  primary key (organization_id, exercise_id)
);

create index if not exists exercise_reviews_exercise_idx
  on public.exercise_reviews (exercise_id);

alter table public.exercise_reviews enable row level security;

revoke all on public.exercise_reviews from anon, authenticated;
grant select, insert, delete on public.exercise_reviews to authenticated;

drop policy if exists exercise_reviews_select on public.exercise_reviews;
create policy exercise_reviews_select on public.exercise_reviews
  for select to authenticated
  using (public.is_org_member(organization_id));

drop policy if exists exercise_reviews_insert on public.exercise_reviews;
create policy exercise_reviews_insert on public.exercise_reviews
  for insert to authenticated
  with check (
    public.org_role(organization_id) in ('admin', 'coach')
    and reviewed_by = auth.uid()
  );

drop policy if exists exercise_reviews_delete on public.exercise_reviews;
create policy exercise_reviews_delete on public.exercise_reviews
  for delete to authenticated
  using (public.org_role(organization_id) in ('admin', 'coach'));

-- Invariant 8 : un exercice commun, ou de la même organisation, seulement.
create or replace function public.trg_review_same_org()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_found boolean;
  v_org uuid;
begin
  select true, organization_id into v_found, v_org
  from public.exercises where id = new.exercise_id;
  if v_found is not true then
    raise exception 'exercise not found';
  end if;
  if v_org is not null and v_org <> new.organization_id then
    raise exception 'exercise belongs to another organization';
  end if;
  return new;
end;
$$;

revoke all on function public.trg_review_same_org() from public, anon, authenticated;

drop trigger if exists trg_review_same_org on public.exercise_reviews;
create trigger trg_review_same_org
  before insert on public.exercise_reviews
  for each row execute function public.trg_review_same_org();