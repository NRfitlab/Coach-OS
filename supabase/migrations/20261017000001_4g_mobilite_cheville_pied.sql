-- 4g-2 : mobilité cheville et pied (30 fiches), rédaction originale, à relire.
-- Rejouable : un nom déjà présent parmi les exercices communs est ignoré.

with v(name, name_fr, description, steps, cues, common_mistakes, body_zones, technique, level, unilateral, equipment, primary_muscles, secondary_muscles) as (
values
('Half-kneeling ankle dorsiflexion rock','Bascule de cheville à demi-genou',
 'Le genou avant avance au-dessus du pied resté à plat pour gagner de la flexion dorsale de cheville.',
 ARRAY['Se placer à demi-genou, pied avant à plat, orteils à 10 cm d’un mur ou d’un repère.','Pousser le genou avant vers l’avant sans décoller le talon.','Revenir et répéter lentement.'],
 ARRAY['Talon collé au sol','Genou dans l’axe du 2e orteil'],
 ARRAY['Talon qui se soulève','Genou qui tombe vers l’intérieur'],
 ARRAY['ankle'],'active_mobility','beginner',true,ARRAY['bodyweight'],ARRAY['calves'],ARRAY[]::text[]),

('Banded ankle dorsiflexion mobilization','Mobilisation de cheville à la bande (glissement antérieur)',
 'Une bande tire le haut de la cheville vers l’arrière pendant que le genou avance, pour faciliter le glissement de l’articulation.',
 ARRAY['Fixer une bande basse, la placer à plat sur le haut du pied-cheville, à la base de la jambe, tirant vers l’arrière.','Poser le pied à plat, genou avant fléchi, bande tendue.','Pousser le genou vers l’avant en gardant le talon au sol, 10 répétitions.'],
 ARRAY['Bande sur le pli de la cheville, pas sur les orteils','Talon lourd'],
 ARRAY['Bande trop basse sur le pied','Talon qui décolle'],
 ARRAY['ankle'],'loaded_mobility','intermediate',true,ARRAY['band'],ARRAY['calves'],ARRAY[]::text[]),

('Wall calf stretch','Étirement du mollet au mur, genou tendu',
 'Étirement du gastrocnémien : jambe arrière tendue, talon au sol, bassin poussé vers le mur.',
 ARRAY['Mains au mur, une jambe en arrière, talon au sol et jambe tendue.','Avancer le bassin vers le mur jusqu’à sentir l’étirement du mollet.','Tenir 30 à 45 s puis changer de jambe.'],
 ARRAY['Pied arrière dirigé droit devant','Corps aligné de la tête au talon'],
 ARRAY['Talon qui se soulève','Pied tourné vers l’extérieur'],
 ARRAY['ankle'],'static_stretch','beginner',true,ARRAY['wall'],ARRAY['calves'],ARRAY[]::text[]),

('Soleus wall stretch','Étirement du soléaire au mur, genou fléchi',
 'Même position que l’étirement du mollet mais genou arrière fléchi, pour cibler le soléaire.',
 ARRAY['Mains au mur, une jambe en arrière, pieds proches du mur.','Fléchir le genou arrière en gardant le talon au sol.','Tenir 30 à 45 s puis changer de jambe.'],
 ARRAY['Genou arrière vers l’avant et le bas','Talon lourd'],
 ARRAY['Talon qui décolle','Dos arrondi'],
 ARRAY['ankle'],'static_stretch','beginner',true,ARRAY['wall'],ARRAY['calves'],ARRAY[]::text[]),

('Step calf stretch','Étirement du mollet sur marche (talon en bas)',
 'Les avant-pieds sur une marche, les talons descendent sous le niveau de la marche pour étirer les mollets.',
 ARRAY['Placer l’avant-pied sur le bord d’une marche, talons dans le vide, une main en appui.','Laisser descendre les talons lentement.','Tenir 30 s, genoux tendus puis légèrement fléchis.'],
 ARRAY['Descente lente et contrôlée','Appui stable de la main'],
 ARRAY['Rebondir dans l’étirement','Basculer le poids vers l’extérieur du pied'],
 ARRAY['ankle'],'static_stretch','beginner',false,ARRAY['box'],ARRAY['calves'],ARRAY[]::text[]),

('Seated calf stretch with strap','Mollet assis à la sangle, genou tendu',
 'Assis jambe tendue, une sangle autour de l’avant-pied tire le pied vers soi.',
 ARRAY['S’asseoir jambe tendue, sangle autour de l’avant-pied.','Tirer la sangle pour ramener les orteils vers soi, dos droit.','Tenir 30 à 45 s puis changer de jambe.'],
 ARRAY['Genou tendu','Buste droit'],
 ARRAY['Dos arrondi pour attraper la sangle','Genou fléchi'],
 ARRAY['ankle'],'static_stretch','beginner',true,ARRAY['strap'],ARRAY['calves'],ARRAY['hamstrings']),

('Downward dog pedaling','Chien tête en bas, pédalage',
 'Depuis le chien tête en bas, les talons descendent alternativement pour mobiliser les mollets et les chevilles.',
 ARRAY['Prendre la position du chien tête en bas, hanches hautes.','Fléchir un genou et descendre le talon opposé vers le sol.','Alterner doucement, 10 à 20 répétitions.'],
 ARRAY['Hanches hautes','Poids réparti entre mains et pieds'],
 ARRAY['Dos arrondi','Mouvement trop rapide'],
 ARRAY['ankle','hip'],'dynamic_stretch','beginner',false,ARRAY['bodyweight'],ARRAY['calves','hamstrings'],ARRAY['upper_back']),

('Ankle circles','Cercles de cheville',
 'Rotation lente de la cheville dans toute son amplitude, jambe non chargée.',
 ARRAY['S’asseoir ou s’allonger, une jambe levée.','Dessiner de grands cercles avec les orteils, 10 dans chaque sens.','Changer de jambe.'],
 ARRAY['Grand cercle, mouvement venant de la cheville','Genou immobile'],
 ARRAY['Cercle trop petit','Mouvement venant de la jambe'],
 ARRAY['ankle'],'articular_rotation','beginner',true,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY['calves']),

('Ankle alphabet','Alphabet avec la cheville',
 'Tracer les lettres de l’alphabet avec le gros orteil pour explorer toutes les directions de la cheville.',
 ARRAY['S’asseoir, jambe levée ou croisée.','Tracer les lettres de A à Z avec le gros orteil.','Changer de jambe.'],
 ARRAY['Lettres grandes','Mouvement lent'],
 ARRAY['Bouger tout le genou','Lettres bâclées'],
 ARRAY['ankle'],'articular_rotation','beginner',true,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY['calves']),

('Banded ankle inversion','Inversion de cheville à la bande',
 'Le pied tourne la plante vers l’intérieur contre la résistance d’une bande.',
 ARRAY['Assis, jambe tendue, bande fixée côté extérieur et passée sur l’avant-pied.','Tourner la plante du pied vers l’intérieur, jambe immobile.','Revenir lentement, 12 à 15 répétitions.'],
 ARRAY['Mouvement isolé de la cheville','Retour contrôlé'],
 ARRAY['Rotation de la jambe entière','Retour sans contrôle'],
 ARRAY['ankle'],'activation','beginner',true,ARRAY['band'],ARRAY[]::text[],ARRAY['calves']),

('Banded ankle eversion','Éversion de cheville à la bande',
 'Le pied tourne la plante vers l’extérieur contre la résistance d’une bande.',
 ARRAY['Assis, jambe tendue, bande fixée côté intérieur et passée sur l’avant-pied.','Tourner la plante du pied vers l’extérieur, jambe immobile.','Revenir lentement, 12 à 15 répétitions.'],
 ARRAY['Mouvement isolé de la cheville','Retour contrôlé'],
 ARRAY['Rotation de la jambe entière','Retour sans contrôle'],
 ARRAY['ankle'],'activation','beginner',true,ARRAY['band'],ARRAY[]::text[],ARRAY['calves']),

('Banded ankle dorsiflexion','Flexion dorsale de cheville à la bande',
 'Ramener les orteils vers le tibia contre une bande pour activer les releveurs du pied.',
 ARRAY['Assis, jambe tendue, bande fixée devant et passée sur l’avant-pied.','Ramener les orteils vers le tibia.','Revenir lentement, 12 à 15 répétitions.'],
 ARRAY['Talon au sol','Mouvement lent'],
 ARRAY['Soulever la jambe','Aller trop vite'],
 ARRAY['ankle'],'activation','beginner',true,ARRAY['band'],ARRAY[]::text[],ARRAY['calves']),

('Banded ankle plantarflexion','Flexion plantaire de cheville à la bande',
 'Pousser l’avant-pied vers le bas contre une bande tenue à la main.',
 ARRAY['Assis, jambe tendue, bande passée sous l’avant-pied et tenue des deux mains.','Pousser l’avant-pied vers l’avant, comme pour appuyer sur une pédale.','Revenir lentement, 12 à 15 répétitions.'],
 ARRAY['Amplitude complète','Retour lent'],
 ARRAY['Fléchir le genou','Raccourcir le mouvement'],
 ARRAY['ankle'],'activation','beginner',true,ARRAY['band'],ARRAY['calves'],ARRAY[]::text[]),

('Single-leg balance','Équilibre sur une jambe',
 'Tenir l’équilibre sur un pied pour solliciter les stabilisateurs de la cheville et du pied.',
 ARRAY['Se tenir debout, plier légèrement le genou d’appui.','Lever l’autre pied et tenir 30 s, regard fixe.','Changer de jambe ; fermer les yeux pour progresser.'],
 ARRAY['Pied d’appui actif, orteils à plat','Bassin de niveau'],
 ARRAY['Genou verrouillé','Regard qui bouge'],
 ARRAY['ankle','foot'],'activation','beginner',true,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY['calves','glutes']),

('Star excursion reach','Étoile d’équilibre (reach multidirectionnel)',
 'En équilibre sur une jambe, l’autre pied touche le sol dans plusieurs directions sans prendre appui.',
 ARRAY['Se tenir sur une jambe, genou légèrement fléchi.','Toucher du bout du pied libre le sol devant, sur le côté et derrière, en traçant une étoile.','Revenir au centre entre chaque direction, 3 tours par jambe.'],
 ARRAY['Poids sur la jambe d’appui','Toucher léger sans transfert de poids'],
 ARRAY['Prendre appui sur le pied qui touche','Genou d’appui qui s’effondre vers l’intérieur'],
 ARRAY['ankle','knee','hip'],'active_mobility','intermediate',true,ARRAY['bodyweight'],ARRAY['glutes'],ARRAY['calves','quadriceps']),

('Heel-elevated deep squat hold','Squat profond maintenu, talons surélevés',
 'Squat profond avec talons sur un disque pour faciliter la position et ouvrir progressivement la cheville.',
 ARRAY['Placer les talons sur de petits disques ou une planche.','Descendre en squat profond, genoux dans l’axe des pieds.','Tenir 30 à 60 s en baissant progressivement la hauteur des cales.'],
 ARRAY['Poitrine haute','Genoux dans l’axe des orteils'],
 ARRAY['Genoux qui rentrent','Dos arrondi'],
 ARRAY['ankle','hip'],'active_mobility','beginner',false,ARRAY['plate'],ARRAY['quadriceps','glutes'],ARRAY['calves','adductors']),

('Heel walk','Marche sur les talons',
 'Marcher sur les talons, avant-pieds relevés, pour activer les releveurs du pied.',
 ARRAY['Se tenir droit, relever les avant-pieds.','Marcher sur 10 à 15 m en gardant les orteils levés.','Revenir et répéter.'],
 ARRAY['Orteils bien relevés','Buste droit'],
 ARRAY['Orteils qui retombent','Pas trop longs'],
 ARRAY['ankle','foot'],'activation','beginner',false,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY['calves']),

('Calf foam rolling','Rouleau sur les mollets',
 'Auto-massage des mollets avec un rouleau, en cherchant les zones tendues.',
 ARRAY['S’asseoir, rouleau sous les mollets, mains au sol.','Rouler du dessous du genou jusqu’au-dessus de la cheville.','Marquer une pause de 20 à 30 s sur les zones sensibles, 1 à 2 min par jambe.'],
 ARRAY['Pression supportable','Respiration calme'],
 ARRAY['Rouler trop vite','Appuyer jusqu’à la douleur vive'],
 ARRAY['ankle'],'self_massage','beginner',true,ARRAY['foam_roller'],ARRAY['calves'],ARRAY[]::text[]),

('Tibialis anterior foam rolling','Rouleau sur le tibial antérieur',
 'À quatre pattes, le rouleau sous la face externe du tibia pour détendre le releveur du pied.',
 ARRAY['À quatre pattes, rouleau sous la face externe du tibia, juste à côté de l’os.','Rouler doucement de sous le genou à la cheville.','Faire 1 min par jambe.'],
 ARRAY['Rouleau sur le muscle, pas sur l’os','Pression modérée'],
 ARRAY['Rouler directement sur l’os du tibia','Appui trop fort'],
 ARRAY['ankle'],'self_massage','intermediate',true,ARRAY['foam_roller'],ARRAY[]::text[],ARRAY['calves']),

('Peroneal ball massage','Auto-massage des péroniers à la balle',
 'Une balle de massage sous la face externe de la jambe détend les muscles péroniers.',
 ARRAY['Allongé sur le côté, balle sous la face externe de la jambe, entre genou et cheville.','Faire de petits mouvements de va-et-vient en appuyant sur la balle.','Faire 1 min par jambe.'],
 ARRAY['Pression progressive','Respiration calme'],
 ARRAY['Appuyer sur le péroné près du genou','Pression trop forte'],
 ARRAY['ankle'],'self_massage','beginner',true,ARRAY['massage_ball'],ARRAY[]::text[],ARRAY['calves']),

('Short foot exercise','Pied court',
 'Rapprocher l’avant-pied du talon sans plier les orteils, pour activer la voûte plantaire.',
 ARRAY['Debout ou assis, pied à plat.','Rapprocher la base des orteils du talon pour faire monter la voûte, orteils longs et relâchés.','Tenir 5 s, 10 répétitions par pied.'],
 ARRAY['Orteils à plat','Voûte qui monte'],
 ARRAY['Orteils qui se crispent','Talon ou gros orteil qui décolle'],
 ARRAY['foot'],'activation','beginner',true,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY[]::text[]),

('Kneeling toe stretch','Étirement des orteils à genoux',
 'À genoux, orteils repliés sous les pieds, assis sur les talons, pour étirer la plante des pieds.',
 ARRAY['À genoux, orteils repliés sous les pieds.','S’asseoir doucement sur les talons.','Tenir 20 à 30 s, mains au sol pour doser la charge.'],
 ARRAY['Charge dosée avec les mains','Respiration calme'],
 ARRAY['S’asseoir brutalement','Forcer malgré une douleur vive'],
 ARRAY['foot'],'static_stretch','beginner',false,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY[]::text[]),

('Big toe lift','Élévation du gros orteil seul',
 'Lever uniquement le gros orteil en gardant les autres orteils posés.',
 ARRAY['Pied à plat, assis.','Lever le gros orteil seul, orteils restants au sol.','Tenir 3 s, puis inverser : lever les 4 autres orteils, gros orteil au sol. 10 répétitions.'],
 ARRAY['Pied immobile','Gros orteil seul'],
 ARRAY['Lever tous les orteils ensemble','Talon qui décolle'],
 ARRAY['foot'],'activation','beginner',true,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY[]::text[]),

('Toe spreading','Écartement des orteils',
 'Écarter les orteils au maximum pour travailler les petits muscles du pied.',
 ARRAY['Pied à plat, assis ou debout.','Écarter les orteils et tenir 5 s.','Relâcher, 10 répétitions par pied.'],
 ARRAY['Orteils longs et détendus','Pied à plat'],
 ARRAY['Crisper les orteils vers le bas','Contenir le souffle'],
 ARRAY['foot'],'activation','beginner',true,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY[]::text[]),

('Towel scrunch','Griffe de serviette',
 'Ramener une serviette posée au sol vers soi en la plissant avec les orteils.',
 ARRAY['Assis, pied sur une serviette posée à plat au sol.','Plisser la serviette vers soi avec les orteils.','Répéter jusqu’à ramener toute la serviette, 2 à 3 passages par pied.'],
 ARRAY['Talon au sol','Mouvement lent'],
 ARRAY['Pousser avec le talon','Aller trop vite'],
 ARRAY['foot'],'activation','beginner',true,ARRAY['chair'],ARRAY[]::text[],ARRAY[]::text[]),

('Plantar fascia ball roll','Auto-massage plantaire à la balle',
 'Rouler une balle de massage sous la plante du pied pour détendre la face plantaire.',
 ARRAY['Debout ou assis, balle sous la plante.','Rouler lentement du talon à la base des orteils.','Faire 1 à 2 min par pied.'],
 ARRAY['Pression modérée','Rouler lentement'],
 ARRAY['Appuyer trop fort','Rouler sous les orteils'],
 ARRAY['foot'],'self_massage','beginner',true,ARRAY['massage_ball'],ARRAY[]::text[],ARRAY[]::text[]),

('Plantar fascia stretch with toes extended','Étirement de la voûte plantaire, orteils tirés',
 'Assis, la jambe croisée, les orteils sont tirés vers le tibia pour étirer la face plantaire.',
 ARRAY['Assis, cheville posée sur le genou opposé.','Tirer les orteils vers le tibia avec la main.','Tenir 20 à 30 s, puis changer de pied.'],
 ARRAY['Étirement ressenti sous la voûte','Traction douce'],
 ARRAY['Tirer fort jusqu’à la douleur','Cheville en rotation'],
 ARRAY['foot'],'static_stretch','beginner',true,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY[]::text[]),

('Outside edge foot walk','Marche sur les bords externes du pied',
 'Marcher sur le bord externe des pieds pour mobiliser et renforcer le côté externe du pied et de la cheville.',
 ARRAY['Debout, pieds tournés pour poser le poids sur le bord externe.','Marcher 10 à 15 m lentement.','Revenir et répéter.'],
 ARRAY['Orteils légèrement repliés','Pas lents'],
 ARRAY['Pas trop rapides','Cheville qui s’affaisse vers l’intérieur'],
 ARRAY['ankle','foot'],'active_mobility','beginner',false,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY['calves']),

('Metatarsal mobilization','Mobilisation des métatarses',
 'Mobiliser l’avant-pied avec les mains pour redonner de la souplesse entre les os du métatarse.',
 ARRAY['Assis, pied sur la cuisse opposée.','Saisir l’avant-pied et faire glisser doucement les métatarses les uns par rapport aux autres.','Faire 1 min par pied.'],
 ARRAY['Mouvements doux','Pied détendu'],
 ARRAY['Forcer l’amplitude','Mains qui serrent trop fort'],
 ARRAY['foot'],'active_mobility','beginner',true,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY[]::text[]),

('Barefoot heel-to-toe rock','Bascule talon-pointe pieds nus',
 'Debout pieds nus, balancer le poids du talon vers les orteils pour réveiller le contrôle du pied et de la cheville.',
 ARRAY['Debout pieds nus, pieds parallèles.','Basculer le poids vers l’avant, orteils au sol, puis vers l’arrière en relevant les orteils.','Faire 10 à 15 répétitions lentes.'],
 ARRAY['Corps en bloc','Mouvement venant des chevilles'],
 ARRAY['Plier la taille','Aller trop vite'],
 ARRAY['ankle','foot'],'active_mobility','beginner',false,ARRAY['bodyweight'],ARRAY[]::text[],ARRAY['calves'])
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

-- Exercice d’origine : compléter la fiche sans écraser une valeur déjà saisie.
update public.exercises
set name_fr = 'Genou au mur (dorsiflexion de cheville)',
    description = 'Le genou avance vers un mur, pied à plat, pour mesurer et améliorer la flexion dorsale de cheville.',
    steps = ARRAY['Placer le pied à 10 cm du mur, talon au sol.','Pousser le genou vers le mur sans décoller le talon.','Éloigner progressivement le pied du mur.'],
    cues = ARRAY['Talon au sol','Genou dans l’axe du 2e orteil'],
    common_mistakes = ARRAY['Talon qui se soulève','Genou qui rentre vers l’intérieur'],
    body_zones = ARRAY['ankle'],
    technique = 'active_mobility'
where organization_id is null
  and name = 'Ankle dorsiflexion wall drill'
  and name_fr is null;
