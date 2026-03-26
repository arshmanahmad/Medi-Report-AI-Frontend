import { Navigate } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import { FiCpu, FiFolder, FiTerminal } from "react-icons/fi";

export default function ModelManagement() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">AI service</h1>
        <p className="mb-8 text-gray-600">
          Disease prediction runs in the Python service inside the backend repo,
          not in this admin UI.
        </p>

        <div className="space-y-4">
          <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-lighter">
              <FiFolder className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Location</h2>
              <p className="mt-1 text-sm text-gray-600">
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                  Medi-Report-AI-Backend/ai-services/
                </code>
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Run <code className="rounded bg-gray-100 px-1">python app.py</code>{" "}
                after activating the virtual environment and installing{" "}
                <code className="rounded bg-gray-100 px-1">requirements.txt</code>.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary-lighter">
              <FiCpu className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Engine</h2>
              <p className="mt-1 text-sm text-gray-600">
                Rule-based medical constraints in{" "}
                <code className="rounded bg-gray-100 px-1">prediction.py</code>.
                Optional ML retraining via{" "}
                <code className="rounded bg-gray-100 px-1">train_model.py</code>{" "}
                and labeled rows in{" "}
                <code className="rounded bg-gray-100 px-1">
                  data/training_data.json
                </code>
                .
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <FiTerminal className="h-6 w-6 text-amber-800" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Health checks</h2>
              <p className="mt-1 text-sm text-gray-600">
                Admin Dashboard shows whether the Express API can reach the Python
                service (<code className="rounded bg-gray-100 px-1">GET /api/health/ai</code>
                ).
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
