/**
 * Frontend config from environment.
 * Set VITE_API_URL in .env to connect to the backend (e.g. http://localhost:4000).
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const IS_BACKEND_CONNECTED = Boolean(import.meta.env.VITE_API_URL);
