import { Navigate } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import {
  FiUsers,
  FiActivity,
  FiCpu,
  FiTrendingUp,
  FiBarChart,
} from "react-icons/fi";

export default function AdminDashboard() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  const stats = {
    totalUsers: 1234,
    totalReports: 5678,
    activeModels: 5,
    accuracy: 94.2,
    todayReports: 45,
    todayUsers: 12,
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of system analytics and management.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-primary">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  +{stats.todayUsers} today
                </p>
              </div>
              <FiUsers className="w-10 h-10 text-primary opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-secondary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                <p className="text-3xl font-bold text-secondary">
                  {stats.totalReports.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  +{stats.todayReports} today
                </p>
              </div>
              <FiActivity className="w-10 h-10 text-secondary opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">ML Models</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.activeModels}
                </p>
                <p className="text-xs text-gray-500 mt-1">All active</p>
              </div>
              <FiCpu className="w-10 h-10 text-purple-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Model Accuracy</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.accuracy}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <FiTrendingUp className="w-3 h-3 inline" /> +2.1% this month
                </p>
              </div>
              <FiBarChart className="w-10 h-10 text-orange-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/admin/users"
                className="block w-full bg-primary text-white text-center py-3 rounded-lg hover:bg-primary-dark transition font-semibold"
              >
                Manage Users
              </a>
              <a
                href="/admin/models"
                className="block w-full bg-secondary text-white text-center py-3 rounded-lg hover:bg-secondary-dark transition font-semibold"
              >
                Manage Models
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Status</span>
                <span className="px-3 py-1 bg-secondary-lighter text-secondary-dark rounded-full text-sm font-semibold">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database</span>
                <span className="px-3 py-1 bg-secondary-lighter text-secondary-dark rounded-full text-sm font-semibold">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">ML Service</span>
                <span className="px-3 py-1 bg-secondary-lighter text-secondary-dark rounded-full text-sm font-semibold">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">New user registered</p>
                <p className="text-sm text-gray-600">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <FiActivity className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">New report generated</p>
                <p className="text-sm text-gray-600">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <FiCpu className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Model updated</p>
                <p className="text-sm text-gray-600">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
