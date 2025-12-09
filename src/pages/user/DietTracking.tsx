import { useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { FiCheckCircle, FiClock, FiXCircle, FiPlus } from "react-icons/fi";

interface DietEntry {
  id: string;
  type: "medicine" | "diet";
  name: string;
  time: string;
  status: "pending" | "completed" | "skipped";
  date: string;
}

export default function DietTracking() {
  const [entries, setEntries] = useState<DietEntry[]>([
    {
      id: "1",
      type: "medicine",
      name: "Metformin 500mg",
      time: "08:00",
      status: "completed",
      date: new Date().toISOString().split("T")[0],
    },
    {
      id: "2",
      type: "diet",
      name: "Breakfast",
      time: "08:30",
      status: "completed",
      date: new Date().toISOString().split("T")[0],
    },
    {
      id: "3",
      type: "medicine",
      name: "Aspirin 75mg",
      time: "12:00",
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    },
    {
      id: "4",
      type: "diet",
      name: "Lunch",
      time: "13:00",
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: "medicine" as "medicine" | "diet",
    name: "",
    time: "",
  });

  const updateStatus = (id: string, status: "completed" | "skipped") => {
    setEntries(
      entries.map((entry) => (entry.id === id ? { ...entry, status } : entry))
    );
  };

  const addEntry = () => {
    if (newEntry.name && newEntry.time) {
      const entry: DietEntry = {
        id: Date.now().toString(),
        ...newEntry,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
      };
      setEntries([...entries, entry]);
      setNewEntry({ type: "medicine", name: "", time: "" });
      setShowAddModal(false);
    }
  };

  const todayEntries = entries.filter(
    (entry) => entry.date === new Date().toISOString().split("T")[0]
  );
  const completedCount = todayEntries.filter(
    (e) => e.status === "completed"
  ).length;
  const totalCount = todayEntries.length;
  const completionRate =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Diet & Medicine Tracking
          </h1>
          <p className="text-gray-600">
            Track your daily medicine intake and diet to monitor your health
            progress.
          </p>
        </div>

        {/* Progress Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Progress</p>
                <p className="text-3xl font-bold text-primary">
                  {completedCount}/{totalCount}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent transform -rotate-90">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {completionRate.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-secondary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-secondary">
                  {completedCount}
                </p>
              </div>
              <FiCheckCircle className="w-10 h-10 text-secondary opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {totalCount - completedCount}
                </p>
              </div>
              <FiClock className="w-10 h-10 text-yellow-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Add Entry Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition font-semibold"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Entry</span>
          </button>
        </div>

        {/* Entries List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Today's Schedule</h2>
          {todayEntries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No entries for today.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="text-primary hover:text-primary-dark font-semibold"
              >
                Add your first entry
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {todayEntries
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((entry) => (
                  <div
                    key={entry.id}
                    className={`border-2 rounded-lg p-4 transition ${
                      entry.status === "completed"
                        ? "border-secondary bg-secondary-lighter"
                        : entry.status === "skipped"
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            entry.type === "medicine"
                              ? "bg-primary-lighter"
                              : "bg-secondary-lighter"
                          }`}
                        >
                          {entry.type === "medicine" ? (
                            <span className="text-primary font-bold text-lg">
                              💊
                            </span>
                          ) : (
                            <span className="text-secondary font-bold text-lg">
                              🍽️
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {entry.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FiClock className="w-4 h-4" />
                            <span>{entry.time}</span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">{entry.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {entry.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateStatus(entry.id, "completed")
                              }
                              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition font-semibold flex items-center space-x-2"
                            >
                              <FiCheckCircle className="w-4 h-4" />
                              <span>Complete</span>
                            </button>
                            <button
                              onClick={() => updateStatus(entry.id, "skipped")}
                              className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold flex items-center space-x-2"
                            >
                              <FiXCircle className="w-4 h-4" />
                              <span>Skip</span>
                            </button>
                          </>
                        )}
                        {entry.status === "completed" && (
                          <div className="flex items-center space-x-2 text-secondary">
                            <FiCheckCircle className="w-5 h-5" />
                            <span className="font-semibold">Completed</span>
                          </div>
                        )}
                        {entry.status === "skipped" && (
                          <div className="flex items-center space-x-2 text-red-600">
                            <FiXCircle className="w-5 h-5" />
                            <span className="font-semibold">Skipped</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Add New Entry</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newEntry.type}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        type: e.target.value as "medicine" | "diet",
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="medicine">Medicine</option>
                    <option value="diet">Diet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newEntry.name}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, name: e.target.value })
                    }
                    placeholder="e.g., Metformin 500mg or Breakfast"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newEntry.time}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, time: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewEntry({ type: "medicine", name: "", time: "" });
                  }}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addEntry}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
                >
                  Add Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
