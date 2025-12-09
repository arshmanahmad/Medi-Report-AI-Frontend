// Enhanced Mock API service with comprehensive models and realistic responses
import type {
  MedicalTestInput,
  PredictionResult,
  User,
  HealthHistory,
  DiseasePrediction,
  SaltRecommendation,
} from "../types";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Users Database
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    createdAt: "2024-01-20",
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    createdAt: "2024-01-10",
  },
];

// Mock Health History Database (stored per user)
const mockHealthHistoryDB: Record<string, HealthHistory[]> = {
  "1": [
    {
      id: "hist-1-1",
      testDate: "2024-01-20",
      testValues: {
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
      },
      predictions: [
        {
          disease: "Diabetes",
          riskLevel: "Low",
          probability: 0.15,
          description: "Your glucose levels are within normal range.",
        },
        {
          disease: "Anemia",
          riskLevel: "Low",
          probability: 0.2,
          description: "Hemoglobin levels are normal.",
        },
      ],
    },
    {
      id: "hist-1-2",
      testDate: "2024-02-15",
      testValues: {
        glucose: 110,
        urea: 28,
        creatinine: 1.1,
        hemoglobin: 13.8,
        platelets: 245000,
        wbc: 7500,
        rbc: 4.6,
        alt: 35,
        ast: 32,
        bilirubin: 0.9,
        albumin: 4.1,
        sodium: 138,
        potassium: 4.2,
        cholesterol: 195,
        hdl: 52,
        ldl: 125,
        triglycerides: 135,
      },
      predictions: [
        {
          disease: "Diabetes",
          riskLevel: "Moderate",
          probability: 0.55,
          description:
            "Slightly elevated glucose levels. Monitor your diet and consider lifestyle changes.",
        },
        {
          disease: "Kidney Disorder",
          riskLevel: "Moderate",
          probability: 0.5,
          description:
            "Kidney function markers are slightly elevated. Monitor hydration and diet.",
        },
      ],
    },
  ],
  "2": [
    {
      id: "hist-2-1",
      testDate: "2024-01-25",
      testValues: {
        glucose: 130,
        urea: 35,
        creatinine: 1.3,
        hemoglobin: 11.5,
        platelets: 220000,
        wbc: 8500,
        rbc: 4.2,
        alt: 45,
        ast: 42,
        bilirubin: 1.2,
        albumin: 3.8,
        sodium: 142,
        potassium: 3.8,
        cholesterol: 220,
        hdl: 45,
        ldl: 150,
        triglycerides: 180,
      },
      predictions: [
        {
          disease: "Diabetes",
          riskLevel: "High",
          probability: 0.85,
          description:
            "Elevated glucose levels indicate high risk of diabetes. Immediate medical attention recommended.",
        },
        {
          disease: "Anemia",
          riskLevel: "High",
          probability: 0.8,
          description:
            "Low hemoglobin levels indicate anemia. Iron supplements may be needed.",
        },
        {
          disease: "Liver Disorder",
          riskLevel: "High",
          probability: 0.75,
          description:
            "Elevated liver enzymes detected. Consult a hepatologist for further evaluation.",
        },
      ],
    },
  ],
};

// Disease Prediction Models
interface DiseaseModel {
  name: string;
  checkRisk: (values: MedicalTestInput) => DiseasePrediction;
}

const diseaseModels: DiseaseModel[] = [
  {
    name: "Diabetes",
    checkRisk: (values) => {
      if (values.glucose > 126) {
        return {
          disease: "Diabetes",
          riskLevel: "High",
          probability: 0.85,
          description:
            "Elevated glucose levels indicate high risk of diabetes. Immediate medical attention recommended.",
        };
      } else if (values.glucose > 100) {
        return {
          disease: "Diabetes",
          riskLevel: "Moderate",
          probability: 0.55,
          description:
            "Slightly elevated glucose levels. Monitor your diet and consider lifestyle changes.",
        };
      } else {
        return {
          disease: "Diabetes",
          riskLevel: "Low",
          probability: 0.15,
          description: "Your glucose levels are within normal range.",
        };
      }
    },
  },
  {
    name: "Anemia",
    checkRisk: (values) => {
      if (values.hemoglobin < 12) {
        return {
          disease: "Anemia",
          riskLevel: "High",
          probability: 0.8,
          description:
            "Low hemoglobin levels indicate anemia. Iron supplements may be needed.",
        };
      } else if (values.hemoglobin < 13) {
        return {
          disease: "Anemia",
          riskLevel: "Moderate",
          probability: 0.45,
          description:
            "Hemoglobin levels are slightly below optimal. Consider iron-rich foods.",
        };
      } else {
        return {
          disease: "Anemia",
          riskLevel: "Low",
          probability: 0.2,
          description: "Hemoglobin levels are normal.",
        };
      }
    },
  },
  {
    name: "Liver Disorder",
    checkRisk: (values) => {
      if (values.alt > 40 || values.ast > 40) {
        return {
          disease: "Liver Disorder",
          riskLevel: "High",
          probability: 0.75,
          description:
            "Elevated liver enzymes detected. Consult a hepatologist for further evaluation.",
        };
      } else {
        return {
          disease: "Liver Disorder",
          riskLevel: "Low",
          probability: 0.25,
          description: "Liver enzyme levels are within normal range.",
        };
      }
    },
  },
  {
    name: "Kidney Disorder",
    checkRisk: (values) => {
      if (values.creatinine > 1.2 || values.urea > 40) {
        return {
          disease: "Kidney Disorder",
          riskLevel: "High",
          probability: 0.7,
          description:
            "Elevated creatinine or urea levels suggest kidney function concerns.",
        };
      } else if (values.creatinine > 1.0) {
        return {
          disease: "Kidney Disorder",
          riskLevel: "Moderate",
          probability: 0.5,
          description:
            "Kidney function markers are slightly elevated. Monitor hydration and diet.",
        };
      } else {
        return {
          disease: "Kidney Disorder",
          riskLevel: "Low",
          probability: 0.2,
          description: "Kidney function appears normal.",
        };
      }
    },
  },
  {
    name: "Heart Disease",
    checkRisk: (values) => {
      const totalRisk =
        (values.cholesterol > 200 ? 0.3 : 0) +
        (values.ldl > 130 ? 0.3 : 0) +
        (values.hdl < 40 ? 0.2 : 0) +
        (values.triglycerides > 150 ? 0.2 : 0);

      if (totalRisk > 0.6) {
        return {
          disease: "Heart Disease",
          riskLevel: "High",
          probability: 0.75,
          description:
            "Multiple lipid markers indicate elevated cardiovascular risk. Consult a cardiologist.",
        };
      } else if (totalRisk > 0.3) {
        return {
          disease: "Heart Disease",
          riskLevel: "Moderate",
          probability: 0.5,
          description:
            "Some lipid markers are concerning. Consider dietary changes and regular monitoring.",
        };
      } else {
        return {
          disease: "Heart Disease",
          riskLevel: "Low",
          probability: 0.2,
          description: "Lipid profile appears healthy.",
        };
      }
    },
  },
  {
    name: "Infection",
    checkRisk: (values) => {
      if (values.wbc > 11000) {
        return {
          disease: "Infection",
          riskLevel: "High",
          probability: 0.75,
          description:
            "Elevated white blood cell count may indicate an active infection.",
        };
      } else if (values.wbc < 4000) {
        return {
          disease: "Infection",
          riskLevel: "Moderate",
          probability: 0.4,
          description:
            "Low white blood cell count may indicate weakened immune system.",
        };
      } else {
        return {
          disease: "Infection",
          riskLevel: "Low",
          probability: 0.15,
          description: "White blood cell count is within normal range.",
        };
      }
    },
  },
  {
    name: "Hypertension",
    checkRisk: (values) => {
      // Note: Blood pressure not in test values, using sodium/potassium as proxy
      const riskFactor =
        (values.sodium > 145 ? 0.3 : 0) +
        (values.potassium < 3.5 ? 0.3 : 0) +
        (values.cholesterol > 200 ? 0.2 : 0);

      if (riskFactor > 0.5) {
        return {
          disease: "Hypertension",
          riskLevel: "Moderate",
          probability: 0.5,
          description:
            "Electrolyte imbalances may contribute to hypertension risk. Monitor blood pressure regularly.",
        };
      } else {
        return {
          disease: "Hypertension",
          riskLevel: "Low",
          probability: 0.2,
          description: "Electrolyte levels appear balanced.",
        };
      }
    },
  },
];

// Generate predictions using disease models
const generateDiseasePredictions = (
  testValues: MedicalTestInput,
  selectedDisease?: string
): DiseasePrediction[] => {
  if (selectedDisease && selectedDisease !== "All Diseases") {
    const model = diseaseModels.find((m) => m.name === selectedDisease);
    return model ? [model.checkRisk(testValues)] : [];
  }

  return diseaseModels.map((model) => model.checkRisk(testValues));
};

// Generate salt recommendations based on high-risk diseases
const generateSaltRecommendations = (
  predictions: DiseasePrediction[]
): SaltRecommendation[] => {
  const recommendations: SaltRecommendation[] = [];
  const highRiskDiseases = predictions
    .filter((p) => p.riskLevel === "High")
    .map((p) => p.disease);

  if (highRiskDiseases.includes("Diabetes")) {
    recommendations.push({
      saltName: "Metformin",
      medicationName: "Metformin HCl",
      safeStartingAge: 18,
      dosage: "500mg twice daily",
      cautions: [
        "May cause gastrointestinal upset",
        "Not recommended for kidney disease",
        "Avoid alcohol",
      ],
      whenNeeded: "When glucose levels consistently exceed 126 mg/dL",
    });
  }

  if (highRiskDiseases.includes("Anemia")) {
    recommendations.push({
      saltName: "Ferrous Sulfate",
      medicationName: "Iron Supplement",
      safeStartingAge: 12,
      dosage: "325mg once daily",
      cautions: [
        "Take with food to reduce stomach upset",
        "May cause constipation",
        "Keep away from children",
      ],
      whenNeeded: "When hemoglobin levels drop below 12 g/dL",
    });
  }

  if (highRiskDiseases.includes("Liver Disorder")) {
    recommendations.push({
      saltName: "Ursodeoxycholic Acid",
      medicationName: "UDCA",
      safeStartingAge: 18,
      dosage: "300mg twice daily",
      cautions: [
        "Requires liver function monitoring",
        "Not for use in pregnancy without doctor approval",
      ],
      whenNeeded: "When liver enzymes (ALT/AST) are significantly elevated",
    });
  }

  if (highRiskDiseases.includes("Heart Disease")) {
    recommendations.push({
      saltName: "Atorvastatin",
      medicationName: "Lipitor",
      safeStartingAge: 18,
      dosage: "10-20mg once daily",
      cautions: [
        "May cause muscle pain",
        "Avoid grapefruit",
        "Regular liver function tests required",
      ],
      whenNeeded: "When cholesterol levels are significantly elevated",
    });
  }

  return recommendations;
};

// Generate diet plan based on predictions
const generateDietPlan = (predictions: DiseasePrediction[]) => {
  const hasDiabetes = predictions.some((p) => p.disease === "Diabetes");
  const hasLiverIssue = predictions.some((p) => p.disease === "Liver Disorder");

  return {
    foodsToEat: [
      "Fresh vegetables (leafy greens, broccoli, carrots)",
      "Whole grains (brown rice, oats, quinoa)",
      "Lean proteins (chicken, fish, legumes)",
      "Fresh fruits (berries, apples, citrus)",
      "Nuts and seeds (almonds, walnuts, chia seeds)",
      "Low-fat dairy products",
      ...(hasDiabetes ? ["High-fiber foods", "Low glycemic index foods"] : []),
      ...(hasLiverIssue ? ["Antioxidant-rich foods", "Green tea"] : []),
    ],
    foodsToAvoid: [
      "Processed foods and fast food",
      "Sugary drinks and desserts",
      "Excessive salt and sodium",
      "Red meat (limit consumption)",
      ...(hasLiverIssue ? ["Alcohol", "Fried foods"] : []),
      "Refined carbohydrates (white bread, pasta)",
    ],
    healthyRoutines: [
      "Drink 8-10 glasses of water daily",
      "Exercise for 30 minutes, 5 days a week",
      "Get 7-8 hours of sleep nightly",
      "Eat meals at regular intervals",
      "Practice stress management techniques",
      "Regular health check-ups every 3-6 months",
    ],
    duration: "Follow this plan for 3-6 months, then reassess",
    mealPlan: {
      breakfast: [
        "Oatmeal with berries",
        "Whole grain toast with avocado",
        "Green tea",
      ],
      lunch: [
        "Grilled chicken salad",
        "Quinoa bowl with vegetables",
        "Fresh fruit",
      ],
      dinner: [
        "Baked fish with steamed vegetables",
        "Brown rice",
        "Mixed greens",
      ],
      snacks: ["Nuts and seeds", "Greek yogurt", "Fresh fruit"],
    },
  };
};

// Main prediction generation function
export const generatePredictions = async (
  testValues: MedicalTestInput,
  selectedDisease?: string,
  userId?: string
): Promise<PredictionResult> => {
  await delay(1500); // Simulate API call

  const predictions = generateDiseasePredictions(testValues, selectedDisease);
  const saltRecommendations = generateSaltRecommendations(predictions);
  const dietPlan = generateDietPlan(predictions);
  const highRiskCount = predictions.filter(
    (p) => p.riskLevel === "High"
  ).length;

  const recoveryTimeline = {
    estimatedDuration: highRiskCount > 0 ? "4-6 months" : "2-3 months",
    milestones: [
      { week: 2, description: "Initial improvements in energy levels" },
      { week: 4, description: "Noticeable changes in test markers" },
      { week: 8, description: "Significant improvement in overall health" },
      { week: 12, description: "Re-evaluation recommended" },
      { week: 24, description: "Target health goals achieved" },
    ],
    improvementPercentage: highRiskCount > 0 ? 60 : 85,
  };

  const result: PredictionResult = {
    predictions,
    saltRecommendations,
    dietPlan,
    recoveryTimeline,
    testDate: new Date().toISOString().split("T")[0],
    userId: userId || "1",
  };

  // Save to history
  if (userId) {
    if (!mockHealthHistoryDB[userId]) {
      mockHealthHistoryDB[userId] = [];
    }
    mockHealthHistoryDB[userId].push({
      id: `hist-${userId}-${Date.now()}`,
      testDate: result.testDate,
      testValues,
      predictions,
    });
  }

  return result;
};

// Authentication APIs
export const mockLogin = async (
  email: string,
  password: string
): Promise<User> => {
  await delay(1000);

  // Check for admin login
  if (email === "admin@example.com" && password) {
    return mockUsers.find((u) => u.role === "admin") || mockUsers[0];
  }

  // Regular user login
  const user = mockUsers.find((u) => u.email === email);
  if (user && password) {
    return user;
  }

  throw new Error("Invalid credentials");
};

export const mockRegister = async (
  name: string,
  email: string,
  _password: string
): Promise<User> => {
  await delay(1000);

  // Check if email already exists
  if (mockUsers.some((u) => u.email === email)) {
    throw new Error("Email already registered");
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: "user",
    createdAt: new Date().toISOString().split("T")[0],
  };

  mockUsers.push(newUser);
  mockHealthHistoryDB[newUser.id] = [];

  return newUser;
};

// Health History APIs
export const mockGetHealthHistory = async (
  userId?: string
): Promise<HealthHistory[]> => {
  await delay(500);
  const targetUserId = userId || "1";
  return mockHealthHistoryDB[targetUserId] || [];
};

export const mockGetHealthHistoryById = async (
  reportId: string
): Promise<HealthHistory | null> => {
  await delay(300);
  for (const histories of Object.values(mockHealthHistoryDB)) {
    const report = histories.find((h) => h.id === reportId);
    if (report) return report;
  }
  return null;
};

// Admin APIs
export const mockGetAllUsers = async (): Promise<User[]> => {
  await delay(500);
  return mockUsers.filter((u) => u.role === "user");
};

export const mockCreateUser = async (
  name: string,
  email: string,
  role: "user" | "admin" = "user"
): Promise<User> => {
  await delay(800);

  if (mockUsers.some((u) => u.email === email)) {
    throw new Error("Email already exists");
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    role,
    createdAt: new Date().toISOString().split("T")[0],
  };

  mockUsers.push(newUser);
  if (role === "user") {
    mockHealthHistoryDB[newUser.id] = [];
  }

  return newUser;
};

export const mockUpdateUser = async (
  userId: string,
  updates: Partial<User>
): Promise<User> => {
  await delay(600);

  const userIndex = mockUsers.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    throw new Error("User not found");
  }

  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
  return mockUsers[userIndex];
};

export const mockDeleteUser = async (userId: string): Promise<void> => {
  await delay(500);

  const userIndex = mockUsers.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    throw new Error("User not found");
  }

  mockUsers.splice(userIndex, 1);
  delete mockHealthHistoryDB[userId];
};

// Statistics APIs
export const mockGetStatistics = async () => {
  await delay(400);
  return {
    totalUsers: mockUsers.filter((u) => u.role === "user").length,
    totalReports: Object.values(mockHealthHistoryDB).reduce(
      (sum, histories) => sum + histories.length,
      0
    ),
    activeModels: diseaseModels.length,
    accuracy: 94.2,
    todayReports: Math.floor(Math.random() * 50) + 20,
    todayUsers: Math.floor(Math.random() * 15) + 5,
  };
};
