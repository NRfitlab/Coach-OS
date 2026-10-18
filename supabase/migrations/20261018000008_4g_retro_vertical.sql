-- 4g-10b : rétro-remplissage des exercices de poussée et de traction verticales d’origine (15 fiches), rédaction originale, à relire.
-- Rejouable : seuls les exercices communs sans nom français sont mis à jour.

with v(name, name_fr, description, steps, cues, common_mistakes) as (
values
('Overhead press','Développé militaire',
 'Poussée de la barre au-dessus de la tête, debout, qui sollicite les deltoïdes, les triceps et le haut du dos.',
 ARRAY['Debout, barre sur l’avant des épaules, pieds à largeur de hanches, fessiers et abdominaux contractés.','Pousser la barre droit au-dessus de la tête en passant la tête légèrement en arrière puis en avant sous la barre.','Verrouiller les bras en haut, puis redescendre la barre jusqu’aux épaules.'],
 ARRAY['Fessiers et abdominaux contractés','Barre au-dessus du milieu du pied en haut'],
 ARRAY['Cambrer le bas du dos','Pousser la barre vers l’avant au lieu de la verticale']),

('Push press','Développé poussé (push press)',
 'Développé au-dessus de la tête avec une impulsion des jambes pour lancer la barre, qui permet de soulever plus lourd.',
 ARRAY['Debout, barre sur l’avant des épaules.','Fléchir légèrement les genoux, puis les tendre explosivement pour lancer la barre vers le haut.','Terminer la poussée avec les bras, verrouiller en haut, puis redescendre la barre aux épaules.'],
 ARRAY['Impulsion des jambes verticale','Barre proche du visage'],
 ARRAY['Fléchir trop les genoux pour faire un squat','Pousser la barre vers l’avant']),

('Seated dumbbell shoulder press','Développé épaules assis aux haltères',
 'Développé épaules avec deux haltères, assis sur un banc à dossier, pour les deltoïdes et les triceps.',
 ARRAY['S’asseoir, dossier à 80 à 90°, haltères à hauteur d’épaules, paumes vers l’avant.','Pousser les haltères vers le haut en les rapprochant légèrement.','Redescendre sous contrôle jusqu’à hauteur des oreilles.'],
 ARRAY['Dos plaqué au dossier','Descente contrôlée'],
 ARRAY['Cambrer le bas du dos','Haltères qui s’écartent trop']),

('Arnold press','Arnold press',
 'Développé aux haltères avec rotation du poignet pendant la poussée, qui sollicite les deltoïdes sur une amplitude étendue.',
 ARRAY['Assis ou debout, haltères devant la poitrine, paumes vers soi.','Pousser en tournant les paumes vers l’avant pendant la montée.','Redescendre en tournant les paumes vers soi.'],
 ARRAY['Rotation fluide','Dos gainé'],
 ARRAY['Aller trop vite','Cambrer le bas du dos']),

('Z press','Z press (développé assis au sol)',
 'Développé épaules assis au sol, jambes tendues et sans dossier, qui supprime l’aide des jambes et sollicite fortement le tronc.',
 ARRAY['S’asseoir au sol, jambes tendues écartées, barre sur l’avant des épaules.','Gainer le tronc et pousser la barre au-dessus de la tête.','Redescendre la barre jusqu’aux épaules sous contrôle.'],
 ARRAY['Tronc gainé','Dos droit'],
 ARRAY['Cambrer le bas du dos','S’incliner en arrière']),

('Landmine press','Développé à la landmine',
 'Poussée avec une barre ancrée à une extrémité, tenue à une main devant l’épaule, qui offre un angle de poussée favorable aux épaules.',
 ARRAY['Debout, extrémité libre de la barre contre l’épaule, une main ou deux.','Pousser la barre vers l’avant et le haut en gardant le tronc gainé.','Redescendre la barre jusqu’à l’épaule sous contrôle.'],
 ARRAY['Tronc gainé','Poussée dans l’axe de la barre'],
 ARRAY['Cambrer le bas du dos','Hausser l’épaule']),

('Handstand push-up','Pompe en équilibre sur les mains (handstand push-up)',
 'Poussée verticale en position de poirier, souvent contre un mur, qui sollicite fortement les épaules et les triceps.',
 ARRAY['Se placer en poirier contre un mur, mains à largeur d’épaules.','Descendre la tête vers le sol en fléchissant les coudes, tronc gainé.','Pousser pour remonter jusqu’aux bras tendus.'],
 ARRAY['Tronc gainé','Mains stables'],
 ARRAY['Cambrer le bas du dos','Descendre trop bas sans contrôle']),

('Pull-up','Traction pronation',
 'Traction à la barre, paumes vers l’avant, qui sollicite les grands dorsaux, le haut du dos et les biceps.',
 ARRAY['Se suspendre à la barre, mains un peu plus larges que les épaules, paumes vers l’avant.','Tirer les coudes vers le sol pour amener le menton au-dessus de la barre.','Redescendre sous contrôle jusqu’aux bras tendus.'],
 ARRAY['Épaules basses','Coudes vers le sol'],
 ARRAY['Hausser les épaules','Balancer le corps']),

('Chin-up','Traction supination',
 'Traction à la barre, paumes vers soi, qui sollicite davantage les biceps.',
 ARRAY['Se suspendre à la barre, mains à largeur d’épaules, paumes vers soi.','Tirer les coudes vers le sol pour amener le menton au-dessus de la barre.','Redescendre sous contrôle jusqu’aux bras tendus.'],
 ARRAY['Épaules basses','Poitrine vers la barre'],
 ARRAY['Hausser les épaules','Balancer le corps']),

('Neutral-grip pull-up','Traction prise neutre',
 'Traction avec les paumes face à face, qui réduit la contrainte sur les épaules et les poignets.',
 ARRAY['Se suspendre à des poignées parallèles, paumes face à face.','Tirer les coudes vers le sol pour amener le menton au niveau des poignées.','Redescendre sous contrôle jusqu’aux bras tendus.'],
 ARRAY['Épaules basses','Coudes proches du corps'],
 ARRAY['Hausser les épaules','Balancer le corps']),

('Weighted pull-up','Traction lestée',
 'Traction avec une charge accrochée à la ceinture, pour augmenter l’intensité.',
 ARRAY['Fixer une charge à une ceinture de lest et se suspendre à la barre.','Tirer les coudes vers le sol pour amener le menton au-dessus de la barre.','Redescendre sous contrôle jusqu’aux bras tendus.'],
 ARRAY['Épaules basses','Charge stable'],
 ARRAY['Balancer la charge','Raccourcir l’amplitude']),

('Assisted pull-up','Traction assistée',
 'Traction avec une aide (machine à contrepoids ou bande élastique), pour travailler le mouvement quand la force est insuffisante pour une traction complète.',
 ARRAY['Régler la machine ou la bande pour une assistance adaptée.','Se suspendre à la barre, mains un peu plus larges que les épaules.','Tirer les coudes vers le sol pour monter le menton au-dessus de la barre, puis redescendre sous contrôle.'],
 ARRAY['Épaules basses','Amplitude complète'],
 ARRAY['Trop d’assistance qui supprime l’effort','Rebondir sur la bande']),

('Lat pulldown','Tirage vertical à la poulie',
 'Tirage d’une barre vers la poitrine, assis, qui sollicite les grands dorsaux.',
 ARRAY['S’asseoir, cuisses bloquées sous les coussins, saisir la barre mains un peu plus larges que les épaules.','Tirer la barre vers le haut de la poitrine en abaissant les coudes.','Remonter la barre lentement jusqu’aux bras tendus.'],
 ARRAY['Coudes vers le bas','Poitrine vers la barre'],
 ARRAY['Se pencher en arrière pour aider le mouvement','Tirer avec les bras seulement']),

('Single-arm lat pulldown','Tirage vertical à une main',
 'Tirage à la poulie haute, un bras à la fois, qui permet une amplitude plus grande et une meilleure concentration sur chaque côté.',
 ARRAY['S’asseoir face à la poulie, saisir la poignée d’une main.','Tirer la poignée vers l’épaule en abaissant le coude vers le flanc.','Remonter lentement jusqu’au bras tendu.'],
 ARRAY['Coude vers le flanc','Tronc stable'],
 ARRAY['Tourner le tronc pour aider','Hausser l’épaule']),

('Straight-arm pulldown','Tirage bras tendus à la poulie',
 'Tirage à la poulie haute avec les bras presque tendus, qui isole les grands dorsaux sans solliciter les biceps.',
 ARRAY['Debout face à la poulie haute, barre ou corde tenue bras tendus, buste légèrement penché.','Abaisser la barre jusqu’aux cuisses en gardant les bras presque tendus.','Remonter lentement jusqu’au niveau des épaules.'],
 ARRAY['Bras presque tendus','Mouvement venant de l’épaule'],
 ARRAY['Fléchir les coudes pour transformer le mouvement en tirage','Se pencher trop en avant'])
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