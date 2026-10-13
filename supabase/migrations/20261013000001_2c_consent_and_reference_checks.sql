-- 2c : consentement horodaté côté serveur + garde-fous sur athlete_references

alter table public.athlete_sensitive
  alter column consent_at set default now();

create or replace function public.sensitive_consent_server_side()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.consent_at := now();
    new.consent_by := auth.uid();
  else
    new.consent_at := old.consent_at;
    new.consent_by := old.consent_by;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_sensitive_consent on public.athlete_sensitive;
create trigger trg_sensitive_consent
  before insert or update on public.athlete_sensitive
  for each row execute function public.sensitive_consent_server_side();

alter table public.athlete_references
  add constraint ref_value_positive check (value > 0) not valid,
  add constraint ref_estimated_needs_formula
    check (method <> 'estimated' or estimation_formula is not null) not valid;
