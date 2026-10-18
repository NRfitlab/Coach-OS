-- 4g-10a : rétro-remplissage des exercices de poussée horizontale d’origine (12 fiches), rédaction originale, à relire.
-- Rejouable : seuls les exercices communs sans nom français sont mis à jour.

with v(name, name_fr, description, steps, cues, common_mistakes) as (
values
('Bench press','Développé couché',
 'Poussée barre à la poitrine, allongé sur un banc plat, exercice de base pour les pectoraux, les triceps et les deltoïdes antérieurs.',
 ARRAY['S’allonger sur le banc, yeux sous la barre, pieds au sol, omoplates serrées et bas du dos légèrement cambré.','Saisir la barre un peu plus large que les épaules, la décrocher et la descendre contrôlée jusqu’au bas de la poitrine.','Pousser la barre vers le haut en gardant les omoplates serrées et les fesses sur le banc.'],
 ARRAY['Omoplates serrées','Avant-bras à la verticale'],
 ARRAY['Fesses qui décollent','Coudes trop écartés du corps']),

('Close-grip bench press','Développé couché prise serrée',
 'Développé couché avec les mains rapprochées, qui sollicite davantage les triceps.',
 ARRAY['S’allonger sur le banc comme pour un développé couché.','Saisir la barre à largeur d’épaules environ, coudes proches du corps.','Descendre vers le bas de la poitrine puis pousser, coudes serrés.'],
 ARRAY['Coudes proches du corps','Poignets alignés sur les avant-bras'],
 ARRAY['Prise trop étroite qui sollicite les poignets','Coudes qui s’écartent']),

('Incline bench press','Développé incliné',
 'Développé barre sur un banc incliné de 15 à 45°, qui sollicite davantage le haut des pectoraux et les deltoïdes antérieurs.',
 ARRAY['Régler le banc entre 15 et 45°, s’allonger, omoplates serrées.','Décrocher la barre et la descendre contrôlée vers le haut de la poitrine.','Pousser la barre vers le haut en gardant les épaules basses.'],
 ARRAY['Omoplates serrées','Épaules basses'],
 ARRAY['Inclinaison trop forte qui transforme l’exercice en développé épaules','Hausser les épaules']),

('Decline bench press','Développé décliné',
 'Développé barre sur un banc incliné vers le bas, qui sollicite davantage le bas des pectoraux.',
 ARRAY['S’allonger tête en bas sur un banc décliné, pieds bloqués.','Décrocher la barre et la descendre contrôlée vers le bas de la poitrine.','Pousser la barre vers le haut en gardant les omoplates serrées.'],
 ARRAY['Pieds bloqués','Descente contrôlée'],
 ARRAY['Rebondir sur la poitrine','Charge trop lourde pour la position']),

('Dumbbell bench press','Développé couché aux haltères',
 'Développé avec deux haltères sur un banc plat, qui permet une amplitude plus grande et corrige les déséquilibres entre les côtés.',
 ARRAY['S’asseoir avec les haltères sur les cuisses, s’allonger en les montant à hauteur de poitrine.','Descendre les haltères contrôlés de chaque côté de la poitrine, coudes à environ 45 à 75° du corps.','Pousser les haltères vers le haut en les rapprochant légèrement.'],
 ARRAY['Poignets alignés','Haltères qui descendent à la même vitesse'],
 ARRAY['Coudes trop écartés','Amplitude excessive qui sollicite l’épaule']),

('Incline dumbbell press','Développé incliné aux haltères',
 'Développé aux haltères sur un banc incliné, qui sollicite le haut des pectoraux avec une grande amplitude.',
 ARRAY['Régler le banc entre 15 et 45°, s’allonger en montant les haltères à hauteur de poitrine.','Descendre les haltères contrôlés de chaque côté du haut de la poitrine.','Pousser les haltères vers le haut en les rapprochant légèrement.'],
 ARRAY['Omoplates serrées','Descente contrôlée'],
 ARRAY['Inclinaison trop forte','Coudes trop écartés']),

('Floor press','Développé au sol',
 'Développé couché réalisé allongé au sol, qui limite l’amplitude en bas et protège l’épaule.',
 ARRAY['S’allonger au sol, genoux fléchis, barre ou haltères à hauteur de poitrine.','Descendre jusqu’à ce que les coudes touchent le sol.','Pousser vers le haut, sans rebond sur le sol.'],
 ARRAY['Arrêt contrôlé au sol','Coudes à environ 45° du corps'],
 ARRAY['Rebondir sur le sol','Relâcher les épaules au contact']),

('Machine chest press','Presse pectorale (machine)',
 'Poussée sur une machine guidée, assis, qui permet de travailler les pectoraux avec une trajectoire stable.',
 ARRAY['S’asseoir, régler le siège pour que les poignées soient à hauteur de poitrine, dos plaqué au dossier.','Saisir les poignées et pousser vers l’avant sans verrouiller les coudes.','Revenir lentement jusqu’à sentir l’étirement des pectoraux.'],
 ARRAY['Dos plaqué au dossier','Coudes non verrouillés'],
 ARRAY['Décoller le dos du dossier','Verrouiller les coudes en fin de poussée']),

('Cable fly','Écarté à la poulie',
 'Mouvement d’écarté avec deux poulies, qui isole les pectoraux avec une tension constante.',
 ARRAY['Se placer entre deux poulies à hauteur de poitrine, un pas en avant, buste légèrement incliné.','Tirer les mains devant la poitrine, coudes légèrement fléchis, comme pour serrer un arbre.','Revenir lentement jusqu’à sentir l’étirement des pectoraux.'],
 ARRAY['Coudes légèrement fléchis','Mouvement venant de l’épaule'],
 ARRAY['Fléchir trop les coudes pour transformer le mouvement en développé','Amplitude excessive à l’épaule']),

('Push-up','Pompe',
 'Poussée au poids du corps en planche, qui sollicite pectoraux, triceps, deltoïdes antérieurs et gainage.',
 ARRAY['Se placer en planche, mains un peu plus larges que les épaules, corps aligné de la tête aux talons.','Descendre la poitrine vers le sol en gardant les coudes à environ 45° du corps.','Pousser pour remonter jusqu’aux bras tendus.'],
 ARRAY['Corps aligné','Coudes à environ 45°'],
 ARRAY['Bassin qui s’affaisse ou monte','Coudes trop écartés']),

('Weighted push-up','Pompe lestée',
 'Pompe avec une charge posée sur le haut du dos ou un gilet lesté, pour augmenter l’intensité.',
 ARRAY['Poser une charge sur le haut du dos ou enfiler un gilet lesté, se placer en planche.','Descendre la poitrine vers le sol en gardant le corps aligné.','Pousser pour remonter jusqu’aux bras tendus.'],
 ARRAY['Corps aligné','Charge stable'],
 ARRAY['Charge qui glisse','Bassin qui s’affaisse']),

('Parallel bar dip','Dips aux barres parallèles',
 'Poussée au poids du corps entre deux barres, qui sollicite les pectoraux, les triceps et les deltoïdes antérieurs.',
 ARRAY['S’appuyer sur les barres parallèles, bras tendus, buste légèrement penché vers l’avant.','Descendre en fléchissant les coudes jusqu’à ce que les bras soient parallèles au sol ou légèrement en dessous.','Pousser pour remonter jusqu’aux bras tendus.'],
 ARRAY['Buste légèrement penché','Épaules basses'],
 ARRAY['Descendre trop bas pour l’épaule','Hausser les épaules'])
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