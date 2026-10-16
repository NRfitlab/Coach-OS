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
