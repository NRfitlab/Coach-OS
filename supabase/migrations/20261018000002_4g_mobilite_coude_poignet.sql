-- 4g-7 : mobilité du coude, de l’avant-bras et du poignet (15 fiches), rédaction originale, à relire.
-- Rejouable : un nom déjà présent parmi les exercices communs est ignoré.

with v(name, name_fr, description, steps, cues, common_mistakes, body_zones, technique, level, unilateral, equipment, primary_muscles, secondary_muscles) as (
values
('Wrist flexor stretch','Étirement des fléchisseurs du poignet',
 'Bras tendu paume vers le haut, l’autre main ramène les doigts vers le bas pour étirer la face avant de l’avant-bras.',
 ARRAY['Tendre un bras devant soi, paume vers le haut, coude tendu.','Avec l’autre main, tirer doucement les doigts vers le sol.','Tenir 20 à 30 s, puis changer de bras. Arrêter en cas de picotements ou d’engourdissement.'],
 ARRAY['Coude tendu','Traction douce'],
 ARRAY['Tirer fort','Fléchir le coude'],
 ARRAY['wrist_hand','elbow_forearm'],'static_stretch','beginner',true,ARRAY['bodyweight'],ARRAY['forearms'],ARRAY[]::text[]),

('Wrist extensor stretch','Étirement des extenseurs du poignet',
 'Bras tendu paume vers le bas, l’autre main fléchit le poignet pour étirer la face arrière de l’avant-bras.',
 ARRAY['Tendre un bras devant soi, paume vers le bas, coude tendu.','Avec l’autre main, tirer doucement le dos de la main vers soi en fléchissant le poignet.','Tenir 20 à 30 s, puis changer de bras. Arrêter en cas de picotements ou d’engourdissement.'],
 ARRAY['Coude tendu','Traction douce'],
 ARRAY['Tirer fort','Fléchir le coude'],
 ARRAY['wrist_hand','elbow_forearm'],'static_stretch','beginner',true,ARRAY['bodyweight'],ARRAY['forearms'],ARRAY[]::text[]),

('Prayer stretch','Posture de la prière (poignets)',
 'Paumes jointes devant la poitrine, les mains descendent vers le ventre en gardant les paumes en contact, pour étirer les fléchisseurs du poignet.',
 ARRAY['Joindre les paumes devant la poitrine, coudes écartés.','Descendre lentement les mains vers le ventre en gardant les paumes collées.','Tenir 20 à 30 s. Arrêter en cas de picotements ou d’engourdissement.'],
 ARRAY['Paumes en contact','Coudes à hauteur'],
 ARRAY['Décoller les paumes','Descendre trop vite'],
 ARRAY['wrist_hand'],'static_stretch','beginner',false,ARRAY['bodyweight'],ARRAY['forearms'],ARRAY[]::text[]),

('Reverse prayer stretch','Posture de la prière inversée (poignets)',
 'Dos de mains joints devant la poitrine, les mains remontent vers le menton pour étirer les extenseurs du poignet.',
 ARRAY['Joindre le dos des mains devant la poitrine, doigts vers le bas.','Remonter lentement les mains vers le menton en gardant le contact.','Tenir 20 à 30 s. Arrêter en cas de picotements ou d’engourdissement.'],
 ARRAY['Dos des mains en contact','Épaules basses'],
 ARRAY['Hausser les épaules','Forcer en fin d’amplitude'],
 ARRAY['wrist_hand'],'static_stretch','intermediate',false,ARRAY['bodyweight'],ARRAY['forearms'],ARRAY[]::text[]),

('Quadruped wrist rock','Bascule des poignets à quatre pattes',
 'À quatre pattes, les mains posées à plat, le poids bascule vers l’avant et l’arrière pour mobiliser l’extension du poignet.',
 ARRAY['À quatre pattes, mains à plat sous les épaules, doigts vers l’avant.','Basculer doucement le poids vers l’avant puis revenir, dans une amplitude confortable.','Faire 8 à 10 bascules, puis reprendre mains tournées vers l’extérieur si le confort le permet.'],
 ARRAY['Paumes à plat','Mouvement lent'],
 ARRAY['Forcer l’amplitude','Soulever les paumes'],
 ARRAY['wrist_hand'],'active_mobility','beginner',false,ARRAY['bodyweight'],ARRAY['forearms'],ARRAY[]::text[]),

('Wrist circles','Cercles de poignet',
 'Les poignets dessinent de grands cercles lents dans les deux sens, coudes tendus ou reposés.',
 ARRAY['Debout ou assis, bras tendus devant, poings légèrement serrés.','Dessiner de grands cercles avec les poignets, 8 dans chaque sens.','Garder l’avant-bras immobile.'],
 ARRAY['Grand cercle','Avant-bras immobile'],
 ARRAY['Cercle trop petit','Bouger tout l’avant-bras'],
 ARRAY['wrist_hand'],'articular_rotation','beginner',false,ARRAY['bodyweight'],ARRAY['forearms'],ARRAY[]::text[]),

('Active wrist flexion and extension','Flexion et extension actives du poignet',
 'Avant-bras posé sur une cuisse ou une table, la main monte et descend de façon active sans charge.',
 ARRAY['Poser l’avant-bras sur une cuisse, main dans le vide, paume vers le bas.','Lever la main vers le haut, puis la baisser vers le bas, sans aide.','Faire 10 à 15 répétitions lentes par poignet.'],
 ARRAY['Avant-bras immobile','Amplitude complète'],
 ARRAY['Bouger le coude','Aller trop vite'],
 ARRAY['wrist_hand'],'active_mobility','beginner',true,ARRAY['bodyweight'],ARRAY['forearms'],ARRAY[]::text[]),

('Wrist radial and ulnar deviation','Inclinaisons radiale et ulnaire du poignet',
 'Avant-bras posé, la main s’incline vers le pouce puis vers l’auriculaire pour mobiliser le poignet latéralement.',
 ARRAY['Poser l’avant-bras sur une cuisse, paume vers le bas, main dans le vide.','Incliner la main vers le côté du pouce puis vers le côté du petit doigt.','Faire 10 à 12 répétitions lentes par poignet.'],
 ARRAY['Avant-bras immobile','Mouvement lent'],
 ARRAY['Tourner l’avant-bras','Aller trop vite'],
 ARRAY['wrist_hand'],'active_mobility','beginner',true,ARRAY['bodyweight'],ARRAY['forearms'],ARRAY[]::text[]),

('Forearm pronation and supination','Pronation et supination de l’avant-bras',
 'Coude fléchi à 90° contre le corps, la paume se tourne vers le haut puis vers le bas pour mobiliser la rotation de l’avant-bras.',
 ARRAY['Assis ou debout, coude fléchi à 90° contre le flanc, pouce vers le haut.','Tourner la paume vers le haut (supination) puis vers le bas (pronation), coude fixe.','Faire 10 à 12 répétitions lentes par bras.'],
 ARRAY['Coude collé au corps','Mouvement lent'],
 ARRAY['Décoller le coude','Compenser avec l’épaule'],
 ARRAY['elbow_forearm'],'active_mobility','beginner',true,ARRAY['bodyweight'],ARRAY['forearms'],ARRAY['biceps']),

('Banded wrist extension','Extension du poignet à la bande',
 'Avant-bras posé, la main monte contre la résistance d’une bande pour renforcer les extenseurs du poignet.',
 ARRAY['Assis, avant-bras posé sur une cuisse, paume vers le bas, bande sous le pied et tenue dans la main.','Lever la main contre la bande, avant-bras immobile.','Redescendre lentement, 12 à 15 répétitions par poignet.'],
 ARRAY['Avant-bras immobile','Retour lent'],
 ARRAY['Soulever le coude','Choisir une bande trop forte'],
 ARRAY['wrist_hand','elbow_forearm'],'activation','beginner',true,ARRAY['band'],ARRAY['forearms'],ARRAY[]::text[]),

('Banded finger extension','Extension des doigts à la bande',
 'Un élastique autour des doigts, les doigts s’écartent et s’étendent contre la résistance pour travailler les extenseurs des doigts.',
 ARRAY['Placer un élastique ou une petite bande autour des doigts, au niveau des premières phalanges.','Ouvrir les doigts contre la résistance.','Tenir 2 s, relâcher, 12 à 15 répétitions par main.'],
 ARRAY['Mouvement lent','Doigts bien étendus'],
 ARRAY['Choisir une résistance trop forte','Crisper l’avant-bras'],
 ARRAY['wrist_hand'],'activation','beginner',true,ARRAY['band'],ARRAY['forearms'],ARRAY[]::text[]),

('Finger tendon glides','Glissements des tendons des doigts',
 'La main passe par cinq positions successives (ouverte, crochet, poing, poing en crochet, poing complet) pour mobiliser les tendons fléchisseurs.',
 ARRAY['Main ouverte, doigts tendus, paume vers soi.','Enchaîner lentement : doigts en crochet, poing complet, poing creux, puis revenir main ouverte.','Faire 5 cycles par main.'],
 ARRAY['Mouvement lent','Position tenue 2 s'],
 ARRAY['Enchaîner trop vite','Forcer en fin d’amplitude'],
 ARRAY['wrist_hand'],'active_mobility','beginner',true,ARRAY['bodyweight'],ARRAY['forearms'],ARRAY[]::text[]),

('Active elbow flexion and extension','Flexion et extension actives du coude',
 'Le coude se fléchit et se tend lentement sans charge, pour mobiliser l’articulation sur toute son amplitude.',
 ARRAY['Debout, bras le long du corps, paume vers l’avant.','Fléchir le coude pour amener la main vers l’épaule, puis tendre complètement.','Faire 10 à 12 répétitions lentes par bras.'],
 ARRAY['Coude collé au corps','Amplitude complète'],
 ARRAY['Balancer le bras','Raccourcir l’extension'],
 ARRAY['elbow_forearm'],'active_mobility','beginner',true,ARRAY['bodyweight'],ARRAY['biceps'],ARRAY['forearms']),

('Forearm ball massage','Auto-massage de l’avant-bras à la balle',
 'Avant-bras posé sur une table, une balle de massage roule sous les muscles de l’avant-bras.',
 ARRAY['Poser l’avant-bras sur une table, balle de massage entre l’avant-bras et la table.','Appuyer doucement et rouler du poignet vers le coude.','Faire 1 min par avant-bras. Arrêter en cas de picotements ou de douleur vive.'],
 ARRAY['Pression modérée','Respiration calme'],
 ARRAY['Appuyer sur l’os','Appuyer trop fort'],
 ARRAY['elbow_forearm'],'self_massage','beginner',true,ARRAY['massage_ball'],ARRAY['forearms'],ARRAY[]::text[]),

('Biceps wall stretch','Étirement du biceps au mur',
 'Main à plat contre un mur, bras tendu derrière soi à hauteur d’épaule, le buste tourne pour étirer l’avant du bras.',
 ARRAY['Debout de côté, main à plat contre un mur à hauteur d’épaule, doigts vers l’arrière.','Tourner doucement le buste à l’opposé du bras en gardant le coude tendu.','Tenir 20 à 30 s, puis changer de bras.'],
 ARRAY['Coude tendu','Épaule basse'],
 ARRAY['Hausser l’épaule','Forcer la rotation'],
 ARRAY['elbow_forearm','shoulder'],'static_stretch','beginner',true,ARRAY['wall'],ARRAY['biceps'],ARRAY['chest'])
)
insert into public.exercises
  (organization_id, movement_id, name, name_fr, description, steps, cues, common_mistakes,
   body_zones, technique, level, unilateral, equipment, primary_muscles, secondary_muscles)
select null, (select id from public.movements where slug = 'mobility'),
       v.name, v.name_fr, v.description, v.steps, v.cues, v.common_mistakes,
       v.body_zones, v.technique, v.level, v.unilateral, v.equipment, v.primary_muscles, v.secondary_muscles
from v
where not exists (
  select 1 from public.exercises e
  where e.organization_id is null and lower(e.name) = lower(v.name)
)
on conflict do nothing;