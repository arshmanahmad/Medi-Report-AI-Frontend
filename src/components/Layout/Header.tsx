import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiUser, FiBell } from "react-icons/fi";

export default function Header() {
  const { user } = useAuth();

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30"
      style={{ height: "var(--header-height)" }}
    >
      <div className="h-full flex items-center justify-between px-6">
        <Link
          to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="text-xl font-bold text-gray-800">
            Medi Report AI
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition">
            <FiBell className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <FiUser className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
