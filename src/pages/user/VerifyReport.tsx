import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import type { MedicalTestInput } from "../../types";
import { generatePredictions } from "../../services/backend";
import { NORMAL_RANGES } from "../../utils/constants";
import { useAuth } from "../../contexts/AuthContext";
import { useDataRefresh } from "../../contexts/DataRefreshContext";
import { FiCheckCircle, FiAlertCircle, FiCpu } from "react-icons/fi";

const DISEASE_OPTIONS = [
  "Diabetes",
  "Hypertension",
  "Kidney Disorder",
  "Liver Disorder",
  "Heart Disease",
  "Anemia",
  "Infection",
  "All Diseases",
];

export default function VerifyReport() {
  const { user } = useAuth();
  const { triggerRefresh } = useDataRefresh();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDisease, setSelectedDisease] = useState("All Diseases");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MedicalTestInput>({
    defaultValues: {
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
  });

  const testFields: Array<{
    key: keyof MedicalTestInput;
    label: string;
    category: string;
  }> = [
    { key: "glucose", label: "Glucose", category: "Basic Metabolic" },
    { key: "urea", label: "Urea", category: "Basic Metabolic" },
    { key: "creatinine", label: "Creatinine", category: "Basic Metabolic" },
    { key: "sodium", label: "Sodium", category: "Basic Metabolic" },
    { key: "potassium", label: "Potassium", category: "Basic Metabolic" },
    { key: "hemoglobin", label: "Hemoglobin", category: "Blood Count" },
    { key: "platelets", label: "Platelets", category: "Blood Count" },
    { key: "wbc", label: "White Blood Cells (WBC)", category: "Blood Count" },
    { key: "rbc", label: "Red Blood Cells (RBC)", category: "Blood Count" },
    { key: "alt", label: "ALT", category: "Liver Function" },
    { key: "ast", label: "AST", category: "Liver Function" },
    { key: "bilirubin", label: "Bilirubin", category: "Liver Function" },
    { key: "albumin", label: "Albumin", category: "Liver Function" },
    { key: "cholesterol", label: "Total Cholesterol", category: "Lipid Panel" },
    { key: "hdl", label: "HDL Cholesterol", category: "Lipid Panel" },
    { key: "ldl", label: "LDL Cholesterol", category: "Lipid Panel" },
    {
      key: "triglycerides",
      label: "Triglycerides",
      category: "Lipid Panel",
    },
  ];

  const onSubmit = async (data: MedicalTestInput) => {
    setLoading(true);
    setError("");

    try {
      const diseaseToCheck =
        selectedDisease === "All Diseases" ? undefined : selectedDisease;
      const result = await generatePredictions(data, diseaseToCheck, user?.id);
      sessionStorage.setItem("predictionResult", JSON.stringify(result));
      sessionStorage.setItem("testValues", JSON.stringify(data));
      triggerRefresh(); // realtime: Dashboard & History refetch
      navigate("/results");
    } catch (err) {
      setError("Failed to generate predictions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    field: keyof MedicalTestInput,
    label: string,
    type: string = "number"
  ) => {
    const value = watch(field);
    const range = NORMAL_RANGES[field];
    const isNormal = value && value >= range.min && value <= range.max;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} ({range.unit})
        </label>
        <div className="relative">
          <input
            type={type}
            step={type === "number" ? "0.01" : undefined}
            {...register(field, {
              required: `${label} is required`,
              valueAsNumber: type === "number",
              min: { value: 0, message: "Value must be positive" },
            })}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition ${
              errors[field]
                ? "border-red-300"
                : isNormal
                ? "border-secondary"
                : "border-gray-300"
            }`}
          />
          {value && !errors[field] && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isNormal ? (
                <FiCheckCircle className="w-5 h-5 text-secondary" />
              ) : (
                <FiAlertCircle className="w-5 h-5 text-yellow-500" />
              )}
            </div>
          )}
        </div>
        {errors[field] && (
          <p className="text-sm text-red-600">
            {errors[field]?.message as string}
          </p>
        )}
        {value && !errors[field] && (
          <p
            className={`text-xs ${
              isNormal ? "text-secondary" : "text-yellow-600"
            }`}
          >
            Normal range: {range.min} - {range.max} {range.unit}
            {!isNormal && " (Out of range)"}
          </p>
        )}
      </div>
    );
  };

  const groupedFields = testFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, typeof testFields>);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Robot Model Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-lighter rounded-full mb-4">
            <FiCpu className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Disease Classification System
          </h1>
          <p className="text-gray-600">
            Input your blood test values step by step to get AI-powered disease
            classification and recommendations
          </p>
        </div>

        {/* Disease Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Select Disease to Check
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DISEASE_OPTIONS.map((disease) => (
              <button
                key={disease}
                onClick={() => setSelectedDisease(disease)}
                className={`px-4 py-3 rounded-lg border-2 transition ${
                  selectedDisease === disease
                    ? "border-primary bg-primary-lighter text-primary font-semibold"
                    : "border-gray-200 hover:border-primary hover:bg-gray-50"
                }`}
              >
                {disease}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Selected: <span className="font-semibold">{selectedDisease}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <div className="space-y-8">
            {Object.entries(groupedFields).map(([category, fields]) => (
              <div key={category}>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-primary pb-2">
                  {category}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {fields.map((field) =>
                    renderInputField(field.key, field.label)
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <FiCpu className="w-5 h-5" />
                  <span>Analyze & Classify</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
