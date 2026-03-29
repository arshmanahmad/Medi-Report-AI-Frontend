import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiUser } from "react-icons/fi";

export default function Header() {
  const { user, isDemo } = useAuth();

  return (
    <header
      className="fixed left-0 right-0 top-0 z-30 border-b border-gray-200 bg-white"
      style={{ height: "var(--header-height)" }}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <Link
          to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
          className="flex min-w-0 items-center gap-2 sm:gap-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary sm:h-10 sm:w-10">
            <span className="text-lg font-bold text-white sm:text-xl">M</span>
          </div>
          <span className="truncate text-lg font-bold text-gray-800 sm:text-xl">
            Medi Report AI
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {isDemo && (
            <span className="hidden rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 sm:inline">
              Demo · not saved to your account
            </span>
          )}
          <div className="flex max-w-[200px] items-center gap-2 rounded-lg bg-gray-50 px-2 py-1.5 sm:max-w-none sm:px-3 sm:py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
              <FiUser className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 text-left text-sm">
              <p className="truncate font-medium text-gray-800">{user?.name}</p>
              <p className="truncate text-xs capitalize text-gray-500">
                {isDemo ? "preview" : user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
