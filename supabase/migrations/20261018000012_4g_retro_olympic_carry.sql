-- 4g-11c : rétro-remplissage des exercices olympiques et de portés d’origine (16 fiches), rédaction originale, à relire.
-- Rejouable : seuls les exercices communs sans nom français sont mis à jour.

with v(name, name_fr, description, steps, cues, common_mistakes) as (
values
('Power clean','Épaulé de puissance',
 'Montée de la barre du sol jusqu’aux épaules en une seule action explosive, réception en quart de squat.',
 ARRAY['Barre au-dessus du milieu du pied, dos neutre, prise un peu plus large que les épaules.','Décoller la barre, puis étendre explosivement hanches, genoux et chevilles pour la projeter vers le haut.','Passer sous la barre et la recevoir sur les épaules en quart de squat, coudes hauts, puis se redresser.'],
 ARRAY['Extension complète des hanches','Barre proche du corps'],
 ARRAY['Tirer avec les bras trop tôt','Barre qui s’éloigne du corps']),

('Hang power clean','Épaulé de puissance depuis la suspension',
 'Épaulé de puissance démarré avec la barre à hauteur des genoux ou des cuisses, qui simplifie le départ.',
 ARRAY['Debout, barre tenue devant les cuisses, hanches reculées, dos neutre.','Étendre explosivement hanches, genoux et chevilles pour projeter la barre vers le haut.','Passer sous la barre et la recevoir sur les épaules en quart de squat, puis se redresser.'],
 ARRAY['Extension complète des hanches','Barre proche du corps'],
 ARRAY['Tirer avec les bras trop tôt','Réception sans fléchir les genoux']),

('Squat clean','Épaulé complet (squat clean)',
 'Épaulé avec réception en squat profond, qui permet de soulever des charges plus lourdes.',
 ARRAY['Barre au-dessus du milieu du pied, dos neutre, prise un peu plus large que les épaules.','Décoller la barre, étendre explosivement le corps, puis passer sous la barre en squat profond.','Recevoir la barre sur les épaules, coudes hauts, puis se relever.'],
 ARRAY['Coudes hauts à la réception','Barre proche du corps'],
 ARRAY['Coudes qui tombent à la réception','Barre qui s’éloigne du corps']),

('Power snatch','Arraché de puissance',
 'Montée de la barre du sol au-dessus de la tête en une seule action explosive, réception en quart de squat bras tendus.',
 ARRAY['Barre au sol, prise large, dos neutre.','Décoller la barre, étendre explosivement le corps pour la projeter vers le haut.','Passer sous la barre et la recevoir bras tendus au-dessus de la tête en quart de squat, puis se redresser.'],
 ARRAY['Bras tendus à la réception','Barre proche du corps'],
 ARRAY['Tirer avec les bras trop tôt','Barre qui part vers l’avant']),

('Snatch','Arraché complet',
 'Montée de la barre du sol au-dessus de la tête en un seul mouvement, réception en squat profond bras tendus.',
 ARRAY['Barre au sol, prise large, dos neutre.','Décoller la barre, étendre explosivement le corps, puis passer sous la barre en squat profond.','Recevoir la barre bras tendus au-dessus de la tête, puis se relever.'],
 ARRAY['Bras verrouillés à la réception','Barre proche du corps'],
 ARRAY['Barre qui part vers l’avant','Mobilité insuffisante pour la prise choisie']),

('Clean and jerk','Épaulé-jeté',
 'Enchaînement d’un épaulé puis d’un jeté au-dessus de la tête, mouvement de compétition d’haltérophilie.',
 ARRAY['Épauler la barre du sol aux épaules, comme pour un épaulé.','Fléchir légèrement les genoux, puis étendre explosivement pour projeter la barre au-dessus de la tête.','Recevoir la barre bras tendus, jambes fléchies ou en fente, puis se redresser et poser la barre.'],
 ARRAY['Impulsion verticale des jambes','Bras verrouillés à la réception'],
 ARRAY['Pousser la barre vers l’avant','Fléchir les coudes à la réception du jeté']),

('Push jerk','Jeté poussé',
 'Poussée explosive de la barre au-dessus de la tête, avec une flexion des genoux à la réception, depuis les épaules.',
 ARRAY['Barre sur l’avant des épaules, coudes légèrement en avant.','Fléchir légèrement les genoux puis étendre explosivement pour projeter la barre.','Recevoir la barre bras tendus avec une légère flexion des genoux, puis se redresser.'],
 ARRAY['Impulsion verticale','Bras verrouillés à la réception'],
 ARRAY['Pousser la barre vers l’avant','Réception genoux verrouillés']),

('Dumbbell snatch','Arraché à un bras avec haltère',
 'Arraché d’un haltère à un bras, du sol au-dessus de la tête, qui développe la puissance de façon unilatérale.',
 ARRAY['Debout, haltère entre les pieds, une main sur l’haltère, dos neutre.','Étendre explosivement hanches, genoux et chevilles pour projeter l’haltère vers le haut.','Recevoir l’haltère bras tendu au-dessus de la tête, puis redescendre sous contrôle.'],
 ARRAY['Extension complète des hanches','Bras tendu à la réception'],
 ARRAY['Tirer avec le bras trop tôt','Arrondir le dos au départ']),

('Kettlebell clean','Épaulé au kettlebell',
 'Montée d’un kettlebell du sol ou de l’élan jusqu’à l’épaule, avec une poussée explosive des hanches.',
 ARRAY['Debout, kettlebell au sol légèrement devant soi, une main sur la poignée.','Balancer le kettlebell vers l’arrière entre les jambes, puis étendre explosivement les hanches pour le projeter vers l’épaule.','Recevoir le kettlebell au niveau de l’épaule, coude près du corps, puis redescendre sous contrôle.'],
 ARRAY['Poussée des hanches','Kettlebell proche du corps'],
 ARRAY['Tirer avec le bras','Laisser le kettlebell cogner l’avant-bras']),

('Farmer carry','Marche du fermier',
 'Marche avec une charge lourde dans chaque main, bras le long du corps, qui sollicite la préhension, le tronc et les jambes.',
 ARRAY['Debout entre deux haltères, kettlebells ou poignées, dos neutre.','Soulever les charges en se redressant, épaules basses et tronc gainé.','Marcher sur la distance voulue à pas réguliers, puis poser les charges sous contrôle.'],
 ARRAY['Tronc gainé','Épaules basses'],
 ARRAY['Hausser les épaules','Se pencher d’un côté']),

('Suitcase carry','Marche de la valise',
 'Marche avec une charge dans une seule main, qui sollicite fortement l’anti-flexion latérale du tronc.',
 ARRAY['Debout à côté d’un haltère ou d’un kettlebell, dos neutre.','Soulever la charge en se redressant, tronc droit, épaules de niveau.','Marcher sur la distance voulue sans pencher le tronc, puis changer de main.'],
 ARRAY['Épaules de niveau','Tronc droit'],
 ARRAY['Pencher le tronc du côté de la charge','Hausser l’épaule']),

('Front-rack carry','Marche en position rack',
 'Marche avec une ou deux charges tenues sur l’avant des épaules, qui sollicite le tronc et le haut du dos.',
 ARRAY['Tenir un ou deux kettlebells ou haltères sur l’avant des épaules, coudes proches du corps.','Gainer le tronc et marcher sur la distance voulue.','Poser les charges sous contrôle.'],
 ARRAY['Coudes hauts','Tronc gainé'],
 ARRAY['Coudes qui tombent','Cambrer le bas du dos']),

('Overhead carry','Marche bras en l’air',
 'Marche avec une charge tenue bras tendus au-dessus de la tête, qui sollicite fortement les épaules et le tronc.',
 ARRAY['Tenir une charge bras tendu au-dessus de la tête, poignet aligné sur l’avant-bras.','Gainer le tronc et marcher sur la distance voulue.','Poser la charge sous contrôle.'],
 ARRAY['Bras verrouillé','Tronc gainé'],
 ARRAY['Cambrer le bas du dos','Bras qui part vers l’avant']),

('Sandbag carry','Marche avec sac de sable',
 'Marche avec un sac de sable porté contre la poitrine ou sur l’épaule, qui sollicite tout le corps.',
 ARRAY['Soulever le sac de sable en se redressant, tenu serré contre la poitrine ou posé sur l’épaule.','Gainer le tronc et marcher sur la distance voulue.','Poser le sac sous contrôle.'],
 ARRAY['Sac serré contre le corps','Tronc gainé'],
 ARRAY['Laisser le sac glisser','Arrondir le dos']),

('Sled push','Poussée de traîneau',
 'Poussée d’un traîneau chargé en marchant, qui sollicite fortement les jambes avec peu de contrainte articulaire.',
 ARRAY['Se placer derrière le traîneau, mains sur les poignées, corps incliné vers l’avant.','Pousser en faisant des pas puissants, tronc gainé.','Garder le traîneau en mouvement sur la distance voulue.'],
 ARRAY['Corps incliné','Pas puissants'],
 ARRAY['Dos arrondi','Bras qui poussent seuls']),

('Sled pull','Traction de traîneau',
 'Traction d’un traîneau chargé à l’aide d’une corde ou d’une sangle, en marchant en arrière ou en tirant à la force des bras.',
 ARRAY['Se placer face au traîneau, saisir la corde ou la sangle.','Tirer la corde main sur main ou en marchant en arrière, tronc gainé.','Garder le traîneau en mouvement sur la distance voulue.'],
 ARRAY['Tronc gainé','Mouvement régulier'],
 ARRAY['Arrondir le dos','Se pencher en arrière sans contrôle'])
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