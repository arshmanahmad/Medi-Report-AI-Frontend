import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [sidebarWidth, setSidebarWidth] = useState(260);

  useEffect(() => {
    // Listen for sidebar collapse state from localStorage or context
    const stored = localStorage.getItem("sidebarCollapsed");
    setSidebarWidth(stored === "true" ? 80 : 260);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main
        className="transition-all duration-300"
        style={{
          marginLeft: "260px", // Default sidebar width
          paddingTop: "var(--header-height)",
          minHeight: "calc(100vh - var(--header-height))",
        }}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
