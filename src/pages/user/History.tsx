import { useEffect, useState, useMemo, useCallback } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { getHealthHistory } from "../../services/backend";
import type { HealthHistory } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useDataRefresh } from "../../contexts/DataRefreshContext";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiFileText,
  FiArrowRight,
  FiDownload,
} from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function History() {
  const { user } = useAuth();
  const { refreshKey } = useDataRefresh();
  const [history, setHistory] = useState<HealthHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getHealthHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory, refreshKey]);

  // Realtime: refetch when user returns to tab
  useEffect(() => {
    const handler = () => document.visibilityState === "visible" && loadHistory();
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [loadHistory]);

  const riskChartData = useMemo(() => {
    let high = 0,
      moderate = 0,
      low = 0;
    history.forEach((r) => {
      r.predictions.forEach((p) => {
        if (p.riskLevel === "High") high++;
        else if (p.riskLevel === "Moderate") moderate++;
        else low++;
      });
    });
    return [
      { name: "High Risk", value: high, color: "#ef4444" },
      { name: "Moderate Risk", value: moderate, color: "#eab308" },
      { name: "Low Risk", value: low, color: "#22c55e" },
    ].filter((d) => d.value > 0);
  }, [history]);

  const metricsTrend = useMemo(() => {
    return history
      .slice(0, 12)
      .map((r) => ({
        date: new Date(r.testDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        glucose: r.testValues.glucose,
        hemoglobin: r.testValues.hemoglobin,
        creatinine: r.testValues.creatinine,
      }))
      .reverse();
  }, [history]);

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

        {!loading && history.length > 0 && (riskChartData.length > 0 || metricsTrend.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {riskChartData.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Risk Distribution (All Reports)
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={riskChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {riskChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            {metricsTrend.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Metrics Over Time
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={metricsTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="glucose" name="Glucose (mg/dL)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="hemoglobin" name="Hemoglobin (g/dL)" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="creatinine" name="Creatinine (mg/dL)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

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
