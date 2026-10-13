-- Corrige INSERT ... RETURNING sur athletes : la politique de lecture juge sur les
-- colonnes de la ligne et non plus sur une relecture de la table. Droits inchangés.

create or replace function public.has_athlete_access(p_athlete uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.athlete_access x
    where x.athlete_id = p_athlete and x.user_id = auth.uid()
  );
$$;

revoke all on function public.has_athlete_access(uuid) from public, anon;
grant execute on function public.has_athlete_access(uuid) to authenticated;

drop policy if exists athletes_select on public.athletes;

create policy athletes_select on public.athletes
  for select to authenticated
  using (
    public.is_org_member(organization_id)
    and (
      public.org_role(organization_id) = 'admin'
      or coach_id = auth.uid()
      or public.has_athlete_access(id)
    )
  );