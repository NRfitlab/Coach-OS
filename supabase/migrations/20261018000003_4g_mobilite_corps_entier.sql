-- 4g-8 : mobilité du corps entier, enchaînements globaux (15 fiches), rédaction originale, à relire.
-- Rejouable : un nom déjà présent parmi les exercices communs est ignoré.

with v(name, name_fr, description, steps, cues, common_mistakes, body_zones, technique, level, unilateral, equipment, primary_muscles, secondary_muscles) as (
values
('Inchworm walkout','Marche de la chenille',
 'Depuis la position debout, les mains marchent vers l’avant jusqu’à la planche, puis les pieds viennent vers les mains, pour étirer l’arrière du corps.',
 ARRAY['Debout, pencher le buste pour poser les mains au sol, genoux légèrement fléchis si besoin.','Marcher avec les mains jusqu’à la position de planche, corps aligné.','Faire revenir les pieds vers les mains par petits pas, puis se redresser. 6 à 8 répétitions.'],
 ARRAY['Corps aligné en planche','Mouvement lent'],
 ARRAY['Cambrer le bas du dos en planche','Plier les genoux au maximum'],
 ARRAY['full_body','shoulder'],'dynamic_stretch','beginner',false,ARRAY['bodyweight'],ARRAY['hamstrings','front_delts'],ARRAY['calves','abs']),

('Down dog to cobra flow','Chien tête en bas vers cobra',
 'Enchaînement fluide entre le chien tête en bas et la posture du cobra pour mobiliser colonne, épaules et hanches.',
 ARRAY['Partir en chien tête en bas, hanches hautes, talons vers le sol.','Avancer le buste en glissant vers le bas pour passer en posture du cobra, poitrine ouverte, bassin proche du sol.','Revenir en chien tête en bas. 6 à 8 enchaînements lents. Arrêter en cas de douleur lombaire ou de pincement à l’épaule.'],
 ARRAY['Mouvement fluide','Épaules loin des oreilles'],
 ARRAY['Forcer la cambrure lombaire','Hausser les épaules'],
 ARRAY['full_body','pelvis_lumbar','shoulder'],'dynamic_stretch','beginner',false,ARRAY['bodyweight'],ARRAY['full_body'],ARRAY['lower_back','hamstrings']),

('Sun salutation','Salutation au soleil',
 'Enchaînement de postures qui mobilise la colonne, les épaules, les hanches et les ischio-jambiers dans une séquence continue.',
 ARRAY['Debout, bras levés, puis pencher le buste vers l’avant pour toucher les pieds ou les tibias.','Poser les mains, reculer en planche, descendre, puis passer en cobra ou chien tête en bas.','Revenir en avançant les pieds entre les mains, se redresser bras levés. 4 à 6 cycles lents, en suivant la respiration.'],
 ARRAY['Respiration synchronisée','Mouvements fluides'],
 ARRAY['Enchaîner trop vite','Forcer l’amplitude'],
 ARRAY['full_body'],'dynamic_stretch','beginner',false,ARRAY['bodyweight'],ARRAY['full_body'],ARRAY['hamstrings','glutes']),

('Scorpion stretch','Scorpion',
 'Allongé sur le ventre, une jambe passe de l’autre côté du corps pour mobiliser la rotation du tronc et la hanche.',
 ARRAY['Allongé sur le ventre, bras en croix, front au sol.','Lever une jambe et la faire passer de l’autre côté du corps, le pied vers la main opposée.','Revenir, 6 à 8 répétitions par côté, épaules au sol.'],
 ARRAY['Épaules au sol','Mouvement lent'],
 ARRAY['Décoller les épaules','Forcer la rotation'],
 ARRAY['full_body','hip','thoracic'],'dynamic_stretch','intermediate',true,ARRAY['bodyweight'],ARRAY['hip_flexors','obliques'],ARRAY['glutes','lower_back']),

('Crab reach','Crabe avec bras levé',
 'En position de crabe, hanches hautes, un bras passe au-dessus de la tête pour ouvrir l’épaule, la poitrine et la hanche.',
 ARRAY['S’asseoir, mains derrière soi, doigts vers les pieds, hanches levées en position de table.','Lever un bras au-dessus de la tête en tournant le buste vers le plafond.','Revenir, alterner, 6 à 8 répétitions par côté.'],
 ARRAY['Hanches hautes','Épaule ouverte'],
 ARRAY['Laisser les hanches tomber','Hausser les épaules'],
 ARRAY['full_body','shoulder','thoracic'],'active_mobility','intermediate',true,ARRAY['bodyweight'],ARRAY['glutes','upper_back'],ARRAY['front_delts']),

('Cat-cow to child’s pose flow','Chat-vache vers posture de l’enfant',
 'À quatre pattes, enchaîner chat-vache puis reculer les fessiers vers les talons pour mobiliser colonne et hanches.',
 ARRAY['À quatre pattes, faire 5 chat-vache lents.','Reculer ensuite les fessiers vers les talons pour passer en posture de l’enfant, bras tendus devant.','Revenir à quatre pattes, 4 à 6 enchaînements.'],
 ARRAY['Respiration synchronisée','Mouvement lent'],
 ARRAY['Forcer l’amplitude','Aller trop vite'],
 ARRAY['full_body','pelvis_lumbar','thoracic'],'active_mobility','beginner',false,ARRAY['bodyweight'],ARRAY['lower_back','upper_back'],ARRAY['glutes']),

('Lunge with overhead reach','Fente avec bras en l’air',
 'En fente avant, les bras montent au-dessus de la tête et le buste s’incline légèrement pour ouvrir hanche, flanc et épaule.',
 ARRAY['Faire un pas en avant en fente, talon avant au sol.','Lever les deux bras au-dessus de la tête et pencher le buste doucement vers le côté de la jambe avant.','Revenir, alterner, 6 à 8 répétitions par côté.'],
 ARRAY['Bassin stable','Talon avant au sol'],
 ARRAY['Cambrer le bas du dos','Genou qui rentre'],
 ARRAY['full_body','hip','thoracic'],'dynamic_stretch','beginner',true,ARRAY['bodyweight'],ARRAY['hip_flexors','quadriceps'],ARRAY['obliques','lats']),

('Squat to stand','Squat vers debout',
 'Depuis la position debout, les mains saisissent les orteils, les hanches descendent en squat, puis les jambes se tendent en gardant les mains aux pieds.',
 ARRAY['Debout, se pencher pour saisir les orteils.','Descendre les hanches en squat, buste vers l’avant, mains aux pieds.','Tendre les jambes en gardant les mains aux pieds, puis revenir. 8 répétitions.'],
 ARRAY['Mains aux pieds','Mouvement lent'],
 ARRAY['Arrondir exagérément le dos','Lâcher les orteils'],
 ARRAY['full_body','hip','ankle'],'dynamic_stretch','beginner',false,ARRAY['bodyweight'],ARRAY['hamstrings','glutes'],ARRAY['calves','quadriceps']),

('Deep squat thoracic rotation','Squat profond avec rotation thoracique',
 'En squat profond, une main au sol, l’autre bras s’ouvre vers le plafond en suivant la main du regard.',
 ARRAY['Descendre en squat profond, une main posée au sol, l’autre main derrière la tête.','Ouvrir le coude vers le plafond en tournant le haut du buste.','Revenir, 6 à 8 répétitions par côté, genoux dans l’axe des pieds.'],
 ARRAY['Genoux dans l’axe des orteils','Regard qui suit le coude'],
 ARRAY['Laisser les genoux rentrer','Décoller les talons'],
 ARRAY['full_body','hip','thoracic'],'active_mobility','intermediate',true,ARRAY['bodyweight'],ARRAY['obliques','glutes'],ARRAY['quadriceps','adductors']),

('Walking knee hug','Marche avec genou à la poitrine',
 'À chaque pas, un genou est tiré vers la poitrine avec les mains pour mobiliser hanche et genou.',
 ARRAY['Debout, tirer un genou vers la poitrine avec les mains.','Reposer le pied, avancer d’un pas, puis tirer l’autre genou.','Faire 10 à 15 m, en alternant.'],
 ARRAY['Buste droit','Appui stable sur la jambe d’appui'],
 ARRAY['Pencher le buste','Verrouiller le genou d’appui'],
 ARRAY['full_body','hip'],'dynamic_stretch','beginner',false,ARRAY['bodyweight'],ARRAY['glutes'],ARRAY['hamstrings']),

('Walking quad stretch','Marche avec étirement du quadriceps',
 'À chaque pas, un pied est tiré vers le fessier avec la main pour étirer l’avant de la cuisse.',
 ARRAY['Debout, attraper un pied derrière soi avec la main du même côté.','Tirer doucement le talon vers le fessier, genoux proches, bassin rentré.','Reposer le pied, avancer, puis alterner. 10 à 15 m.'],
 ARRAY['Genoux proches','Bassin légèrement rentré'],
 ARRAY['Cambrer le bas du dos','Tirer fort sur la cheville'],
 ARRAY['full_body','knee','hip'],'dynamic_stretch','beginner',false,ARRAY['bodyweight'],ARRAY['quadriceps'],ARRAY['hip_flexors']),

('90/90 to deep squat transition','Transition 90/90 vers squat profond',
 'Assis en 90/90, le bassin se soulève pour passer en squat profond, puis revient de l’autre côté.',
 ARRAY['S’asseoir en position 90/90, genoux fléchis de côté.','Se soulever et passer en squat profond en ramenant les pieds sous le bassin.','Redescendre de l’autre côté en 90/90. 5 à 6 transitions par côté, avec appui des mains si besoin.'],
 ARRAY['Mouvement fluide','Contrôle de la descente'],
 ARRAY['Se laisser tomber','Forcer l’amplitude de hanche'],
 ARRAY['full_body','hip','ankle'],'active_mobility','advanced',false,ARRAY['bodyweight'],ARRAY['glutes','hip_rotators'],ARRAY['quadriceps','adductors']),

('Lateral lunge reach','Fente latérale avec bras tendu',
 'En fente latérale, le buste s’incline vers la jambe fléchie et les bras tendus vers le pied pour étirer l’intérieur de la cuisse et mobiliser le dos.',
 ARRAY['Debout, pieds largement écartés.','Fléchir un genou en fente latérale, buste incliné, bras tendus vers le pied.','Revenir, alterner, 6 à 8 répétitions par côté.'],
 ARRAY['Talon plat sur la jambe fléchie','Jambe tendue gardée à plat'],
 ARRAY['Talon qui décolle','Arrondir le dos'],
 ARRAY['full_body','hip','ankle'],'dynamic_stretch','intermediate',true,ARRAY['bodyweight'],ARRAY['adductors','glutes'],ARRAY['quadriceps']),

('Rolling like a ball','Rouler comme une balle',
 'Assis en boule, genoux serrés contre la poitrine, le corps roule en arrière puis revient pour masser doucement la colonne.',
 ARRAY['S’asseoir, genoux contre la poitrine, mains autour des tibias, menton rentré.','Rouler doucement en arrière jusqu’aux omoplates, sans toucher la nuque.','Revenir assis en gardant la forme de boule. 6 à 8 répétitions.'],
 ARRAY['Menton rentré','Roulement sans toucher la nuque'],
 ARRAY['Rouler sur la nuque','Se projeter trop fort'],
 ARRAY['full_body','pelvis_lumbar','thoracic'],'active_mobility','beginner',false,ARRAY['bodyweight'],ARRAY['abs'],ARRAY['lower_back']),

('Full-body foam rolling sequence','Séquence de rouleau pour le corps entier',
 'Enchaînement d’auto-massage au rouleau sur mollets, ischio-jambiers, fessiers, haut du dos et grands dorsaux.',
 ARRAY['Rouler 45 s chaque mollet, puis 45 s chaque ischio-jambier.','Rouler 45 s chaque fessier en position de figure 4, puis 45 s le haut du dos.','Rouler 45 s chaque grand dorsal, côté sur le rouleau, en restant sur une pression modérée.'],
 ARRAY['Pression modérée','Respiration calme'],
 ARRAY['Rouler sur les articulations','Appuyer jusqu’à la douleur vive'],
 ARRAY['full_body'],'self_massage','beginner',false,ARRAY['foam_roller'],ARRAY['full_body'],ARRAY[]::text[])
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