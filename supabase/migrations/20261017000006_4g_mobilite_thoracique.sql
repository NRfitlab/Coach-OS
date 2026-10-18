-- 4g-5a : mobilité de la colonne thoracique (15 fiches), rédaction originale, à relire.
-- Rejouable : un nom déjà présent parmi les exercices communs est ignoré.

with v(name, name_fr, description, steps, cues, common_mistakes, body_zones, technique, level, unilateral, equipment, primary_muscles, secondary_muscles) as (
values
('Thoracic extension over foam roller','Extension thoracique sur rouleau',
 'Allongé sur le dos, le rouleau placé sous le haut du dos, le buste s’étend au-dessus du rouleau pour mobiliser la colonne thoracique en extension.',
 ARRAY['S’allonger sur le dos, rouleau en travers sous le haut du dos, mains derrière la tête, genoux fléchis.','Laisser la tête et le haut du dos s’étendre au-dessus du rouleau, côtes basses rentrées.','Revenir, déplacer le rouleau de quelques centimètres, 6 à 8 répétitions par position.'],
 ARRAY['Côtes basses rentrées','Menton légèrement rentré'],
 ARRAY['Cambrer le bas du dos','Placer le rouleau sous les lombaires'],
 ARRAY['thoracic'],'active_mobility','beginner',false,ARRAY['foam_roller'],ARRAY['upper_back'],ARRAY['chest']),

('Seated thoracic extension over chair','Extension thoracique assis sur dossier',
 'Assis sur une chaise, le haut du dos s’étend au-dessus du dossier pour mobiliser la colonne thoracique.',
 ARRAY['Assis sur une chaise, dossier au niveau du bas des omoplates, mains derrière la tête.','S’étendre doucement au-dessus du dossier, côtes basses rentrées.','Revenir, 8 à 10 répétitions.'],
 ARRAY['Côtes basses rentrées','Mouvement lent'],
 ARRAY['Cambrer le bas du dos','Se laisser tomber en arrière'],
 ARRAY['thoracic'],'active_mobility','beginner',false,ARRAY['chair'],ARRAY['upper_back'],ARRAY['chest']),

('Quadruped thoracic rotation','Rotation thoracique à quatre pattes',
 'À quatre pattes, une main derrière la tête, le coude s’ouvre vers le plafond puis revient vers le coude opposé.',
 ARRAY['À quatre pattes, une main derrière la tête.','Ouvrir le coude vers le plafond en tournant le haut du dos, bassin immobile.','Refermer vers l’autre coude, 8 à 10 répétitions par côté.'],
 ARRAY['Bassin immobile','Regard qui suit le coude'],
 ARRAY['Faire tourner le bassin','Mouvement trop rapide'],
 ARRAY['thoracic'],'active_mobility','beginner',true,ARRAY['bodyweight'],ARRAY['obliques','upper_back'],ARRAY['chest']),

('Side-lying windmill','Moulin à vent en décubitus latéral',
 'Allongé sur le côté, genoux fléchis, un bras décrit un grand arc au-dessus du buste pour mobiliser la rotation thoracique.',
 ARRAY['Allongé sur le côté, hanches et genoux fléchis à 90°, bras tendus devant, paumes jointes.','Faire glisser le bras du dessus en arc vers l’arrière, en suivant la main du regard.','Revenir, 8 à 10 répétitions par côté, genoux collés ensemble.'],
 ARRAY['Genoux collés','Regard qui suit la main'],
 ARRAY['Décoller les genoux','Forcer au-delà de l’amplitude confortable'],
 ARRAY['thoracic','shoulder'],'active_mobility','beginner',true,ARRAY['bodyweight'],ARRAY['obliques','upper_back'],ARRAY['chest']),

('Seated thoracic rotation','Rotation thoracique assis',
 'Assis sur une chaise, bras croisés sur la poitrine, le buste tourne d’un côté puis de l’autre, bassin immobile.',
 ARRAY['Assis sur une chaise, pieds à plat, bras croisés sur la poitrine.','Tourner le buste d’un côté en gardant le bassin immobile.','Revenir et tourner de l’autre côté, 8 à 10 répétitions par côté.'],
 ARRAY['Bassin immobile','Dos long'],
 ARRAY['Tourner depuis les lombaires','Voûter le dos'],
 ARRAY['thoracic'],'active_mobility','beginner',false,ARRAY['chair'],ARRAY['obliques'],ARRAY['upper_back']),

('Half-kneeling thoracic rotation','Rotation thoracique à demi-genou',
 'À demi-genou, une main derrière la tête, le buste tourne vers la jambe avant puis s’ouvre vers l’arrière.',
 ARRAY['À demi-genou, jambe avant à 90°, une main derrière la tête.','Tourner le buste vers le genou avant puis ouvrir le coude vers le plafond.','Faire 8 répétitions par côté, bassin stable.'],
 ARRAY['Bassin stable','Fessier arrière contracté'],
 ARRAY['Cambrer le bas du dos','Faire tourner le bassin'],
 ARRAY['thoracic','hip'],'active_mobility','intermediate',true,ARRAY['bodyweight'],ARRAY['obliques','upper_back'],ARRAY['hip_flexors']),

('Prone thoracic extension lift','Élévation thoracique sur le ventre',
 'Allongé sur le ventre, le haut du corps se soulève légèrement par l’extension du haut du dos.',
 ARRAY['Allongé sur le ventre, bras le long du corps, front vers le sol.','Soulever le haut du buste de quelques centimètres en gardant la nuque longue.','Tenir 2 s, redescendre lentement, 8 à 10 répétitions.'],
 ARRAY['Nuque longue','Soulèvement modéré'],
 ARRAY['Relever la tête','Cambrer le bas du dos'],
 ARRAY['thoracic'],'activation','beginner',false,ARRAY['bodyweight'],ARRAY['upper_back','lower_back'],ARRAY['rear_delts']),

('Wall angel','Ange au mur',
 'Dos contre un mur, les bras glissent le long du mur en V puis en W pour mobiliser les épaules et le haut du dos.',
 ARRAY['Debout dos au mur, talons à 10 cm, côtes basses rentrées, bras contre le mur à 90°.','Glisser les bras vers le haut sans décoller le dos, coudes et poignets en contact avec le mur autant que possible.','Redescendre, 8 à 10 répétitions lentes.'],
 ARRAY['Côtes basses rentrées','Dos et bras au mur'],
 ARRAY['Cambrer le bas du dos','Hausser les épaules'],
 ARRAY['thoracic','shoulder','scapula'],'active_mobility','intermediate',false,ARRAY['wall'],ARRAY['upper_back','traps'],ARRAY['rear_delts']),

('Upper back foam rolling','Rouleau sur le haut du dos',
 'Allongé sur le dos, le rouleau sous le haut du dos, rouler lentement entre les omoplates et le milieu du dos.',
 ARRAY['S’allonger sur le dos, rouleau sous les omoplates, bras croisés sur la poitrine, bassin légèrement levé.','Rouler lentement du haut des omoplates au milieu du dos.','Faire 1 à 2 min, pauses de 20 s sur les zones sensibles.'],
 ARRAY['Pression modérée','Respiration calme'],
 ARRAY['Rouler sur les lombaires','Appuyer jusqu’à la douleur vive'],
 ARRAY['thoracic'],'self_massage','beginner',false,ARRAY['foam_roller'],ARRAY['upper_back'],ARRAY['traps']),

('Thoracic ball massage','Auto-massage thoracique à la balle',
 'Une balle de massage entre le dos et le mur pour cibler les points sensibles du haut du dos, à côté de la colonne.',
 ARRAY['Placer une balle entre le haut du dos et le mur, à côté de la colonne vertébrale.','Fléchir légèrement les genoux pour rouler lentement sur la zone sensible.','Faire 1 min par côté.'],
 ARRAY['Balle à côté de la colonne','Pression progressive'],
 ARRAY['Placer la balle sur la colonne','Insister sur une douleur vive'],
 ARRAY['thoracic'],'self_massage','beginner',true,ARRAY['massage_ball','wall'],ARRAY['upper_back'],ARRAY['traps']),

('Puppy pose','Posture du chiot',
 'À genoux, les mains avancent et la poitrine descend vers le sol, fessiers au-dessus des genoux, pour étirer le haut du dos et les épaules.',
 ARRAY['À quatre pattes, avancer les mains de quelques dizaines de centimètres.','Descendre la poitrine vers le sol, fessiers au-dessus des genoux.','Tenir 20 à 30 s en respirant calmement.'],
 ARRAY['Fessiers au-dessus des genoux','Respiration profonde'],
 ARRAY['Reculer les fessiers vers les talons','Forcer sur les épaules'],
 ARRAY['thoracic','shoulder'],'static_stretch','beginner',false,ARRAY['bodyweight'],ARRAY['lats','upper_back'],ARRAY['chest']),

('Bench thoracic extension stretch','Étirement thoracique, coudes sur un banc',
 'À genoux devant un banc, les coudes posés dessus, la poitrine descend vers le sol pour étirer le haut du dos et les épaules.',
 ARRAY['S’agenouiller face à un banc, coudes posés dessus, mains jointes ou tenant un bâton.','Descendre la poitrine vers le sol, dos plat.','Tenir 20 à 30 s en respirant calmement.'],
 ARRAY['Dos plat','Côtes basses rentrées'],
 ARRAY['Cambrer le bas du dos','Forcer sur les épaules'],
 ARRAY['thoracic','shoulder'],'static_stretch','intermediate',false,ARRAY['bench'],ARRAY['lats','upper_back'],ARRAY['chest']),

('Side-lying rib breathing','Respiration costale en décubitus latéral',
 'Allongé sur le côté, la respiration dirige l’air vers les côtes du dessus pour mobiliser la cage thoracique.',
 ARRAY['Allongé sur le côté, genoux fléchis, un bras tendu au-dessus de la tête.','Inspirer par le nez en dirigeant l’air vers les côtes du dessus.','Expirer lentement, 8 à 10 respirations par côté.'],
 ARRAY['Expiration lente','Côtes qui s’écartent'],
 ARRAY['Hausser les épaules','Respirer vers le ventre seulement'],
 ARRAY['thoracic'],'activation','beginner',true,ARRAY['bodyweight'],ARRAY['obliques'],ARRAY['abs']),

('Seated cat-cow','Chat-vache assis',
 'Assis sur une chaise, le dos s’arrondit puis se creuse doucement, mains sur les genoux.',
 ARRAY['Assis sur une chaise, mains sur les genoux.','Arrondir le dos en rentrant le menton, puis creuser doucement en ouvrant la poitrine.','Alterner lentement, 8 à 10 répétitions.'],
 ARRAY['Mouvement lent','Respiration synchronisée'],
 ARRAY['Forcer l’amplitude','Mouvement trop rapide'],
 ARRAY['thoracic','pelvis_lumbar'],'active_mobility','beginner',false,ARRAY['chair'],ARRAY['upper_back','abs'],ARRAY['lower_back']),

('Lat foam rolling','Rouleau sur les grands dorsaux',
 'Allongé sur le côté, le rouleau sous l’aisselle, bras tendu, pour détendre le grand dorsal.',
 ARRAY['Allongé sur le côté, rouleau sous l’aisselle, bras du dessous tendu au-dessus de la tête.','Rouler lentement du pli de l’aisselle vers le milieu du dos.','Faire 1 min par côté, pression modérée.'],
 ARRAY['Pression modérée','Bras tendu'],
 ARRAY['Rouler directement sur l’épaule','Appuyer jusqu’à la douleur vive'],
 ARRAY['thoracic','shoulder'],'self_massage','intermediate',true,ARRAY['foam_roller'],ARRAY['lats'],ARRAY['upper_back'])
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