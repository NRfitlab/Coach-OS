-- 4g-3a : mobilité du genou, première moitié (15 fiches), rédaction originale, à relire.
-- Rejouable : un nom déjà présent parmi les exercices communs est ignoré.

with v(name, name_fr, description, steps, cues, common_mistakes, body_zones, technique, level, unilateral, equipment, primary_muscles, secondary_muscles) as (
values
('Heel slide','Glissement du talon',
 'Allongé sur le dos, le talon glisse vers les fessiers pour fléchir le genou, puis revient jambe tendue.',
 ARRAY['Allongé sur le dos, jambes tendues.','Faire glisser un talon vers les fessiers en fléchissant le genou.','Revenir jambe tendue, 10 à 15 répétitions par jambe.'],
 ARRAY['Talon qui glisse sur le sol','Mouvement lent et fluide'],
 ARRAY['Décoller le talon du sol','Bascule du bassin'],
 ARRAY['knee'],'active_mobility','beginner',true,ARRAY['bodyweight'],ARRAY['hamstrings','quadriceps'],ARRAY[]::text[]),

('Prone quad stretch with strap','Quadriceps sur le ventre à la sangle',
 'Allongé sur le ventre, une sangle ramène le talon vers le fessier pour étirer l’avant de la cuisse.',
 ARRAY['Allongé sur le ventre, sangle autour de la cheville.','Tirer doucement le talon vers le fessier avec la sangle.','Tenir 30 à 45 s, puis changer de jambe.'],
 ARRAY['Bassin collé au sol','Traction progressive'],
 ARRAY['Creuser le bas du dos','Tirer jusqu’à une douleur dans le genou'],
 ARRAY['knee','hip'],'static_stretch','beginner',true,ARRAY['strap'],ARRAY['quadriceps'],ARRAY['hip_flexors']),

('Side-lying quad stretch','Quadriceps en décubitus latéral',
 'Allongé sur le côté, la main ramène le talon du dessus vers le fessier.',
 ARRAY['Allongé sur le côté, jambe du dessous fléchie pour la stabilité.','Attraper la cheville du dessus et ramener le talon vers le fessier.','Tenir 30 à 45 s, puis changer de côté.'],
 ARRAY['Genoux proches l’un de l’autre','Bassin légèrement basculé vers l’arrière'],
 ARRAY['Creuser le bas du dos','Genou qui part loin devant'],
 ARRAY['knee','hip'],'static_stretch','beginner',true,ARRAY['bodyweight'],ARRAY['quadriceps'],ARRAY['hip_flexors']),

('Banded terminal knee extension','Extension terminale du genou à la bande',
 'Une bande derrière le genou résiste à la dernière phase d’extension, pour activer le quadriceps.',
 ARRAY['Fixer une bande à hauteur du genou, la passer derrière le genou, face à l’ancrage.','Genou légèrement fléchi, tendre la jambe contre la bande.','Tenir 2 s, revenir lentement, 12 à 15 répétitions par jambe.'],
 ARRAY['Quadriceps contracté en fin de course','Retour contrôlé'],
 ARRAY['Verrouiller le genou en arrière','Se pencher en avant'],
 ARRAY['knee'],'activation','beginner',true,ARRAY['band'],ARRAY['quadriceps'],ARRAY[]::text[]),

('Quad set','Contraction isométrique du quadriceps',
 'Assis jambe tendue, contracter le quadriceps pour pousser l’arrière du genou vers le sol.',
 ARRAY['Assis ou allongé, jambe tendue, une serviette roulée sous le genou.','Contracter le quadriceps et pousser le genou vers le bas.','Tenir 5 s, relâcher, 10 répétitions par jambe.'],
 ARRAY['Rotule qui remonte légèrement','Respiration continue'],
 ARRAY['Bloquer la respiration','Contracter les fessiers à la place'],
 ARRAY['knee'],'activation','beginner',true,ARRAY['bodyweight'],ARRAY['quadriceps'],ARRAY[]::text[]),

('Seated active knee extension','Extension active du genou assis',
 'Assis sur une chaise, tendre le genou jusqu’à la jambe alignée, sans charge.',
 ARRAY['Assis sur une chaise, dos droit.','Tendre un genou jusqu’à aligner la jambe, orteils vers soi.','Tenir 2 s, redescendre lentement, 10 à 15 répétitions par jambe.'],
 ARRAY['Buste droit','Mouvement lent'],
 ARRAY['Se pencher en arrière','Balancer la jambe'],
 ARRAY['knee'],'active_mobility','beginner',true,ARRAY['chair'],ARRAY['quadriceps'],ARRAY[]::text[]),

('Seated hamstring stretch','Ischio-jambiers assis',
 'Assis au bord d’une chaise, jambe tendue devant, le buste s’incline vers l’avant en gardant le dos droit.',
 ARRAY['Assis au bord d’une chaise, une jambe tendue, talon au sol.','Incliner le buste vers l’avant depuis les hanches, dos droit.','Tenir 30 à 45 s, puis changer de jambe.'],
 ARRAY['Dos long','Pied relevé ou relâché selon la sensation'],
 ARRAY['Arrondir le dos','Verrouiller le genou en arrière'],
 ARRAY['knee','hip'],'static_stretch','beginner',true,ARRAY['chair'],ARRAY['hamstrings'],ARRAY['calves']),

('Wall hamstring stretch','Ischio-jambiers au mur',
 'Allongé sur le dos, les jambes montées contre un mur, pour étirer l’arrière des cuisses de façon passive.',
 ARRAY['S’allonger sur le dos, fessiers près du mur.','Poser les jambes contre le mur, genoux tendus ou légèrement fléchis.','Tenir 1 à 2 min en respirant calmement.'],
 ARRAY['Bas du dos au sol','Distance au mur ajustée à la sensation'],
 ARRAY['Fessiers trop près du mur au début','Jambes en tension forcée'],
 ARRAY['knee','hip'],'static_stretch','beginner',false,ARRAY['wall'],ARRAY['hamstrings'],ARRAY[]::text[]),

('Quad foam rolling','Rouleau sur les quadriceps',
 'Allongé sur le ventre, le rouleau sous les cuisses, avancer et reculer pour détendre l’avant de la cuisse.',
 ARRAY['Allongé sur le ventre en appui sur les avant-bras, rouleau sous les cuisses.','Rouler de la hanche au-dessus du genou.','Faire 1 à 2 min par jambe, pauses de 20 s sur les zones sensibles.'],
 ARRAY['Gainage du tronc','Pression modérée'],
 ARRAY['Rouler sur la rotule','Creuser le bas du dos'],
 ARRAY['knee','hip'],'self_massage','beginner',true,ARRAY['foam_roller'],ARRAY['quadriceps'],ARRAY[]::text[]),

('Hamstring foam rolling','Rouleau sur les ischio-jambiers',
 'Assis, le rouleau sous l’arrière des cuisses, pour détendre les ischio-jambiers.',
 ARRAY['Assis, rouleau sous l’arrière des cuisses, mains au sol.','Rouler de sous les fessiers jusqu’au-dessus du genou.','Faire 1 à 2 min par jambe.'],
 ARRAY['Pression modérée','Respiration calme'],
 ARRAY['Rouler directement sous le genou','Aller trop vite'],
 ARRAY['knee','hip'],'self_massage','beginner',true,ARRAY['foam_roller'],ARRAY['hamstrings'],ARRAY[]::text[]),

('Lateral thigh foam rolling','Rouleau sur la face externe de la cuisse',
 'Allongé sur le côté, le rouleau sous la face externe de la cuisse, pour détendre cette zone.',
 ARRAY['Allongé sur le côté, rouleau sous la cuisse, jambe du dessus fléchie devant.','Rouler de la hanche jusqu’au-dessus du genou.','Faire 1 min par côté, avec une pression modérée.'],
 ARRAY['Pression progressive','Appui stable des mains'],
 ARRAY['Appuyer trop fort','Rouler sur le côté du genou'],
 ARRAY['knee','hip'],'self_massage','intermediate',true,ARRAY['foam_roller'],ARRAY['abductors'],ARRAY['quadriceps']),

('Standing knee circles','Cercles de genoux debout',
 'Debout, mains sur les genoux, cercles lents et légers pour échauffer l’articulation.',
 ARRAY['Debout, pieds joints, genoux légèrement fléchis, mains sur les genoux.','Dessiner de petits cercles lents avec les genoux, 8 dans chaque sens.','Arrêter si une gêne apparaît.'],
 ARRAY['Cercles petits et lents','Appui régulier sur les pieds'],
 ARRAY['Cercles trop larges','Verrouiller les genoux'],
 ARRAY['knee'],'articular_rotation','beginner',false,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY['quadriceps','hamstrings']),

('Deep lunge hold','Fente profonde maintenue',
 'Fente basse maintenue, talon avant au sol, pour mobiliser genou, cheville et hanche.',
 ARRAY['Faire un grand pas en avant, descendre en fente basse.','Garder le talon avant au sol, genou dans l’axe du pied.','Tenir 20 à 30 s, puis changer de jambe.'],
 ARRAY['Buste droit','Genou avant dans l’axe du 2e orteil'],
 ARRAY['Talon qui décolle','Genou qui rentre vers l’intérieur'],
 ARRAY['knee','hip','ankle'],'active_mobility','intermediate',true,ARRAY['bodyweight'],ARRAY['quadriceps','glutes'],ARRAY['hip_flexors','calves']),

('Slow sit-to-stand','Assis-debout lent',
 'Se lever d’une chaise et se rasseoir lentement pour contrôler le genou sur toute l’amplitude.',
 ARRAY['Assis sur une chaise, pieds à plat à largeur de hanches.','Se lever en 2 s, genoux dans l’axe des pieds.','Se rasseoir en 3 s, 8 à 12 répétitions.'],
 ARRAY['Descente contrôlée','Appui sur tout le pied'],
 ARRAY['Se laisser tomber sur la chaise','Genoux qui rentrent'],
 ARRAY['knee','hip'],'activation','beginner',false,ARRAY['chair'],ARRAY['quadriceps','glutes'],ARRAY['hamstrings']),

('Hamstring heel dig isometric','Contraction isométrique des ischio-jambiers, talon au sol',
 'Allongé sur le dos, genou légèrement fléchi, pousser le talon dans le sol sans le faire glisser.',
 ARRAY['Allongé sur le dos, genoux fléchis, talons au sol.','Pousser un talon dans le sol comme pour le tirer vers les fessiers, sans bouger.','Tenir 5 s, relâcher, 10 répétitions par jambe.'],
 ARRAY['Intensité progressive','Talon qui reste immobile'],
 ARRAY['Contracter à fond d’emblée','Bloquer la respiration'],
 ARRAY['knee','hip'],'activation','beginner',true,ARRAY['bodyweight'],ARRAY['hamstrings'],ARRAY['glutes'])
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