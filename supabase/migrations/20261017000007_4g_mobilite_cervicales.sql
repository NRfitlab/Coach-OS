-- 4g-5b : mobilité des cervicales (15 fiches), rédaction originale, à relire.
-- Rejouable : un nom déjà présent parmi les exercices communs est ignoré.

with v(name, name_fr, description, steps, cues, common_mistakes, body_zones, technique, level, unilateral, equipment, primary_muscles, secondary_muscles) as (
values
('Chin tuck','Rétraction du menton',
 'Assis ou debout, le menton recule horizontalement pour aligner la tête au-dessus des épaules, sans baisser la tête.',
 ARRAY['Assis ou debout, regard à l’horizontale.','Reculer le menton en gardant la tête à niveau, comme pour faire un double menton.','Tenir 3 à 5 s, relâcher, 8 à 10 répétitions. Arrêter en cas de vertiges ou de picotements dans les bras.'],
 ARRAY['Regard à l’horizontale','Nuque longue'],
 ARRAY['Baisser la tête','Pousser le menton vers le bas'],
 ARRAY['cervical'],'activation','beginner',false,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY['traps']),

('Supine chin tuck','Rétraction du menton allongé',
 'Allongé sur le dos, la tête posée, le menton recule doucement pour aplatir l’arrière du cou vers le sol.',
 ARRAY['Allongé sur le dos, genoux fléchis, tête posée sur une petite serviette si besoin.','Reculer le menton pour allonger l’arrière du cou, sans lever la tête.','Tenir 3 à 5 s, relâcher, 8 à 10 répétitions. Arrêter en cas de vertiges ou de picotements dans les bras.'],
 ARRAY['Nuque longue','Tête qui reste au sol'],
 ARRAY['Lever la tête','Crisper la mâchoire'],
 ARRAY['cervical'],'activation','beginner',false,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY['traps']),

('Wall chin tuck','Rétraction du menton contre un mur',
 'Debout dos à un mur, l’arrière de la tête vient au contact du mur par la rétraction du menton, sans lever le menton.',
 ARRAY['Debout dos au mur, talons à 10 cm, épaules et fessiers contre le mur.','Reculer le menton pour amener l’arrière de la tête au contact du mur, regard à l’horizontale.','Tenir 3 à 5 s, relâcher, 8 à 10 répétitions. Arrêter en cas de vertiges ou de picotements dans les bras.'],
 ARRAY['Regard à l’horizontale','Menton qui recule'],
 ARRAY['Lever le menton','Cambrer le bas du dos'],
 ARRAY['cervical'],'activation','beginner',false,ARRAY['wall'],ARRAY[]::text[],ARRAY['traps','upper_back']),

('Seated neck rotation','Rotation active du cou assis',
 'Assis, la tête tourne lentement d’un côté puis de l’autre, épaules relâchées et immobiles.',
 ARRAY['Assis, dos droit, épaules relâchées, regard à l’horizontale.','Tourner la tête lentement d’un côté jusqu’à sentir une légère tension, sans forcer.','Revenir au centre et tourner de l’autre côté, 6 à 8 répétitions par côté. Arrêter en cas de vertiges.'],
 ARRAY['Épaules immobiles','Mouvement lent'],
 ARRAY['Forcer en fin d’amplitude','Hausser les épaules'],
 ARRAY['cervical'],'active_mobility','beginner',false,ARRAY['chair'],ARRAY[]::text[],ARRAY['traps']),

('Seated neck side bend','Inclinaison latérale active du cou assis',
 'Assis, l’oreille descend vers l’épaule du même côté, épaule relâchée, sans la hausser.',
 ARRAY['Assis, dos droit, épaules relâchées.','Incliner la tête pour rapprocher l’oreille de l’épaule, sans hausser celle-ci.','Revenir au centre, 6 à 8 répétitions par côté. Arrêter en cas de picotements dans le bras.'],
 ARRAY['Épaule basse et relâchée','Mouvement lent'],
 ARRAY['Hausser l’épaule vers l’oreille','Faire pivoter la tête'],
 ARRAY['cervical'],'active_mobility','beginner',false,ARRAY['chair'],ARRAY['traps'],ARRAY[]::text[]),

('Neck flexion and extension','Flexion et extension douces du cou',
 'Assis, la tête s’incline lentement vers l’avant puis revient vers l’arrière, sans aller en fin d’amplitude.',
 ARRAY['Assis, dos droit, regard à l’horizontale.','Baisser doucement le menton vers la poitrine, puis revenir à la position neutre.','Regarder légèrement vers le haut sans forcer, 6 à 8 répétitions. Arrêter en cas de vertiges ou de picotements.'],
 ARRAY['Mouvement lent','Amplitude modérée'],
 ARRAY['Forcer l’extension du cou','Aller trop vite'],
 ARRAY['cervical'],'active_mobility','beginner',false,ARRAY['chair'],ARRAY[]::text[],ARRAY['traps']),

('Upper trapezius stretch','Étirement du trapèze supérieur',
 'Assis, l’oreille est inclinée vers l’épaule du même côté pendant que l’autre épaule reste basse, pour étirer le côté du cou.',
 ARRAY['Assis, dos droit, une main tenant le bord de la chaise pour garder l’épaule basse.','Incliner la tête vers l’autre épaule, avec une pression douce de la main libre si besoin.','Tenir 20 à 30 s, puis changer de côté. Arrêter en cas de picotements dans le bras.'],
 ARRAY['Épaule basse','Pression douce'],
 ARRAY['Tirer fort sur la tête','Hausser l’épaule étirée'],
 ARRAY['cervical','shoulder'],'static_stretch','beginner',true,ARRAY['chair'],ARRAY['traps'],ARRAY[]::text[]),

('Levator scapulae stretch','Étirement de l’élévateur de la scapula',
 'Assis, la tête tourne à 45° puis s’incline vers la poitrine, pour étirer le muscle entre la nuque et l’omoplate.',
 ARRAY['Assis, une main tenant le bord de la chaise pour garder l’épaule basse.','Tourner la tête à 45° vers l’autre côté puis baisser le menton vers la poitrine.','Tenir 20 à 30 s, puis changer de côté. Arrêter en cas de picotements dans le bras.'],
 ARRAY['Épaule basse','Pression très douce'],
 ARRAY['Forcer la traction','Hausser l’épaule'],
 ARRAY['cervical','scapula'],'static_stretch','intermediate',true,ARRAY['chair'],ARRAY['traps'],ARRAY['upper_back']),

('Scalene stretch','Étirement des scalènes',
 'Assis, la tête s’incline sur le côté et légèrement vers l’arrière, l’épaule du côté étiré étant maintenue basse.',
 ARRAY['Assis, une main tenant le bord de la chaise pour garder l’épaule basse.','Incliner la tête vers l’autre épaule puis la tourner légèrement vers le haut, avec des mouvements très doux.','Tenir 15 à 20 s, puis changer de côté. Arrêter en cas de vertiges ou de picotements.'],
 ARRAY['Mouvements très doux','Respiration calme'],
 ARRAY['Forcer l’amplitude','Hausser l’épaule'],
 ARRAY['cervical'],'static_stretch','intermediate',true,ARRAY['chair'],ARRAY[]::text[],ARRAY['traps']),

('Neck isometric side press','Pression isométrique latérale du cou',
 'La main pousse contre la tête sur le côté, la tête résiste sans bouger, à faible intensité.',
 ARRAY['Assis, dos droit, main posée sur le côté de la tête.','Pousser la tête contre la main à 20 à 30 % de l’effort, sans bouger, pendant 5 s.','Relâcher, 5 répétitions par côté. Arrêter en cas de vertiges ou de douleur.'],
 ARRAY['Effort léger','Respiration continue'],
 ARRAY['Pousser trop fort','Bloquer la respiration'],
 ARRAY['cervical'],'activation','beginner',true,ARRAY['bodyweight'],ARRAY['traps'],ARRAY[]::text[]),

('Neck isometric flexion press','Pression isométrique du cou en flexion',
 'La main sur le front, la tête pousse vers l’avant sans bouger, à faible intensité.',
 ARRAY['Assis, dos droit, paume contre le front.','Pousser le front contre la main à 20 à 30 % de l’effort, sans bouger, pendant 5 s.','Relâcher, 5 répétitions. Arrêter en cas de vertiges ou de douleur.'],
 ARRAY['Effort léger','Menton légèrement rentré'],
 ARRAY['Pousser trop fort','Bloquer la respiration'],
 ARRAY['cervical'],'activation','beginner',false,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY['traps']),

('Neck isometric extension press','Pression isométrique du cou en extension',
 'Les mains derrière la tête, la tête pousse vers l’arrière sans bouger, à faible intensité.',
 ARRAY['Assis, dos droit, mains jointes derrière la tête.','Pousser la tête vers l’arrière contre les mains à 20 à 30 % de l’effort, sans bouger, pendant 5 s.','Relâcher, 5 répétitions. Arrêter en cas de vertiges ou de douleur.'],
 ARRAY['Effort léger','Menton légèrement rentré'],
 ARRAY['Pousser trop fort','Cambrer la nuque'],
 ARRAY['cervical'],'activation','beginner',false,ARRAY['bodyweight'],ARRAY['traps','upper_back'],ARRAY[]::text[]),

('Suboccipital ball release','Relâchement des sous-occipitaux à la balle',
 'Allongé sur le dos, une balle de massage sous la base du crâne, pour détendre les muscles profonds de la nuque.',
 ARRAY['Allongé sur le dos, genoux fléchis, balle de massage sous la base du crâne, un peu à côté de la colonne.','Laisser le poids de la tête s’appuyer sur la balle en respirant calmement.','Tenir 1 min, puis changer de côté. Arrêter en cas de picotements ou de douleur vive.'],
 ARRAY['Balle sous la base du crâne','Respiration calme'],
 ARRAY['Placer la balle sur la colonne vertébrale','Appuyer trop fort'],
 ARRAY['cervical'],'self_massage','intermediate',true,ARRAY['massage_ball'],ARRAY[]::text[],ARRAY['traps']),

('Upper trapezius ball massage','Auto-massage du trapèze supérieur à la balle',
 'Une balle de massage entre le haut du dos et le mur, sous l’épaule, pour détendre le haut du trapèze.',
 ARRAY['Placer une balle entre le mur et le haut du trapèze, entre le cou et l’épaule.','Fléchir légèrement les genoux pour rouler lentement sur la zone sensible.','Faire 1 min par côté. Arrêter en cas de picotements ou de douleur vive.'],
 ARRAY['Pression progressive','Respiration calme'],
 ARRAY['Placer la balle sur le cou','Insister sur une douleur vive'],
 ARRAY['cervical','shoulder'],'self_massage','beginner',true,ARRAY['massage_ball','wall'],ARRAY['traps'],ARRAY[]::text[]),

('Neck half circles','Demi-cercles du cou',
 'Assis, le menton dessine un demi-cercle de l’épaule gauche à l’épaule droite en passant par la poitrine, sans passer par l’arrière.',
 ARRAY['Assis, dos droit, épaules relâchées.','Baisser le menton vers la poitrine et le faire glisser lentement d’une épaule à l’autre.','Faire 5 passages lents. Arrêter en cas de vertiges.'],
 ARRAY['Mouvement lent','Épaules relâchées'],
 ARRAY['Faire un cercle complet vers l’arrière','Aller trop vite'],
 ARRAY['cervical'],'articular_rotation','beginner',false,ARRAY['chair'],ARRAY[]::text[],ARRAY['traps'])
)
insert into public.exercises
  (organization_id, movement_id, name, name_fr, description, steps, cues, common_mistakes,
   body_zones, technique, level, unilateral, equipment, primary_muscles, secondary_muscles)
select null, (select id from public.movements where slug = 'mobility'),
       v.name, v.name_fr, v.description, v.steps, v.cues, v.common_mistakes,
       v.body_zones, v.technique, v.level, v.unilateral, v.equipment, v.primary_muscles, v.secondary_muscles
from v
where not exists (
  select 1 from public.exercises e
  where e.organization_id is null and lower(e.name) = lower(v.name)
)
on conflict do nothing;