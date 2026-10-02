import { z } from "zod";

/**
 * Prescription = ce que le coach demande. Stockée en JSONB (workout_exercises.prescription).
 * Invariants :
 *  - le RPE est la seule représentation d'intensité subjective stockée ; le RIR est converti à l'affichage ;
 *  - une charge en % référence TOUJOURS une valeur de référence datée (referenceId) ;
 *    la charge absolue n'est jamais stockée, elle est calculée à l'affichage.
 */

const positiveInt = z.number().int().positive();

export const rpeSchema = z
  .number()
  .min(1)
  .max(10)
  .refine((v) => Number.isInteger(v * 2), "RPE par pas de 0,5");

export const intentionSchema = z.enum([
  "max_strength",
  "strength",
  "hypertrophy",
  "power",
  "speed",
  "aerobic",
  "anaerobic",
  "technique",
  "mobility",
  "recovery",
]);

const repsSchema = z.union([
  positiveInt,
  z.object({ min: positiveInt, max: positiveInt }).refine((r) => r.max >= r.min, "max >= min"),
]);

const loadSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("kg"), value: z.number().positive() }),
  z.object({
    type: z.literal("percent_reference"),
    value: z.number().positive().max(150),
    referenceId: z.string().uuid(),
  }),
  z.object({ type: z.literal("bodyweight") }),
  z.object({ type: z.literal("rpe_only") }),
]);

const base = {
  intention: intentionSchema.optional(),
  note: z.string().max(500).optional(),
};

export const forcePrescription = z.object({
  mode: z.literal("force"),
  sets: positiveInt,
  reps: repsSchema,
  load: loadSchema,
  rpe: rpeSchema.optional(),
  tempo: z.string().regex(/^[0-9X]-[0-9X]-[0-9X]-[0-9X]$/, "Format 3-1-X-1").optional(),
  restSeconds: z.number().int().min(0).max(900).optional(),
  ...base,
});

const paceTarget = z.discriminatedUnion("unit", [
  z.object({ unit: z.literal("pace_s_per_km"), value: z.number().positive() }),
  z.object({ unit: z.literal("speed_kmh"), value: z.number().positive() }),
  z.object({
    unit: z.literal("percent_mas"),
    value: z.number().positive().max(200),
    referenceId: z.string().uuid(),
  }),
  z.object({ unit: z.literal("hr_bpm"), value: z.number().int().positive() }),
  z.object({ unit: z.literal("rpe"), value: rpeSchema }),
]);

export const coursePrescription = z.object({
  mode: z.literal("course"),
  repeats: positiveInt.default(1),
  target: z.discriminatedUnion("type", [
    z.object({ type: z.literal("distance_m"), value: z.number().positive() }),
    z.object({ type: z.literal("duration_s"), value: z.number().positive() }),
  ]),
  intensity: paceTarget.optional(),
  recovery: z
    .object({
      kind: z.enum(["jog", "walk", "rest"]),
      durationSeconds: z.number().int().min(0),
    })
    .optional(),
  ...base,
});

export const conditioningPrescription = z.object({
  mode: z.literal("conditioning"),
  format: z.enum(["amrap", "emom", "for_time", "interval"]),
  durationSeconds: positiveInt.optional(),
  rounds: positiveInt.optional(),
  workSeconds: positiveInt.optional(),
  restSeconds: z.number().int().min(0).optional(),
  rpe: rpeSchema.optional(),
  ...base,
});

export const mobilityPrescription = z.object({
  mode: z.literal("mobilite"),
  durationSeconds: positiveInt.optional(),
  reps: positiveInt.optional(),
  breaths: positiveInt.optional(),
  side: z.enum(["both", "left", "right"]).default("both"),
  ...base,
});

export const prescriptionSchema = z.discriminatedUnion("mode", [
  forcePrescription,
  coursePrescription,
  conditioningPrescription,
  mobilityPrescription,
]);

export type Prescription = z.infer<typeof prescriptionSchema>;
export type ForcePrescription = z.infer<typeof forcePrescription>;

// ---------------------------------------------------------------------
// Fonctions pures d'affichage / calcul
// ---------------------------------------------------------------------

/** RIR ≈ 10 − RPE. Approximation : la fiabilité dépend de l'expérience de l'athlète. */
export const rpeToRir = (rpe: number): number => 10 - rpe;
export const rirToRpe = (rir: number): number => 10 - rir;

export interface ReferenceValue {
  id: string;
  value: number;
  unit: string;
  measuredOn: string; // ISO
  method: "direct_test" | "estimated" | "declared";
}

/**
 * Charge absolue à l'affichage. Retourne null si la référence manque :
 * l'interface doit alors afficher un avertissement, jamais une valeur inventée.
 */
export function absoluteLoadKg(
  load: ForcePrescription["load"],
  references: ReferenceValue[],
): { kg: number; estimated: boolean; referenceDate: string } | null {
  if (load.type === "kg") return { kg: load.value, estimated: false, referenceDate: "" };
  if (load.type !== "percent_reference") return null;
  const ref = references.find((r) => r.id === load.referenceId);
  if (!ref) return null;
  return {
    kg: Math.round(((ref.value * load.value) / 100) * 2) / 2, // arrondi au 0,5 kg
    estimated: ref.method !== "direct_test",
    referenceDate: ref.measuredOn,
  };
}

/** Série de travail = hors échauffement (le bloc 'warmup' est exclu en amont). */
export const workingSets = (p: ForcePrescription): number => p.sets;
