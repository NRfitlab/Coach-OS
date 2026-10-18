-- 4g-11e : rétro-remplissage des exercices de conditioning et de course d’origine (16 fiches), rédaction originale, à relire.
-- Rejouable : seuls les exercices communs sans nom français sont mis à jour.

with v(name, name_fr, description, steps, cues, common_mistakes) as (
values
('Burpee','Burpee',
 'Enchaînement de squat, planche, pompe et saut, qui sollicite tout le corps et développe l’endurance.',
 ARRAY['Debout, descendre en squat, mains au sol.','Reculer les pieds en planche, faire une pompe, puis ramener les pieds vers les mains.','Se redresser en sautant, bras au-dessus de la tête.'],
 ARRAY['Corps aligné en planche','Enchaînement fluide'],
 ARRAY['Bassin qui s’affaisse en planche','Sauter sans extension complète']),

('Devil press','Devil press',
 'Enchaînement de burpee et de soulevé d’haltères au-dessus de la tête, mouvement intense de conditioning.',
 ARRAY['Haltères au sol, mains sur les haltères, faire un burpee.','Se redresser en balançant les haltères entre les jambes, puis les projeter au-dessus de la tête.','Redescendre les haltères au sol sous contrôle et recommencer.'],
 ARRAY['Poussée des hanches','Bras verrouillés en haut'],
 ARRAY['Arrondir le dos au départ','Tirer avec les bras sans les hanches']),

('Thruster','Thruster',
 'Enchaînement d’un squat avant et d’un développé au-dessus de la tête en un seul mouvement fluide.',
 ARRAY['Barre ou haltères sur l’avant des épaules, descendre en squat.','Remonter en poussant le sol et enchaîner avec un développé au-dessus de la tête.','Redescendre la charge sur les épaules et recommencer.'],
 ARRAY['Poussée des jambes dans le développé','Coudes hauts en bas'],
 ARRAY['Pause entre le squat et le développé','Cambrer le bas du dos']),

('Wall ball','Wall ball',
 'Lancer d’un médecine-ball contre une cible murale après un squat, utilisé en conditionnement et dans les épreuves de type HYROX.',
 ARRAY['Debout face au mur, médecine-ball tenu contre la poitrine, descendre en squat.','Remonter explosivement et lancer le ballon sur la cible murale.','Rattraper le ballon et redescendre en squat pour la répétition suivante.'],
 ARRAY['Poussée des jambes','Rattraper le ballon en amorti'],
 ARRAY['Lancer avec les bras seuls','Squat trop haut']),

('Sandbag over shoulder','Sac de sable par-dessus l’épaule',
 'Soulevé d’un sac de sable du sol jusqu’à l’épaule puis par-dessus celle-ci, qui sollicite tout le corps.',
 ARRAY['Se placer au-dessus du sac, saisir le sac à deux mains, dos neutre.','Se redresser en tirant le sac vers la hanche, puis le projeter par-dessus l’épaule.','Laisser le sac retomber derrière soi, puis recommencer de l’autre côté si besoin.'],
 ARRAY['Poussée des hanches','Dos neutre au soulevé'],
 ARRAY['Arrondir le dos pour soulever','Tirer avec les bras sans les hanches']),

('Double-under','Double saut de corde (double-under)',
 'Saut à la corde où la corde passe deux fois sous les pieds à chaque saut, exigeant en coordination et en endurance.',
 ARRAY['Tenir la corde de chaque côté, poignets proches des hanches.','Sauter un peu plus haut que pour un saut simple et faire tourner la corde plus vite avec les poignets pour qu’elle passe deux fois.','Réceptionner en amorti puis enchaîner.'],
 ARRAY['Rotation rapide des poignets','Saut un peu plus haut'],
 ARRAY['Faire tourner la corde avec les bras','Fléchir les genoux pour compenser']),

('Battle rope waves','Vagues avec corde ondulatoire',
 'Mouvements de bras alternés sur des cordes lourdes ancrées, qui sollicitent les épaules, le tronc et le système cardiovasculaire.',
 ARRAY['Debout, genoux légèrement fléchis, une corde dans chaque main.','Monter et descendre les bras en alternance pour créer des ondulations.','Maintenir un rythme régulier pendant la durée voulue.'],
 ARRAY['Tronc gainé','Rythme régulier'],
 ARRAY['Se pencher excessivement','Mouvements trop amples qui épuisent trop vite']),

('Easy run','Course facile',
 'Course à allure confortable qui permet de tenir une conversation, pour développer l’endurance de base avec une fatigue modérée.',
 ARRAY['S’échauffer quelques minutes en marchant ou en trottinant.','Courir à une allure à laquelle on peut parler en phrases complètes.','Terminer par quelques minutes de marche ou de footing très lent.'],
 ARRAY['Allure conversationnelle','Respiration régulière'],
 ARRAY['Courir trop vite','Zapper l’échauffement']),

('Long run','Sortie longue',
 'Course la plus longue de la semaine à allure facile, pour développer l’endurance et la résistance à la fatigue.',
 ARRAY['S’échauffer quelques minutes à allure très facile.','Courir à allure facile pendant la durée ou la distance prévue.','Terminer par un retour au calme et boire régulièrement.'],
 ARRAY['Allure facile et régulière','Hydratation régulière'],
 ARRAY['Partir trop vite','Augmenter trop vite la durée d’une semaine à l’autre']),

('Tempo run','Course tempo',
 'Course soutenue à une allure confortablement difficile, juste en dessous du seuil, pour développer la capacité à tenir un effort long.',
 ARRAY['S’échauffer 10 à 15 minutes à allure facile.','Courir à allure tempo pendant la durée prévue, effort soutenu mais contrôlé.','Terminer par 5 à 10 minutes de retour au calme.'],
 ARRAY['Effort soutenu mais contrôlé','Allure régulière'],
 ARRAY['Partir trop vite','Courir trop fort pour tenir la durée']),

('Race-pace run','Course à allure de compétition',
 'Course à l’allure visée en compétition, pour s’habituer à l’effort et à la gestion de l’allure.',
 ARRAY['S’échauffer 10 à 15 minutes à allure facile.','Courir à l’allure cible de la compétition sur la durée ou la distance prévue.','Terminer par un retour au calme.'],
 ARRAY['Allure régulière','Respiration contrôlée'],
 ARRAY['Partir trop vite','Courir plus vite que l’allure cible']),

('Interval run','Course en fractionné',
 'Alternance de séquences de course rapide et de récupération active ou passive, pour développer la vitesse et la VO2max.',
 ARRAY['S’échauffer 10 à 15 minutes à allure facile.','Courir la distance ou la durée prévue à allure rapide, puis récupérer en trottinant ou en marchant.','Répéter le nombre d’intervalles prescrits, puis terminer par un retour au calme.'],
 ARRAY['Allure régulière sur tous les intervalles','Récupération complète'],
 ARRAY['Partir trop vite sur le premier intervalle','Raccourcir la récupération sans l’avoir prévu']),

('Fartlek','Fartlek',
 'Course à allure variable où l’on alterne séquences rapides et lentes de façon libre ou structurée, pour développer l’endurance et la vitesse.',
 ARRAY['S’échauffer 10 minutes à allure facile.','Alterner des séquences rapides et des séquences lentes selon le plan prévu ou au ressenti.','Terminer par un retour au calme.'],
 ARRAY['Variation d’allure fluide','Récupération entre les accélérations'],
 ARRAY['Accélérer trop fort','Oublier de récupérer entre les séquences']),

('Hill repeats','Répétitions en côte',
 'Montées répétées d’une côte à allure soutenue, qui développent la force et la puissance de course.',
 ARRAY['S’échauffer 10 à 15 minutes à allure facile, puis trouver une côte adaptée.','Monter la côte à allure soutenue en gardant la foulée dynamique.','Redescendre en marchant ou en trottinant, puis répéter le nombre de fois prévu.'],
 ARRAY['Foulée dynamique','Buste légèrement penché'],
 ARRAY['Partir trop vite en bas','Se pencher excessivement']),

('Strides','Lignes droites (strides)',
 'Accélérations progressives de 15 à 30 secondes jusqu’à une vitesse proche du maximum, avec une récupération complète.',
 ARRAY['À la fin d’une course facile, accélérer progressivement pendant 15 à 30 s jusqu’à une vitesse rapide mais relâchée.','Ralentir progressivement, puis marcher ou trottiner pour récupérer complètement.','Répéter 4 à 8 fois.'],
 ARRAY['Foulée relâchée','Récupération complète'],
 ARRAY['Sprinter à fond','Crisper les épaules']),

('Treadmill run','Course sur tapis',
 'Course sur un tapis roulant, qui permet de contrôler précisément l’allure et la pente et de s’entraîner à l’abri des conditions extérieures.',
 ARRAY['Monter sur le tapis, régler la vitesse et la pente (souvent 1 % pour compenser l’absence de vent).','Courir à l’allure prévue en gardant une posture droite.','Réduire progressivement la vitesse pour le retour au calme.'],
 ARRAY['Posture droite','Pente de 1 % pour reproduire l’extérieur'],
 ARRAY['Se tenir aux barres','Regarder ses pieds'])
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