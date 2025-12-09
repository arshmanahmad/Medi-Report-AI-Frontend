import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
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
  FiMenu,
} from "react-icons/fi";
import { useState } from "react";

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
    icon: <FiHome className="w-5 h-5" />,
    roles: ["user"],
  },
  {
    path: "/verify-report",
    label: "Verify Report",
    icon: <FiFileText className="w-5 h-5" />,
    roles: ["user"],
  },
  {
    path: "/history",
    label: "History",
    icon: <FiClock className="w-5 h-5" />,
    roles: ["user"],
  },
  {
    path: "/diet-tracking",
    label: "Diet Tracking",
    icon: <FiActivity className="w-5 h-5" />,
    roles: ["user"],
  },
  {
    path: "/download-report",
    label: "Download Report",
    icon: <FiDownload className="w-5 h-5" />,
    roles: ["user"],
  },
  {
    path: "/profile-settings",
    label: "Profile Settings",
    icon: <FiSettings className="w-5 h-5" />,
    roles: ["user"],
  },
];

const adminNavItems: NavItem[] = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: <FiHome className="w-5 h-5" />,
    roles: ["admin"],
  },
  {
    path: "/admin/users",
    label: "Users",
    icon: <FiUsers className="w-5 h-5" />,
    roles: ["admin"],
  },
  {
    path: "/admin/models",
    label: "Model Management",
    icon: <FiCpu className="w-5 h-5" />,
    roles: ["admin"],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = user?.role === "admin" ? adminNavItems : userNavItems;

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
      style={{
        paddingTop: "var(--header-height)",
        height: "100vh",
      }}
    >
      <div className="h-full flex flex-col relative">
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 bg-primary text-white rounded-full p-1.5 shadow-lg hover:bg-primary-dark transition z-50 flex items-center justify-center"
          style={{
            top: `calc(var(--header-height) + 20px)`,
            transform: "translateY(0)",
          }}
        >
          <FiMenu className="w-4 h-4" />
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary-lighter text-primary font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${isCollapsed ? "justify-center" : ""}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <FiLogOut className="w-5 h-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
