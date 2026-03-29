import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function LandingHeader() {
  const navigate = useNavigate();
  const { enterDemo, isAuthenticated, isDemo, user } = useAuth();

  const handleDemo = () => {
    enterDemo();
    navigate("/dashboard");
  };

  const dashboardPath =
    user?.role === "admin" ? "/admin/dashboard" : "/dashboard";

  return (
    <header
      className="fixed left-0 right-0 top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur"
      style={{ height: "var(--header-height)" }}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary sm:h-10 sm:w-10">
            <span className="text-lg font-bold text-white sm:text-xl">M</span>
          </div>
          <span className="truncate text-lg font-bold text-gray-800 sm:text-xl">
            Medi Report AI
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated || isDemo ? (
            <Link
              to={dashboardPath}
              className="rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark sm:px-5"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:px-5"
              >
                Login
              </Link>
              <button
                type="button"
                onClick={handleDemo}
                className="rounded-lg border-2 border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-lighter sm:px-5"
              >
                Get a demo
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
