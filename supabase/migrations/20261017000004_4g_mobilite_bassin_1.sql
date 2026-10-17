-- 4g-4a : mobilité du bassin et des lombaires, première moitié (15 fiches), rédaction originale, à relire.
-- Rejouable : un nom déjà présent parmi les exercices communs est ignoré.

with v(name, name_fr, description, steps, cues, common_mistakes, body_zones, technique, level, unilateral, equipment, primary_muscles, secondary_muscles) as (
values
('Supine pelvic tilt','Bascule du bassin allongé',
 'Allongé sur le dos, genoux fléchis, le bassin bascule pour aplatir puis cambrer légèrement le bas du dos.',
 ARRAY['Allongé sur le dos, genoux fléchis, pieds à plat.','Rouler le bassin pour plaquer le bas du dos au sol en contractant les abdominaux.','Revenir en cambrant légèrement, 10 à 15 répétitions lentes.'],
 ARRAY['Mouvement venant du bassin','Respiration continue'],
 ARRAY['Pousser avec les pieds ou les fessiers','Bloquer la respiration'],
 ARRAY['pelvis_lumbar'],'active_mobility','beginner',false,ARRAY['bodyweight'],ARRAY['abs','lower_back'],ARRAY['glutes']),

('Pelvic clock','Horloge pelvienne',
 'Allongé sur le dos, le bassin dessine les heures d’un cadran pour explorer les directions de mouvement lombo-pelvien.',
 ARRAY['Allongé sur le dos, genoux fléchis, imaginer un cadran sur le bassin.','Basculer le bassin vers 12 h, 3 h, 6 h puis 9 h, en petits mouvements.','Faire 5 tours dans chaque sens.'],
 ARRAY['Petite amplitude','Mouvement lent et fluide'],
 ARRAY['Bouger les jambes à la place du bassin','Amplitude trop grande'],
 ARRAY['pelvis_lumbar'],'articular_rotation','beginner',false,ARRAY['bodyweight'],ARRAY['abs','lower_back'],ARRAY['obliques']),

('Wall pelvic tilt','Bascule du bassin au mur',
 'Debout, dos contre un mur, le bassin bascule pour plaquer le bas du dos contre le mur, puis relâche.',
 ARRAY['Debout, talons à 10 cm du mur, fessiers et épaules contre le mur.','Contracter les abdominaux pour plaquer le bas du dos contre le mur.','Relâcher doucement, 10 à 12 répétitions.'],
 ARRAY['Genoux légèrement fléchis','Nuque longue'],
 ARRAY['Verrouiller les genoux','Pousser le thorax vers l’avant'],
 ARRAY['pelvis_lumbar'],'active_mobility','beginner',false,ARRAY['wall'],ARRAY['abs'],ARRAY['glutes']),

('Supine lumbar rotation','Rotation lombaire allongé, genoux de côté',
 'Allongé sur le dos, les genoux fléchis tombent doucement d’un côté puis de l’autre, épaules au sol.',
 ARRAY['Allongé sur le dos, bras en croix, genoux fléchis, pieds à plat.','Laisser tomber les genoux d’un côté sans forcer, épaules au sol.','Revenir au centre et changer de côté, 8 à 10 répétitions lentes.'],
 ARRAY['Épaules au sol','Amplitude confortable'],
 ARRAY['Forcer la rotation','Décoller les épaules'],
 ARRAY['pelvis_lumbar','hip'],'active_mobility','beginner',false,ARRAY['bodyweight'],ARRAY['obliques'],ARRAY['lower_back']),

('Double knee-to-chest rock','Balancier genoux à la poitrine',
 'Allongé sur le dos, les deux genoux ramenés vers la poitrine, balancement doux d’avant en arrière.',
 ARRAY['Allongé sur le dos, ramener les deux genoux vers la poitrine avec les mains.','Balancer doucement d’avant en arrière et sur les côtés.','Faire 30 à 60 s en respirant calmement.'],
 ARRAY['Mouvement lent','Nuque détendue'],
 ARRAY['Balancer trop fort','Tirer sur les genoux avec force'],
 ARRAY['pelvis_lumbar','hip'],'active_mobility','beginner',false,ARRAY['bodyweight'],ARRAY['lower_back'],ARRAY['glutes']),

('Sphinx pose','Posture du sphinx',
 'Allongé sur le ventre en appui sur les avant-bras, le haut du corps se redresse pour une extension douce de la région lombaire.',
 ARRAY['Allongé sur le ventre, coudes sous les épaules, avant-bras au sol.','Pousser les avant-bras dans le sol pour allonger le haut du corps.','Tenir 20 à 30 s en respirant calmement, arrêter si une douleur irradie.'],
 ARRAY['Épaules loin des oreilles','Fessiers relâchés'],
 ARRAY['Hausser les épaules','Forcer la cambrure'],
 ARRAY['pelvis_lumbar'],'static_stretch','beginner',false,ARRAY['bodyweight'],ARRAY['abs'],ARRAY['lower_back','hip_flexors']),

('Prone press-up','Extension en appui sur les mains sur le ventre',
 'Allongé sur le ventre, poussée des mains pour redresser le haut du corps, bassin au sol, pour une extension lombaire active.',
 ARRAY['Allongé sur le ventre, mains sous les épaules.','Pousser avec les bras pour redresser le haut du corps, bassin et cuisses au sol.','Redescendre lentement, 8 à 10 répétitions, arrêter si une douleur irradie vers la jambe.'],
 ARRAY['Fessiers relâchés','Respiration continue'],
 ARRAY['Contracter les fessiers','Forcer en fin d’amplitude'],
 ARRAY['pelvis_lumbar'],'active_mobility','intermediate',false,ARRAY['bodyweight'],ARRAY['lower_back'],ARRAY['abs']),

('Clamshell','Coquillage',
 'Allongé sur le côté, genoux fléchis, le genou du dessus s’ouvre sans que le bassin ne bascule.',
 ARRAY['Allongé sur le côté, hanches et genoux fléchis, pieds joints.','Ouvrir le genou du dessus sans faire rouler le bassin vers l’arrière.','Redescendre lentement, 12 à 15 répétitions par côté.'],
 ARRAY['Bassin immobile','Mouvement lent'],
 ARRAY['Rouler le bassin vers l’arrière','Décoller les pieds l’un de l’autre'],
 ARRAY['hip'],'activation','beginner',true,ARRAY['bodyweight'],ARRAY['glutes','hip_rotators'],ARRAY['abductors']),

('Glute foam rolling','Rouleau sur les fessiers',
 'Assis sur un rouleau, la jambe croisée en figure 4, pour détendre les muscles fessiers.',
 ARRAY['S’asseoir sur le rouleau, mains au sol derrière soi.','Croiser une cheville sur le genou opposé, incliner le poids du côté croisé.','Rouler lentement 1 à 2 min par côté, pause de 20 s sur les zones sensibles.'],
 ARRAY['Pression modérée','Respiration calme'],
 ARRAY['Rouler sur le bas du dos','Appuyer jusqu’à la douleur vive'],
 ARRAY['hip','pelvis_lumbar'],'self_massage','beginner',true,ARRAY['foam_roller'],ARRAY['glutes'],ARRAY['hip_rotators']),

('Glute ball massage','Auto-massage des fessiers à la balle',
 'Une balle de massage entre un fessier et le mur ou le sol pour cibler les points sensibles.',
 ARRAY['Placer la balle entre le fessier et le mur, ou au sol sous le fessier.','Déplacer lentement le poids pour rouler sur la zone sensible.','Faire 1 à 2 min par côté.'],
 ARRAY['Pression progressive','Respiration calme'],
 ARRAY['Placer la balle sur l’os du bassin ou la colonne','Insister sur une douleur vive'],
 ARRAY['hip','pelvis_lumbar'],'self_massage','beginner',true,ARRAY['massage_ball','wall'],ARRAY['glutes'],ARRAY['hip_rotators']),

('Hip flexor ball massage','Auto-massage des fléchisseurs de hanche à la balle',
 'Allongé sur le ventre, une balle sous le haut de la cuisse, juste sous l’os du bassin, pour détendre l’avant de la hanche.',
 ARRAY['Allongé sur le ventre, balle sous l’avant de la hanche, à côté de l’os du bassin.','Respirer calmement en laissant le poids s’appuyer sur la balle.','Bouger très légèrement la jambe, 1 min par côté.'],
 ARRAY['Poids progressif','Respiration lente'],
 ARRAY['Placer la balle sur le ventre ou l’os','Appuyer jusqu’à la douleur vive'],
 ARRAY['hip','pelvis_lumbar'],'self_massage','intermediate',true,ARRAY['massage_ball'],ARRAY['hip_flexors'],ARRAY['quadriceps']),

('Adductor foam rolling','Rouleau sur les adducteurs',
 'Allongé sur le ventre, une jambe fléchie sur le côté, le rouleau sous l’intérieur de la cuisse.',
 ARRAY['Allongé sur le ventre en appui sur les avant-bras, une jambe fléchie sur le côté, rouleau sous l’intérieur de la cuisse.','Rouler de l’aine jusqu’au-dessus du genou.','Faire 1 min par jambe, pression modérée.'],
 ARRAY['Pression modérée','Gainage du tronc'],
 ARRAY['Rouler sur l’aine directement','Appuyer trop fort'],
 ARRAY['hip'],'self_massage','intermediate',true,ARRAY['foam_roller'],ARRAY['adductors'],ARRAY[]::text[]),

('Wall hip hinge drill','Charnière de hanche au mur',
 'Debout dos à un mur, les fessiers reculent vers le mur en gardant le dos neutre, pour apprendre le mouvement de charnière.',
 ARRAY['Debout, dos à 20 cm d’un mur, pieds à largeur de hanches, genoux légèrement fléchis.','Pousser les fessiers vers le mur en inclinant le buste, dos neutre.','Remonter en poussant les hanches vers l’avant, 8 à 12 répétitions.'],
 ARRAY['Dos long','Genoux légèrement fléchis'],
 ARRAY['Arrondir le bas du dos','Fléchir les genoux comme dans un squat'],
 ARRAY['hip','pelvis_lumbar'],'active_mobility','beginner',false,ARRAY['wall'],ARRAY['glutes','hamstrings'],ARRAY['lower_back']),

('Thomas stretch','Étirement de Thomas',
 'Assis au bord d’un banc, se laisser basculer sur le dos en tenant un genou, pour étirer les fléchisseurs de hanche de la jambe libre.',
 ARRAY['S’asseoir au bord d’un banc, fessiers au bord.','Se coucher sur le dos en ramenant un genou vers la poitrine, l’autre jambe pend au bord.','Tenir 30 à 45 s, puis changer de jambe.'],
 ARRAY['Bas du dos au contact du banc','Jambe libre détendue'],
 ARRAY['Creuser le bas du dos','Ramener le genou trop fort'],
 ARRAY['hip','pelvis_lumbar'],'static_stretch','intermediate',true,ARRAY['bench'],ARRAY['hip_flexors'],ARRAY['quadriceps']),

('Standing pelvic hike','Bascule latérale du bassin debout',
 'Debout sur une marche, une jambe dans le vide : le bassin du côté libre monte et descend pour mobiliser les lombaires latéralement.',
 ARRAY['Debout sur le bord d’une marche, une jambe dans le vide, genoux tendus mais pas verrouillés.','Faire descendre la hanche du côté libre, puis la remonter en la tirant vers le haut.','Faire 10 à 12 répétitions lentes par côté, une main en appui.'],
 ARRAY['Genoux souples','Petite amplitude'],
 ARRAY['Fléchir la jambe d’appui','Mouvement trop rapide'],
 ARRAY['pelvis_lumbar','hip'],'active_mobility','intermediate',true,ARRAY['box'],ARRAY['obliques','abductors'],ARRAY['lower_back'])
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