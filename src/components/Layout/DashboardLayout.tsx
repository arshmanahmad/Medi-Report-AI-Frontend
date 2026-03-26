import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { SidebarLayoutProvider, useSidebarLayout } from "../../contexts/SidebarLayoutContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardShell({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const { sidebarWidth } = useSidebarLayout();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main
        className="transition-[margin-left] duration-300 ease-in-out"
        style={{
          marginLeft: `${sidebarWidth}px`,
          paddingTop: "var(--header-height)",
          minHeight: "calc(100vh - var(--header-height))",
        }}
      >
        <div className="p-6 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarLayoutProvider>
      <DashboardShell>{children}</DashboardShell>
    </SidebarLayoutProvider>
  );
}
