import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataRefreshProvider } from "./contexts/DataRefreshContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/auth/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Results from "./pages/Results";
// User Pages
import UserDashboard from "./pages/user/Dashboard";
import VerifyReport from "./pages/user/VerifyReport";
import History from "./pages/user/History";
import DietTracking from "./pages/user/DietTracking";
import DownloadReport from "./pages/user/DownloadReport";
import ProfileSettings from "./pages/user/ProfileSettings";
// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import ModelManagement from "./pages/admin/ModelManagement";
function App() {
  return (
    <AuthProvider>
      <DataRefreshProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-report"
            element={
              <ProtectedRoute>
                <VerifyReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diet-tracking"
            element={
              <ProtectedRoute>
                <DietTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/download-report"
            element={
              <ProtectedRoute>
                <DownloadReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-settings"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes — JWT only; demo cannot access */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/models"
            element={
              <AdminRoute>
                <ModelManagement />
              </AdminRoute>
            }
          />

          {/* Legacy routes - redirect to new routes */}
          <Route
            path="/input"
            element={<Navigate to="/verify-report" replace />}
          />
          <Route
            path="/profile"
            element={<Navigate to="/profile-settings" replace />}
          />
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </DataRefreshProvider>
    </AuthProvider>
  );
}
export default App;
