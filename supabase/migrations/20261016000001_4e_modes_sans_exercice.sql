alter table public.workout_exercises drop constraint if exists workout_exercises_prescription_check;
alter table public.workout_exercises add constraint workout_exercises_prescription_check
  check (
    jsonb_typeof(prescription) = 'object'
    and (prescription ->> 'mode') = any (array[
      'force','course','conditioning','mobilite','puissance','recuperation','libre'
    ])
  );

alter table public.workout_exercises alter column exercise_id drop not null;

alter table public.workout_exercises drop constraint if exists workout_exercises_exercise_required;
alter table public.workout_exercises add constraint workout_exercises_exercise_required
  check (exercise_id is not null or (prescription ->> 'mode') in ('libre', 'recuperation'));