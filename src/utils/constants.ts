// Constants for the application

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
