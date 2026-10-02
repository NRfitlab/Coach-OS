-- =====================================================================
-- Données de démonstration (PROJET DEV UNIQUEMENT, jamais en prod)
-- Prérequis : créer 4 utilisateurs dans Supabase → Authentication → Users
--   admin.a@demo.test   (admin de Club Alpha)
--   coach.a@demo.test   (coach de Club Alpha)
--   assist.a@demo.test  (assistant de Club Alpha)
--   coach.b@demo.test   (admin de Club Beta, pour tester l'isolation)
-- Puis exécuter ce script dans l'éditeur SQL du projet dev.
-- Toutes les données ci-dessous sont fictives.
-- =====================================================================
do $$
declare
  v_admin_a uuid; v_coach_a uuid; v_assist_a uuid; v_coach_b uuid;
  v_org_a uuid; v_org_b uuid;
  v_jean uuid; v_marie uuid; v_thomas uuid;
  v_squat uuid;
begin
  select id into v_admin_a  from auth.users where email = 'admin.a@demo.test';
  select id into v_coach_a  from auth.users where email = 'coach.a@demo.test';
  select id into v_assist_a from auth.users where email = 'assist.a@demo.test';
  select id into v_coach_b  from auth.users where email = 'coach.b@demo.test';

  if v_admin_a is null or v_coach_a is null or v_assist_a is null or v_coach_b is null then
    raise exception 'Crée d''abord les 4 utilisateurs demo (voir l''en-tête du fichier).';
  end if;
  if exists (select 1 from public.organizations where name = 'Club Alpha') then
    raise notice 'Données de démo déjà présentes, rien à faire.';
    return;
  end if;

  insert into public.organizations (name, created_by) values ('Club Alpha', v_admin_a) returning id into v_org_a;
  insert into public.organizations (name, created_by) values ('Club Beta',  v_coach_b) returning id into v_org_b;

  insert into public.organization_members (organization_id, user_id, role) values
    (v_org_a, v_admin_a,  'admin'),
    (v_org_a, v_coach_a,  'coach'),
    (v_org_a, v_assist_a, 'assistant'),
    (v_org_b, v_coach_b,  'admin');

  insert into public.athletes
    (organization_id, coach_id, full_name, primary_sport, secondary_sports, level,
     sessions_per_week, available_minutes, availability, equipment)
  values
    (v_org_a, v_coach_a, 'Jean Dupont', 'HYROX', '{course,musculation}', 'intermediate', 5, 90,
     '{"mon":60,"tue":90,"wed":0,"thu":60,"fri":45,"sat":120,"sun":0}'::jsonb,
     '{gym:barbell,gym:rack,gym:skierg,home:dumbbells}')
  returning id into v_jean;

  insert into public.athletes
    (organization_id, coach_id, full_name, primary_sport, level, sessions_per_week, available_minutes, equipment)
  values
    (v_org_a, v_coach_a, 'Marie Martin', 'Course à pied', 'intermediate', 4, 60, '{gym:dumbbells,home:dumbbells}')
  returning id into v_marie;

  insert into public.athletes
    (organization_id, coach_id, full_name, primary_sport, level, sessions_per_week, available_minutes, equipment)
  values
    (v_org_b, v_coach_b, 'Thomas Bernard', 'Musculation', 'beginner', 3, 60, '{gym:barbell,gym:rack}')
  returning id into v_thomas;

  insert into public.athlete_access (athlete_id, organization_id, user_id)
    values (v_jean, v_org_a, v_assist_a);

  insert into public.athlete_goals
    (organization_id, athlete_id, priority, type, title, metric, target_date)
  values
    (v_org_a, v_jean, 'primary', 'compétition', 'HYROX', 'temps total', date '2027-06-15');
  insert into public.athlete_goals
    (organization_id, athlete_id, priority, type, title, metric, current_value, target_value, unit)
  values
    (v_org_a, v_jean, 'secondary', 'force', 'Squat arrière', '1RM', 140, 150, 'kg'),
    (v_org_a, v_marie, 'primary', 'performance', '5 km', 'temps', 1290, 1230, 's');

  select id into v_squat from public.exercises where organization_id is null and name = 'Back squat';

  insert into public.athlete_references
    (organization_id, athlete_id, kind, exercise_id, value, unit, measured_on, method)
  values
    (v_org_a, v_jean, 'one_rm', v_squat, 140, 'kg', date '2026-09-01', 'direct_test'),
    (v_org_a, v_jean, 'mas', null, 17.5, 'km/h', date '2026-09-10', 'direct_test'),
    (v_org_a, v_marie, 'mas', null, 16.0, 'km/h', date '2026-09-05', 'estimated');

  -- Section sensible fictive, avec consentement
  insert into public.athlete_sensitive (organization_id, athlete_id, injuries_limitations, consent_at, consent_by)
  values (v_org_a, v_jean, 'Donnée fictive de démonstration.', now(), v_coach_a);

  raise notice 'Démo créée : Club Alpha (2 athlètes), Club Beta (1 athlète).';
end $$;
