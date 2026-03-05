import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type DataRefreshContextType = {
  /** Incremented when history/data should be refetched (e.g. after new prediction). */
  refreshKey: number;
  /** Call after mutations so Dashboard/History refetch in real time. */
  triggerRefresh: () => void;
};

const DataRefreshContext = createContext<DataRefreshContextType | undefined>(
  undefined
);

export function DataRefreshProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <DataRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </DataRefreshContext.Provider>
  );
}

export function useDataRefresh() {
  const ctx = useContext(DataRefreshContext);
  if (ctx === undefined) {
    throw new Error("useDataRefresh must be used within DataRefreshProvider");
  }
  return ctx;
}
