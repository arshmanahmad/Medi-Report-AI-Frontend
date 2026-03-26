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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { collapsed, toggleCollapsed, sidebarWidth } = useSidebarLayout();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = user?.role === "admin" ? adminNavItems : userNavItems;

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex flex-col border-r border-gray-200 bg-white shadow-sm transition-[width] duration-300 ease-in-out"
      style={{
        width: `${sidebarWidth}px`,
        paddingTop: "var(--header-height)",
        height: "100vh",
      }}
    >
      <div className="flex h-full flex-col">
        <button
          type="button"
          onClick={toggleCollapsed}
          className="absolute right-0 top-[calc(var(--header-height)+12px)] z-50 flex h-8 w-8 translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition hover:bg-primary hover:text-white hover:border-primary"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <FiChevronRight className="h-4 w-4" />
          ) : (
            <FiChevronLeft className="h-4 w-4" />
          )}
        </button>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin/dashboard" || item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-primary-lighter font-semibold text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${collapsed ? "justify-center px-2" : ""}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-gray-200 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "Logout" : undefined}
          >
            <FiLogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
