-- 4g-9c : rétro-remplissage des exercices de charnière de hanche d’origine (16 fiches), rédaction originale, à relire.
-- Rejouable : seuls les exercices communs sans nom français sont mis à jour.

with v(name, name_fr, description, steps, cues, common_mistakes) as (
values
('Conventional deadlift','Soulevé de terre classique',
 'Soulevé de terre avec les pieds à largeur de hanches et les mains à l’extérieur des jambes, mouvement de base pour la chaîne postérieure.',
 ARRAY['Placer la barre au-dessus du milieu du pied, pieds à largeur de hanches, mains à l’extérieur des jambes.','Gainer le tronc, tendre les bras et pousser le sol pour décoller la barre en gardant le dos neutre.','Verrouiller les hanches en haut, puis redescendre en gardant la barre proche des jambes.'],
 ARRAY['Barre collée aux jambes','Dos neutre'],
 ARRAY['Arrondir le bas du dos','Barre qui s’éloigne des jambes']),

('Sumo deadlift','Soulevé de terre sumo',
 'Soulevé de terre avec les pieds très écartés et les mains à l’intérieur des jambes, qui raccourcit la trajectoire et sollicite davantage les adducteurs.',
 ARRAY['Se placer pieds très écartés, pointes ouvertes, mains à l’intérieur des jambes sur la barre.','Gainer le tronc, pousser le sol en écartant les genoux et décoller la barre.','Verrouiller les hanches en haut, puis redescendre sous contrôle.'],
 ARRAY['Genoux écartés dans l’axe des pieds','Buste haut'],
 ARRAY['Genoux qui rentrent','Hanches qui montent avant les épaules']),

('Trap bar deadlift','Soulevé de terre à la barre hexagonale',
 'Soulevé de terre avec une barre hexagonale dans laquelle on se tient, qui garde la charge au centre du corps et réduit la contrainte sur le dos.',
 ARRAY['Se placer au centre de la barre hexagonale, pieds à largeur de hanches, mains sur les poignées.','Gainer le tronc et pousser le sol pour se redresser, dos neutre.','Verrouiller les hanches en haut, puis redescendre sous contrôle.'],
 ARRAY['Dos neutre','Poussée sur tout le pied'],
 ARRAY['Arrondir le dos','Hausser les épaules en haut']),

('Deficit deadlift','Soulevé de terre en déficit',
 'Soulevé de terre avec les pieds posés sur une plateforme surélevée, qui augmente l’amplitude de départ.',
 ARRAY['Se placer sur une plateforme de 2 à 5 cm, barre au-dessus du milieu du pied.','Gainer le tronc et pousser le sol pour décoller la barre depuis la position plus basse.','Verrouiller les hanches en haut, puis redescendre sous contrôle.'],
 ARRAY['Dos neutre dès le départ','Barre collée aux jambes'],
 ARRAY['Arrondir le bas du dos en bas','Déficit trop important pour la mobilité disponible']),

('Romanian deadlift','Soulevé de terre roumain',
 'Charnière de hanche avec les jambes presque tendues, la barre glisse le long des cuisses pour travailler ischio-jambiers et fessiers.',
 ARRAY['Debout, barre devant les cuisses, genoux légèrement fléchis.','Reculer les hanches en faisant glisser la barre le long des jambes, dos neutre, jusqu’à sentir l’étirement des ischio-jambiers.','Remonter en poussant les hanches vers l’avant sans cambrer.'],
 ARRAY['Hanches qui reculent','Barre collée aux jambes'],
 ARRAY['Arrondir le dos','Plier trop les genoux et transformer le mouvement en squat']),

('Stiff-leg deadlift','Soulevé de terre jambes tendues',
 'Charnière de hanche avec les genoux presque verrouillés et une amplitude plus grande que le soulevé de terre roumain.',
 ARRAY['Debout, barre devant les cuisses, genoux presque tendus.','Reculer les hanches et incliner le buste en gardant les jambes tendues, dos neutre.','Remonter en poussant les hanches vers l’avant.'],
 ARRAY['Jambes presque tendues','Dos neutre'],
 ARRAY['Arrondir le dos pour descendre plus bas','Verrouiller les genoux avec force']),

('Single-leg Romanian deadlift','Soulevé de terre roumain à une jambe',
 'Charnière de hanche sur une jambe, l’autre jambe part vers l’arrière, qui sollicite ischio-jambiers, fessiers et équilibre.',
 ARRAY['Debout sur une jambe, charge devant les cuisses ou le long de la jambe d’appui.','Reculer le bassin en envoyant l’autre jambe vers l’arrière, dos neutre, hanches alignées.','Remonter en poussant la hanche d’appui vers l’avant.'],
 ARRAY['Hanches alignées','Jambe libre dans le prolongement du dos'],
 ARRAY['Ouvrir le bassin','Arrondir le dos']),

('Good morning','Good morning (charnière avec barre sur le dos)',
 'Charnière de hanche avec la barre posée sur le haut du dos, qui sollicite fortement les ischio-jambiers, les fessiers et les érecteurs du rachis.',
 ARRAY['Barre en position de squat arrière, genoux légèrement fléchis.','Reculer les hanches en inclinant le buste, dos neutre, jusqu’à sentir l’étirement des ischio-jambiers.','Remonter en poussant les hanches vers l’avant.'],
 ARRAY['Hanches qui reculent','Dos neutre'],
 ARRAY['Arrondir le dos','Choisir une charge trop lourde']),

('45-degree back extension','Extension lombaire à 45°',
 'Extension sur un banc incliné à 45°, qui renforce érecteurs du rachis, fessiers et ischio-jambiers.',
 ARRAY['Régler le banc pour que les hanches dépassent légèrement le coussin, chevilles bloquées.','Fléchir le buste en gardant le dos neutre.','Remonter jusqu’à l’alignement du corps sans cambrer.'],
 ARRAY['Corps aligné en haut','Mouvement venant des hanches'],
 ARRAY['Cambrer en haut','Rebondir en bas']),

('Glute bridge','Pont fessier',
 'Montée du bassin depuis le sol, dos au sol, pour travailler les fessiers et les ischio-jambiers.',
 ARRAY['Allongé sur le dos, genoux fléchis, pieds à plat près des fessiers.','Pousser sur les pieds pour monter le bassin jusqu’à l’alignement épaules, hanches et genoux.','Contracter les fessiers 1 à 2 s en haut, puis redescendre sous contrôle.'],
 ARRAY['Fessiers contractés en haut','Côtes basses rentrées'],
 ARRAY['Cambrer le bas du dos','Pousser avec le haut des cuisses']),

('Hip thrust','Poussée de hanche (hip thrust)',
 'Montée du bassin avec le haut du dos sur un banc et une charge posée sur les hanches, exercice de référence pour les fessiers.',
 ARRAY['Haut du dos appuyé sur un banc, charge posée sur les hanches, pieds à plat.','Pousser sur les pieds pour monter le bassin jusqu’à l’alignement du tronc et des cuisses.','Contracter les fessiers en haut, puis redescendre sous contrôle.'],
 ARRAY['Menton légèrement rentré','Fessiers contractés en haut'],
 ARRAY['Cambrer le bas du dos en haut','Pieds trop éloignés ou trop proches']),

('Cable pull-through','Tirage à la poulie entre les jambes',
 'Charnière de hanche avec une poulie basse tirant entre les jambes, qui apprend à pousser les hanches vers l’avant en gardant le dos neutre.',
 ARRAY['Dos à la poulie basse, corde tenue entre les jambes, pieds écartés à largeur de hanches.','Reculer les hanches en gardant le dos neutre et les bras tendus.','Pousser les hanches vers l’avant pour se redresser, fessiers contractés.'],
 ARRAY['Hanches qui reculent','Bras tendus'],
 ARRAY['Tirer avec les bras','Arrondir le dos']),

('Kettlebell swing','Balancé de kettlebell',
 'Mouvement balistique de charnière de hanche, la poussée des hanches projette le kettlebell vers l’avant jusqu’à hauteur de poitrine.',
 ARRAY['Debout, kettlebell au sol légèrement devant soi, pieds à largeur d’épaules.','Saisir le kettlebell, le faire passer entre les jambes en reculant les hanches.','Pousser les hanches vers l’avant pour projeter le kettlebell à hauteur de poitrine, bras tendus.'],
 ARRAY['Poussée des hanches','Bras comme des cordes'],
 ARRAY['Faire un squat au lieu d’une charnière','Lever le kettlebell avec les bras']),

('Lying leg curl','Leg curl allongé',
 'Flexion du genou sur une machine, allongé sur le ventre, pour isoler les ischio-jambiers.',
 ARRAY['S’allonger sur le ventre, coussin au-dessus des talons, hanches plaquées au banc.','Fléchir les genoux pour amener les talons vers les fessiers.','Redescendre lentement jusqu’à l’extension presque complète.'],
 ARRAY['Hanches plaquées au banc','Descente lente'],
 ARRAY['Décoller les hanches','Balancer la charge']),

('Seated leg curl','Leg curl assis',
 'Flexion du genou sur une machine, en position assise, pour isoler les ischio-jambiers avec les hanches fléchies.',
 ARRAY['S’asseoir sur la machine, coussin au-dessus des talons, genoux alignés avec l’axe de rotation.','Fléchir les genoux pour amener les talons vers l’arrière.','Revenir lentement jusqu’à l’extension presque complète.'],
 ARRAY['Dos plaqué au dossier','Descente lente'],
 ARRAY['Se pencher en avant pour aider le mouvement','Balancer la charge']),

('Nordic hamstring curl','Nordic hamstring curl',
 'Exercice excentrique pour les ischio-jambiers : à genoux, les chevilles bloquées, le corps descend vers l’avant en résistant le plus longtemps possible.',
 ARRAY['À genoux, chevilles bloquées sous un support, corps aligné des genoux à la tête.','Descendre lentement vers l’avant en gardant les hanches ouvertes, en résistant avec les ischio-jambiers.','Se rattraper avec les mains, puis se repousser pour revenir en haut.'],
 ARRAY['Corps aligné','Descente contrôlée'],
 ARRAY['Plier les hanches pour descendre moins loin','Se laisser tomber'])
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