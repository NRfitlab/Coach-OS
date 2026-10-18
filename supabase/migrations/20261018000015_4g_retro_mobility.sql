-- 4g-11f : rétro-remplissage des exercices de mobilité d’origine (10 fiches), rédaction originale, à relire.
-- Rejouable : seuls les exercices communs sans nom français sont mis à jour.
-- Les zones du corps et la technique sont aussi renseignées (colonnes vides sur ces 10 exercices).

with v(name, name_fr, description, steps, cues, common_mistakes, body_zones, technique) as (
values
('90/90 hip switch','Bascule de hanches 90/90',
 'Assis au sol, les deux jambes à 90°, les genoux basculent d’un côté à l’autre pour mobiliser les rotations interne et externe de hanche.',
 ARRAY['S’asseoir, une jambe fléchie devant à 90°, l’autre fléchie sur le côté à 90°.','Faire pivoter les genoux pour inverser la position des jambes, sans s’aider des mains si possible.','Enchaîner 8 à 10 bascules lentes, dos droit.'],
 ARRAY['Dos droit','Mouvement lent'],
 ARRAY['Se pencher en arrière pour aider le mouvement','Forcer l’amplitude'],
 ARRAY['hip'],'active_mobility'),

('Cossack squat','Squat cosaque',
 'Squat latéral profond sur une jambe, l’autre jambe tendue, qui mobilise les adducteurs, la hanche et la cheville.',
 ARRAY['Debout, pieds largement écartés, pointes légèrement ouvertes.','Fléchir une jambe en reculant le bassin, l’autre jambe restant tendue avec le pied à plat ou la pointe relevée.','Revenir au centre et alterner, 6 à 8 répétitions par côté.'],
 ARRAY['Talon plat sur la jambe fléchie','Buste droit'],
 ARRAY['Talon qui décolle','Genou qui rentre'],
 ARRAY['hip','ankle'],'active_mobility'),

('Deep squat hold','Squat profond maintenu',
 'Maintien d’un squat profond, talons au sol, pour mobiliser hanches, genoux et chevilles.',
 ARRAY['Pieds à largeur d’épaules ou un peu plus, pointes légèrement ouvertes.','Descendre en squat profond, coudes à l’intérieur des genoux, talons au sol.','Tenir 30 à 60 s en respirant calmement.'],
 ARRAY['Talons au sol','Dos long'],
 ARRAY['Talons qui décollent','Dos arrondi'],
 ARRAY['hip','ankle'],'active_mobility'),

('Couch stretch','Étirement du canapé',
 'Étirement des fléchisseurs de hanche et du quadriceps, genou arrière posé contre un mur ou un canapé.',
 ARRAY['Poser le genou arrière contre un mur, le pied remontant le long du mur, l’autre pied devant en fente.','Contracter les fessiers et rentrer le bassin en se redressant.','Tenir 30 à 60 s, puis changer de côté.'],
 ARRAY['Bassin rentré','Fessiers contractés'],
 ARRAY['Cambrer le bas du dos','Forcer sur le genou'],
 ARRAY['hip','knee'],'static_stretch'),

('Pigeon stretch','Posture du pigeon',
 'Étirement du fessier et de la rotation externe de hanche, une jambe fléchie devant, l’autre tendue derrière.',
 ARRAY['À quatre pattes, ramener un genou vers la main du même côté, le tibia en travers devant soi.','Tendre l’autre jambe derrière et s’incliner doucement vers l’avant.','Tenir 30 à 60 s, puis changer de côté.'],
 ARRAY['Bassin à plat','Respiration calme'],
 ARRAY['Forcer en cas de douleur au genou','Laisser le bassin basculer sur le côté'],
 ARRAY['hip'],'static_stretch'),

('World''s greatest stretch','Meilleur étirement du monde',
 'Enchaînement d’une fente, d’une rotation du buste et d’une extension de hanche, qui mobilise hanches, colonne et épaules.',
 ARRAY['Faire une grande fente en avant, mains au sol de chaque côté du pied avant.','Poser le coude du côté de la jambe avant vers le sol, puis ouvrir ce bras vers le plafond en tournant le buste.','Revenir, alterner, 4 à 6 répétitions par côté.'],
 ARRAY['Rotation du buste','Mouvement lent'],
 ARRAY['Talon avant qui décolle','Aller trop vite'],
 ARRAY['hip','thoracic'],'dynamic_stretch'),

('Cat-cow','Chat-vache',
 'Mouvement alterné d’arrondi et de creux du dos à quatre pattes, qui mobilise la colonne vertébrale.',
 ARRAY['À quatre pattes, mains sous les épaules, genoux sous les hanches.','Arrondir le dos en rentrant le menton, puis le creuser en relevant la tête et les fesses.','Alterner lentement, 8 à 10 répétitions.'],
 ARRAY['Mouvement lent','Respiration synchronisée'],
 ARRAY['Forcer l’amplitude','Aller trop vite'],
 ARRAY['thoracic','pelvis_lumbar'],'active_mobility'),

('Thoracic open book','Livre ouvert thoracique',
 'Allongé sur le côté, un bras s’ouvre comme un livre pour mobiliser la rotation thoracique.',
 ARRAY['Allongé sur le côté, genoux fléchis à 90°, bras tendus devant, paumes jointes.','Ouvrir le bras du dessus vers l’arrière en suivant la main du regard, genoux collés ensemble.','Revenir, 8 à 10 répétitions par côté.'],
 ARRAY['Genoux collés','Regard qui suit la main'],
 ARRAY['Décoller les genoux','Forcer au-delà de l’amplitude confortable'],
 ARRAY['thoracic'],'active_mobility'),

('Thread the needle','Passage du fil dans l’aiguille',
 'À quatre pattes, un bras passe sous le corps pour tourner le haut du dos et étirer l’épaule et les omoplates.',
 ARRAY['À quatre pattes, mains sous les épaules, genoux sous les hanches.','Glisser un bras sous le corps, paume vers le haut, en tournant le buste jusqu’à poser l’épaule et la tête au sol.','Revenir, 6 à 8 répétitions par côté, ou tenir 20 à 30 s.'],
 ARRAY['Hanches stables','Respiration calme'],
 ARRAY['Basculer les hanches vers l’arrière','Forcer sur l’épaule'],
 ARRAY['thoracic','shoulder'],'active_mobility'),

('Band shoulder dislocates','Passage d’épaules avec bande',
 'Passage d’une bande ou d’un bâton tenu bras tendus de l’avant vers l’arrière du corps, pour mobiliser les épaules.',
 ARRAY['Debout, bande tenue bras tendus devant les cuisses, mains largement écartées.','Passer la bande au-dessus de la tête puis derrière le dos, bras tendus.','Revenir par le même chemin, 8 à 10 répétitions, en rapprochant les mains si l’épaule coince.'],
 ARRAY['Bras tendus','Mouvement lent'],
 ARRAY['Plier les coudes','Prise trop étroite qui force l’épaule'],
 ARRAY['shoulder','scapula'],'active_mobility')
)
update public.exercises e
set name_fr = v.name_fr,
    description = v.description,
    steps = v.steps,
    cues = v.cues,
    common_mistakes = v.common_mistakes,
    body_zones = v.body_zones,
    technique = v.technique
from v
where e.organization_id is null
  and e.name = v.name
  and e.name_fr is null;