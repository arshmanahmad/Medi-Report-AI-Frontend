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

/** Matches Tailwind `md` (768px): at this width and below, sidebar stays narrow. */
const NARROW_MEDIA_QUERY = "(max-width: 767px)";

type SidebarLayoutContextType = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggleCollapsed: () => void;
  /** True when the viewport is narrow; sidebar is forced to collapsed width. */
  isNarrowScreen: boolean;
  /** User preference OR narrow screen — use for icon-only vs labels. */
  effectiveCollapsed: boolean;
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

  const [isNarrowScreen, setIsNarrowScreen] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(NARROW_MEDIA_QUERY).matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia(NARROW_MEDIA_QUERY);
    const onChange = () => setIsNarrowScreen(mq.matches);
    setIsNarrowScreen(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const effectiveCollapsed = collapsed || isNarrowScreen;
  const sidebarWidth = effectiveCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

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
        isNarrowScreen,
        effectiveCollapsed,
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
