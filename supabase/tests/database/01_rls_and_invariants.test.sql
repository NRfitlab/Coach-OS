-- Tests pgTAP : RLS multi-coach + invariants
-- Lancement (nécessite Docker) :  npx supabase test db
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(21);

-- =====================================================================
-- Fixtures (exécutées en superuser : la RLS est contournée)
-- =====================================================================
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'admin.a@test.local'),
  ('22222222-2222-2222-2222-222222222222', 'coach.a1@test.local'),
  ('33333333-3333-3333-3333-333333333333', 'coach.a2@test.local'),
  ('44444444-4444-4444-4444-444444444444', 'assist.a@test.local'),
  ('55555555-5555-5555-5555-555555555555', 'coach.b@test.local');

insert into public.organizations (id, name) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Org A'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Org B');

insert into public.organization_members (organization_id, user_id, role) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'admin'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'coach'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'coach'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'assistant'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'admin');

insert into public.athletes (id, organization_id, coach_id, full_name) values
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Athlète A1'),
  ('a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Athlète A2'),
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'Athlète B1');

insert into public.athlete_access (athlete_id, organization_id, user_id) values
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444');

insert into public.athlete_sensitive (organization_id, athlete_id, injuries_limitations, consent_at) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'donnée de test', now());

insert into public.athlete_goals (organization_id, athlete_id, priority, title) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'primary', 'Objectif test');

insert into public.athlete_references (organization_id, athlete_id, kind, value, unit, measured_on, method) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'hr_max', 190, 'bpm', current_date, 'declared');

insert into public.exercises (id, organization_id, name) values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Exercice privé Org B');

insert into public.workouts (id, organization_id, athlete_id, title) values
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Séance A1');

insert into public.workout_blocks (id, organization_id, workout_id, position, kind) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 1, 'straight');

insert into public.assignments (id, organization_id, athlete_id, snapshot) values
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', '{"v":1}'::jsonb);

-- =====================================================================
-- (a) Coach d'une autre organisation : rien de lisible, rien d'écrivable
-- =====================================================================
select set_config('request.jwt.claims', '{"sub":"55555555-5555-5555-5555-555555555555","role":"authenticated"}', true);
set local role authenticated;

select is((select count(*)::int from public.athletes where organization_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 0,
  '1. coach B ne voit aucun athlète de l''organisation A');

select throws_ok(
  $$insert into public.athletes (organization_id, coach_id, full_name)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'Intrus')$$,
  '42501', null, '2. coach B ne peut pas créer d''athlète dans l''organisation A');

select is((select count(*)::int from public.workouts where organization_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 0,
  '3. coach B ne voit aucune séance de l''organisation A');

-- =====================================================================
-- (b) Coach A1 / A2 : cloisonnement dans la même organisation
-- =====================================================================
select set_config('request.jwt.claims', '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', true);

select is((select count(*)::int from public.athletes where organization_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 1,
  '4. coach A1 ne voit que son propre athlète');

select is((select count(*)::int from public.athlete_sensitive where athlete_id = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'), 1,
  '12. coach A1 lit la section sensible de son athlète');

select is_empty(
  $$update public.athlete_references set value = 1 returning 1$$,
  '13. une valeur de référence ne peut pas être modifiée (historique conservé)');

select is_empty(
  $$update public.exercises set name = 'piraté' where organization_id is null returning 1$$,
  '14. un exercice commun n''est modifiable par personne');

select lives_ok($$select public.create_organization('Nouvelle org')$$,
  '20. un utilisateur connecté peut créer une organisation (RPC)');

select set_config('request.jwt.claims', '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}', true);

select is((select count(*)::int from public.athletes where id = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'), 0,
  '5. coach A2 ne voit pas l''athlète du coach A1');

-- =====================================================================
-- (c) Assistant : athlète autorisé seulement, jamais le sensible
-- =====================================================================
select set_config('request.jwt.claims', '{"sub":"44444444-4444-4444-4444-444444444444","role":"authenticated"}', true);

select is((select count(*)::int from public.athletes where id = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'), 1,
  '6. l''assistant voit l''athlète autorisé');

select is((select count(*)::int from public.athletes where id = 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2'), 0,
  '7. l''assistant ne voit pas les autres athlètes');

select is((select count(*)::int from public.athlete_sensitive), 0,
  '8. l''assistant ne voit jamais la section sensible');

select is_empty(
  $$update public.athletes set full_name = 'modifié' returning 1$$,
  '9. l''assistant ne peut pas modifier le profil de l''athlète');

-- =====================================================================
-- (d) Admin : toute son organisation, rien d'autre
-- =====================================================================
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true);

select is((select count(*)::int from public.athletes where organization_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 2,
  '10. l''admin voit tous les athlètes de son organisation');

select is((select count(*)::int from public.athletes where organization_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 0,
  '11. l''admin ne voit pas l''organisation B');

-- =====================================================================
-- Accès anonyme
-- =====================================================================
select set_config('request.jwt.claims', '{"role":"anon"}', true);
set local role anon;

select throws_ok($$select count(*) from public.athletes$$, '42501', null,
  '19. un visiteur anonyme n''a aucun accès aux tables');

-- =====================================================================
-- Invariants structurels (en superuser)
-- =====================================================================
reset role;

select throws_ok(
  $$insert into public.workouts (organization_id, athlete_id, title)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'Séance inter-org')$$,
  '23503', null, '15. une séance ne peut pas viser un athlète d''une autre organisation');

select throws_ok(
  $$insert into public.workout_exercises (organization_id, block_id, position, exercise_id, prescription)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 1,
            'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '{"mode":"force"}'::jsonb)$$,
  '23514', null, '16. un exercice privé d''une autre organisation est refusé');

select throws_ok(
  $$update public.assignments set snapshot = '{"v":2}'::jsonb where id = 'ffffffff-ffff-ffff-ffff-ffffffffffff'$$,
  '23514', null, '17. le snapshot d''une assignation est immuable');

select throws_ok(
  $$delete from public.organization_members
    where user_id = '22222222-2222-2222-2222-222222222222'
      and organization_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  '23503', null, '18. impossible de retirer un coach qui a encore des athlètes');

select throws_ok(
  $$insert into public.athlete_goals (organization_id, athlete_id, priority, title)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'primary', 'Second principal')$$,
  '23505', null, '21. un seul objectif principal actif par athlète');

select * from finish();
rollback;
