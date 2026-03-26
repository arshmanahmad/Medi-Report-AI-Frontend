/**
 * Backend-only integration. All calls use VITE_API_URL (see .env).
 * Ensure Medi-Report-AI-Backend and ai-services are running.
 */
export {
  getPrediction as generatePredictions,
  getHealthHistory,
  getHealthHistoryById,
  login,
  register,
  getAdminStats,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getApiErrorMessage,
} from "./api";
