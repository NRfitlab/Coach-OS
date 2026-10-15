alter table public.workout_blocks drop constraint if exists workout_blocks_kind_check;
alter table public.workout_blocks add constraint workout_blocks_kind_check
  check (kind = any (array[
    'warmup','straight','superset','circuit','emom','amrap','interval','cooldown','drills','continuous'
  ]));