-- 4g-3b : mobilité du genou, seconde moitié (15 fiches), rédaction originale, à relire.
-- Rejouable : un nom déjà présent parmi les exercices communs est ignoré.

with v(name, name_fr, description, steps, cues, common_mistakes, body_zones, technique, level, unilateral, equipment, primary_muscles, secondary_muscles) as (
values
('Patellar mobilization','Mobilisation de la rotule',
 'Assis jambe tendue et relâchée, les mains font glisser la rotule dans toutes les directions.',
 ARRAY['Assis, jambe tendue, quadriceps relâché.','Saisir la rotule entre le pouce et l’index.','La faire glisser doucement vers le haut, le bas et les côtés, 1 min par genou.'],
 ARRAY['Quadriceps bien relâché','Pression douce'],
 ARRAY['Contracter le quadriceps','Appuyer fort sur la rotule'],
 ARRAY['knee'],'self_massage','beginner',true,ARRAY['bodyweight'],ARRAY['quadriceps'],ARRAY[]::text[]),

('Walking hamstring sweep','Balayage des ischio-jambiers en marchant',
 'À chaque pas, le talon se pose devant, jambe tendue, et les mains balaient vers le pied pendant que les hanches reculent.',
 ARRAY['Faire un pas en avant, talon au sol, jambe avant tendue.','Reculer les hanches et glisser les mains le long de la jambe vers le pied, dos long.','Se redresser en avançant, alterner sur 10 à 15 m.'],
 ARRAY['Dos long','Hanches qui reculent'],
 ARRAY['Arrondir le dos','Verrouiller le genou en arrière'],
 ARRAY['hip','knee'],'dynamic_stretch','beginner',false,ARRAY['bodyweight'],ARRAY['hamstrings'],ARRAY['calves']),

('Seiza sit','Assis sur les talons (seiza)',
 'Assis sur les talons, fessiers sur les pieds, pour amener le genou en flexion profonde de façon progressive.',
 ARRAY['S’agenouiller, pieds à plat ou orteils repliés selon le confort.','S’asseoir doucement sur les talons, mains sur les cuisses.','Tenir 30 à 60 s, avec un coussin sous les fessiers ou un rouleau sous les mollets si besoin.'],
 ARRAY['Descente progressive','Respiration calme'],
 ARRAY['S’asseoir brusquement','Forcer malgré une douleur vive au genou'],
 ARRAY['knee','ankle'],'static_stretch','intermediate',false,ARRAY['bodyweight'],ARRAY['quadriceps'],ARRAY['calves']),

('Seated tibial rotation','Rotation tibiale assise',
 'Assis, le pied pivote vers l’intérieur puis l’extérieur pendant que le fémur reste immobile, pour mobiliser la rotation du genou.',
 ARRAY['Assis sur une chaise, genou à 90°, cuisse immobile.','Pivoter le pied vers l’intérieur puis vers l’extérieur, sans bouger la cuisse.','Faire 10 à 15 répétitions lentes par jambe.'],
 ARRAY['Cuisse immobile','Petite amplitude, mouvement lent'],
 ARRAY['Bouger tout le bassin','Forcer l’amplitude'],
 ARRAY['knee'],'active_mobility','beginner',true,ARRAY['chair'],ARRAY[]::text[],ARRAY['hamstrings']),

('Single-leg sit-to-stand','Assis-debout unipodal',
 'Se lever d’une chaise sur une seule jambe, en contrôlant la descente.',
 ARRAY['Assis au bord d’une chaise, un pied à plat, l’autre jambe tendue devant.','Se lever en poussant sur le pied d’appui, genou dans l’axe du pied.','Se rasseoir en 3 s, 5 à 8 répétitions par jambe, avec appui des mains si besoin.'],
 ARRAY['Genou dans l’axe du pied','Descente lente'],
 ARRAY['Genou qui rentre','Se laisser tomber sur la chaise'],
 ARRAY['knee','hip'],'activation','intermediate',true,ARRAY['chair'],ARRAY['quadriceps','glutes'],ARRAY['hamstrings']),

('Supine strap-assisted knee flexion','Flexion du genou allongé assistée à la sangle',
 'Allongé sur le dos, une sangle autour du tibia aide à fléchir le genou au-delà de l’amplitude active.',
 ARRAY['Allongé sur le dos, sangle autour du bas de la jambe.','Fléchir le genou en tirant doucement sur la sangle.','Tenir 20 à 30 s, 3 répétitions par jambe, sans douleur vive.'],
 ARRAY['Traction progressive','Bassin à plat'],
 ARRAY['Tirer brusquement','Forcer au-delà d’une gêne marquée'],
 ARRAY['knee'],'static_stretch','beginner',true,ARRAY['strap'],ARRAY['quadriceps'],ARRAY[]::text[]),

('Hamstring contract-relax stretch','Ischio-jambiers en contracté-relâché',
 'Allongé, la jambe tendue tenue par une sangle : contraction douce contre la sangle, puis relâchement pour gagner en amplitude.',
 ARRAY['Allongé sur le dos, jambe levée tendue, sangle autour du pied.','Pousser la jambe contre la sangle à 30 à 50 % de l’effort pendant 5 s.','Relâcher, tirer la jambe un peu plus loin 20 s, 3 cycles par jambe.'],
 ARRAY['Contraction douce','Bassin à plat'],
 ARRAY['Contracter à fond','Plier le genou pour compenser'],
 ARRAY['hip','knee'],'pnf','intermediate',true,ARRAY['strap'],ARRAY['hamstrings'],ARRAY['glutes']),

('Quadriceps contract-relax stretch','Quadriceps en contracté-relâché',
 'Sur le ventre ou en décubitus latéral, contraction douce du quadriceps contre la main, puis relâchement pour gagner en amplitude.',
 ARRAY['Allongé sur le ventre, attraper la cheville ou la sangle et ramener le talon vers le fessier.','Pousser légèrement le pied contre la main 5 s.','Relâcher et ramener le talon un peu plus loin 20 s, 3 cycles par jambe.'],
 ARRAY['Contraction douce','Bassin collé au sol'],
 ARRAY['Creuser le bas du dos','Contracter à fond'],
 ARRAY['knee','hip'],'pnf','intermediate',true,ARRAY['strap'],ARRAY['quadriceps'],ARRAY['hip_flexors']),

('Slow step-down','Descente de marche lente',
 'Descendre lentement d’une marche sur une jambe, pour travailler le contrôle du genou en phase de freinage.',
 ARRAY['Debout sur une marche ou un box, un pied dans le vide.','Fléchir le genou d’appui pour descendre le talon libre vers le sol en 3 s.','Remonter, 6 à 10 répétitions par jambe.'],
 ARRAY['Genou dans l’axe du pied','Bassin de niveau'],
 ARRAY['Genou qui rentre','Se laisser tomber'],
 ARRAY['knee','hip'],'activation','intermediate',true,ARRAY['box'],ARRAY['quadriceps','glutes'],ARRAY['calves']),

('Single-leg mini squat','Mini-squat unipodal',
 'Petite flexion de genou sur une jambe, avec le genou aligné sur le pied.',
 ARRAY['Debout sur une jambe, mains devant ou sur la hanche.','Fléchir le genou sur un quart d’amplitude, genou dans l’axe du pied.','Remonter, 8 à 10 répétitions par jambe, avec appui d’une main si besoin.'],
 ARRAY['Genou dans l’axe du pied','Bassin de niveau'],
 ARRAY['Genou qui rentre','Tronc qui s’affaisse sur le côté'],
 ARRAY['knee','ankle'],'activation','intermediate',true,ARRAY['bodyweight'],ARRAY['quadriceps','glutes'],ARRAY['calves']),

('Banded squat with knee push-out','Squat avec bande aux genoux (ouverture)',
 'Squat avec une bande autour des genoux : les genoux poussent vers l’extérieur contre la bande.',
 ARRAY['Placer une bande autour des genoux, pieds à largeur d’épaules.','Descendre en squat en poussant les genoux vers l’extérieur contre la bande.','Remonter, 8 à 12 répétitions.'],
 ARRAY['Genoux dans l’axe des orteils','Poids réparti sur tout le pied'],
 ARRAY['Genoux qui rentrent','Talons qui décollent'],
 ARRAY['knee','hip'],'activation','beginner',false,ARRAY['band'],ARRAY['glutes','quadriceps'],ARRAY['abductors']),

('Prone active knee flexion','Flexion active du genou sur le ventre',
 'Allongé sur le ventre, le talon monte vers le fessier avec une contraction active des ischio-jambiers.',
 ARRAY['Allongé sur le ventre, jambes tendues.','Fléchir un genou en ramenant le talon vers le fessier, bassin à plat.','Revenir lentement, 10 à 12 répétitions par jambe.'],
 ARRAY['Bassin collé au sol','Mouvement lent'],
 ARRAY['Creuser le bas du dos','Balancer la jambe'],
 ARRAY['knee'],'active_mobility','beginner',true,ARRAY['bodyweight'],ARRAY['hamstrings'],ARRAY[]::text[]),

('Standing knee hug to leg extension','Genou à la poitrine puis extension, debout',
 'Debout, monter un genou vers la poitrine puis tendre la jambe devant soi, pour mobiliser hanche et genou ensemble.',
 ARRAY['Debout, monter un genou vers la poitrine avec les mains.','Tendre la jambe devant soi en gardant le dos droit.','Reposer le pied, 6 à 8 répétitions par jambe.'],
 ARRAY['Grand axe du tronc','Appui stable sur la jambe d’appui'],
 ARRAY['Reculer le buste','Verrouiller le genou d’appui'],
 ARRAY['hip','knee'],'dynamic_stretch','beginner',true,ARRAY['bodyweight'],ARRAY['hamstrings','glutes'],ARRAY['hip_flexors']),

('Quadruped rock back','Bascule arrière à quatre pattes',
 'À quatre pattes, les fessiers reculent vers les talons pour amener le genou en flexion de façon progressive.',
 ARRAY['À quatre pattes, mains sous les épaules, genoux sous les hanches.','Reculer les fessiers vers les talons sans arrondir le dos.','Revenir, 8 à 10 répétitions, en restant dans une amplitude confortable.'],
 ARRAY['Dos long','Mouvement lent'],
 ARRAY['Arrondir le dos','Forcer malgré une gêne au genou'],
 ARRAY['knee','hip'],'active_mobility','beginner',false,ARRAY['bodyweight'],ARRAY['glutes','quadriceps'],ARRAY['adductors']),

('Seated sciatic nerve slider','Glissement du nerf sciatique assis',
 'Assis, le genou se tend pendant que la tête se redresse, puis l’inverse, pour mobiliser les tissus de l’arrière de la jambe sans étirement fort.',
 ARRAY['Assis sur une chaise, dos droit, mains sur les cuisses.','Tendre un genou en relevant la tête, puis fléchir le genou en baissant la tête.','Faire 8 à 10 répétitions lentes par jambe, sans provoquer de douleur ni de picotements.'],
 ARRAY['Mouvement fluide','Sensation modérée seulement'],
 ARRAY['Forcer jusqu’aux picotements','Aller trop vite'],
 ARRAY['hip','knee'],'active_mobility','intermediate',true,ARRAY['chair'],ARRAY['hamstrings'],ARRAY['calves'])
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