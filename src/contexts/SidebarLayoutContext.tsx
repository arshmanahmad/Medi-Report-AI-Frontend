import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

const STORAGE_KEY = "medi-sidebar-collapsed";

const COLLAPSED_WIDTH = 80;
const EXPANDED_WIDTH = 256;

type SidebarLayoutContextType = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggleCollapsed: () => void;
  sidebarWidth: number;
};

const SidebarLayoutContext = createContext<SidebarLayoutContextType | undefined>(
  undefined
);

export function SidebarLayoutProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  return (
    <SidebarLayoutContext.Provider
      value={{
        collapsed,
        setCollapsed,
        toggleCollapsed,
        sidebarWidth,
      }}
    >
      {children}
    </SidebarLayoutContext.Provider>
  );
}

export function useSidebarLayout() {
  const ctx = useContext(SidebarLayoutContext);
  if (!ctx) {
    throw new Error("useSidebarLayout must be used within SidebarLayoutProvider");
  }
  return ctx;
}
