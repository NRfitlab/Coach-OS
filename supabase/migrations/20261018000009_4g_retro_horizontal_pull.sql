-- 4g-10c : rétro-remplissage des exercices de traction horizontale d’origine (11 fiches), rédaction originale, à relire.
-- Rejouable : seuls les exercices communs sans nom français sont mis à jour.

with v(name, name_fr, description, steps, cues, common_mistakes) as (
values
('Barbell row','Rowing barre',
 'Tirage de la barre vers le bas du ventre, buste penché, qui sollicite le haut du dos, les grands dorsaux et les biceps.',
 ARRAY['Debout, barre devant les jambes, hanches reculées, buste incliné à environ 45° et dos neutre.','Tirer la barre vers le bas du ventre en rapprochant les omoplates.','Redescendre la barre sous contrôle jusqu’aux bras tendus.'],
 ARRAY['Dos neutre','Coudes vers l’arrière'],
 ARRAY['Se redresser pour aider le mouvement','Arrondir le dos']),

('Pendlay row','Rowing Pendlay',
 'Rowing barre depuis le sol, buste parallèle au sol, qui oblige à repartir de zéro à chaque répétition.',
 ARRAY['Barre posée au sol, buste parallèle au sol, dos neutre.','Tirer la barre explosivement vers le bas de la poitrine.','Reposer la barre au sol entre chaque répétition.'],
 ARRAY['Buste fixe','Dos neutre'],
 ARRAY['Se redresser à chaque répétition','Arrondir le dos']),

('Dumbbell row','Rowing haltère',
 'Tirage d’un haltère à une main, avec une main et un genou appuyés sur un banc, qui sollicite le dos et les biceps.',
 ARRAY['Un genou et une main sur un banc, dos plat, haltère tenu à bout de bras.','Tirer l’haltère vers la hanche en gardant le coude proche du corps.','Redescendre l’haltère sous contrôle jusqu’au bras tendu.'],
 ARRAY['Dos plat','Coude vers la hanche'],
 ARRAY['Tourner le buste pour aider','Tirer vers l’épaule plutôt que vers la hanche']),

('Meadows row','Rowing Meadows',
 'Rowing à une main avec une barre ancrée à une extrémité, qui sollicite le dos avec une amplitude étendue.',
 ARRAY['Se placer de côté près de l’extrémité de la barre ancrée, penché en avant, dos neutre.','Saisir la barre près du disque et la tirer vers la hanche.','Redescendre sous contrôle jusqu’au bras tendu.'],
 ARRAY['Dos neutre','Coude vers la hanche'],
 ARRAY['Tourner le buste pour aider','Arrondir le dos']),

('Seal row','Rowing phoque',
 'Rowing barre allongé sur un banc surélevé, qui supprime l’aide du bas du dos et isole le haut du dos.',
 ARRAY['S’allonger sur le ventre sur un banc surélevé, barre au-dessus du sol, bras tendus.','Tirer la barre vers le haut du ventre en rapprochant les omoplates.','Redescendre sous contrôle jusqu’aux bras tendus.'],
 ARRAY['Poitrine plaquée au banc','Omoplates serrées en haut'],
 ARRAY['Décoller le buste du banc','Utiliser l’élan']),

('Chest-supported row','Rowing poitrine appuyée',
 'Rowing avec la poitrine appuyée sur un banc incliné, qui supprime la sollicitation du bas du dos et isole le haut du dos.',
 ARRAY['S’allonger sur un banc incliné, poitrine appuyée, haltères ou barre tenus bras tendus.','Tirer les coudes vers l’arrière en rapprochant les omoplates.','Redescendre sous contrôle jusqu’aux bras tendus.'],
 ARRAY['Poitrine plaquée au banc','Coudes vers l’arrière'],
 ARRAY['Décoller la poitrine du banc','Hausser les épaules']),

('Seated cable row','Rowing assis à la poulie',
 'Tirage à la poulie basse, assis, qui sollicite le haut du dos et les grands dorsaux avec une tension constante.',
 ARRAY['S’asseoir face à la poulie basse, pieds sur les repose-pieds, genoux légèrement fléchis, dos droit.','Tirer la poignée vers le bas du ventre en rapprochant les omoplates.','Revenir lentement jusqu’aux bras tendus, sans arrondir le dos.'],
 ARRAY['Dos droit','Omoplates serrées en fin de tirage'],
 ARRAY['Se pencher en arrière pour aider le mouvement','Arrondir le dos en fin de retour']),

('Machine row','Rowing à la machine',
 'Tirage sur machine guidée, poitrine appuyée, qui permet de travailler le haut du dos avec une trajectoire stable.',
 ARRAY['S’asseoir, poitrine appuyée sur le support, saisir les poignées.','Tirer les poignées vers soi en rapprochant les omoplates.','Revenir lentement jusqu’à sentir l’étirement du haut du dos.'],
 ARRAY['Poitrine plaquée au support','Coudes vers l’arrière'],
 ARRAY['Décoller la poitrine du support','Hausser les épaules']),

('T-bar row','Rowing T-bar',
 'Tirage d’une barre ancrée à une extrémité, tenue avec une poignée en V, qui sollicite le haut du dos avec une charge élevée.',
 ARRAY['Se placer au-dessus de la barre ancrée, penché, dos neutre, poignée en V tenue bras tendus.','Tirer la barre vers la poitrine en rapprochant les omoplates.','Redescendre sous contrôle jusqu’aux bras tendus.'],
 ARRAY['Dos neutre','Coudes proches du corps'],
 ARRAY['Se redresser pour aider le mouvement','Arrondir le dos']),

('Inverted row','Rowing inversé',
 'Tirage au poids du corps sous une barre fixe, corps aligné, qui sollicite le haut du dos et les biceps.',
 ARRAY['S’allonger sous une barre fixe à hauteur de poitrine, saisir la barre mains un peu plus larges que les épaules, corps aligné.','Tirer la poitrine vers la barre en rapprochant les omoplates.','Redescendre sous contrôle jusqu’aux bras tendus.'],
 ARRAY['Corps aligné','Omoplates serrées en haut'],
 ARRAY['Bassin qui s’affaisse','Hausser les épaules']),

('Face pull','Tirage visage (face pull)',
 'Tirage à la poulie haute vers le visage, qui renforce l’arrière des épaules et le haut du dos.',
 ARRAY['Se placer face à la poulie haute, corde tenue mains en pronation, bras tendus.','Tirer la corde vers le visage en écartant les mains et en ouvrant les coudes vers l’extérieur.','Revenir lentement jusqu’aux bras tendus.'],
 ARRAY['Coudes hauts','Mains qui s’écartent en fin de tirage'],
 ARRAY['Se pencher en arrière pour aider le mouvement','Charge trop lourde qui supprime la rotation externe'])
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