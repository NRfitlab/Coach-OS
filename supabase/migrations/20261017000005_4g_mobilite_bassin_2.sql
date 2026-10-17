-- 4g-4b : mobilité du bassin et des lombaires, seconde moitié (15 fiches), rédaction originale, à relire.
-- Rejouable : un nom déjà présent parmi les exercices communs est ignoré.

with v(name, name_fr, description, steps, cues, common_mistakes, body_zones, technique, level, unilateral, equipment, primary_muscles, secondary_muscles) as (
values
('Quadruped fire hydrant','Chien qui lève la patte (à quatre pattes)',
 'À quatre pattes, le genou s’ouvre sur le côté en rotation externe de hanche, sans que le bassin ne tourne.',
 ARRAY['À quatre pattes, mains sous les épaules, genoux sous les hanches.','Lever un genou sur le côté, comme un chien près d’une borne, bassin immobile.','Redescendre lentement, 10 à 12 répétitions par côté.'],
 ARRAY['Bassin immobile','Dos plat'],
 ARRAY['Faire pivoter le bassin','Cambrer le bas du dos'],
 ARRAY['hip'],'activation','beginner',true,ARRAY['bodyweight'],ARRAY['glutes','abductors'],ARRAY['hip_rotators']),

('Quadruped hip extension','Extension de hanche à quatre pattes',
 'À quatre pattes, une jambe se tend vers l’arrière en restant alignée avec le dos, sans cambrer.',
 ARRAY['À quatre pattes, abdominaux engagés.','Tendre une jambe vers l’arrière jusqu’à l’alignement avec le dos, sans cambrer.','Revenir lentement, 10 à 12 répétitions par côté.'],
 ARRAY['Dos plat','Mouvement venant de la hanche'],
 ARRAY['Cambrer le bas du dos','Monter la jambe au-delà de l’alignement'],
 ARRAY['hip','pelvis_lumbar'],'activation','beginner',true,ARRAY['bodyweight'],ARRAY['glutes'],ARRAY['hamstrings','lower_back']),

('Posterior tilt glute bridge','Pont fessier avec bascule du bassin',
 'Pont fessier en démarrant par la bascule du bassin vers l’arrière, pour apprendre à monter sans cambrer.',
 ARRAY['Allongé sur le dos, genoux fléchis, pieds à plat.','Basculer le bassin pour plaquer le bas du dos au sol, puis monter les hanches vertèbre par vertèbre.','Tenir 2 s en haut, redescendre lentement, 8 à 12 répétitions.'],
 ARRAY['Côtes basses rentrées','Fessiers contractés en haut'],
 ARRAY['Cambrer le bas du dos en haut','Pousser avec le haut des cuisses'],
 ARRAY['pelvis_lumbar','hip'],'activation','beginner',false,ARRAY['bodyweight'],ARRAY['glutes'],ARRAY['hamstrings','abs']),

('Marching glute bridge','Pont fessier avec marche',
 'Pont fessier maintenu, les genoux montent alternativement vers la poitrine sans que le bassin ne tourne.',
 ARRAY['Se placer en pont fessier, hanches hautes.','Monter un genou vers la poitrine puis le reposer, sans que le bassin ne tourne.','Alterner, 8 à 12 montées par jambe.'],
 ARRAY['Hanches stables','Fessiers contractés'],
 ARRAY['Faire tourner le bassin','Laisser les hanches descendre'],
 ARRAY['pelvis_lumbar','hip'],'activation','intermediate',true,ARRAY['bodyweight'],ARRAY['glutes','abs'],ARRAY['hamstrings']),

('Standing figure-four stretch','Figure 4 debout',
 'Debout sur une jambe, la cheville opposée posée sur le genou, le bassin recule pour étirer le fessier.',
 ARRAY['Debout face à un mur ou une chaise pour l’équilibre, croiser une cheville sur le genou opposé.','Fléchir la jambe d’appui en reculant le bassin.','Tenir 30 à 45 s, puis changer de côté.'],
 ARRAY['Buste droit','Genou de la jambe croisée ouvert'],
 ARRAY['Arrondir le dos','Forcer sur le genou croisé'],
 ARRAY['hip'],'static_stretch','intermediate',true,ARRAY['wall'],ARRAY['glutes'],ARRAY['hip_rotators']),

('Supine knee-across-body stretch','Genou vers l’épaule opposée allongé',
 'Allongé sur le dos, un genou est amené vers l’épaule opposée pour étirer le fessier et les rotateurs de hanche.',
 ARRAY['Allongé sur le dos, jambes tendues.','Ramener un genou vers l’épaule opposée avec les mains.','Tenir 30 à 45 s, puis changer de jambe.'],
 ARRAY['Bassin à plat','Épaules au sol'],
 ARRAY['Soulever le bassin','Tirer sur le genou avec force'],
 ARRAY['hip','pelvis_lumbar'],'static_stretch','beginner',true,ARRAY['bodyweight'],ARRAY['glutes'],ARRAY['hip_rotators']),

('Seated hip internal rotation rock','Bascule en rotation interne de hanche assis',
 'Assis, genoux fléchis, pieds écartés, les genoux basculent d’un côté à l’autre pour mobiliser la rotation interne de hanche.',
 ARRAY['Assis au sol, genoux fléchis, pieds un peu plus larges que le bassin, mains derrière soi.','Laisser tomber les deux genoux vers la droite, puis vers la gauche.','Faire 10 à 12 bascules lentes.'],
 ARRAY['Dos long','Mouvement fluide'],
 ARRAY['Se laisser tomber en arrière','Forcer l’amplitude'],
 ARRAY['hip'],'active_mobility','intermediate',false,ARRAY['bodyweight'],ARRAY['hip_rotators'],ARRAY['glutes']),

('Quadruped side rock','Bascule latérale à quatre pattes',
 'À quatre pattes, les fessiers se décalent vers un côté puis l’autre pour mobiliser hanche et bassin dans le plan frontal.',
 ARRAY['À quatre pattes, mains sous les épaules, genoux sous les hanches.','Décaler les fessiers vers la droite en gardant les mains en place, puis vers la gauche.','Faire 8 à 10 bascules par côté.'],
 ARRAY['Dos plat','Mouvement lent'],
 ARRAY['Arrondir le dos','Déplacer les mains avec les fessiers'],
 ARRAY['hip','pelvis_lumbar'],'active_mobility','beginner',false,ARRAY['bodyweight'],ARRAY['glutes'],ARRAY['adductors','obliques']),

('Standing hip circle','Cercles de hanche debout',
 'Debout sur une jambe, l’autre genou dessine de larges cercles pour mobiliser la hanche dans toute son amplitude.',
 ARRAY['Debout, une main en appui sur un mur, lever un genou.','Dessiner de larges cercles avec le genou, 8 dans chaque sens.','Changer de jambe.'],
 ARRAY['Bassin stable','Grand cercle'],
 ARRAY['Pencher le tronc','Cercles trop petits'],
 ARRAY['hip'],'articular_rotation','beginner',true,ARRAY['wall'],ARRAY['hip_rotators'],ARRAY['glutes','hip_flexors']),

('Standing hip hinge reach','Charnière de hanche debout, bras en avant',
 'Debout, les bras tendus devant soi, le buste s’incline depuis les hanches, dos plat, pour répéter le geste de charnière.',
 ARRAY['Debout, pieds à largeur de hanches, genoux légèrement fléchis, bras tendus devant.','Pousser les fessiers vers l’arrière en inclinant le buste, dos plat.','Remonter en poussant les hanches vers l’avant, 8 à 12 répétitions.'],
 ARRAY['Dos long','Poids sur les talons'],
 ARRAY['Arrondir le bas du dos','Fléchir les genoux comme dans un squat'],
 ARRAY['hip','pelvis_lumbar'],'dynamic_stretch','beginner',false,ARRAY['bodyweight'],ARRAY['glutes','hamstrings'],ARRAY['lower_back']),

('Standing side bend','Inclinaison latérale debout',
 'Debout, un bras monte au-dessus de la tête et le buste s’incline latéralement pour étirer le flanc.',
 ARRAY['Debout, pieds à largeur de hanches, un bras levé au-dessus de la tête.','Incliner le buste de l’autre côté, bassin immobile.','Revenir, 8 à 10 répétitions par côté, ou tenir 20 s.'],
 ARRAY['Bassin immobile','Mouvement dans un plan latéral'],
 ARRAY['Se pencher vers l’avant','Verrouiller les genoux'],
 ARRAY['pelvis_lumbar'],'dynamic_stretch','beginner',true,ARRAY['bodyweight'],ARRAY['obliques'],ARRAY['lats']),

('Child’s pose side reach','Posture de l’enfant, bras vers le côté',
 'Depuis la posture de l’enfant, les deux mains marchent vers un côté pour étirer le flanc et le dos du côté opposé.',
 ARRAY['Prendre la posture de l’enfant, bras tendus devant.','Marcher avec les mains vers la droite jusqu’à sentir l’étirement du flanc gauche.','Tenir 20 à 30 s en respirant calmement, puis changer de côté.'],
 ARRAY['Fessiers vers les talons','Respiration dans le flanc'],
 ARRAY['Soulever les fessiers','Hausser les épaules'],
 ARRAY['pelvis_lumbar','thoracic'],'static_stretch','beginner',true,ARRAY['bodyweight'],ARRAY['lats'],ARRAY['obliques']),

('TFL foam rolling','Rouleau sur le tenseur du fascia lata',
 'Allongé sur le côté, le rouleau sous l’avant-côté de la hanche, pour détendre cette zone.',
 ARRAY['Allongé sur le côté, rouleau sous la partie avant-externe de la hanche, en appui sur l’avant-bras.','Rouler lentement quelques centimètres vers le haut et vers le bas.','Faire 1 min par côté, avec une pression modérée.'],
 ARRAY['Pression modérée','Respiration calme'],
 ARRAY['Rouler sur l’os de la hanche','Appuyer jusqu’à la douleur vive'],
 ARRAY['hip'],'self_massage','intermediate',true,ARRAY['foam_roller'],ARRAY['abductors'],ARRAY[]::text[]),

('Standing crossed-leg side bend','Inclinaison latérale debout, jambes croisées',
 'Debout, une jambe croisée devant l’autre, le buste s’incline pour étirer l’extérieur de la hanche.',
 ARRAY['Debout, croiser une jambe devant l’autre, pieds serrés.','Lever le bras du côté de la jambe arrière et incliner le buste du côté opposé.','Tenir 20 à 30 s, puis changer de côté.'],
 ARRAY['Poids sur les deux pieds','Bassin qui décale doucement du côté opposé'],
 ARRAY['Se pencher vers l’avant','Forcer l’inclinaison'],
 ARRAY['hip','pelvis_lumbar'],'static_stretch','beginner',true,ARRAY['bodyweight'],ARRAY['abductors'],ARRAY['obliques']),

('Prone hip internal rotation','Rotation interne de hanche sur le ventre',
 'Allongé sur le ventre, genoux fléchis, les pieds s’écartent pour faire pivoter les hanches vers l’intérieur.',
 ARRAY['Allongé sur le ventre, jambes écartées à largeur de bassin, genoux fléchis à 90°.','Laisser les pieds s’écarter, les deux jambes tombent vers l’extérieur.','Tenir 20 à 30 s, ou balancer lentement de gauche à droite, 8 à 10 répétitions.'],
 ARRAY['Bassin collé au sol','Respiration calme'],
 ARRAY['Soulever le bassin','Forcer malgré une gêne au genou'],
 ARRAY['hip'],'active_mobility','intermediate',false,ARRAY['bodyweight'],ARRAY['hip_rotators'],ARRAY['glutes'])
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