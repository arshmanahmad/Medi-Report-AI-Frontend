// Constants for the application

import type { MedicalTestInput } from "../types";

/** Full panel defaults (used for hidden fields + “All Diseases” baseline). Matches backend rule defaults. */
export const DEFAULT_MEDICAL_TEST_VALUES: MedicalTestInput = {
  glucose: 95,
  urea: 25,
  creatinine: 0.9,
  hemoglobin: 14.5,
  platelets: 250000,
  wbc: 7000,
  rbc: 4.5,
  alt: 30,
  ast: 28,
  bilirubin: 0.8,
  albumin: 4.2,
  sodium: 140,
  potassium: 4.0,
  cholesterol: 180,
  hdl: 55,
  ldl: 110,
  triglycerides: 120,
};

/** Keys used by each disease rule in ai-services/prediction.py (single-disease mode). */
export const DISEASE_FIELD_KEYS: Record<
  string,
  readonly (keyof MedicalTestInput)[]
> = {
  Diabetes: ["glucose"],
  Hypertension: ["sodium", "potassium", "cholesterol"],
  "Kidney Disorder": ["creatinine", "urea"],
  "Liver Disorder": ["alt", "ast"],
  "Heart Disease": ["cholesterol", "hdl", "ldl", "triglycerides"],
  Anemia: ["hemoglobin"],
  Infection: ["wbc"],
  "All Diseases": [
    "glucose",
    "urea",
    "creatinine",
    "hemoglobin",
    "platelets",
    "wbc",
    "rbc",
    "alt",
    "ast",
    "bilirubin",
    "albumin",
    "sodium",
    "potassium",
    "cholesterol",
    "hdl",
    "ldl",
    "triglycerides",
  ],
};

export function getVisibleFieldKeys(
  selectedDisease: string
): Set<keyof MedicalTestInput> {
  const keys = DISEASE_FIELD_KEYS[selectedDisease];
  if (!keys) {
    return new Set(DISEASE_FIELD_KEYS["All Diseases"]);
  }
  return new Set(keys);
}

export const RISK_LEVEL_COLORS = {
  Low: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
    badge: "bg-green-500",
  },
  Moderate: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-300",
    badge: "bg-yellow-500",
  },
  High: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-300",
    badge: "bg-red-500",
  },
};

export const NORMAL_RANGES = {
  glucose: { min: 70, max: 100, unit: "mg/dL" },
  urea: { min: 7, max: 20, unit: "mg/dL" },
  creatinine: { min: 0.6, max: 1.2, unit: "mg/dL" },
  hemoglobin: { min: 12, max: 16, unit: "g/dL" },
  platelets: { min: 150000, max: 450000, unit: "/μL" },
  wbc: { min: 4000, max: 11000, unit: "/μL" },
  rbc: { min: 4.0, max: 5.5, unit: "million/μL" },
  alt: { min: 7, max: 40, unit: "U/L" },
  ast: { min: 10, max: 40, unit: "U/L" },
  bilirubin: { min: 0.1, max: 1.2, unit: "mg/dL" },
  albumin: { min: 3.5, max: 5.0, unit: "g/dL" },
  sodium: { min: 136, max: 145, unit: "mEq/L" },
  potassium: { min: 3.5, max: 5.0, unit: "mEq/L" },
  cholesterol: { min: 0, max: 200, unit: "mg/dL" },
  hdl: { min: 40, max: 100, unit: "mg/dL" },
  ldl: { min: 0, max: 100, unit: "mg/dL" },
  triglycerides: { min: 0, max: 150, unit: "mg/dL" },
};

export const DISEASE_DESCRIPTIONS: Record<string, string> = {
  Diabetes:
    "A condition where blood glucose levels are too high. Can lead to serious complications if not managed.",
  Anemia:
    "A condition where there are not enough red blood cells or hemoglobin in the blood.",
  "Liver Disorder":
    "Conditions affecting liver function, often indicated by elevated liver enzymes.",
  "Kidney Disorder":
    "Conditions affecting kidney function, often indicated by elevated creatinine or urea levels.",
  Infection:
    "Presence of harmful microorganisms in the body, often indicated by elevated white blood cell count.",
};
