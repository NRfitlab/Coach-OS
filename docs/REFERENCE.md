
# TRAINING COACH OS
## Plateforme professionnelle de planification, périodisation et prescription de l'entraînement

---

# 1. POSITIONNEMENT DU PRODUIT

Ne pas concevoir l'application comme une simple application de création de séances.

Le produit est un :

> **Training Planning & Prescription Platform for Coaches**

La plateforme doit permettre au coach de :

- connaître ses athlètes ;
- définir leurs objectifs ;
- recueillir leurs contraintes ;
- évaluer leur niveau ;
- définir leurs disponibilités ;
- gérer leur matériel disponible ;
- construire une planification ;
- périodiser l'entraînement ;
- construire des microcycles ;
- construire des mésocycles ;
- construire des macrocycles ;
- créer des séances ;
- individualiser les prescriptions ;
- modifier une séance pour un athlète particulier ;
- suivre la charge ;
- analyser les réponses à l'entraînement ;
- comparer les performances ;
- ajuster la programmation ;
- envoyer les séances aux athlètes ;
- conserver l'historique des prescriptions.

L'athlète n'est pas l'utilisateur principal dans le MVP.

Le produit doit être pensé d'abord pour :

> **COACH → ATHLETE**

et non :

> ATHLETE → APP.

---

# 2. PHILOSOPHIE DU PRODUIT

Le produit doit suivre la logique :

```text
ATHLETE
   ↓
OBJECTIFS
   ↓
CONTRAINTES
   ↓
ÉVALUATION
   ↓
PLANIFICATION
   ↓
PÉRIODISATION
   ↓
MICROCYCLE
   ↓
SÉANCE
   ↓
PRESCRIPTION
   ↓
ENVOI
   ↓
RÉALISATION
   ↓
FEEDBACK
   ↓
ANALYSE
   ↓
AJUSTEMENT
   ↓
NOUVELLE PLANIFICATION
```

La plateforme doit permettre au coach de naviguer facilement entre ces différents niveaux.

---

# 3. ARCHITECTURE CONCEPTUELLE

Le système doit être structuré en 7 niveaux.

```text
LEVEL 1
Athlete

LEVEL 2
Goal

LEVEL 3
Training Plan

LEVEL 4
Mesocycle

LEVEL 5
Microcycle

LEVEL 6
Workout

LEVEL 7
Exercise Prescription
```

Exemple :

```text
ATHLETE
Jean

GOAL
HYROX — June

MESOCYCLE
General Preparation

MICROCYCLE
Week 4

SESSION
Lower Body + Running

BLOCK
Strength

EXERCISE
Back Squat

PRESCRIPTION
4 × 5
80 %
RPE 8
Tempo 3-1-X-1
Rest 180 s
```

Le coach doit pouvoir passer d'un niveau à l'autre sans perdre le contexte.

---

# 4. DASHBOARD COACH

La page d'accueil ne doit PAS être :

> "Create Workout"

Elle doit être :

# COACH DASHBOARD

Afficher :

### Athletes

24

### Active Programs

8

### Sessions This Week

42

### Upcoming

12

### Athletes Needing Review

4

### Recent Activity

Jean — Session completed  
Marie — RPE 9  
Thomas — missed session  
Paul — new PB

---

# 5. ATHLETE MANAGEMENT

Créer une fiche athlète complète.

```text
ATHLETE
├── Profile
├── Goals
├── Availability
├── Equipment
├── Performance
├── Training history
├── Current plan
├── Readiness
├── Injuries / limitations
├── Preferences
└── Notes
```

Les informations sensibles doivent être séparées et protégées.

---

# 6. PROFIL ATHLÈTE

Informations :

- nom ;
- âge ;
- sexe si pertinent pour les objectifs du coach ;
- niveau ;
- sport principal ;
- sports secondaires ;
- expérience d'entraînement ;
- disponibilité ;
- nombre de séances/semaine ;
- durée disponible ;
- matériel ;
- préférences ;
- contraintes ;
- objectifs.

Ne collecter que les informations réellement nécessaires.

---

# 7. OBJECTIFS

Chaque athlète peut avoir plusieurs objectifs.

Exemple :

```text
Primary Goal
HYROX Race — June 15

Secondary Goal
Increase lower-body strength

Maintenance Goal
Running aerobic capacity
```

Chaque objectif possède :

- type ;
- priorité ;
- date cible ;
- métrique ;
- valeur actuelle ;
- valeur cible.

Exemple :

```text
5K
Current: 21:30
Target: 20:30
```

Ne jamais transformer automatiquement ces données en promesse de résultat.

---

# 8. OBJECTIFS HIÉRARCHISÉS

Permettre :

### Primary

Objectif principal.

### Secondary

Objectif secondaire.

### Maintenance

Capacité à maintenir.

Cela est particulièrement important lorsque plusieurs qualités physiques doivent coexister.

Exemple :

```text
PRIMARY
HYROX

SECONDARY
Strength

MAINTENANCE
Mobility
```

---

# 9. DISPONIBILITÉS

Le coach doit pouvoir renseigner :

```text
Monday
60 min

Tuesday
90 min

Wednesday
OFF

Thursday
60 min

Friday
45 min

Saturday
120 min

Sunday
OFF
```

Mais aussi :

- horaires ;
- nombre maximal de séances ;
- jours préférés ;
- jours interdits ;
- temps maximal.

---

# 10. CONTRAINTES

Créer un système de contraintes :

### Equipment

- Full gym
- Home
- Hotel
- Running only
- Dumbbells
- Minimal equipment

### Time

- 30 min
- 45 min
- 60 min
- 90 min

### Environment

- Indoor
- Outdoor
- Track
- Trail
- Road

---

# 11. EXERCISE / MOVEMENT / PRESCRIPTION

Séparer strictement :

## MOVEMENT

Concept biomécanique / pattern.

Exemple :

**Horizontal Push**

↓

## EXERCISE

Bench Press

↓

## VARIANT

Close Grip Bench Press

↓

## PRESCRIPTION

4 × 6 @ 80 %

RPE 8

Tempo 3-1-X-1

Rest 180 s

Cette séparation doit être présente dans la base de données.

---

# 12. INTENTION D'ENTRAÎNEMENT

Chaque prescription doit avoir une intention.

Exemples :

- maximal strength ;
- strength ;
- hypertrophy ;
- power ;
- speed ;
- aerobic development ;
- anaerobic conditioning ;
- technical skill ;
- mobility ;
- recovery ;
- movement quality.

L'intention doit être visible dans le builder.

---

# 13. MOTEUR DE PRESCRIPTION

Le coach choisit :

### Prescription mode

#### Strength

- kg
- %1RM
- RPE
- RIR
- velocity

#### Hypertrophy

- reps
- RIR
- RPE
- tempo
- rest

#### Running

- pace
- speed
- MAS
- HR
- RPE
- duration
- distance

#### Conditioning

- work
- rest
- rounds
- calories
- distance
- pace

#### Mobility

- duration
- breaths
- reps
- ROM
- side

---

# 14. RPE / RIR COMME MOTEUR

RPE et RIR doivent être des variables centrales.

Exemple :

```text
Target
RPE 8
```

Après la séance :

```text
Actual
RPE 9
```

Le système conserve :

```text
Prescribed RPE
Actual RPE
```

Cela permet au coach d'analyser l'écart entre :

> **Prescription**

et

> **Response**

---

# 15. PRESCRIPTION + RESPONSE

C'est une distinction fondamentale.

Chaque variable doit pouvoir exister sous deux formes :

```text
PRESCRIBED
ACTUAL
```

Exemple :

```text
Back Squat

Prescribed
80 kg × 5
RPE 8

Actual
82.5 kg × 5
RPE 8.5
```

Cette structure devient la base du suivi longitudinal.

---

# 16. MOTEURS SCIENTIFIQUES PAR SPORT

Ne pas créer un moteur universel.

Créer des moteurs spécialisés.

```text
Strength Engine

Hypertrophy Engine

Running Engine

HYROX Engine

CrossFit Engine

Mobility Engine

Conditioning Engine
```

Ils utilisent cependant un noyau commun :

```text
Volume
Intensity
Frequency
Density
Duration
Recovery
```

---

# 17. STRENGTH ENGINE

Variables :

- sets ;
- reps ;
- load ;
- %1RM ;
- RPE ;
- RIR ;
- velocity ;
- tempo ;
- rest ;
- unilateral/bilateral.

Calculer notamment :

- volume ;
- tonnage ;
- e1RM ;
- estimated intensity ;
- velocity loss si disponible.

---

# 18. RUNNING ENGINE

Créer un véritable modèle coureur.

Profil :

```text
5K PB
10K PB
HM PB
Marathon PB

MAS
Critical Speed

HRmax
Resting HR

Threshold Pace
Threshold HR
```

Le coach peut choisir son modèle de prescription.

---

# 19. NE PAS LIMITER LE RUNNING AUX ZONES 1–5

Le coach doit pouvoir prescrire selon :

### Pace

3:55/km

### Speed

15.3 km/h

### %MAS

105 %

### HR

165 bpm

### %HRmax

88 %

### RPE

8

### Critical Speed

105 %

### Race Pace

10K pace

L'unité utilisée doit être explicite dans la séance.

---

# 20. RUNNING SESSION BUILDER

Exemple :

```text
Warm-up
15 min easy

Drills
3 × 30 m

Main Set
6 × 800 m

Pace
3:50/km

Recovery
2:00 jog

Cool-down
10 min
```

Le coach doit pouvoir visualiser :

```text
TOTAL DISTANCE
8.6 km

TOTAL TIME
52 min
```

---

# 21. HYROX ENGINE

Créer un moteur spécifique.

Stations :

- Run
- SkiErg
- Sled Push
- Sled Pull
- Burpee Broad Jump
- Row
- Farmer Carry
- Sandbag Lunge
- Wall Ball

Mais également :

### TRANSITION

```text
Run
↓
Station
↓
Transition
↓
Run
```

Permettre de suivre :

- station time ;
- transition time ;
- running time ;
- total time ;
- RPE.

---

# 22. CROSSFIT ENGINE

Chaque workout possède :

### Structure

- AMRAP
- EMOM
- E2MOM
- For Time
- Chipper
- Interval
- Strength + Metcon

### Stimulus

- Strength
- Power
- Gymnastics
- Aerobic
- Anaerobic
- Mixed

### Time Domain

- Short
- Medium
- Long

Le coach doit pouvoir définir le stimulus recherché sans que l'application prétende déterminer automatiquement la "bonne" séance.

---

# 23. MOBILITY ENGINE

Ajouter :

### Context

- Pre-training
- Post-training
- Recovery
- ROM
- Skill
- General

Puis :

### Region

- ankle
- hip
- thoracic
- shoulder
- spine
- full body

---

# 24. WORKOUT BUILDER

Le builder doit être l'un des éléments les plus puissants de l'application.

Structure visuelle :

```text
SESSION
│
├── Warm-up
│
├── Block A
│
├── Block B
│
├── Conditioning
│
└── Cool-down
```

Drag & drop.

Chaque bloc peut être :

- straight sets ;
- superset ;
- giant set ;
- circuit ;
- EMOM ;
- AMRAP ;
- For Time ;
- interval ;
- ladder ;
- cluster.

---

# 25. VUE COMPACTE

Ajouter une vue spécialement conçue pour les coachs expérimentés.

```text
A1 Back Squat       4×5   80%   RPE8   180"
A2 Box Jump         4×3   MAX           120"

B1 Bench Press      3×8   RPE8         90"
B2 Row              3×10  RPE8         90"

C Run               6×800m  3:55/km    2'
```

Le coach peut programmer extrêmement rapidement.

---

# 26. VUE SCIENTIFIQUE

Créer une vue optionnelle.

Elle affiche :

- volume ;
- séries ;
- répétitions ;
- tonnage ;
- intensité ;
- RPE ;
- RIR ;
- durée ;
- densité ;
- distance ;
- training load ;
- stimulus.

Cette vue doit être destinée aux coachs avancés.

---

# 27. WORKOUT DNA

Chaque séance reçoit automatiquement une représentation descriptive.

Exemple :

```text
STRENGTH       █████████
HYPERTROPHY    ██████
POWER          ███
CONDITIONING   ██
MOBILITY       █
```

Mais également :

```text
Lower Body
████████

Upper Body
████

Aerobic
███

Anaerobic
██████
```

Ce n'est pas un score de qualité.

C'est une **cartographie descriptive de la séance**.

---

# 28. WORKOUT AUDIT

Ajouter :

**Analyze Workout**

Le système analyse objectivement :

- durée ;
- volume ;
- intensité ;
- densité ;
- répétition de patterns ;
- répartition musculaire ;
- squat/hinge ;
- push/pull ;
- upper/lower ;
- conditioning ;
- mobility ;
- récupération.

Exemple :

> This session contains 14 lower-body working sets and 4 upper-body working sets.

Ne pas afficher :

> "This workout is optimal."

---

# 29. COMPARE WORKOUTS

Comparer :

### Workout A

vs

### Workout B

Variables :

- duration ;
- volume ;
- intensity ;
- density ;
- sets ;
- reps ;
- distance ;
- RPE ;
- training load ;
- stimulus.

---

# 30. AUTO REPLACE

Chaque exercice doit avoir :

- movement pattern ;
- primary muscles ;
- equipment ;
- difficulty ;
- unilateral/bilateral ;
- training goal.

Le coach peut cliquer :

**Replace**

et voir :

```text
Similar pattern

Back Squat
Front Squat
Hack Squat
Goblet Squat
Split Squat
```

Puis filtrer :

**Available equipment**

---

# 31. EQUIPMENT PROFILE

L'équipement devient une donnée de l'athlète.

```text
ATHLETE EQUIPMENT

Gym
✓ Barbell
✓ Rack
✓ Cable
✓ Dumbbells
✓ Kettlebells
✓ SkiErg

Home
✓ Dumbbells
✓ Bands
✓ Bench
```

---

# 32. HOME / GYM / HOTEL

Une séance peut posséder :

### Primary version

Gym

### Alternative

Home

### Minimal equipment

Hotel

Le coach peut préparer plusieurs versions d'une même séance.

---

# 33. PROGRAMMATION HEBDOMADAIRE

Créer un calendrier :

```text
WEEK 04

MON
Lower Strength

TUE
Easy Run

WED
Recovery

THU
Upper Strength

FRI
HYROX Conditioning

SAT
Long Run

SUN
OFF
```

Drag & drop.

---

# 34. MICRO / MESO / MACRO

Créer trois niveaux.

### MICRO

Semaine.

### MESO

4–8 semaines.

### MACRO

Saison / objectif annuel.

Le coach doit pouvoir zoomer :

```text
YEAR
 ↓
MACROCYCLE
 ↓
MESOCYCLE
 ↓
MICROCYCLE
 ↓
SESSION
 ↓
EXERCISE
```

---

# 35. PERIODISATION

Ne pas imposer une méthode unique.

Permettre au coach de construire :

- accumulation ;
- intensification ;
- réalisation ;
- deload ;
- taper ;
- maintenance ;
- transition.

Ou une structure entièrement personnalisée.

---

# 36. OBJECTIFS DE MESOCYCLE

Exemple :

```text
MESOCYCLE

Goal:
Max Strength

Duration:
5 weeks

Primary qualities:
Strength
Power

Secondary:
Mobility
Aerobic maintenance
```

Puis suivre les tendances.

---

# 37. TEMPLATES INTELLIGENTS

Les templates doivent dépendre de :

- objectif ;
- niveau ;
- sport ;
- équipement ;
- durée ;
- fréquence.

Exemple :

```text
Goal: Strength
Level: Intermediate
Frequency: 3/week
Equipment: Full Gym
```

Proposer des structures de programmation adaptées au contexte.

Les templates doivent rester des **structures éditables**, et non des prescriptions automatiques présentées comme universelles.

---

# 38. TRAINING LOAD

Conserver séparément :

### External load

- kg ;
- reps ;
- distance ;
- duration ;
- watts ;
- calories.

### Internal load

- RPE ;
- HR ;
- session RPE ;
- subjective response.

Permettre au coach de choisir les métriques pertinentes pour chaque sport.

---

# 39. FATIGUE

Créer un historique :

```text
Sleep
Energy
Stress
Soreness
Motivation
Session RPE
```

Mais ces données sont des **indicateurs contextuels**, pas un diagnostic.

Le coach peut les utiliser pour décider d'adapter la séance.

---

# 40. PRESCRIBED VS ACTUAL

C'est l'une des fonctions les plus importantes.

Afficher :

```text
PRESCRIBED
4 × 5 @ 80 kg

ACTUAL
5 / 5 / 5 / 4 @ 80 kg

RPE
8 / 8 / 9 / 10
```

Le coach voit immédiatement l'écart.

---

# 41. HISTORIQUE ET PROGRESSION

Pour chaque exercice :

```text
Back Squat

Week 1
100 × 5

Week 2
102.5 × 5

Week 3
105 × 5

Week 4
107.5 × 5
```

Graphiques :

- load ;
- reps ;
- e1RM ;
- RPE ;
- volume.

---

# 42. PERFORMANCE DASHBOARD

Le dashboard doit être **athlete-specific**.

Pas de score global.

Afficher :

### Strength

e1RM trends.

### Running

Pace / distance / performance.

### Conditioning

Work capacity.

### Training load

Trend.

### Compliance

Prescribed vs completed.

---

# 43. INTER-SPORT

Un athlète peut pratiquer :

```text
Strength
Running
HYROX
Mobility
Cycling
CrossFit
```

Le système doit conserver un calendrier unique.

Le coach voit l'ensemble de la charge prescrite et réalisée.

---

# 44. CONFLITS DE PLANIFICATION

Détecter des situations nécessitant l'attention du coach.

Exemple :

```text
MON
Heavy Lower

TUE
Intervals

WED
Heavy Lower

THU
HYROX

FRI
Long Run
```

Le système peut signaler :

> High concentration of lower-body intensive sessions.

Mais ne doit pas décider automatiquement que c'est incorrect.

---

# 45. COACH NOTES

À chaque niveau :

### Athlete note

### Program note

### Week note

### Session note

### Exercise note

Cela permet de conserver le raisonnement du coach.

---

# 46. VERSIONING

Chaque modification importante d'une séance doit être historisée.

Exemple :

```text
Workout v1
Workout v2
Workout v3
```

Le coach peut voir :

> What changed?

Exemple :

```text
Back Squat
80 → 82.5 kg

Sets
4 → 5

Rest
180 → 150 sec
```

---

# 47. PROGRAMMATION INDIVIDUALISÉE

Le coach doit pouvoir créer :

### Base workout

puis :

**Athlete-specific modifications**

Exemple :

```text
GROUP SESSION

Base:
Back Squat
4 × 5 @ 80%

Jean:
4 × 5 @ 82.5%

Marie:
3 × 5 @ 70%

Thomas:
Goblet Squat
3 × 8
```

Un énorme gain de temps pour le coaching.

---

# 48. GROUP TRAINING

Prévoir les séances collectives.

```text
TEAM

12 athletes

BASE WORKOUT

Individual overrides
```

Le coach peut donc créer une seule séance puis individualiser :

- charge ;
- volume ;
- exercice ;
- récupération ;
- intensité.

---

# 49. ENVOI DES SÉANCES

Plusieurs formats :

### Link

### QR code

### PDF

### Email

### Native share

### Athlete account

### Calendar

---

# 50. WORKOUT PASS

Créer une fiche partageable :

```text
┌───────────────────────────────┐
│ TRAINING                      │
│                               │
│ LOWER BODY STRENGTH           │
│                               │
│ 60 MIN · INTERMEDIATE         │
│                               │
│ COACH                         │
│                               │
│       [ START ]               │
│                               │
│       QR CODE                 │
└───────────────────────────────┘
```

---

# 51. ATHLETE LINK

L'athlète n'a pas besoin d'utiliser le builder.

Il reçoit :

```text
John sent you a workout

LOWER BODY STRENGTH

[ OPEN WORKOUT ]
```

Puis :

**Start Workout**

---

# 52. PDF

Trois formats principaux.

### ATHLETE

Simple.

### COACH

Détaillé.

### TECHNICAL

Démonstrations + consignes.

Ajouter :

- QR code ;
- version ;
- coach ;
- date ;
- durée ;
- objectif.

---

# 53. CONFIDENTIALITÉ

Prévoir dès le début :

- séparation coach/athlete ;
- contrôle d'accès ;
- permissions ;
- chiffrement ;
- logs ;
- suppression ;
- export des données ;
- partage explicite.

Les données de santé ou assimilées doivent être traitées avec une attention particulière.

---

# 54. BASE DE DONNÉES SCIENTIFIQUE

Construire une vraie couche de connaissances.

Exemple :

```text
Exercise
Movement
Training goal
Training variable
Evidence
Source
Population
Context
```

Une recommandation scientifique doit pouvoir être liée à :

```text
Source
Year
Population
Study type
DOI / PMID
```

Ne jamais présenter une opinion du logiciel comme une conclusion scientifique universelle.

---

# 55. EVIDENCE LAYER

Lorsqu'une fonctionnalité utilise une règle scientifique :

Afficher éventuellement :

**Evidence**

avec :

- source ;
- niveau de preuve ;
- population ;
- contexte ;
- limites.

Cette couche doit être indépendante du moteur logiciel.

---

# 56. ARCHITECTURE TECHNIQUE

Architecture multi-tenant :

```text
Organization
│
├── Coaches
│
├── Athletes
│
├── Programs
│
├── Workouts
│
└── Data
```

Un coach peut éventuellement appartenir à une organisation.

Prévoir :

```text
Coach
Assistant Coach
Athlete
Admin
```

---

# 57. STACK

Frontend :

- React
- TypeScript
- Vite
- Tailwind
- shadcn/ui

State :

- Zustand

Validation :

- Zod

Drag & drop :

- dnd-kit

Backend :

- Supabase
- PostgreSQL

Auth :

- Supabase Auth

Storage :

- Supabase Storage

PWA :

- Service Worker
- IndexedDB

---

# 58. ARCHITECTURE DES DONNÉES

Créer notamment :

```text
Organization
Coach
Athlete

AthleteGoal
AthleteAvailability
AthleteEquipment
AthleteAssessment

TrainingPlan
Macrocycle
Mesocycle
Microcycle

Workout
WorkoutBlock
WorkoutExercise
Prescription

Exercise
Movement
ExerciseVariant
ExerciseMedia

WorkoutAssignment
WorkoutCompletion
ExercisePerformance

TrainingLoad
Readiness

WorkoutTemplate

WorkoutVersion
WorkoutShare

CoachNote
AthleteNote

EvidenceSource
```

---

# 59. RELATION ENTRE PRESCRIPTION ET PERFORMANCE

Le modèle doit pouvoir représenter :

```text
Prescription
      ↓
Assignment
      ↓
Completion
      ↓
Performance
      ↓
Response
```

C'est la structure centrale du système.

---

# 60. WORKOUT AUDIT

Le coach peut demander :

**Audit**

Le système retourne des données descriptives :

```text
Duration: 63 min

Strength volume:
14 sets

Lower body:
10 sets

Upper body:
4 sets

Conditioning:
12 min

Rest:
18 min

Total estimated load:
...
```

---

# 61. COMPARE

Comparer :

### Week 1

vs

### Week 4

ou :

### Planned

vs

### Completed.

Afficher les différences.

---

# 62. PROGRAM AUDIT

Même logique à l'échelle d'un mésocycle.

```text
MESOCYCLE

Week 1
Week 2
Week 3
Week 4
```

Afficher :

- volume ;
- fréquence ;
- intensité ;
- distribution des qualités ;
- running volume ;
- strength volume ;
- conditioning ;
- recovery days.

---

# 63. IA — PHASE ULTÉRIEURE

L'IA doit devenir un assistant du coach.

Exemples :

> "Construis-moi un microcycle de 5 séances."

> "Adapte cette semaine à 4 séances."

> "Remplace tous les exercices nécessitant un rack."

> "Construis une alternative hôtel."

> "Analyse la distribution de cette semaine."

> "Compare cette semaine à la précédente."

Mais toujours :

```text
AI proposal
↓
Coach review
↓
Coach approval
↓
Save
```

Jamais :

```text
AI
↓
Automatic prescription
```

sans validation.

---

# 64. PRIORITÉ ABSOLUE DU PRODUIT

Le cœur du produit est :

# COACHING LOOP

```text
PLAN
 ↓
PRESCRIBE
 ↓
ASSIGN
 ↓
ATHLETE PERFORMS
 ↓
COLLECT RESPONSE
 ↓
ANALYZE
 ↓
ADAPT
 ↓
PLAN AGAIN
```

---

# 65. MVP RÉEL

Le premier produit ne doit PAS essayer de tout faire.

Il doit parfaitement maîtriser :

### 1. ATHLETE

Profil + objectifs + contraintes.

### 2. PLAN

Semaine / calendrier.

### 3. WORKOUT

Builder.

### 4. EXERCISE

Bibliothèque + démonstration.

### 5. PRESCRIPTION

Charge / reps / RPE / RIR / tempo / repos / durée / distance.

### 6. ASSIGN

Coach → Athlète.

### 7. SHARE

Lien + PDF + QR.

### 8. COMPLETE

Athlète réalise.

### 9. RESPONSE

RPE + performances.

### 10. HISTORY

Prescription vs réalisé.

---

# 66. PHASE 2

Ajouter :

- mésocycles ;
- macrocycles ;
- périodisation ;
- progression ;
- training load ;
- dashboard ;
- Workout DNA ;
- Workout Audit ;
- Compare ;
- group training.

---

# 67. PHASE 3

Ajouter :

- IA ;
- adaptation ;
- recommandations ;
- intégrations wearables ;
- Garmin ;
- Polar ;
- Apple Health ;
- Strava ;
- TrainingPeaks ;
- capteurs de vitesse.

---

# 68. PHILOSOPHIE UX

Le coach doit toujours pouvoir répondre à trois questions :

### 1. Où en est mon athlète ?

**Athlete**

### 2. Où doit-il aller ?

**Plan**

### 3. Que doit-il faire aujourd'hui ?

**Workout**

L'interface doit constamment maintenir cette hiérarchie.

---

# 69. NAVIGATION PRINCIPALE

Je recommande une navigation :

```text
DASHBOARD

ATHLETES

CALENDAR

PROGRAMS

WORKOUTS

EXERCISE LIBRARY

ANALYTICS
```

et non :

```text
Exercises
Workouts
PDF
Settings
```

car l'organisation doit être centrée sur le **travail du coach**.

---

# 70. ÉCRAN ATHLETE

Exemple :

```text
JEAN DUPONT

HYROX — 15 JUN

Current phase
Specific Preparation

This week
5 sessions

Completed
3 / 5

Training load
████████

Readiness
Moderate

Next session
THU — Strength + Run
```

---

# 71. ÉCRAN CALENDAR

Vue :

### Day

### Week

### Month

### Mesocycle

Avec couleurs ou badges indiquant les qualités :

```text
S
Strength

R
Running

C
Conditioning

M
Mobility

P
Power
```

---

# 72. ÉCRAN PROGRAM

```text
HYROX PREPARATION

12 WEEKS

Base
████

Build
██████

Specific
████████

Taper
██
```

Cliquer sur une phase pour descendre jusqu'aux semaines puis aux séances.

---

# 73. ÉCRAN SESSION

Le coach peut voir :

```text
SESSION

Goal
Lower Body Strength

Duration
65 min

Stimulus
Strength + Hypertrophy

Blocks
4

Volume
...

Estimated load
...
```

Puis éditer.

---

# 74. DESIGN

Je conserverais les trois thèmes précédents mais je les repositionnerais.

### Design A — COACH PRO

Light.

Très dense mais extrêmement lisible.

Inspirations :

- Notion ;
- Linear ;
- TrainingPeaks.

### Design B — PERFORMANCE

Dark.

Pour les dashboards et analytics.

### Design C — ATHLETE OUTPUT

Minimal.

Pour les PDF, liens et séances envoyées.

Ainsi le coach travaille dans **Coach Pro**, tandis que ce qu'il envoie à l'athlète utilise une interface **Athlete Output** beaucoup plus simple.

---

# 75. RÈGLE FONDAMENTALE

La plateforme ne doit jamais demander au coach :

> "Que veux-tu faire maintenant ?"

Elle doit lui permettre de naviguer naturellement :

> **Quel athlète ?**

↓

> **Quel objectif ?**

↓

> **Quelle phase ?**

↓

> **Quelle semaine ?**

↓

> **Quelle séance ?**

↓

> **Quelle prescription ?**

↓

> **Quelle réponse ?**

↓

> **Quelle adaptation ?**

---

# 76. VISION DU PRODUIT

Le produit final doit être pensé comme :

> **un système d'exploitation de la programmation sportive pour coachs.**

Le Workout Builder n'est qu'un composant.

Le véritable produit est la boucle :

> **Athlete → Goal → Plan → Periodization → Session → Prescription → Execution → Response → Analysis → Adaptation**

La première version doit donc optimiser avant tout cette boucle et non multiplier les fonctionnalités périphériques.

---

# 77. PREMIER PROTOTYPE À DÉVELOPPER

Construire maintenant un prototype fonctionnel centré sur :

```text
COACH DASHBOARD
        ↓
ATHLETE
        ↓
CALENDAR
        ↓
WEEK
        ↓
WORKOUT
        ↓
WORKOUT BUILDER
        ↓
EXERCISE + DEMONSTRATION
        ↓
PRESCRIPTION
        ↓
ASSIGN TO ATHLETE
        ↓
SHARE / PDF / QR
```

Le prototype doit permettre au coach de partir d'un athlète réel, construire sa semaine, ouvrir une séance, créer les blocs, prescrire chaque exercice et envoyer la séance.

La priorité absolue est :

> **Le coach doit pouvoir construire une semaine individualisée pour un athlète en quelques minutes, tout en conservant suffisamment de profondeur pour une programmation professionnelle.**

Ne pas sacrifier la richesse scientifique.

Ne pas sacrifier la simplicité UX.

La complexité doit être **dans le système**, pas dans l'interface.