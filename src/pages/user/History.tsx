import { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { mockGetHealthHistory } from "../../services/mockApi";
import type { HealthHistory } from "../../types";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiFileText,
  FiArrowRight,
  FiDownload,
} from "react-icons/fi";

export default function History() {
  const [history, setHistory] = useState<HealthHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await mockGetHealthHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Report History
          </h1>
          <p className="text-gray-600">
            View and manage all your past health reports and analyses.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Reports Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first health report analysis.
            </p>
            <Link
              to="/verify-report"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition font-semibold"
            >
              Create First Report
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-primary-lighter rounded-lg p-2">
                        <FiCalendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Report from{" "}
                          {new Date(report.testDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(report.testDate).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="ml-11 space-y-2">
                      <p className="text-gray-600">
                        <span className="font-semibold">
                          {report.predictions.length}
                        </span>{" "}
                        disease predictions analyzed
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {report.predictions.map((pred, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              pred.riskLevel === "High"
                                ? "bg-red-100 text-red-800"
                                : pred.riskLevel === "Moderate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-secondary-lighter text-secondary-dark"
                            }`}
                          >
                            {pred.disease} ({pred.riskLevel})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ml-6">
                    <Link
                      to={`/results?reportId=${report.id}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                    >
                      <span>View Details</span>
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/download-report?reportId=${report.id}`}
                      className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      title="Download Report"
                    >
                      <FiDownload className="w-5 h-5 text-gray-600" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
