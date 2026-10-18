-- 4g-11b : rétro-remplissage des exercices de sauts, lancers et mollets d’origine (16 fiches), rédaction originale, à relire.
-- Rejouable : seuls les exercices communs sans nom français sont mis à jour.

with v(name, name_fr, description, steps, cues, common_mistakes) as (
values
('Box jump','Saut sur box',
 'Saut vertical pour atterrir sur un box, qui développe la puissance des jambes et la coordination.',
 ARRAY['Se placer face à un box à hauteur adaptée, pieds à largeur de hanches.','Fléchir les genoux et les hanches en balançant les bras, puis sauter pour atterrir en douceur sur le box, genoux fléchis.','Se redresser sur le box, puis redescendre en marchant ou en sautant en arrière de façon contrôlée.'],
 ARRAY['Réception silencieuse','Genoux fléchis à la réception'],
 ARRAY['Choisir un box trop haut','Redescendre en sautant à pieds joints sans contrôle']),

('Broad jump','Saut en longueur',
 'Saut horizontal à pieds joints pour parcourir la plus grande distance, qui développe la puissance horizontale.',
 ARRAY['Debout, pieds à largeur de hanches, bras en arrière.','Balancer les bras vers l’avant et sauter le plus loin possible.','Réceptionner en amorti, genoux fléchis, tronc penché.'],
 ARRAY['Bras actifs','Réception stable'],
 ARRAY['Réception genoux verrouillés','Perdre l’équilibre à la réception']),

('Countermovement jump','Saut avec contre-mouvement',
 'Saut vertical avec une flexion préalable des genoux, qui permet de mesurer ou de développer la puissance des jambes.',
 ARRAY['Debout, pieds à largeur de hanches, mains sur les hanches ou bras libres.','Fléchir rapidement les genoux et les hanches, puis sauter le plus haut possible.','Réceptionner en amorti, genoux fléchis.'],
 ARRAY['Extension complète en haut','Réception silencieuse'],
 ARRAY['Pause entre la descente et la montée','Réception genoux verrouillés']),

('Squat jump','Saut squat',
 'Saut vertical depuis la position de squat, sans contre-mouvement, pour développer la puissance concentrique.',
 ARRAY['Descendre en squat et marquer une pause d’une seconde.','Sauter le plus haut possible depuis cette position.','Réceptionner en amorti puis revenir en squat.'],
 ARRAY['Pause de 1 s en bas','Extension complète en haut'],
 ARRAY['Rebondir avant de sauter','Réception genoux verrouillés']),

('Depth jump','Saut en contrebas',
 'Descente d’un box puis saut vertical immédiat à la réception, exercice pliométrique avancé qui sollicite fortement les tendons.',
 ARRAY['Se placer au bord d’un box bas, descendre sans sauter.','À la réception au sol, sauter immédiatement le plus haut possible.','Réceptionner en amorti, puis marcher pour récupérer.'],
 ARRAY['Contact au sol très bref','Réception silencieuse'],
 ARRAY['Box trop haut','Contact au sol trop long']),

('Pogo hops','Sauts pogo',
 'Petits sauts rapides sur place, genoux presque tendus, qui développent la raideur des tendons et la réactivité.',
 ARRAY['Debout, pieds à largeur de hanches, genoux presque tendus.','Sauter en repoussant le sol avec les chevilles, contact au sol très bref.','Enchaîner pendant la durée voulue.'],
 ARRAY['Contact au sol bref','Chevilles actives'],
 ARRAY['Fléchir trop les genoux','Contact au sol trop long']),

('Single-leg hop','Saut sur une jambe',
 'Saut vers l’avant ou sur place sur une jambe, qui développe la puissance unilatérale et le contrôle du genou.',
 ARRAY['Debout sur une jambe, genou légèrement fléchi.','Sauter vers l’avant sur une jambe, réceptionner sur la même jambe.','Maintenir l’équilibre 2 s à la réception.'],
 ARRAY['Genou dans l’axe du pied','Réception stable'],
 ARRAY['Genou qui rentre à la réception','Se laisser tomber sur le pied']),

('Skater bound','Saut du patineur',
 'Sauts latéraux d’une jambe à l’autre, qui développent la puissance latérale et l’équilibre.',
 ARRAY['Debout sur une jambe, genou légèrement fléchi.','Sauter latéralement sur l’autre jambe, en balançant les bras.','Réceptionner sur une jambe, genou fléchi, puis repartir de l’autre côté.'],
 ARRAY['Réception stable','Genou dans l’axe du pied'],
 ARRAY['Genou qui rentre','Réception genou verrouillé']),

('Burpee broad jump','Burpee avec saut en longueur',
 'Burpee suivi d’un saut en longueur à pieds joints, mouvement complet utilisé en conditionnement, notamment dans les épreuves de type HYROX.',
 ARRAY['Faire un burpee : planche, pompe, retour des pieds vers les mains.','Se redresser et sauter vers l’avant le plus loin possible.','Réceptionner en amorti, puis enchaîner avec le burpee suivant.'],
 ARRAY['Enchaînement fluide','Réception stable'],
 ARRAY['Bassin qui s’affaisse en planche','Saut trop court par manque de relance']),

('Medicine ball slam','Lancer de médecine-ball au sol',
 'Lancer violent d’un médecine-ball vers le sol depuis une position au-dessus de la tête, qui sollicite tout le corps.',
 ARRAY['Debout, médecine-ball tenu à deux mains au-dessus de la tête.','Lancer le ballon vers le sol en gainant le tronc et en fléchissant les hanches et les genoux.','Ramasser le ballon et recommencer.'],
 ARRAY['Tronc gainé','Mouvement venant des hanches'],
 ARRAY['Arrondir le dos pour ramasser le ballon','Lancer avec les bras seulement']),

('Medicine ball rotational throw','Lancer de médecine-ball rotatif',
 'Lancer d’un médecine-ball contre un mur avec rotation du tronc, qui développe la puissance de rotation.',
 ARRAY['Debout de côté face à un mur, médecine-ball tenu à deux mains au niveau de la hanche.','Tourner le tronc et lancer le ballon contre le mur avec les hanches.','Rattraper le ballon et recommencer, puis changer de côté.'],
 ARRAY['Rotation des hanches','Tronc stable'],
 ARRAY['Lancer avec les bras seulement','Pivoter sans bouger les pieds']),

('Jump rope','Corde à sauter',
 'Sauts répétés avec une corde, qui sollicitent les mollets, la coordination et l’endurance.',
 ARRAY['Tenir la corde de chaque côté, poignets légèrement écartés du corps.','Faire tourner la corde avec les poignets et sauter à chaque passage, de petits sauts.','Enchaîner pendant la durée voulue.'],
 ARRAY['Petits sauts','Rotation par les poignets'],
 ARRAY['Sauter trop haut','Faire tourner la corde avec les bras']),

('Standing calf raise','Montée sur pointes debout',
 'Montée sur la pointe des pieds, debout, qui sollicite les mollets, surtout les gastrocnémiens.',
 ARRAY['Debout, pointes de pieds sur une marche, talons dans le vide, genoux tendus.','Monter sur la pointe des pieds le plus haut possible.','Redescendre lentement jusqu’à l’étirement des mollets.'],
 ARRAY['Montée complète','Descente lente'],
 ARRAY['Rebondir en bas','Fléchir les genoux']),

('Seated calf raise','Montée sur pointes assis',
 'Montée sur la pointe des pieds, assis, genoux fléchis, qui sollicite surtout le soléaire.',
 ARRAY['S’asseoir sur la machine, charge posée sur les genoux, pointes de pieds sur la plateforme.','Monter sur la pointe des pieds le plus haut possible.','Redescendre lentement jusqu’à l’étirement des mollets.'],
 ARRAY['Montée complète','Descente lente'],
 ARRAY['Rebondir en bas','Raccourcir l’amplitude']),

('Single-leg calf raise','Montée sur pointes à une jambe',
 'Montée sur la pointe du pied à une jambe, qui augmente l’intensité du travail des mollets sans matériel supplémentaire.',
 ARRAY['Debout sur une jambe, pointe du pied sur une marche, une main en appui.','Monter sur la pointe du pied le plus haut possible.','Redescendre lentement jusqu’à l’étirement du mollet.'],
 ARRAY['Montée complète','Descente lente'],
 ARRAY['Rebondir en bas','Fléchir le genou']),

('Tibialis raise','Relevé du tibial antérieur',
 'Dos contre un mur, les pointes de pieds se relèvent pour renforcer le muscle à l’avant du tibia.',
 ARRAY['Debout, dos et fessiers contre un mur, talons à quelques dizaines de centimètres du mur.','Relever les pointes de pieds le plus haut possible en gardant les talons au sol.','Redescendre lentement.'],
 ARRAY['Talons au sol','Mouvement lent'],
 ARRAY['Décoller les talons','Raccourcir l’amplitude'])
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