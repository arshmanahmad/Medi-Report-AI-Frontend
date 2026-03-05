import axios from "axios";
import { API_BASE_URL } from "../config";
import type {
  MedicalTestInput,
  PredictionResult,
  User,
  HealthHistory,
} from "../types";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

export async function getPrediction(
  testValues: MedicalTestInput,
  selectedDisease?: string,
  userId?: string
): Promise<PredictionResult> {
  const { data } = await api.post<PredictionResult>("/api/predict", {
    testValues,
    selectedDisease: selectedDisease || undefined,
    userId: userId || undefined,
  });
  return data;
}

export async function getHealthHistory(userId?: string): Promise<HealthHistory[]> {
  const { data } = await api.get<HealthHistory[]>("/api/history", {
    params: { userId: userId || "default" },
  });
  return data;
}

export async function getHealthHistoryById(
  reportId: string,
  userId?: string
): Promise<HealthHistory | null> {
  try {
    const { data } = await api.get<HealthHistory>(`/api/history/${reportId}`, {
      params: { userId: userId || "default" },
    });
    return data;
  } catch {
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<User> {
  const { data } = await api.post<User>("/api/auth/login", { email, password });
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const { data } = await api.post<User>("/api/auth/register", {
    name,
    email,
    password,
  });
  return data;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const { status } = await api.get("/api/health");
    return status === 200;
  } catch {
    return false;
  }
}
