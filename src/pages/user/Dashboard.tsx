import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import { useDataRefresh } from "../../contexts/DataRefreshContext";
import { useEffect, useState, useMemo, useCallback } from "react";
import { getHealthHistory } from "../../services/backend";
import type { HealthHistory } from "../../types";
import { Link } from "react-router-dom";
import {
  FiActivity,
  FiTrendingUp,
  FiFileText,
  FiAlertCircle,
  FiArrowRight,
} from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function UserDashboard() {
  const { user } = useAuth();
  const { refreshKey } = useDataRefresh();
  const [history, setHistory] = useState<HealthHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    highRiskCount: 0,
    moderateRiskCount: 0,
    lowRiskCount: 0,
  });

  const loadData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      setHistory([]);
      setStats({
        totalReports: 0,
        highRiskCount: 0,
        moderateRiskCount: 0,
        lowRiskCount: 0,
      });
      return;
    }
    setLoading(true);
    try {
      const data = await getHealthHistory(user.id);
      setHistory(data);

      let highRisk = 0;
      let moderateRisk = 0;
      let lowRisk = 0;
      data.forEach((report) => {
        report.predictions.forEach((pred) => {
          if (pred.riskLevel === "High") highRisk++;
          else if (pred.riskLevel === "Moderate") moderateRisk++;
          else lowRisk++;
        });
      });

      setStats({
        totalReports: data.length,
        highRiskCount: highRisk,
        moderateRiskCount: moderateRisk,
        lowRiskCount: lowRisk,
      });
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData, refreshKey]);

  useEffect(() => {
    const onFocus = () => loadData();
    const handler = () => document.visibilityState === "visible" && onFocus();
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [loadData]);

  const riskChartData = useMemo(() => {
    return [
      { name: "High Risk", value: stats.highRiskCount, color: "#ef4444" },
      { name: "Moderate Risk", value: stats.moderateRiskCount, color: "#eab308" },
      { name: "Low Risk", value: stats.lowRiskCount, color: "#22c55e" },
    ].filter((d) => d.value > 0);
  }, [stats.highRiskCount, stats.moderateRiskCount, stats.lowRiskCount]);

  const reportsByDate = useMemo(() => {
    return history
      .slice(0, 10)
      .map((r) => ({
        date: new Date(r.testDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "2-digit",
        }),
        reports: 1,
        highRisk: r.predictions.filter((p) => p.riskLevel === "High").length,
      }))
      .reverse();
  }, [history]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your health analytics and recent activity.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                <p className="text-3xl font-bold text-primary">
                  {stats.totalReports}
                </p>
              </div>
              <FiFileText className="w-10 h-10 text-primary opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">High Risk</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.highRiskCount}
                </p>
              </div>
              <FiAlertCircle className="w-10 h-10 text-red-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Moderate Risk</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.moderateRiskCount}
                </p>
              </div>
              <FiTrendingUp className="w-10 h-10 text-yellow-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-secondary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Low Risk</p>
                <p className="text-3xl font-bold text-secondary">
                  {stats.lowRiskCount}
                </p>
              </div>
              <FiActivity className="w-10 h-10 text-secondary opacity-50" />
            </div>
          </div>
        </div>

        {/* Charts */}
        {!loading && history.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {riskChartData.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Risk Distribution
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
                      {riskChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            {reportsByDate.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Reports Overview
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={reportsByDate} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="highRisk" name="High risk findings" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/verify-report"
            className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <FiFileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Verify Report</h3>
                <p className="text-white text-opacity-90 text-sm">
                  Analyze your test values
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/history"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-secondary-lighter rounded-lg p-3">
                <FiActivity className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">View History</h3>
                <p className="text-gray-600 text-sm">Past reports</p>
              </div>
            </div>
          </Link>

          <Link
            to="/diet-tracking"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary-lighter rounded-lg p-3">
                <FiTrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Diet Tracking</h3>
                <p className="text-gray-600 text-sm">Track your progress</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Reports</h2>
            <Link
              to="/history"
              className="text-primary hover:text-primary-dark flex items-center space-x-1"
            >
              <span>View All</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                No reports yet. Start your first analysis!
              </p>
              <Link
                to="/verify-report"
                className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
              >
                Create First Report
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {history.slice(0, 5).map((report) => (
                <Link
                  key={report.id}
                  to={`/results?reportId=${report.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Report from{" "}
                        {new Date(report.testDate).toLocaleDateString()}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {report.predictions.length} disease predictions
                      </p>
                    </div>
                    <FiArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
