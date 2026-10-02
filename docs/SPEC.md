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
