import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { mockGetHealthHistory } from "../../services/mockApi";
import type {
  HealthHistory,
  PredictionResult,
  MedicalTestInput,
} from "../../types";
import {
  generatePDFReport,
  generateExcelReport,
} from "../../services/reportGenerator";
import { useAuth } from "../../contexts/AuthContext";
import { FiDownload, FiFileText, FiFile } from "react-icons/fi";

export default function DownloadReport() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get("reportId");
  const [history, setHistory] = useState<HealthHistory[]>([]);
  const [selectedReport, setSelectedReport] = useState<HealthHistory | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await mockGetHealthHistory();
        setHistory(data);
        if (reportId) {
          const report = data.find((r) => r.id === reportId);
          if (report) setSelectedReport(report);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [reportId]);

  const handleDownloadPDF = () => {
    if (selectedReport && user) {
      // Convert HealthHistory to PredictionResult format
      const result: PredictionResult = {
        predictions: selectedReport.predictions,
        saltRecommendations: [],
        dietPlan: {
          foodsToEat: [],
          foodsToAvoid: [],
          healthyRoutines: [],
          duration: "4-6 weeks",
        },
        recoveryTimeline: {
          estimatedDuration: "4-6 weeks",
          milestones: [],
          improvementPercentage: 70,
        },
        testDate: selectedReport.testDate,
        userId: user.id,
      };
      generatePDFReport(selectedReport.testValues, result, user.name);
    }
  };

  const handleDownloadExcel = () => {
    if (selectedReport && user) {
      const result: PredictionResult = {
        predictions: selectedReport.predictions,
        saltRecommendations: [],
        dietPlan: {
          foodsToEat: [],
          foodsToAvoid: [],
          healthyRoutines: [],
          duration: "4-6 weeks",
        },
        recoveryTimeline: {
          estimatedDuration: "4-6 weeks",
          milestones: [],
          improvementPercentage: 70,
        },
        testDate: selectedReport.testDate,
        userId: user.id,
      };
      generateExcelReport(selectedReport.testValues, result, user.name);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Download Report
          </h1>
          <p className="text-gray-600">
            Select a report and download it in PDF or Excel format.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Report Selection */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Select Report</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : history.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No reports available
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        selectedReport?.id === report.id
                          ? "border-primary bg-primary-lighter"
                          : "border-gray-200 hover:border-primary hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-semibold text-gray-900">
                        {new Date(report.testDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {report.predictions.length} predictions
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Download Options */}
          <div className="md:col-span-2">
            {selectedReport ? (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">
                    Report from{" "}
                    {new Date(selectedReport.testDate).toLocaleDateString()}
                  </h2>
                  <p className="text-gray-600">
                    {selectedReport.predictions.length} disease predictions
                    analyzed
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Disease Predictions</h3>
                    <div className="space-y-2">
                      {selectedReport.predictions.map((pred, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="font-medium">{pred.disease}</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              pred.riskLevel === "High"
                                ? "bg-red-100 text-red-800"
                                : pred.riskLevel === "Moderate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-secondary-lighter text-secondary-dark"
                            }`}
                          >
                            {pred.riskLevel} Risk (
                            {(pred.probability * 100).toFixed(1)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center space-x-3 bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    <FiFileText className="w-6 h-6" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={handleDownloadExcel}
                    className="flex items-center justify-center space-x-3 bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    <FiFile className="w-6 h-6" />
                    <span>Download Excel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FiDownload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Report Selected
                </h3>
                <p className="text-gray-600">
                  Please select a report from the list to download.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
