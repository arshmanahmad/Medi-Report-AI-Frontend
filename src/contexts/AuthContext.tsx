import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import {
  login as apiLogin,
  register as apiRegister,
  AUTH_TOKEN_KEY,
  APP_MODE_KEY,
} from "../services/api";

/** Mirrors backend `demo` user id for preview mode (no JWT). */
export const DEMO_USER: User = {
  id: "demo",
  name: "Demo guest",
  email: "demo@preview.local",
  role: "user",
  createdAt: "",
};
const USER_KEY = "user";

interface AuthContextType {
  user: User | null;
  isDemo: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  enterDemo: () => void;
  exitDemo: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const mode = localStorage.getItem(APP_MODE_KEY);
    const stored = localStorage.getItem(USER_KEY);

    if (token && stored) {
      try {
        setUser(JSON.parse(stored) as User);
        setIsDemo(false);
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    } else if (mode === "demo") {
      setUser(DEMO_USER);
      setIsDemo(true);
    } else {
      setUser(null);
      setIsDemo(false);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: u, token } = await apiLogin(email, password);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    localStorage.removeItem(APP_MODE_KEY);
    setUser(u);
    setIsDemo(false);
    return u;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { user: u, token } = await apiRegister(name, email, password);
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      localStorage.removeItem(APP_MODE_KEY);
      setUser(u);
      setIsDemo(false);
      return u;
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(APP_MODE_KEY);
    setUser(null);
    setIsDemo(false);
  }, []);

  const enterDemo = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(APP_MODE_KEY, "demo");
    setUser(DEMO_USER);
    setIsDemo(true);
  }, []);

  const exitDemo = useCallback(() => {
    localStorage.removeItem(APP_MODE_KEY);
    setUser(null);
    setIsDemo(false);
  }, []);

  const isAuthenticated = Boolean(user && !isDemo);

  return (
    <AuthContext.Provider
      value={{
        user,
        isDemo,
        isAuthenticated,
        login,
        register,
        logout,
        enterDemo,
        exitDemo,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
