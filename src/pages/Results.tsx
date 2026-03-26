import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/Layout/DashboardLayout";
import type { PredictionResult, MedicalTestInput, RiskLevel } from "../types";
import { RISK_LEVEL_COLORS } from "../utils/constants";
import {
  generatePDFReport,
  generateExcelReport,
} from "../services/reportGenerator";
import { useAuth } from "../contexts/AuthContext";
import { getHealthHistoryById } from "../services/backend";
import {
  FiDownload,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
} from "react-icons/fi";

export default function Results() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get("reportId");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [testValues, setTestValues] = useState<MedicalTestInput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (reportId && user?.id) {
        setLoading(true);
        const hist = await getHealthHistoryById(reportId, user.id);
        if (cancelled) return;
        if (hist?.fullResult && hist.testValues) {
          setResult(hist.fullResult);
          setTestValues(hist.testValues);
          setLoading(false);
          return;
        }
        if (hist?.testValues) {
          setTestValues(hist.testValues);
          setResult({
            predictions: hist.predictions,
            saltRecommendations: [],
            dietPlan: {
              foodsToEat: [],
              foodsToAvoid: [],
              healthyRoutines: [],
              duration: "—",
            },
            recoveryTimeline: {
              estimatedDuration: "—",
              milestones: [],
              improvementPercentage: 0,
            },
            testDate: hist.testDate,
            userId: user.id,
          });
          setLoading(false);
          return;
        }
        navigate("/history");
        setLoading(false);
        return;
      }

      const storedResult = sessionStorage.getItem("predictionResult");
      const storedValues = sessionStorage.getItem("testValues");
      if (storedResult && storedValues) {
        setResult(JSON.parse(storedResult));
        setTestValues(JSON.parse(storedValues));
      } else {
        navigate("/verify-report");
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, reportId, user?.id]);

  const handleDownloadPDF = () => {
    if (result && testValues && user) {
      generatePDFReport(testValues, result, user.name);
    }
  };

  const handleDownloadExcel = () => {
    if (result && testValues && user) {
      generateExcelReport(testValues, result, user.name);
    }
  };

  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case "Low":
        return <FiCheckCircle className="w-6 h-6" />;
      case "Moderate":
        return <FiAlertCircle className="w-6 h-6" />;
      case "High":
        return <FiXCircle className="w-6 h-6" />;
    }
  };

  if (loading || !result) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <FiDownload className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleDownloadExcel}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <FiDownload className="w-5 h-5" />
              <span>Download Excel</span>
            </button>
          </div>
        </div>

        {/* Predictions Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Disease Risk Predictions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {result.predictions.map((prediction, index) => {
              const colors = RISK_LEVEL_COLORS[prediction.riskLevel];
              return (
                <div
                  key={index}
                  className={`border-2 ${colors.border} ${colors.bg} rounded-lg p-4`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={colors.text}>
                        {getRiskIcon(prediction.riskLevel)}
                      </div>
                      <h3 className="text-xl font-semibold">
                        {prediction.disease}
                      </h3>
                    </div>
                    <span
                      className={`${colors.badge} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                    >
                      {prediction.riskLevel} Risk
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Probability</span>
                      <span className="font-semibold">
                        {(prediction.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors.badge}`}
                        style={{ width: `${prediction.probability * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className={`text-sm ${colors.text}`}>
                    {prediction.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Salt Recommendations */}
        {result.saltRecommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              Medication Recommendations
            </h2>
            <div className="space-y-4">
              {result.saltRecommendations.map((rec, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {rec.medicationName}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Salt: {rec.saltName}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Age {rec.safeStartingAge}+
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Dosage:</span>{" "}
                      {rec.dosage}
                    </p>
                    <p>
                      <span className="font-semibold">When Needed:</span>{" "}
                      {rec.whenNeeded}
                    </p>
                    <div>
                      <span className="font-semibold">Cautions:</span>
                      <ul className="list-disc list-inside ml-2 text-sm text-gray-600">
                        {rec.cautions.map((caution, i) => (
                          <li key={i}>{caution}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diet Plan */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Personalized Diet Plan</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-700">
                Foods to Eat
              </h3>
              <ul className="space-y-2">
                {result.dietPlan.foodsToEat.map((food, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-700">
                Foods to Avoid
              </h3>
              <ul className="space-y-2">
                {result.dietPlan.foodsToAvoid.map((food, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <FiXCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {result.dietPlan.mealPlan && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Sample Meal Plan</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Breakfast
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {result.dietPlan.mealPlan.breakfast.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Lunch</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {result.dietPlan.mealPlan.lunch.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Dinner</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {result.dietPlan.mealPlan.dinner.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Snacks</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {result.dietPlan.mealPlan.snacks.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Healthy Routines</h3>
            <ul className="grid md:grid-cols-2 gap-2">
              {result.dietPlan.healthyRoutines.map((routine, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <FiCheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{routine}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-gray-600">
              <span className="font-semibold">Duration:</span>{" "}
              {result.dietPlan.duration}
            </p>
          </div>
        </div>

        {/* Recovery Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Recovery Timeline</h2>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">Estimated Duration</span>
              <span className="text-xl font-bold text-blue-600">
                {result.recoveryTimeline.estimatedDuration}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{
                  width: `${result.recoveryTimeline.improvementPercentage}%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Expected improvement:{" "}
              {result.recoveryTimeline.improvementPercentage}%
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Milestones</h3>
            {result.recoveryTimeline.milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 border-l-4 border-blue-500 pl-4"
              >
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                  {milestone.week}
                </div>
                <div>
                  <p className="font-semibold">Week {milestone.week}</p>
                  <p className="text-gray-600 text-sm">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
