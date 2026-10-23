# Coach OS — SPEC (document de travail)

Référence longue : `docs/REFERENCE.md` (vision en 77 sections). Ce fichier fixe ce qui est
**décidé** pour la construction. En cas de conflit, SPEC.md gagne.

## Objectif
Un coach construit la semaine individualisée d'un athlète en quelques minutes, l'envoie,
puis compare le prescrit au réalisé. La boucle : planifier → prescrire → assigner →
athlète réalise → réponse → analyse → ajustement.

## Hors périmètre (jusqu'à l'étape 6)
IA, wearables, evidence layer, macrocycles/mésocycles, group training, Workout DNA,
audit/compare, moteurs HYROX/CrossFit dédiés, thème sombre analytics, invitations par e-mail
(ajoutées à l'étape 2).

## Utilisateurs et appareils
- Coach / admin / assistant : desktop et tablette d'abord.
- Athlète : mobile d'abord, **sans compte**, via lien à jeton (étape 5).
- Langue : français. Unités : kg, min/km. Dates JJ/MM/AAAA.

## Rôles
| Rôle | Portée |
|---|---|
| admin | toute son organisation, gestion des membres |
| coach | ses athlètes (`athletes.coach_id`) + modèles de l'organisation |
| assistant | seulement les athlètes listés dans `athlete_access` ; jamais la section sensible ; ne modifie pas le profil |

## Invariants (testés dans `supabase/tests`)
1. Séparation movement → exercise → prescription.
2. Une prescription en % référence une valeur de référence datée ; la charge absolue
   est calculée à l'affichage, jamais stockée. Un nouveau test = une nouvelle ligne.
3. Une assignation référence un **snapshot immuable** de la séance.
4. Prescrit (snapshot) et réalisé (`performed_sets`, une ligne par série) sont séparés.
5. RPE stocké seul ; RIR converti à l'affichage (RIR ≈ 10 − RPE, approximation).
6. Toute valeur calculée reposant sur une hypothèse est étiquetée « estimé ».
7. Aucun score global, aucun label « readiness » : variables brutes et tendances.
8. Aucune référence inter-organisations (clés composites + triggers).
9. Exercices communs (`organization_id` NULL) en lecture seule ; on duplique pour personnaliser.
10. Un coach avec des athlètes ne peut pas être retiré : réassigner d'abord.

## Règles de calcul (à respecter dans l'UI)
- Série de travail = hors échauffement.
- Séries par muscle : principal = 1, secondaire = 0,5 (configurable plus tard).
- Durée de séance = temps de travail + repos prescrits ; pour la course, les hypothèses
  (allure de footing, échauffement) sont affichées et modifiables, valeurs « estimé ».
- e1RM : stocker la méthode ; avertir au-delà d'environ 8 à 10 répétitions.
- Charge d'entraînement : séance-RPE × durée. Pas d'indicateur de risque de blessure.

## Données de santé
Table `athlete_sensitive` séparée, consentement horodaté obligatoire, accès coach responsable
et admin uniquement. Hébergement UE. Export et suppression d'un athlète à l'étape 2.

## Sécurité
RLS sur toutes les tables. Pas de `service_role` côté client. Accès athlète uniquement
via Edge Function (jeton aléatoire, stocké haché, expiration, limité à une assignation).

## Conventions
- Schéma = migrations dans `supabase/migrations`, jamais d'édition manuelle en prod.
- Une itération = une branche = une PR ; tag après validation (`v0.1-schema`…).
- Pas de donnée réelle d'athlète sur le projet `dev`.

## Séances : droits d'édition
- Séance rattachée à un athlète : création par l'admin et le coach responsable de l'athlète ; modification et suppression par son créateur seul. Les assistants sont en lecture seule.
- L'admin est en lecture seule sur les séances créées par les coachs. Il garde la suppression d'un athlète (la cascade ignore les politiques).
- Modèles (séance sans athlète) : modifiables par l'admin et les coachs de l'organisation.
- Copie de semaine : les séances copiées appartiennent à celui qui copie ; la destination se limite aux athlètes que l'utilisateur gère.
- Suppression d'une assignation : coach responsable et admin (`can_manage_athlete`).
- À prévoir avant l'interface multi-coach : transfert des séances lors d'une réassignation d'athlète (trigger sur `athletes.coach_id`). Si le créateur est supprimé, `created_by` passe à NULL et la séance n'est plus modifiable depuis l'application.

## Budgets de performance
- Liste de 50 athlètes affichée en moins de 1 s (4G, cache vide).
- JavaScript initial inférieur à 200 ko compressés (mesure au 15/10/2026 : 182,69 ko). Un écran = un chunk chargé à la demande.
- Une page = au plus 2 requêtes Supabase de données, sans cascade.
- Page athlète (lien à jeton) : Lighthouse mobile ≥ 90 ; saisie d'une série sans réseau.

## Builder (4a)
- Écran séance : jusqu'à 4 requêtes de données en parallèle à froid (séance avec blocs et exercices, athlète, références, exercices). Les exercices (5 min) et l'athlète sont en cache en usage normal. Le budget de 2 requêtes vise les écrans de liste.
- Droits : blocs et lignes suivent `can_edit_workout` (créateur seul ; assistants et admin en lecture).
- Prescription en mode force uniquement. Une charge en % référence un 1RM daté de l'athlète pour l'exercice et n'est jamais stockée en kg.

## Builder : blocs et lignes par qualité (4c)
- Chaque ligne porte un mode (champ `mode` de la prescription). La qualité de la séance choisit le mode proposé par défaut. Modes prévus : force, puissance, course, conditioning, mobilite, recuperation, libre. Livrés : force et course.
- Blocs proposés par qualité : course = échauffement, éducatifs, footing continu, intervalles, retour au calme ; autres qualités = types de force. Le bouton « Tous les types de blocs » déplie la liste complète.
- Séance de qualité course : formulaire course d'emblée, exercices limités aux mouvements `running` et `machine_cardio`, exercice suggéré par bloc. « Tous les exercices » rouvre la recherche complète. Vélo, rameur et ski n'ont ni allure ni % VMA.
- Course : hypothèse d'allure de footing (6:00/km, modifiable) pour les lignes de course à pied sans vitesse prescrite. Récupérations comptées entre les répétitions (répétitions − 1). Valeurs sur hypothèse ou sur VMA estimée étiquetées « estimé ». Hors course à pied, aucune hypothèse : la durée incomplète est signalée.
- Ordre des blocs modifiable par glisser-déposer sur la poignée, positions enregistrées en une requête.

## Builder : types de ligne (4d)
- Les lignes de force exposent aussi le tempo (format 3-1-X-1) et l'intention (force max, force, hypertrophie, puissance, technique). La syntaxe texte porte l'intention par les jetons #max #force #hyper #puiss #tech.
- Sélecteur « Type de ligne » à l'ajout : force, course, mobilité. La qualité de la séance donne le type par défaut ; un exercice choisi par recherche impose le mode de son mouvement (running : course, mobility : mobilité, autres : force).
- Mobilité : durée (s), répétitions, respirations, côté ; au moins un des trois premiers. Durée estimée : durée prescrite, sinon répétitions × secondes par répétition, sinon respirations × 5 s (hypothèse affichée) ; multipliée par 2 pour « les deux côtés » (enchaînés).
- Le contexte d'un bloc de mobilité (avant, après, récupération, amplitude, technique) est stocké dans `workout_blocks.params`.

## Builder : puissance, récupération, libre (4e)
- Modes ajoutés : puissance (séries, répétitions ou contacts, charge facultative, vitesse cible, perte de vitesse max, hauteur, récupération obligatoire, RPE), recuperation (modalité, tours, durée par tour, RPE max, température), libre (consigne, durée, RPE cible).
- Les lignes `recuperation` et `libre` n'ont pas d'exercice : `workout_exercises.exercise_id` est nullable, la contrainte `workout_exercises_exercise_required` limite ce cas à ces deux modes.
- Durée estimée : puissance = séries × (répétitions × secondes par répétition + récupération) ; récupération = tours × durée par tour ; libre = durée saisie.
- Blocs proposés par qualité : force, puissance, course, conditioning, mobilité, récupération, autre ; « Tous les types de blocs » déplie la liste complète.
- Course : récupération EF, active (vitesse en km/h obligatoire, distance ajoutée à la distance de course), marche, arrêt. Chaque ligne affiche un badge de son mode.

## 4g — Bibliothèque d'exercices

- **Contenu** : 376 exercices communs (`organization_id` NULL), tous avec `name_fr`, `description`, `steps[]`, `cues[]`, `common_mistakes[]`. Composition : 170 exercices d'origine (rétro-remplis en français), 191 fiches de mobilité par zone du corps (hanche 26, cheville et pied 30, genou 30, bassin et lombaires 30, thoracique 15, cervicales 15, épaule et omoplate 15, coude et poignet 15, corps entier 15) et 15 squats supplémentaires.
- **Sources** : rédaction originale en français à partir d'exercices usuels et d'anatomie standard. Aucune copie de textes, de vidéos ou de catalogues tiers. Fiabilité estimée à 85 % sur les exercices courants, plus faible sur les variantes rares : toute fiche reste « à relire » jusqu'à validation (voir 4h).
- **Colonnes de `exercises`** : `name` (anglais, conservé), `name_fr`, `description`, `steps[]`, `cues[]`, `common_mistakes[]`, `body_zones[]`, `technique`, `animation_url`, `media_credit`, `source` (défaut « Coach OS, rédaction originale »), `image_paths[]`.
- **Vocabulaires contraints** : `level` ∈ beginner / intermediate / advanced ; `body_zones` ⊂ {ankle, foot, knee, hip, pelvis_lumbar, thoracic, cervical, shoulder, scapula, elbow_forearm, wrist_hand, full_body} ; `technique` ∈ {static_stretch, dynamic_stretch, active_mobility, loaded_mobility, pnf, articular_rotation, activation, self_massage}.
- **Unicité** : index unique sur `lower(name)` par organisation.
- **Droits** : exercices communs en lecture seule ; écriture réservée aux exercices d'organisation (admin, coach). Personnaliser = dupliquer.
- **Méthode d'ajout** : lots de 15 fiches, une migration rejouable par lot (`where not exists` sur `lower(name)`), contrôles `wc -l`, `grep -c "^('"`, `awk` sur les apostrophes avant application, vérification SQL après.
- **Objectif** : 450 fiches de force supplémentaires, par mouvement (ordre : charnière de hanche, fentes, poussées, tractions, le reste).

## 4h — Page Exercices, fiche, validation

- **Page `/exercices`** : recherche sans accents sur le nom anglais et le nom français ; filtres zone du corps, muscle, matériel, niveau, mouvement, statut de validation. La bibliothèque complète est chargée une fois (cache 5 minutes) et filtrée dans le navigateur.
- **Fiche détaillée** : panneau latéral (description, étapes, consignes, erreurs fréquentes, images, liens de démonstration). Bouton « i » dans chaque ligne du builder (formulaires de force, course, mobilité, puissance et vue Texte).
- **Statut de validation** : table `exercise_reviews (organization_id, exercise_id, reviewed_by, reviewed_at)`, clé primaire `(organization_id, exercise_id)`. Une ligne = fiche validée par l'organisation ; aucune ligne = « à relire ». Lecture : membres de l'organisation. Écriture : admin et coachs, avec `reviewed_by = auth.uid()`. Pas de mise à jour (retrait puis nouvelle validation). Trigger `trg_review_same_org`. Les assistants consultent sans valider.
- **Démonstration vidéo** : chaque fiche propose deux liens de recherche (chaîne ESCAPhysio avec le nom français, YouTube avec le nom anglais). Prévu en 4j : table `exercise_media` (photos et liens vidéo propres à l'organisation, calquée sur `exercise_reviews`). Droit à l'image : consentement écrit si un athlète est reconnaissable.

## 4i — Images des exercices (RepDB)

- **Source** : RepDB, version gratuite (650 exercices, WebP 512 px). Licence `LICENSE-DATA.md` v1.0. Attribution « Exercise data by RepDB (repdb.co) » affichée dans la barre latérale.
- **Conditions confirmées par écrit par RepDB le 20/10/2026** : affichage dans l'application (coach et page athlète) autorisé ; copie des images dans notre propre stockage obligatoire (pas de chargement depuis `exercise-dataset.com`) ; aucune archive publique, navigable ou téléchargeable en masse ; cache hors-ligne par service worker autorisé ; PDF de séance avec images autorisé ; redimensionnement, recadrage et conversion autorisés ; interdits : republier comme jeu de données, dépôt ou API, alimenter un modèle génératif.
- **Stockage** : bucket Supabase privé `exercise-images` (dossier `repdb/`, 264 fichiers WebP, 5 Mo maximum par fichier, types WebP, JPEG, PNG). Politique de lecture `exercise_images_read` pour les utilisateurs connectés. Adresses signées d'une heure (hook `useExerciseImageUrls`, cache 50 minutes). Aucune image dans le dépôt GitHub public.
- **Liaison** : colonne `exercises.image_paths`. 148 exercices reliés (99 noms exacts, 18 approximatifs validés, 31 validés à la main), 228 sans image. Les images sont des illustrations générées par IA : contrôle visuel obligatoire, retrait par `update … set image_paths = '{}'` si le geste est faux.
- **Fichiers de travail** : `~/repdb-work`, hors dépôt. Un nouvel envoi demande une clé secrète temporaire, saisie par `read -rs`, supprimée aussitôt.
- **Étape 5** : la page athlète à lien à jeton reçoit les adresses signées par l'Edge Function ; le service worker met les images en cache pour la saisie hors-ligne.

## 4k — Direction artistique et accueil

- **Références** : BodyTrack (clair, fond chaud, cartes à bord fin, avatars à initiales, pastilles pastel) et Epilog (vert vif, titres condensés, libellés monospace, grands chiffres, version sombre quasi noire). Aucun texte, logo ni illustration de ces produits n'est repris.
- **Thèmes** : réglage Système (défaut) / Clair / Sombre pour le coach et pour les athlètes, mémorisé dans `localStorage` (clé `coachos-theme`). Script dans `index.html` posant `data-theme` avant le premier affichage (pas d'éclair) et mettant à jour `theme-color`.
- **Jetons** (`src/index.css`, Tailwind v4) : `@theme static` redéfinit `white` et `slate-50` à `slate-900` (neutres chauds) ; `html[data-theme="dark"]` redéfinit les mêmes variables et les couleurs des pastilles d'état. Accent `#0d7f4f` en clair, `#3ddc97` en sombre. Bordures par défaut en `slate-300`.
- **Polices** auto-hébergées (`@fontsource`, aucune requête vers Google) : Inter (texte), Barlow Condensed (titres `h1`, classe `font-display`), JetBrains Mono (libellés, `font-mono`).
- **Mise en page** : `AppShell`, barre latérale à gauche repliable (clé `coachos-sidebar`) ; sur mobile, barre du haut et tiroir. Entrée « Organisation » réservée à l'admin.
- **Accueil** (route index, `src/pages/Home.tsx`) : « À traiter cette semaine ». Une séance est « à faire » si elle appartient à la semaine en cours et si sa date est aujourd'hui ou plus tard. Avant l'étape 5, aucun statut « fait » ni « manqué » n'existe ; il se branchera sur le même écran. Cartes par athlète actif triées par prochaine séance ; athlètes actifs sans séance à venir listés avec « Planifier » (assistants : « Calendrier »). Mêmes données et mêmes politiques que `/semaine` (2 requêtes : athlètes, séances de la semaine, cache partagé).
- **À contrôler** : contrastes du mode sombre et du texte vert avec un outil de contraste (objectif WCAG AA).
- **À venir** : 4k-2c, refonte écran par écran (cartes à grand rayon, champs à bordure plus marquée, builder plus aéré, Semaine en cartes).

## 4f — Conditioning

- **Ligne `conditioning`** : une quantité par ligne (`quantityKind` ∈ reps, meters, calories, seconds ; `quantity` entier ≥ 1, en secondes ou min:sec pour l'unité secondes), charge facultative en kg (`loadKg`), RPE facultatif. L'ancien schéma (format, durée, tours, travail, repos sur chaque ligne) est remplacé : aucune ligne n'existait. Exercices proposés : mouvements `conditioning`, `carry`, `machine_cardio`, `olympic`, `jump_plyo` (tous les exercices sur demande).
- **Mode par défaut** : une séance de qualité Conditioning propose le mode `conditioning` ; badge « Cond. ».
- **Type de bloc `fortime`** : ajouté à la contrainte `workout_blocks_kind_check` (migration `20261022000001_4f_fortime`). Blocs proposés en qualité Conditioning : échauffement, AMRAP, EMOM, For Time, circuit, intervalles, retour au calme.
- **Paramètres de bloc** (`workout_blocks.params`, clés conservées avec `context`) : AMRAP `minutes` ; EMOM `intervalSeconds`, `minutes` ; For Time `capMinutes`, `rounds` ; circuit `rounds`, `restSeconds` ; intervalles `workSeconds`, `restSeconds`, `rounds`. Affichés pour AMRAP, EMOM et For Time quelle que soit la qualité, et pour circuit et intervalles en séance de qualité Conditioning seulement (les circuits et intervalles de force ou de course gardent leur calcul).
- **Durée estimée d'un bloc** : AMRAP et EMOM = durée saisie ; For Time = time cap (borne haute, étiqueté « estimé ») ; circuit = tours × somme des lignes + (tours − 1) × repos ; intervalles = tours × (travail + repos). Dans AMRAP, EMOM et For Time, les lignes ne s'additionnent pas. Paramètre requis absent : somme des lignes et message « Durée incomplète ».
- **Durée d'une ligne** : répétitions × secondes par répétition (hypothèse modifiable, 3 s par défaut) ; secondes telles quelles ; mètres et calories sans durée prescrite : non comptés, message « Durée incomplète ».
- **Droits** : identiques aux autres blocs et lignes (créateur seul pour une séance d'athlète ; admin et assistants en lecture seule).
