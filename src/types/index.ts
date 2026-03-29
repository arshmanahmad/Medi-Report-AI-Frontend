// Type definitions for Medi Report AI

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface MedicalTestInput {
  glucose: number;
  urea: number;
  creatinine: number;
  hemoglobin: number;
  platelets: number;
  wbc: number;
  rbc: number;
  alt: number; // Liver enzyme
  ast: number; // Liver enzyme
  bilirubin: number;
  albumin: number;
  sodium: number;
  potassium: number;
  cholesterol: number;
  hdl: number;
  ldl: number;
  triglycerides: number;
}

export type RiskLevel = "Low" | "Moderate" | "High";

export interface DiseasePrediction {
  disease: string;
  riskLevel: RiskLevel;
  probability: number;
  description: string;
}

export interface SaltRecommendation {
  saltName: string;
  medicationName: string;
  safeStartingAge: number;
  dosage: string;
  cautions: string[];
  whenNeeded: string;
}

export interface DietPlan {
  foodsToEat: string[];
  foodsToAvoid: string[];
  healthyRoutines: string[];
  duration: string;
  mealPlan?: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
}

export interface RecoveryTimeline {
  estimatedDuration: string;
  milestones: {
    week: number;
    description: string;
  }[];
  improvementPercentage: number;
}

export interface PredictionResult {
  predictions: DiseasePrediction[];
  saltRecommendations: SaltRecommendation[];
  dietPlan: DietPlan;
  recoveryTimeline: RecoveryTimeline;
  testDate: string;
  userId?: string;
  mlOverallRisk?: string;
  learning?: {
    trainingSamplesLogged: number;
    mlModelActive: boolean;
  };
}

export interface HealthHistory {
  id: string;
  testDate: string;
  predictions: DiseasePrediction[];
  testValues: MedicalTestInput;
  /** Full report when loaded from backend history */
  fullResult?: PredictionResult;
}
