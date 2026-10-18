-- 4g-9a : rétro-remplissage des exercices de squat d’origine (14 fiches), rédaction originale, à relire.
-- Rejouable : seuls les exercices communs sans nom français sont mis à jour.

with v(name, name_fr, description, steps, cues, common_mistakes) as (
values
('Back squat','Squat arrière (barre sur le dos)',
 'Squat avec la barre posée sur le haut du dos, mouvement de base pour développer la force des jambes et des fessiers.',
 ARRAY['Placer la barre sur le haut des trapèzes, pieds à largeur d’épaules, pointes légèrement ouvertes.','Inspirer, gainer le tronc, puis descendre en poussant les genoux dans l’axe des pieds jusqu’à la profondeur souhaitée.','Remonter en poussant le sol avec tout le pied, en gardant le tronc stable.'],
 ARRAY['Tronc gainé et dos neutre','Genoux dans l’axe des orteils'],
 ARRAY['Genoux qui rentrent à la remontée','Talons qui décollent ou dos qui s’arrondit en bas']),

('Pause back squat','Squat arrière avec pause',
 'Squat arrière avec un arrêt de 1 à 3 secondes en bas, qui supprime l’effet de rebond et travaille la position basse.',
 ARRAY['Se placer comme pour un squat arrière.','Descendre sous contrôle et marquer une pause de 1 à 3 s en bas, tronc gainé.','Remonter sans rebond en gardant la même position du tronc.'],
 ARRAY['Tension maintenue pendant la pause','Remontée sans rebond'],
 ARRAY['Se relâcher en bas','Remonter avec le bassin avant le buste']),

('Front squat','Squat avant',
 'Squat avec la barre posée sur l’avant des épaules, qui demande un tronc plus vertical et sollicite davantage les quadriceps.',
 ARRAY['Poser la barre sur l’avant des épaules, coudes hauts, en position rack ou croisée.','Descendre en gardant les coudes hauts et le tronc vertical.','Remonter en poussant le sol, coudes toujours hauts.'],
 ARRAY['Coudes hauts','Tronc vertical'],
 ARRAY['Coudes qui tombent','Buste qui s’incline vers l’avant']),

('Overhead squat','Squat par-dessus la tête',
 'Squat avec la barre tenue bras tendus au-dessus de la tête, exigeant en mobilité d’épaule, de hanche et de cheville.',
 ARRAY['Tenir la barre bras tendus au-dessus de la tête, prise large, épaules actives.','Descendre en squat en gardant la barre alignée au-dessus du milieu du pied.','Remonter en gardant les bras verrouillés et le tronc gainé.'],
 ARRAY['Bras verrouillés, épaules actives','Barre au-dessus du milieu du pied'],
 ARRAY['Barre qui part vers l’avant','Charge trop lourde pour la mobilité disponible']),

('Zercher squat','Squat Zercher',
 'Squat avec la barre tenue dans le creux des coudes, devant le ventre, qui sollicite fortement le tronc et les quadriceps.',
 ARRAY['Poser la barre dans le creux des coudes, avant-bras croisés ou mains jointes devant la poitrine.','Descendre en squat en gardant le tronc haut.','Remonter en poussant le sol, coudes serrés.'],
 ARRAY['Coudes serrés','Tronc haut'],
 ARRAY['Laisser la barre rouler vers les mains','Arrondir le haut du dos']),

('Safety bar squat','Squat à la barre de sécurité',
 'Squat avec une barre à poignées et coussinets qui réduit les contraintes sur les épaules et le haut du dos.',
 ARRAY['Placer la barre sur le haut du dos, saisir les poignées avant.','Descendre en squat avec le tronc gainé, genoux dans l’axe des pieds.','Remonter en poussant le sol avec tout le pied.'],
 ARRAY['Tronc gainé','Genoux dans l’axe des orteils'],
 ARRAY['Se pencher vers l’avant','Lâcher les poignées en cours de répétition']),

('Box squat','Squat au box',
 'Squat avec un contact contrôlé sur un banc ou un box, qui fixe la profondeur et renforce la poussée depuis la position basse.',
 ARRAY['Placer un box derrière soi à hauteur de cuisses parallèles ou en dessous, barre en place.','Descendre en reculant le bassin jusqu’à toucher le box en gardant la tension.','Remonter en poussant le sol sans se laisser tomber sur le box.'],
 ARRAY['Contrôle de la descente','Tension maintenue au contact'],
 ARRAY['S’asseoir en relâchant le tronc','Rebondir sur le box']),

('Goblet squat','Squat gobelet',
 'Squat avec une charge tenue contre la poitrine, utile pour apprendre le mouvement et garder le tronc droit.',
 ARRAY['Tenir un haltère ou un kettlebell contre la poitrine, coudes vers le bas.','Descendre en squat, coudes à l’intérieur des genoux, tronc droit.','Remonter en poussant le sol avec tout le pied.'],
 ARRAY['Charge collée à la poitrine','Coudes à l’intérieur des genoux'],
 ARRAY['Charge qui s’éloigne du corps','Talons qui décollent']),

('Bodyweight squat','Squat au poids du corps',
 'Squat sans charge, pour apprendre le geste, s’échauffer ou travailler la mobilité des hanches et des chevilles.',
 ARRAY['Pieds à largeur d’épaules, bras tendus devant ou mains jointes.','Descendre en poussant les genoux dans l’axe des pieds, tronc droit.','Remonter en poussant le sol avec tout le pied.'],
 ARRAY['Genoux dans l’axe des orteils','Talons au sol'],
 ARRAY['Genoux qui rentrent','Talons qui décollent']),

('Hack squat','Hack squat (machine)',
 'Squat sur une machine guidée, dos appuyé sur un support incliné, qui concentre le travail sur les quadriceps.',
 ARRAY['Se placer dos au support, pieds à hauteur ou légèrement devant le bassin, épaules sous les coussins.','Déverrouiller et descendre en fléchissant les genoux avec contrôle.','Remonter en poussant sur toute la plante des pieds, sans verrouiller brutalement les genoux.'],
 ARRAY['Dos et bassin plaqués au support','Descente contrôlée'],
 ARRAY['Décoller le bassin du support','Verrouiller les genoux avec force']),

('Smith machine squat','Squat à la Smith machine',
 'Squat avec une barre guidée sur rails, qui stabilise la trajectoire et permet de placer les pieds devant le corps.',
 ARRAY['Placer la barre sur le haut du dos, pieds légèrement devant la barre.','Déverrouiller et descendre en fléchissant les genoux, tronc gainé.','Remonter en poussant le sol, puis verrouiller la barre en fin de série.'],
 ARRAY['Pieds légèrement devant la barre','Tronc gainé'],
 ARRAY['Placer les pieds trop en arrière','Oublier de verrouiller la barre en fin de série']),

('Leg press','Presse à cuisses',
 'Poussée des jambes sur une machine guidée, dos appuyé, pour travailler quadriceps et fessiers avec peu de contrainte sur le dos.',
 ARRAY['S’asseoir dos et bassin plaqués au dossier, pieds sur la plateforme à largeur d’épaules.','Déverrouiller et fléchir les genoux jusqu’à l’amplitude confortable sans décoller le bassin.','Pousser la plateforme sans verrouiller complètement les genoux.'],
 ARRAY['Bassin plaqué au siège','Genoux dans l’axe des pieds'],
 ARRAY['Décoller le bassin en bas','Verrouiller les genoux en haut']),

('Belt squat','Belt squat (squat à la ceinture)',
 'Squat avec la charge suspendue à une ceinture au niveau du bassin, qui décharge le dos et la colonne.',
 ARRAY['Fixer la ceinture avec la charge autour du bassin, pieds sur les plateformes à largeur d’épaules.','Descendre en squat en gardant le tronc vertical.','Remonter en poussant le sol avec tout le pied.'],
 ARRAY['Tronc vertical','Genoux dans l’axe des orteils'],
 ARRAY['Se pencher vers l’avant','Laisser la ceinture se balancer']),

('Landmine squat','Squat à la landmine',
 'Squat avec une barre ancrée à une extrémité, tenue devant la poitrine, qui offre une trajectoire stable et aide à garder le tronc droit.',
 ARRAY['Tenir l’extrémité libre de la barre contre la poitrine, deux mains, pieds à largeur d’épaules.','Descendre en squat en gardant la barre proche du corps.','Remonter en poussant le sol avec tout le pied.'],
 ARRAY['Barre proche du corps','Tronc droit'],
 ARRAY['Éloigner la barre de la poitrine','Talons qui décollent'])
)
update public.exercises e
set name_fr = v.name_fr,
    description = v.description,
    steps = v.steps,
    cues = v.cues,
    common_mistakes = v.common_mistakes
from v
where e.organization_id is null
  and e.name = v.name
  and e.name_fr is null;