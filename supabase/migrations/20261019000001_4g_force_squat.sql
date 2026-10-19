-- 4g-12 : exercices de squat supplémentaires (15 fiches), rédaction originale, à relire.
-- Rejouable : un nom déjà présent parmi les exercices communs est ignoré.

with v(name, name_fr, description, steps, cues, common_mistakes, level, unilateral, equipment, primary_muscles, secondary_muscles) as (
values
('Low-bar back squat','Squat arrière barre basse',
 'Variante du squat arrière avec la barre posée plus bas sur les trapèzes, tronc plus incliné, qui sollicite davantage fessiers et ischio-jambiers.',
 ARRAY['Placer la barre sur la partie basse des trapèzes, sur les deltoïdes postérieurs, prise large et coudes vers l’arrière.','Descendre en reculant le bassin, tronc incliné, jusqu’à la profondeur souhaitée.','Remonter en poussant le sol en gardant le tronc stable.'],
 ARRAY['Hanches qui reculent','Barre stable sur les deltoïdes postérieurs'],
 ARRAY['Barre qui roule vers le bas du dos','Coudes qui tombent et tronc qui s’effondre'],
 'intermediate',false,ARRAY['barbell','rack'],ARRAY['glutes','quadriceps'],ARRAY['hamstrings','lower_back']),

('Tempo back squat','Squat arrière avec tempo',
 'Squat arrière avec une descente lente imposée, par exemple de 3 à 5 secondes, qui améliore le contrôle et la position basse.',
 ARRAY['Se placer comme pour un squat arrière.','Descendre en 3 à 5 s en gardant le tronc gainé, avec éventuellement une courte pause en bas.','Remonter à vitesse normale en poussant le sol.'],
 ARRAY['Descente régulière','Tronc gainé'],
 ARRAY['Accélérer la descente en fin de course','Perdre la tension en bas'],
 'intermediate',false,ARRAY['barbell','rack'],ARRAY['quadriceps','glutes'],ARRAY['hamstrings','lower_back']),

('Heel-elevated squat','Squat talons surélevés',
 'Squat avec les talons posés sur de petits disques ou une cale, qui facilite la profondeur et sollicite davantage les quadriceps.',
 ARRAY['Poser les talons sur de petits disques ou une cale, pieds à largeur d’épaules.','Descendre en poussant les genoux vers l’avant dans l’axe des pieds, tronc droit.','Remonter en poussant sur tout le pied.'],
 ARRAY['Genoux dans l’axe des orteils','Tronc droit'],
 ARRAY['Cale trop haute qui surcharge les genoux','Genoux qui rentrent'],
 'beginner',false,ARRAY['plate','bodyweight'],ARRAY['quadriceps'],ARRAY['glutes','calves']),

('Pin squat','Squat sur butées',
 'Squat dont chaque répétition part des butées du rack, en bas de l’amplitude, ce qui supprime l’élan de la descente.',
 ARRAY['Régler les butées du rack à la hauteur de profondeur souhaitée, barre posée dessus.','Se glisser sous la barre, gainer le tronc et pousser pour la décoller des butées.','Redescendre sous contrôle jusqu’aux butées, relâcher la barre sur elles, puis recommencer.'],
 ARRAY['Tension complète avant de pousser','Poussée sans rebond'],
 ARRAY['Se relâcher sur les butées','Dos qui s’arrondit au décollage'],
 'advanced',false,ARRAY['barbell','rack'],ARRAY['quadriceps','glutes'],ARRAY['hamstrings','lower_back']),

('Zombie squat','Squat zombie',
 'Squat avec la barre posée sur l’avant des épaules et les bras tendus devant, sans la tenir, ce qui oblige à garder le tronc vertical.',
 ARRAY['Poser la barre sur l’avant des épaules, bras tendus devant soi, sans la tenir avec les mains.','Descendre en squat en gardant le tronc vertical pour que la barre reste en place.','Remonter en poussant le sol.'],
 ARRAY['Tronc vertical','Barre collée au cou'],
 ARRAY['Buste qui s’incline et fait tomber la barre','Charge trop lourde pour apprendre le geste'],
 'intermediate',false,ARRAY['barbell','rack'],ARRAY['quadriceps','glutes'],ARRAY['abs','upper_back']),

('Dumbbell front squat','Squat avant aux haltères',
 'Squat avec deux haltères tenus sur l’avant des épaules.',
 ARRAY['Tenir un haltère dans chaque main à hauteur des épaules, coudes vers l’avant, paumes face à face.','Descendre en squat en gardant le tronc droit et les coudes hauts.','Remonter en poussant sur tout le pied.'],
 ARRAY['Coudes hauts','Tronc droit'],
 ARRAY['Coudes qui tombent','Talons qui décollent'],
 'beginner',false,ARRAY['dumbbell'],ARRAY['quadriceps','glutes'],ARRAY['abs','upper_back']),

('Dumbbell squat','Squat aux haltères, bras le long du corps',
 'Squat avec un haltère dans chaque main, bras le long du corps.',
 ARRAY['Debout, un haltère dans chaque main, bras tendus le long du corps, pieds à largeur d’épaules.','Descendre en squat en poussant les genoux dans l’axe des pieds.','Remonter en poussant sur tout le pied.'],
 ARRAY['Haltères le long du corps','Genoux dans l’axe des orteils'],
 ARRAY['Buste qui s’incline vers l’avant','Genoux qui rentrent'],
 'beginner',false,ARRAY['dumbbell'],ARRAY['quadriceps','glutes'],ARRAY['hamstrings','forearms']),

('Double kettlebell front squat','Squat avant à deux kettlebells',
 'Squat avec un kettlebell dans chaque main, posés sur l’avant des épaules en position rack.',
 ARRAY['Amener deux kettlebells en position rack, coudes proches du corps, poignets droits.','Descendre en squat en gardant le tronc vertical.','Remonter en poussant sur tout le pied.'],
 ARRAY['Coudes proches du corps','Tronc vertical'],
 ARRAY['Kettlebells qui s’écrasent sur les avant-bras','Coudes qui s’écartent'],
 'intermediate',false,ARRAY['kettlebell'],ARRAY['quadriceps','glutes'],ARRAY['abs','upper_back']),

('Sumo squat','Squat sumo',
 'Squat avec les pieds très écartés et les pointes ouvertes, souvent avec une charge entre les jambes, qui sollicite davantage les adducteurs.',
 ARRAY['Pieds écartés à environ le double de la largeur d’épaules, pointes ouvertes, charge tenue entre les jambes.','Descendre en écartant les genoux dans l’axe des pieds, tronc droit.','Remonter en poussant le sol.'],
 ARRAY['Genoux dans l’axe des pieds','Tronc droit'],
 ARRAY['Genoux qui rentrent','Bassin qui bascule en bas'],
 'beginner',false,ARRAY['dumbbell','kettlebell'],ARRAY['adductors','glutes'],ARRAY['quadriceps']),

('Single-leg box squat','Squat unipodal au box',
 'Squat sur une jambe jusqu’à un box, l’autre jambe tendue devant, pour travailler la force et l’équilibre.',
 ARRAY['Debout devant un box à hauteur de genoux, sur une jambe, l’autre jambe tendue devant.','Descendre en reculant le bassin jusqu’à toucher le box, tronc légèrement incliné.','Remonter en poussant sur le pied d’appui.'],
 ARRAY['Genou dans l’axe du pied','Descente contrôlée'],
 ARRAY['Se laisser tomber sur le box','Genou qui rentre'],
 'intermediate',true,ARRAY['box'],ARRAY['quadriceps','glutes'],ARRAY['hamstrings','abs']),

('Pistol squat','Squat pistolet',
 'Squat complet sur une jambe, l’autre jambe tendue devant, exercice avancé de force, d’équilibre et de mobilité.',
 ARRAY['Debout sur une jambe, l’autre jambe tendue devant, bras tendus devant pour l’équilibre.','Descendre en squat profond sur la jambe d’appui, talon au sol, l’autre jambe maintenue au-dessus du sol.','Remonter en poussant sur le pied d’appui.'],
 ARRAY['Talon au sol','Bras en contrepoids'],
 ARRAY['Talon qui décolle','Tomber en arrière en bas'],
 'advanced',true,ARRAY['bodyweight'],ARRAY['quadriceps','glutes'],ARRAY['calves','abs']),

('Sissy squat','Sissy squat',
 'Squat penché en arrière, genoux projetés vers l’avant et talons relevés, qui isole fortement les quadriceps.',
 ARRAY['Debout, une main en appui, pieds à largeur de hanches, talons légèrement relevés.','Fléchir les genoux vers l’avant en inclinant tout le corps vers l’arrière, hanches ouvertes.','Revenir en poussant les genoux vers l’arrière et en redressant le corps.'],
 ARRAY['Corps en un bloc','Descente contrôlée'],
 ARRAY['Plier les hanches','Amplitude excessive pour le genou'],
 'advanced',false,ARRAY['bodyweight'],ARRAY['quadriceps'],ARRAY['abs','hip_flexors']),

('Pendulum squat','Squat pendulaire (machine)',
 'Squat sur une machine à bras oscillant, qui guide la trajectoire et sollicite fortement les quadriceps.',
 ARRAY['Se placer sur la machine, dos et épaules appuyés, pieds sur la plateforme.','Déverrouiller et descendre en fléchissant les genoux en suivant la trajectoire de la machine.','Remonter en poussant sur tout le pied, sans verrouiller brutalement les genoux.'],
 ARRAY['Dos plaqué au support','Descente contrôlée'],
 ARRAY['Décoller le bassin du support','Verrouiller les genoux avec force'],
 'beginner',false,ARRAY['machine'],ARRAY['quadriceps'],ARRAY['glutes']),

('Single-leg leg press','Presse à cuisses unilatérale',
 'Poussée sur la presse avec une seule jambe, pour corriger les différences entre les côtés.',
 ARRAY['S’asseoir sur la presse, un pied au centre de la plateforme, l’autre jambe en appui hors de la plateforme.','Déverrouiller et fléchir le genou jusqu’à une amplitude confortable sans décoller le bassin.','Pousser la plateforme sans verrouiller complètement le genou.'],
 ARRAY['Bassin plaqué au siège','Genou dans l’axe du pied'],
 ARRAY['Décoller le bassin','Verrouiller le genou en haut'],
 'beginner',true,ARRAY['machine'],ARRAY['quadriceps','glutes'],ARRAY['hamstrings']),

('Wall sit','Chaise murale',
 'Maintien d’une position assise sans chaise, dos contre un mur et cuisses à l’horizontale, qui sollicite les quadriceps en isométrie.',
 ARRAY['Se placer dos contre un mur, pieds à environ 50 cm du mur.','Glisser vers le bas jusqu’à ce que les cuisses soient à l’horizontale, genoux à 90°.','Tenir la position en respirant normalement.'],
 ARRAY['Genoux à 90°','Dos plaqué au mur'],
 ARRAY['Mains posées sur les cuisses','Pieds trop proches du mur'],
 'beginner',false,ARRAY['wall'],ARRAY['quadriceps'],ARRAY['glutes','calves'])
)
insert into public.exercises
  (organization_id, movement_id, name, name_fr, description, steps, cues, common_mistakes,
   level, unilateral, equipment, primary_muscles, secondary_muscles)
select null, (select id from public.movements where slug = 'squat'),
       v.name, v.name_fr, v.description, v.steps, v.cues, v.common_mistakes,
       v.level, v.unilateral, v.equipment, v.primary_muscles, v.secondary_muscles
from v
where not exists (
  select 1 from public.exercises e
  where e.organization_id is null and lower(e.name) = lower(v.name)
)
on conflict do nothing;