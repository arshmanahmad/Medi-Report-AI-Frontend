import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSidebarLayout } from "../../contexts/SidebarLayoutContext";
import {
  FiHome,
  FiFileText,
  FiClock,
  FiActivity,
  FiDownload,
  FiSettings,
  FiUsers,
  FiCpu,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: ("user" | "admin")[];
}

const userNavItems: NavItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: <FiHome className="w-5 h-5 shrink-0" />,
    roles: ["user"],
  },
  {
    path: "/verify-report",
    label: "Verify Report",
    icon: <FiFileText className="w-5 h-5 shrink-0" />,
    roles: ["user"],
  },
  {
    path: "/history",
    label: "History",
    icon: <FiClock className="w-5 h-5 shrink-0" />,
    roles: ["user"],
  },
  {
    path: "/diet-tracking",
    label: "Diet Tracking",
    icon: <FiActivity className="w-5 h-5 shrink-0" />,
    roles: ["user"],
  },
  {
    path: "/download-report",
    label: "Download Report",
    icon: <FiDownload className="w-5 h-5 shrink-0" />,
    roles: ["user"],
  },
  {
    path: "/profile-settings",
    label: "Profile Settings",
    icon: <FiSettings className="w-5 h-5 shrink-0" />,
    roles: ["user"],
  },
];

const adminNavItems: NavItem[] = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: <FiHome className="w-5 h-5 shrink-0" />,
    roles: ["admin"],
  },
  {
    path: "/admin/users",
    label: "Users",
    icon: <FiUsers className="w-5 h-5 shrink-0" />,
    roles: ["admin"],
  },
  {
    path: "/admin/models",
    label: "AI Service",
    icon: <FiCpu className="w-5 h-5 shrink-0" />,
    roles: ["admin"],
  },
];

export default function Sidebar() {
  const { user, logout, isDemo, exitDemo } = useAuth();
  const navigate = useNavigate();
  const {
    collapsed,
    toggleCollapsed,
    sidebarWidth,
    isNarrowScreen,
    effectiveCollapsed,
  } = useSidebarLayout();

  const handleLogout = () => {
    if (isDemo) {
      exitDemo();
      navigate("/");
      return;
    }
    logout();
    navigate("/login");
  };

  const navItems = user?.role === "admin" ? adminNavItems : userNavItems;

  return (
    <aside
      className="fixed left-0 z-40 flex flex-col border-r border-gray-200 bg-white shadow-sm transition-[width] duration-300 ease-in-out"
      style={{
        width: `${sidebarWidth}px`,
        top: "var(--header-height)",
        height: "calc(100vh - var(--header-height))",
      }}
    >
      <div className="flex h-full min-h-0 flex-col">
        <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 pt-2 pb-1">
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin/dashboard" || item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg py-3.5 text-sm transition-colors ${
                      isActive
                        ? "bg-primary-lighter font-semibold text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${effectiveCollapsed ? "justify-center px-2" : "px-3"}`
                  }
                  title={effectiveCollapsed ? item.label : undefined}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center [&>svg]:block">
                    {item.icon}
                  </span>
                  {!effectiveCollapsed && <span className="min-w-0 truncate">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 space-y-1 border-t border-gray-200 p-2">
          {!isNarrowScreen && (
            <button
              type="button"
              onClick={toggleCollapsed}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-600 transition-colors hover:bg-gray-100 ${
                collapsed ? "justify-center px-2" : ""
              }`}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <FiChevronRight className="h-5 w-5 shrink-0" />
              ) : (
                <FiChevronLeft className="h-5 w-5 shrink-0" />
              )}
              {!collapsed && <span className="truncate">Collapse</span>}
            </button>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-600 transition-colors hover:bg-red-50 ${
              effectiveCollapsed ? "justify-center px-2" : ""
            }`}
            title={effectiveCollapsed ? (isDemo ? "Exit demo" : "Logout") : undefined}
          >
            <FiLogOut className="h-5 w-5 shrink-0" />
            {!effectiveCollapsed && <span>{isDemo ? "Exit demo" : "Logout"}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
