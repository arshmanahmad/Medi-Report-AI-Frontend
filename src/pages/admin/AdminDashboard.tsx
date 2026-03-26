import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import {
  getAdminStats,
  checkBackendHealth,
  checkAiServiceHealth,
  getApiErrorMessage,
  type AdminStats,
} from "../../services/api";
import {
  FiUsers,
  FiActivity,
  FiCpu,
  FiShield,
} from "react-icons/fi";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [backendOk, setBackendOk] = useState(false);
  const [aiOk, setAiOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [s, b, a] = await Promise.all([
          getAdminStats(),
          checkBackendHealth(),
          checkAiServiceHealth(),
        ]);
        if (!cancelled) {
          setStats(s);
          setBackendOk(b);
          setAiOk(a);
        }
      } catch (e) {
        if (!cancelled) {
          setError(getApiErrorMessage(e, "Could not load admin data."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Live metrics from the API and service health.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        ) : stats ? (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Users (role: user)</p>
                    <p className="text-3xl font-bold text-primary">
                      {stats.totalUsers}
                    </p>
                  </div>
                  <FiUsers className="h-10 w-10 text-primary opacity-50" />
                </div>
              </div>

              <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Total reports</p>
                    <p className="text-3xl font-bold text-secondary">
                      {stats.totalReports}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Saved predictions in server memory
                    </p>
                  </div>
                  <FiActivity className="h-10 w-10 text-secondary opacity-50" />
                </div>
              </div>

              <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Admins</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {stats.totalAdmins}
                    </p>
                  </div>
                  <FiShield className="h-10 w-10 text-purple-500 opacity-50" />
                </div>
              </div>

              <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">AI engines</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {stats.activeModels}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {stats.aiServiceNote}
                    </p>
                  </div>
                  <FiCpu className="h-10 w-10 text-orange-500 opacity-50" />
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-semibold">Quick actions</h2>
                <div className="space-y-3">
                  <Link
                    to="/admin/users"
                    className="block w-full rounded-lg bg-primary py-3 text-center font-semibold text-white transition hover:bg-primary-dark"
                  >
                    Manage users
                  </Link>
                  <Link
                    to="/admin/models"
                    className="block w-full rounded-lg bg-secondary py-3 text-center font-semibold text-white transition hover:bg-secondary-dark"
                  >
                    AI service info
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-semibold">Service status</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Express API</span>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        backendOk
                          ? "bg-secondary-lighter text-secondary-dark"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {backendOk ? "Reachable" : "Unreachable"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Python AI service</span>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        aiOk
                          ? "bg-secondary-lighter text-secondary-dark"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {aiOk ? "Connected" : "Not connected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
