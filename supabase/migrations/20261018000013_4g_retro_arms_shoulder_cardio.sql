-- 4g-11d : rétro-remplissage des exercices d’isolation des bras, d’accessoires d’épaule et de cardio machine d’origine (18 fiches), rédaction originale, à relire.
-- Rejouable : seuls les exercices communs sans nom français sont mis à jour.

with v(name, name_fr, description, steps, cues, common_mistakes) as (
values
('Barbell curl','Curl barre',
 'Flexion des coudes avec une barre, debout, pour isoler les biceps.',
 ARRAY['Debout, barre tenue mains en supination à largeur d’épaules, bras tendus devant les cuisses.','Fléchir les coudes pour monter la barre vers les épaules, coudes proches du corps.','Redescendre lentement jusqu’aux bras tendus.'],
 ARRAY['Coudes proches du corps','Descente lente'],
 ARRAY['Balancer le buste','Avancer les coudes en montant']),

('Dumbbell curl','Curl haltères',
 'Flexion des coudes avec deux haltères, debout ou assis, pour isoler les biceps.',
 ARRAY['Debout ou assis, un haltère dans chaque main, bras le long du corps, paumes vers l’avant.','Fléchir les coudes pour monter les haltères vers les épaules, coudes proches du corps.','Redescendre lentement jusqu’aux bras tendus.'],
 ARRAY['Coudes proches du corps','Descente lente'],
 ARRAY['Balancer le buste','Hausser les épaules']),

('Hammer curl','Curl marteau',
 'Flexion des coudes avec les paumes face à face, qui sollicite biceps, brachial et brachio-radial.',
 ARRAY['Debout, un haltère dans chaque main, paumes face à face, bras le long du corps.','Fléchir les coudes pour monter les haltères vers les épaules, poignets neutres.','Redescendre lentement jusqu’aux bras tendus.'],
 ARRAY['Poignets neutres','Coudes proches du corps'],
 ARRAY['Balancer le buste','Faire tourner les poignets']),

('Preacher curl','Curl pupitre',
 'Flexion des coudes avec les bras appuyés sur un pupitre incliné, qui isole les biceps et limite l’élan.',
 ARRAY['S’asseoir au pupitre, bras appuyés sur le coussin, barre ou haltères tenus en supination.','Fléchir les coudes pour monter la charge vers les épaules.','Redescendre lentement sans verrouiller complètement les coudes en bas.'],
 ARRAY['Bras appuyés sur le coussin','Descente lente'],
 ARRAY['Décoller les bras du coussin','Verrouiller les coudes en bas avec force']),

('Cable curl','Curl à la poulie',
 'Flexion des coudes avec une poulie basse, qui maintient une tension constante sur les biceps.',
 ARRAY['Face à la poulie basse, barre ou corde tenue mains en supination, bras tendus.','Fléchir les coudes pour monter la poignée vers les épaules, coudes proches du corps.','Redescendre lentement jusqu’aux bras tendus.'],
 ARRAY['Tension constante','Coudes proches du corps'],
 ARRAY['Balancer le buste','Avancer les coudes en montant']),

('Cable triceps pushdown','Extension triceps à la poulie haute',
 'Extension des coudes vers le bas avec une poulie haute, qui isole les triceps.',
 ARRAY['Face à la poulie haute, barre ou corde tenue, coudes collés au corps, avant-bras à l’horizontale.','Tendre les coudes pour pousser la poignée vers le bas.','Remonter lentement jusqu’à ce que les avant-bras soient à l’horizontale.'],
 ARRAY['Coudes collés au corps','Remontée lente'],
 ARRAY['Avancer les coudes','Pencher le buste pour aider le mouvement']),

('Overhead triceps extension','Extension triceps au-dessus de la tête',
 'Extension des coudes avec la charge au-dessus de la tête, qui sollicite les triceps en position étirée.',
 ARRAY['Debout ou assis, haltère ou corde tenu à deux mains au-dessus de la tête, coudes fléchis.','Tendre les coudes pour lever la charge, coudes près des oreilles.','Redescendre lentement derrière la tête en gardant les coudes en place.'],
 ARRAY['Coudes près des oreilles','Descente lente'],
 ARRAY['Écarter les coudes','Cambrer le bas du dos']),

('Skull crusher','Barre au front (skull crusher)',
 'Extension des coudes allongé sur un banc, la barre descend vers le front, qui isole les triceps.',
 ARRAY['Allongé sur un banc, barre tenue bras tendus au-dessus de la poitrine, prise à largeur d’épaules.','Fléchir les coudes pour descendre la barre vers le front, coudes fixes.','Tendre les coudes pour remonter la barre.'],
 ARRAY['Coudes fixes','Descente contrôlée'],
 ARRAY['Écarter les coudes','Charge trop lourde pour les coudes']),

('Lateral raise','Élévation latérale',
 'Montée des bras sur les côtés avec des haltères, qui isole le deltoïde moyen.',
 ARRAY['Debout, un haltère dans chaque main, bras le long du corps, coudes légèrement fléchis.','Monter les bras sur les côtés jusqu’à hauteur d’épaules.','Redescendre lentement.'],
 ARRAY['Coudes légèrement fléchis','Montée jusqu’à hauteur d’épaules'],
 ARRAY['Hausser les épaules','Balancer le buste']),

('Rear delt fly','Oiseau (élévation arrière)',
 'Écartement des bras vers l’arrière, buste penché, qui isole le deltoïde postérieur.',
 ARRAY['Penché en avant, dos plat, un haltère dans chaque main, bras tendus sous les épaules.','Écarter les bras sur les côtés jusqu’à hauteur d’épaules, coudes légèrement fléchis.','Redescendre lentement.'],
 ARRAY['Dos plat','Coudes légèrement fléchis'],
 ARRAY['Hausser les épaules','Balancer le buste']),

('Cable external rotation','Rotation externe à la poulie',
 'Rotation externe de l’épaule, coude collé au corps, avec une poulie, qui renforce les rotateurs externes.',
 ARRAY['De profil à la poulie à hauteur du coude, coude fléchi à 90° collé au corps, poignée tenue de la main intérieure.','Tourner l’avant-bras vers l’extérieur, coude fixe.','Revenir lentement.'],
 ARRAY['Coude collé au corps','Retour lent'],
 ARRAY['Décoller le coude','Compenser avec le buste']),

('Scapular pull-up','Traction scapulaire',
 'Suspendu à une barre, les omoplates s’abaissent et se rapprochent sans plier les bras, pour activer le bas du trapèze et les grands dorsaux.',
 ARRAY['Se suspendre à la barre, bras tendus, épaules relâchées vers les oreilles.','Abaisser les omoplates vers les hanches sans plier les coudes, le corps monte de quelques centimètres.','Revenir lentement en position suspendue.'],
 ARRAY['Bras tendus','Épaules qui descendent'],
 ARRAY['Plier les coudes','Balancer le corps']),

('Y-T-W raise','Élévations Y-T-W',
 'Série de trois élévations des bras allongé ou penché, en forme de Y, T et W, qui renforce le haut du dos et les épaules.',
 ARRAY['Allongé sur le ventre ou penché en avant, bras tendus devant en position de Y.','Lever les bras au-dessus du sol en rapprochant les omoplates, puis passer en position de T (bras sur les côtés).','Passer en position de W (coudes fléchis, mains près des épaules), puis redescendre.'],
 ARRAY['Omoplates actives','Mouvement lent'],
 ARRAY['Hausser les épaules','Lever la tête']),

('Row ergometer','Rameur (ergomètre)',
 'Machine de cardio qui simule le geste d’aviron, qui sollicite jambes, dos et bras de façon continue.',
 ARRAY['S’asseoir, pieds sanglés, saisir la poignée, bras tendus, buste incliné vers l’avant.','Pousser avec les jambes, puis incliner le buste vers l’arrière, puis tirer la poignée vers le bas du ventre.','Revenir en inversant l’ordre : bras, buste, jambes.'],
 ARRAY['Jambes, buste, bras dans cet ordre','Dos droit'],
 ARRAY['Tirer avec les bras trop tôt','Arrondir le dos']),

('SkiErg','SkiErg',
 'Machine de cardio qui simule le geste du ski de fond, qui sollicite tout le haut du corps et le tronc.',
 ARRAY['Debout face à la machine, saisir les poignées au-dessus de la tête.','Tirer les poignées vers le bas en fléchissant les hanches et les genoux.','Revenir en tendant les bras et en se redressant.'],
 ARRAY['Hanches qui travaillent','Bras tendus en haut'],
 ARRAY['Tirer avec les bras seuls','Arrondir le dos']),

('Assault bike','Assault bike',
 'Vélo à résistance à air avec bras mobiles, qui sollicite jambes et haut du corps, utilisé en conditionnement.',
 ARRAY['S’asseoir sur le vélo, saisir les poignées, pieds sur les pédales.','Pédaler et pousser et tirer les poignées en même temps.','Garder une cadence régulière pendant la durée voulue.'],
 ARRAY['Cadence régulière','Tronc stable'],
 ARRAY['Se pencher excessivement','Partir trop fort sans pouvoir tenir la durée']),

('Bike endurance','Vélo en endurance',
 'Pédalage continu à intensité modérée, qui développe la capacité aérobie avec peu d’impact sur les articulations.',
 ARRAY['Régler la selle à hauteur de hanche environ, pieds sur les pédales.','Pédaler à intensité modérée, cadence régulière.','Maintenir l’effort pendant la durée voulue.'],
 ARRAY['Cadence régulière','Respiration contrôlée'],
 ARRAY['Selle mal réglée','Intensité trop élevée pour tenir la durée']),

('Bike intervals','Vélo en intervalles',
 'Alternance de séquences de pédalage intense et de récupération, qui développe la puissance aérobie et anaérobie.',
 ARRAY['Régler la selle, s’échauffer quelques minutes à intensité faible.','Pédaler à intensité élevée pendant la durée prescrite, puis récupérer à intensité faible.','Répéter le nombre d’intervalles prescrits, puis terminer par un retour au calme.'],
 ARRAY['Intensité régulière sur chaque intervalle','Récupération complète'],
 ARRAY['Partir trop fort au premier intervalle','Raccourcir la récupération sans le prévoir'])
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