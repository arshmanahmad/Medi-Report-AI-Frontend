/**
 * Connects to backend using VITE_API_URL from .env.
 * Tries real API first; falls back to mock only when backend is unreachable.
 */
import * as api from "./api";
import * as mockApi from "./mockApi";
import type { MedicalTestInput, PredictionResult, User, HealthHistory } from "../types";

export async function generatePredictions(
  testValues: MedicalTestInput,
  selectedDisease?: string,
  userId?: string
): Promise<PredictionResult> {
  try {
    return await api.getPrediction(testValues, selectedDisease, userId);
  } catch {
    return mockApi.generatePredictions(testValues, selectedDisease, userId);
  }
}

export async function getHealthHistory(userId?: string): Promise<HealthHistory[]> {
  try {
    return await api.getHealthHistory(userId);
  } catch {
    return mockApi.mockGetHealthHistory(userId);
  }
}

export async function getHealthHistoryById(reportId: string, userId?: string): Promise<HealthHistory | null> {
  try {
    return await api.getHealthHistoryById(reportId, userId);
  } catch {
    return mockApi.mockGetHealthHistoryById(reportId);
  }
}

export async function login(email: string, password: string): Promise<User> {
  try {
    return await api.login(email, password);
  } catch {
    return mockApi.mockLogin(email, password);
  }
}

export async function register(name: string, email: string, password: string): Promise<User> {
  try {
    return await api.register(name, email, password);
  } catch {
    return mockApi.mockRegister(name, email, password);
  }
}
