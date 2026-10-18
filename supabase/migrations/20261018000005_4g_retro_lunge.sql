-- 4g-9b : rétro-remplissage des exercices de fente d’origine (10 fiches), rédaction originale, à relire.
-- Rejouable : seuls les exercices communs sans nom français sont mis à jour.

with v(name, name_fr, description, steps, cues, common_mistakes) as (
values
('Split squat','Fente statique (split squat)',
 'Squat sur place avec les pieds en position de fente, une jambe devant l’autre, pour travailler quadriceps et fessiers sur une jambe à la fois.',
 ARRAY['Se placer en fente, pied avant à plat, pied arrière sur la pointe, pieds écartés à largeur de hanches.','Descendre en fléchissant les deux genoux verticalement, tronc droit.','Remonter en poussant sur le pied avant.'],
 ARRAY['Tronc droit','Descente verticale'],
 ARRAY['Pied avant qui décolle du talon','Genou avant qui rentre vers l’intérieur']),

('Bulgarian split squat','Squat bulgare',
 'Fente avec le pied arrière posé sur un banc, qui concentre la charge sur la jambe avant et sollicite fortement quadriceps et fessiers.',
 ARRAY['Poser le dessus du pied arrière sur un banc derrière soi, pied avant à environ 60 à 90 cm du banc.','Descendre en fléchissant le genou avant, tronc légèrement incliné ou droit selon la cible.','Remonter en poussant sur tout le pied avant.'],
 ARRAY['Poids sur le pied avant','Genou dans l’axe du pied'],
 ARRAY['Pied avant trop proche du banc','Genou avant qui rentre']),

('Reverse lunge','Fente arrière',
 'Fente avec un pas en arrière, plus facile à contrôler pour les genoux que la fente avant.',
 ARRAY['Debout, pieds à largeur de hanches.','Faire un grand pas en arrière et descendre en fléchissant les deux genoux.','Pousser sur le pied avant pour revenir debout, puis alterner.'],
 ARRAY['Tronc droit','Poids sur le pied avant'],
 ARRAY['Pas trop court','Genou avant qui rentre']),

('Walking lunge','Fente marchée',
 'Enchaînement de fentes avant avec déplacement, qui sollicite jambes, fessiers et équilibre.',
 ARRAY['Faire un grand pas en avant et descendre en fente, tronc droit.','Pousser sur la jambe avant pour amener la jambe arrière devant, sans repasser les pieds côte à côte.','Enchaîner en avançant, une jambe après l’autre.'],
 ARRAY['Pas assez grand pour rester stable','Tronc droit'],
 ARRAY['Pas trop court','Buste qui s’incline vers l’avant']),

('Curtsy lunge','Fente révérence',
 'Fente avec un pas en arrière croisé derrière la jambe d’appui, qui sollicite fessiers et abducteurs.',
 ARRAY['Debout, pieds à largeur de hanches.','Croiser une jambe derrière l’autre en diagonale et descendre en fléchissant les genoux.','Remonter en poussant sur le pied avant, puis alterner.'],
 ARRAY['Bassin stable','Genou avant dans l’axe du pied'],
 ARRAY['Genou avant qui rentre','Bassin qui tourne']),

('Lateral lunge','Fente latérale',
 'Fente sur le côté avec une jambe fléchie et l’autre tendue, qui sollicite fessiers, adducteurs et quadriceps.',
 ARRAY['Debout, pieds joints ou à largeur de hanches.','Faire un grand pas sur le côté et fléchir cette jambe en reculant le bassin, l’autre jambe restant tendue.','Pousser sur le pied fléchi pour revenir, puis alterner.'],
 ARRAY['Pied de la jambe tendue à plat','Bassin qui recule'],
 ARRAY['Talon qui décolle sur la jambe fléchie','Buste qui s’effondre vers l’avant']),

('Front-rack lunge','Fente avec barre en position rack',
 'Fente avec la barre posée sur l’avant des épaules, qui maintient le tronc vertical et sollicite les quadriceps et le tronc.',
 ARRAY['Poser la barre sur l’avant des épaules, coudes hauts.','Faire un pas en avant ou en arrière et descendre en fente, tronc vertical.','Remonter en poussant sur le pied avant.'],
 ARRAY['Coudes hauts','Tronc vertical'],
 ARRAY['Coudes qui tombent','Buste qui s’incline']),

('Sandbag lunge','Fente avec sac de sable',
 'Fente avec un sac de sable porté sur l’épaule ou devant le corps, qui sollicite fortement le tronc, comme dans les épreuves de type HYROX.',
 ARRAY['Porter le sac de sable sur les épaules ou serré contre la poitrine.','Faire un pas en avant et descendre en fente, tronc droit.','Remonter en poussant sur le pied avant, puis enchaîner.'],
 ARRAY['Sac serré contre le corps','Tronc droit'],
 ARRAY['Laisser le sac glisser','Genou avant qui rentre']),

('Step-up','Montée sur box',
 'Montée sur un banc ou un box avec une jambe, qui travaille quadriceps et fessiers dans un mouvement proche de la marche.',
 ARRAY['Poser un pied entièrement sur un box à hauteur du genou ou plus bas.','Monter en poussant sur le pied posé, puis amener l’autre pied sur le box.','Redescendre en contrôlant, jambe d’appui avant ou arrière selon la consigne.'],
 ARRAY['Pied entièrement posé','Poussée sur la jambe d’appui'],
 ARRAY['Pousser avec la jambe au sol','Genou qui rentre']),

('Lateral step-up','Montée latérale sur box',
 'Montée sur un box de côté, qui sollicite fessiers et quadriceps dans le plan frontal et améliore le contrôle du genou.',
 ARRAY['Se placer de côté près d’un box, un pied posé dessus.','Monter en poussant sur la jambe posée, sans pousser avec l’autre jambe.','Redescendre lentement, puis répéter du même côté.'],
 ARRAY['Poussée sur la jambe d’appui','Genou dans l’axe du pied'],
 ARRAY['Pousser avec la jambe au sol','Bassin qui s’affaisse'])
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