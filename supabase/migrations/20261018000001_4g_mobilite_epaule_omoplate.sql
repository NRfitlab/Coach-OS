-- 4g-6 : mobilité de l’épaule et de l’omoplate (15 fiches), rédaction originale, à relire.
-- Rejouable : un nom déjà présent parmi les exercices communs est ignoré.

with v(name, name_fr, description, steps, cues, common_mistakes, body_zones, technique, level, unilateral, equipment, primary_muscles, secondary_muscles) as (
values
('Cross-body shoulder stretch','Étirement de l’épaule bras croisé',
 'Un bras tendu est ramené en travers de la poitrine, tenu par l’autre bras, pour étirer l’arrière de l’épaule.',
 ARRAY['Debout ou assis, un bras tendu devant la poitrine à hauteur d’épaule.','Le ramener vers l’épaule opposée avec l’avant-bras de l’autre bras, sans tourner le buste.','Tenir 20 à 30 s, puis changer de bras.'],
 ARRAY['Épaule basse','Buste de face'],
 ARRAY['Hausser l’épaule','Tourner le buste'],
 ARRAY['shoulder'],'static_stretch','beginner',true,ARRAY['bodyweight'],ARRAY['rear_delts'],ARRAY['upper_back']),

('Sleeper stretch','Étirement du dormeur',
 'Allongé sur le côté, le coude à 90° devant l’épaule, l’avant-bras est poussé doucement vers le sol pour étirer l’arrière de l’épaule.',
 ARRAY['Allongé sur le côté, épaule sous le corps, coude fléchi à 90° devant l’épaule, avant-bras vertical.','Avec l’autre main, pousser très doucement l’avant-bras vers le sol.','Tenir 20 à 30 s, puis changer de côté. Arrêter en cas de pincement ou de douleur vive à l’avant de l’épaule.'],
 ARRAY['Pression très douce','Épaule détendue'],
 ARRAY['Pousser fort','Rouler le corps vers l’avant'],
 ARRAY['shoulder'],'static_stretch','intermediate',true,ARRAY['bodyweight'],ARRAY['rear_delts'],ARRAY['upper_back']),

('Doorway pec stretch','Étirement des pectoraux dans un encadrement de porte',
 'Avant-bras posé contre un montant de porte, le buste avance pour étirer l’avant de l’épaule et le pectoral.',
 ARRAY['Debout dans un encadrement de porte, avant-bras contre le montant, coude à hauteur d’épaule.','Avancer doucement un pied pour tourner le buste à l’opposé du bras.','Tenir 20 à 30 s, puis changer de côté.'],
 ARRAY['Coude à hauteur d’épaule','Buste droit'],
 ARRAY['Cambrer le bas du dos','Avancer trop loin'],
 ARRAY['shoulder'],'static_stretch','beginner',true,ARRAY['wall'],ARRAY['chest'],ARRAY['front_delts']),

('Wall lat stretch','Étirement du grand dorsal au mur',
 'Mains ou avant-bras contre un mur, le buste descend et les fessiers reculent pour étirer le flanc et le dessous du bras.',
 ARRAY['Debout face à un mur, un bras tendu contre le mur au-dessus de la tête.','Reculer les fessiers et descendre la poitrine vers le sol, en gardant le bras contre le mur.','Tenir 20 à 30 s, puis changer de côté.'],
 ARRAY['Bras tendu contre le mur','Respiration dans le flanc'],
 ARRAY['Cambrer le bas du dos','Hausser l’épaule'],
 ARRAY['shoulder','thoracic'],'static_stretch','beginner',true,ARRAY['wall'],ARRAY['lats'],ARRAY['upper_back']),

('Shoulder pendulum','Pendule d’épaule',
 'Penché en avant, un bras pend et balance doucement en petits cercles et en avant-arrière, sans effort musculaire.',
 ARRAY['Debout, une main en appui sur une table ou une chaise, penché en avant, bras libre pendant.','Laisser le bras pendre et le balancer par petits cercles, puis d’avant en arrière, avec le mouvement du corps.','Faire 30 à 45 s par bras, bras relâché.'],
 ARRAY['Bras relâché','Mouvement venant du corps'],
 ARRAY['Contracter le bras','Faire de trop grands cercles'],
 ARRAY['shoulder'],'active_mobility','beginner',true,ARRAY['chair'],ARRAY[]::text[],ARRAY['rear_delts']),

('Scapular clock','Horloge scapulaire',
 'Contre un mur, la main appuie sur une balle ou la paume et l’omoplate dessine les positions d’un cadran.',
 ARRAY['Debout face à un mur, paume à plat à hauteur d’épaule.','Déplacer l’omoplate vers 12 h (haut), 3 h, 6 h puis 9 h, sans plier le coude.','Faire 5 tours par côté.'],
 ARRAY['Mouvement venant de l’omoplate','Coude tendu'],
 ARRAY['Plier le coude','Hausser le cou'],
 ARRAY['scapula','shoulder'],'active_mobility','beginner',true,ARRAY['wall'],ARRAY['traps','upper_back'],ARRAY['front_delts']),

('Forearm wall slide','Glissement des avant-bras au mur',
 'Les avant-bras contre un mur, glisser vers le haut puis redescendre pour mobiliser l’épaule et l’omoplate.',
 ARRAY['Debout face à un mur, avant-bras contre le mur, coudes à hauteur d’épaule.','Glisser les avant-bras vers le haut en gardant le contact avec le mur.','Redescendre, 8 à 10 répétitions lentes.'],
 ARRAY['Avant-bras contre le mur','Côtes basses rentrées'],
 ARRAY['Cambrer le bas du dos','Hausser les épaules'],
 ARRAY['shoulder','scapula'],'active_mobility','beginner',false,ARRAY['wall'],ARRAY['traps','upper_back'],ARRAY['front_delts']),

('Scapular push-up','Pompe scapulaire',
 'En position de planche bras tendus, le haut du dos descend puis monte entre les omoplates, sans plier les coudes.',
 ARRAY['Se placer en planche bras tendus, mains sous les épaules.','Rapprocher les omoplates pour laisser descendre la poitrine, coudes tendus.','Écarter les omoplates pour remonter, 8 à 12 répétitions.'],
 ARRAY['Coudes tendus','Corps aligné'],
 ARRAY['Plier les coudes','Cambrer le bas du dos'],
 ARRAY['scapula','shoulder'],'activation','intermediate',false,ARRAY['bodyweight'],ARRAY['upper_back','chest'],ARRAY['abs']),

('Scapular retraction squeeze','Serrage des omoplates',
 'Debout ou assis, les omoplates se rapprochent vers la colonne sans hausser les épaules.',
 ARRAY['Debout ou assis, bras le long du corps, épaules basses.','Rapprocher les omoplates l’une de l’autre, comme pour les glisser dans les poches arrière.','Tenir 3 s, relâcher, 10 à 12 répétitions.'],
 ARRAY['Épaules basses','Nuque longue'],
 ARRAY['Hausser les épaules','Cambrer le bas du dos'],
 ARRAY['scapula','thoracic'],'activation','beginner',false,ARRAY['bodyweight'],ARRAY['upper_back'],ARRAY['rear_delts','traps']),

('Banded external rotation at side','Rotation externe à la bande, coude au corps',
 'Coude collé au corps, l’avant-bras s’écarte vers l’extérieur contre une bande, pour activer les rotateurs externes de l’épaule.',
 ARRAY['Fixer une bande à hauteur du coude, debout de profil, coude fléchi à 90° contre le corps, serviette roulée entre le coude et le flanc.','Faire tourner l’avant-bras vers l’extérieur contre la bande, coude fixe.','Revenir lentement, 12 à 15 répétitions par bras.'],
 ARRAY['Coude collé au corps','Retour contrôlé'],
 ARRAY['Décoller le coude','Compenser avec le buste'],
 ARRAY['shoulder'],'activation','beginner',true,ARRAY['band'],ARRAY['rear_delts'],ARRAY['upper_back']),

('Banded internal rotation at side','Rotation interne à la bande, coude au corps',
 'Coude collé au corps, l’avant-bras se rapproche du ventre contre une bande, pour activer les rotateurs internes de l’épaule.',
 ARRAY['Fixer une bande à hauteur du coude, debout de profil, coude fléchi à 90° contre le corps, serviette roulée entre le coude et le flanc.','Faire tourner l’avant-bras vers le ventre contre la bande, coude fixe.','Revenir lentement, 12 à 15 répétitions par bras.'],
 ARRAY['Coude collé au corps','Retour contrôlé'],
 ARRAY['Décoller le coude','Compenser avec le buste'],
 ARRAY['shoulder'],'activation','beginner',true,ARRAY['band'],ARRAY['front_delts','chest'],ARRAY['lats']),

('Shoulder controlled articular rotations','Rotations articulaires contrôlées de l’épaule',
 'Le bras dessine un grand cercle lent dans toute l’amplitude disponible de l’épaule, tronc immobile.',
 ARRAY['Debout, tronc stable, un bras le long du corps.','Faire un grand cercle lent avec le bras, en tendant les muscles pour garder le contrôle, tronc immobile.','Faire 3 cercles dans chaque sens, puis changer de bras.'],
 ARRAY['Tronc immobile','Mouvement lent et contrôlé'],
 ARRAY['Compenser avec le dos','Aller trop vite'],
 ARRAY['shoulder','scapula'],'articular_rotation','intermediate',true,ARRAY['bodyweight'],ARRAY['front_delts','side_delts'],ARRAY['rear_delts','traps']),

('Pec minor ball massage','Auto-massage du petit pectoral à la balle',
 'Une balle de massage entre le mur et l’avant de l’épaule, sous la clavicule, pour détendre le pectoral.',
 ARRAY['Placer une balle entre le mur et l’avant de l’épaule, sous la clavicule, à côté du bras.','Fléchir légèrement les genoux pour rouler lentement sur la zone sensible.','Faire 1 min par côté. Arrêter en cas de picotements ou de douleur vive.'],
 ARRAY['Pression progressive','Respiration calme'],
 ARRAY['Placer la balle sur la clavicule','Insister sur une douleur vive'],
 ARRAY['shoulder','thoracic'],'self_massage','beginner',true,ARRAY['massage_ball','wall'],ARRAY['chest'],ARRAY['front_delts']),

('Posterior shoulder ball massage','Auto-massage de l’arrière de l’épaule à la balle',
 'Une balle de massage entre le mur et le dos de l’épaule, pour détendre la zone de l’omoplate.',
 ARRAY['Placer une balle entre le mur et le dos de l’épaule, à côté de l’omoplate.','Fléchir légèrement les genoux pour rouler lentement sur la zone sensible.','Faire 1 min par côté. Arrêter en cas de picotements ou de douleur vive.'],
 ARRAY['Pression progressive','Respiration calme'],
 ARRAY['Placer la balle sur l’os de l’omoplate','Insister sur une douleur vive'],
 ARRAY['shoulder','scapula'],'self_massage','beginner',true,ARRAY['massage_ball','wall'],ARRAY['rear_delts'],ARRAY['upper_back']),

('Passive hang','Suspension passive à la barre',
 'Suspendu à une barre, bras tendus, épaules relâchées, pour décomprimer l’épaule et étirer le haut du dos.',
 ARRAY['Se suspendre à une barre de traction, mains à largeur d’épaules ou un peu plus, pieds posés sur un support au besoin.','Laisser les épaules monter vers les oreilles, sans effort, bras tendus.','Tenir 15 à 30 s, descendre en contrôlant. Arrêter en cas de douleur vive à l’épaule.'],
 ARRAY['Bras tendus','Respiration calme'],
 ARRAY['Se lâcher brusquement','Forcer au-delà de sa capacité de préhension'],
 ARRAY['shoulder','scapula'],'static_stretch','intermediate',false,ARRAY['pullup_bar'],ARRAY['lats'],ARRAY['forearms','upper_back'])
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