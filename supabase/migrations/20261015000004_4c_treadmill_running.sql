update public.exercises
set movement_id = (select id from public.movements where slug = 'running')
where organization_id is null and name = 'Treadmill run';