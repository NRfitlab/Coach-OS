-- 4g-11a : rétro-remplissage des exercices de gainage d’origine (15 fiches), rédaction originale, à relire.
-- Rejouable : seuls les exercices communs sans nom français sont mis à jour.

with v(name, name_fr, description, steps, cues, common_mistakes) as (
values
('Plank','Gainage ventral (planche)',
 'Maintien du corps aligné en appui sur les avant-bras et les pointes de pieds, exercice de base pour le gainage du tronc.',
 ARRAY['S’appuyer sur les avant-bras, coudes sous les épaules, jambes tendues, appui sur les pointes de pieds.','Contracter abdominaux et fessiers pour garder le corps aligné de la tête aux talons.','Tenir la position en respirant normalement.'],
 ARRAY['Corps aligné','Fessiers et abdominaux contractés'],
 ARRAY['Bassin qui s’affaisse ou qui monte','Bloquer la respiration']),

('Side plank','Gainage latéral',
 'Maintien du corps aligné de côté, en appui sur un avant-bras, qui sollicite les obliques et les muscles stabilisateurs du bassin.',
 ARRAY['Allongé sur le côté, coude sous l’épaule, jambes tendues et empilées.','Soulever le bassin pour aligner la tête, les hanches et les pieds.','Tenir la position, puis changer de côté.'],
 ARRAY['Corps aligné','Bassin haut'],
 ARRAY['Bassin qui s’affaisse','Épaule qui monte vers l’oreille']),

('Copenhagen plank','Gainage Copenhague',
 'Gainage latéral avec la jambe du dessus posée sur un banc, qui sollicite fortement les adducteurs.',
 ARRAY['Allongé sur le côté, avant-bras au sol, jambe du dessus posée sur un banc (cheville ou genou selon le niveau).','Soulever le bassin pour aligner le corps, la jambe du dessous suspendue.','Tenir la position, puis changer de côté.'],
 ARRAY['Corps aligné','Adducteurs contractés'],
 ARRAY['Bassin qui s’affaisse','Commencer par la version cheville sans progression']),

('Hollow hold','Maintien en creux (hollow hold)',
 'Maintien allongé sur le dos, bras et jambes décollés du sol, bas du dos plaqué au sol, qui sollicite fortement la sangle abdominale.',
 ARRAY['Allongé sur le dos, bas du dos plaqué au sol, bras tendus au-dessus de la tête.','Décoller épaules et jambes tendues du sol en gardant le bas du dos plaqué.','Tenir la position en respirant normalement.'],
 ARRAY['Bas du dos plaqué au sol','Côtes basses rentrées'],
 ARRAY['Bas du dos qui se creuse','Position trop basse pour le niveau']),

('Dead bug','Dead bug (insecte mort)',
 'Allongé sur le dos, les bras et les jambes bougent alternativement pendant que le tronc reste stable.',
 ARRAY['Allongé sur le dos, bras tendus vers le plafond, hanches et genoux fléchis à 90°.','Tendre lentement un bras au-dessus de la tête et la jambe opposée, bas du dos plaqué au sol.','Revenir et alterner.'],
 ARRAY['Bas du dos plaqué au sol','Mouvement lent'],
 ARRAY['Bas du dos qui se creuse','Mouvement trop rapide']),

('Bird dog','Bird dog',
 'À quatre pattes, un bras et la jambe opposée se tendent en gardant le tronc stable, pour travailler la stabilité du tronc et des hanches.',
 ARRAY['À quatre pattes, mains sous les épaules, genoux sous les hanches.','Tendre un bras vers l’avant et la jambe opposée vers l’arrière, corps aligné.','Revenir lentement et alterner.'],
 ARRAY['Bassin stable','Dos plat'],
 ARRAY['Cambrer le bas du dos','Bassin qui tourne']),

('Pallof press','Pallof press',
 'Poussée à la poulie, de côté, qui résiste à la rotation du tronc et travaille l’anti-rotation.',
 ARRAY['Se placer de côté par rapport à la poulie à hauteur de poitrine, poignée tenue contre la poitrine.','Pousser la poignée droit devant soi en résistant à la rotation du tronc.','Tenir 2 s bras tendus, puis revenir.'],
 ARRAY['Tronc stable','Bassin face à l’avant'],
 ARRAY['Laisser le tronc tourner','Haussement des épaules']),

('Ab wheel rollout','Roulette abdominale (ab wheel)',
 'Extension du corps vers l’avant en roulant une roue, qui sollicite fortement les abdominaux et le gainage.',
 ARRAY['À genoux, mains sur la roue, bras tendus.','Rouler la roue vers l’avant en gardant le dos plat, abdominaux contractés.','Revenir en tirant la roue vers les genoux, sans cambrer.'],
 ARRAY['Dos plat','Abdominaux contractés'],
 ARRAY['Cambrer le bas du dos','Rouler trop loin pour son niveau']),

('Cable crunch','Crunch à la poulie',
 'Flexion du tronc à genoux face à une poulie haute, qui sollicite les abdominaux avec une résistance progressive.',
 ARRAY['À genoux face à la poulie haute, corde tenue de chaque côté du visage.','Fléchir le tronc pour amener les coudes vers les cuisses en arrondissant le dos.','Revenir lentement jusqu’à la position de départ.'],
 ARRAY['Mouvement venant du tronc','Hanches immobiles'],
 ARRAY['Tirer avec les bras','Reculer les hanches']),

('Russian twist','Rotation russe',
 'Assis en équilibre, buste incliné, rotation du tronc de gauche à droite, qui sollicite les obliques.',
 ARRAY['Assis, genoux fléchis, buste incliné en arrière, pieds posés ou levés, mains jointes ou tenant une charge.','Tourner le tronc d’un côté puis de l’autre, en gardant le dos droit.','Continuer le nombre de répétitions voulu.'],
 ARRAY['Dos droit','Rotation du tronc plutôt que des bras'],
 ARRAY['Arrondir le dos','Mouvement trop rapide']),

('V-up','V-up (relevé en V)',
 'Allongé sur le dos, le tronc et les jambes se relèvent simultanément pour former un V, qui sollicite fortement les abdominaux.',
 ARRAY['Allongé sur le dos, bras au-dessus de la tête, jambes tendues.','Relever simultanément le tronc et les jambes pour toucher les pieds avec les mains.','Redescendre lentement.'],
 ARRAY['Mouvement contrôlé','Jambes tendues'],
 ARRAY['Utiliser l’élan','Arrondir le dos de façon excessive']),

('Hanging knee raise','Relevé de genoux suspendu',
 'Suspendu à une barre, les genoux montent vers la poitrine, qui sollicite le bas des abdominaux et les fléchisseurs de hanche.',
 ARRAY['Se suspendre à une barre, bras tendus, épaules actives.','Monter les genoux vers la poitrine en basculant le bassin vers l’arrière.','Redescendre lentement sans se balancer.'],
 ARRAY['Bassin qui bascule','Mouvement contrôlé'],
 ARRAY['Se balancer','Monter les genoux sans basculer le bassin']),

('Hanging leg raise','Relevé de jambes suspendu',
 'Suspendu à une barre, les jambes tendues montent vers l’horizontale ou au-dessus, qui sollicite fortement les abdominaux.',
 ARRAY['Se suspendre à une barre, bras tendus, épaules actives.','Monter les jambes tendues jusqu’à l’horizontale ou plus haut en basculant le bassin.','Redescendre lentement sans se balancer.'],
 ARRAY['Bassin qui bascule','Mouvement contrôlé'],
 ARRAY['Se balancer','Amplitude insuffisante au-dessus de l’horizontale']),

('Toes to bar','Orteils à la barre',
 'Suspendu à une barre, les pieds montent jusqu’à toucher la barre, mouvement exigeant en gainage et en mobilité d’épaule.',
 ARRAY['Se suspendre à une barre, bras tendus, épaules actives.','Basculer le corps pour monter les jambes tendues jusqu’à toucher la barre avec les orteils.','Redescendre en contrôlant le balancement.'],
 ARRAY['Épaules actives','Balancement contrôlé'],
 ARRAY['Balancer sans contrôle','Fléchir les genoux pour compenser']),

('Bear crawl','Marche de l’ours',
 'Déplacement à quatre pattes, genoux décollés du sol, qui sollicite le tronc, les épaules et les hanches.',
 ARRAY['À quatre pattes, mains sous les épaules, genoux décollés de quelques centimètres du sol.','Avancer en déplaçant la main et le pied opposés, dos plat.','Garder les genoux près du sol pendant tout le déplacement.'],
 ARRAY['Dos plat','Genoux près du sol'],
 ARRAY['Hanches trop hautes','Mouvement saccadé'])
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