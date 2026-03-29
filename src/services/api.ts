import axios, { type AxiosError } from "axios";
import { API_BASE_URL } from "../config";
import type {
  MedicalTestInput,
  PredictionResult,
  User,
  HealthHistory,
} from "../types";

/** Persisted JWT (signed-in users only). */
export const AUTH_TOKEN_KEY = "auth_token";
/** When set to `demo`, requests use X-Demo-Mode (no JWT). */
export const APP_MODE_KEY = "app_mode";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const mode = localStorage.getItem(APP_MODE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    delete config.headers["X-Demo-Mode"];
  } else if (mode === "demo") {
    config.headers["X-Demo-Mode"] = "true";
  }
  return config;
});

export type AuthResponse = {
  user: User;
  token: string;
};

export function getApiErrorMessage(err: unknown, fallback: string): string {
  const ax = err as AxiosError<{ error?: string; details?: string }>;
  const msg =
    ax.response?.data?.error ||
    ax.response?.data?.details ||
    ax.message;
  return typeof msg === "string" && msg ? msg : fallback;
}

export async function getPrediction(
  testValues: MedicalTestInput,
  selectedDisease?: string
): Promise<PredictionResult> {
  const { data } = await api.post<PredictionResult>("/api/predict", {
    testValues,
    selectedDisease: selectedDisease || undefined,
  });
  return data;
}

export async function getHealthHistory(): Promise<HealthHistory[]> {
  const { data } = await api.get<HealthHistory[]>("/api/history");
  return data;
}

export async function getHealthHistoryById(
  reportId: string
): Promise<HealthHistory | null> {
  try {
    const { data } = await api.get<HealthHistory>(`/api/history/${reportId}`);
    return data;
  } catch {
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/register", {
    name,
    email,
    password,
  });
  return data;
}

export type AdminStats = {
  totalUsers: number;
  totalAdmins: number;
  totalReports: number;
  activeModels: number;
  aiServiceNote?: string;
};

export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>("/api/admin/stats");
  return data;
}

export async function getAdminUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>("/api/admin/users");
  return data;
}

export async function createAdminUser(body: {
  name: string;
  email: string;
  role?: "user" | "admin";
}): Promise<User> {
  const { data } = await api.post<User>("/api/admin/users", body);
  return data;
}

export async function updateAdminUser(
  id: string,
  body: Partial<{ name: string; email: string; role: "user" | "admin" }>
): Promise<User> {
  const { data } = await api.patch<User>(`/api/admin/users/${id}`, body);
  return data;
}

export async function deleteAdminUser(id: string): Promise<void> {
  await api.delete(`/api/admin/users/${id}`);
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const { status } = await api.get("/api/health");
    return status === 200;
  } catch {
    return false;
  }
}

export async function checkAiServiceHealth(): Promise<boolean> {
  try {
    const { data } = await api.get<{ aiService?: string }>("/api/health/ai");
    return data.aiService === "connected";
  } catch {
    return false;
  }
}
