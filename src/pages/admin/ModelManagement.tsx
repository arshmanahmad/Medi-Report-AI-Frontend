import { useState } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import { FiCpu, FiSettings, FiSave, FiPlus } from "react-icons/fi";

interface MLModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  status: "active" | "inactive";
  threshold: {
    low: number;
    moderate: number;
    high: number;
  };
  lastUpdated: string;
}

export default function ModelManagement() {
  const { user } = useAuth();
  const [models, setModels] = useState<MLModel[]>([
    {
      id: "1",
      name: "Random Forest",
      type: "Classification",
      accuracy: 92.5,
      status: "active",
      threshold: { low: 30, moderate: 60, high: 80 },
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      name: "XGBoost",
      type: "Classification",
      accuracy: 94.2,
      status: "active",
      threshold: { low: 30, moderate: 60, high: 80 },
      lastUpdated: "2024-01-20",
    },
    {
      id: "3",
      name: "Logistic Regression",
      type: "Classification",
      accuracy: 89.8,
      status: "active",
      threshold: { low: 30, moderate: 60, high: 80 },
      lastUpdated: "2024-01-10",
    },
  ]);

  const [editingModel, setEditingModel] = useState<MLModel | null>(null);
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [thresholdData, setThresholdData] = useState({
    low: 30,
    moderate: 60,
    high: 80,
  });

  const handleEditThreshold = (model: MLModel) => {
    setEditingModel(model);
    setThresholdData(model.threshold);
    setShowThresholdModal(true);
  };

  const handleSaveThreshold = () => {
    if (editingModel) {
      setModels(
        models.map((m) =>
          m.id === editingModel.id
            ? {
                ...m,
                threshold: thresholdData,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : m
        )
      );
    }
    setShowThresholdModal(false);
    setEditingModel(null);
  };

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const toggleModelStatus = (id: string) => {
    setModels(
      models.map((m) =>
        m.id === id
          ? {
              ...m,
              status: m.status === "active" ? "inactive" : "active",
            }
          : m
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Model Management
          </h1>
          <p className="text-gray-600">
            Manage ML models, update thresholds, and monitor performance.
          </p>
        </div>

        {/* Models Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {models.map((model) => (
            <div
              key={model.id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center">
                    <FiCpu className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{model.name}</h3>
                    <p className="text-sm text-gray-600">{model.type}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    model.status === "active"
                      ? "bg-secondary-lighter text-secondary-dark"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {model.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Accuracy</span>
                    <span className="font-semibold">{model.accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${model.accuracy}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Risk Thresholds</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Low:</span>
                      <span className="font-semibold">
                        &lt; {model.threshold.low}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Moderate:</span>
                      <span className="font-semibold">
                        {model.threshold.low}% - {model.threshold.moderate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>High:</span>
                      <span className="font-semibold">
                        &gt; {model.threshold.moderate}%
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Updated: {new Date(model.lastUpdated).toLocaleDateString()}
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditThreshold(model)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition text-sm font-semibold"
                >
                  <FiSettings className="w-4 h-4" />
                  <span>Edit Thresholds</span>
                </button>
                <button
                  onClick={() => toggleModelStatus(model.id)}
                  className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${
                    model.status === "active"
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-secondary text-white hover:bg-secondary-dark"
                  }`}
                >
                  {model.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Model Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Model</h2>
          <p className="text-gray-600 mb-4">
            Upload and configure a new machine learning model for disease
            prediction.
          </p>
          <button className="flex items-center space-x-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary-dark transition font-semibold">
            <FiPlus className="w-5 h-5" />
            <span>Add New Model</span>
          </button>
        </div>

        {/* Threshold Modal */}
        {showThresholdModal && editingModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">
                Edit Thresholds - {editingModel.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Risk Threshold (%)
                  </label>
                  <input
                    type="number"
                    value={thresholdData.low}
                    onChange={(e) =>
                      setThresholdData({
                        ...thresholdData,
                        low: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moderate Risk Threshold (%)
                  </label>
                  <input
                    type="number"
                    value={thresholdData.moderate}
                    onChange={(e) =>
                      setThresholdData({
                        ...thresholdData,
                        moderate: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    High Risk Threshold (%)
                  </label>
                  <input
                    type="number"
                    value={thresholdData.high}
                    onChange={(e) =>
                      setThresholdData({
                        ...thresholdData,
                        high: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowThresholdModal(false);
                    setEditingModel(null);
                  }}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveThreshold}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
                >
                  <FiSave className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
