import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LandingHeader from "../../components/Layout/LandingHeader";
import { FiActivity, FiShield, FiFileText, FiTrendingUp } from "react-icons/fi";

export default function Home() {
  const { isAuthenticated, isDemo, user } = useAuth();

  const showHeroCta =
    !isAuthenticated && !isDemo ? (
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          to="/login"
          className="inline-flex min-w-[160px] items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white transition hover:bg-primary-dark"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="inline-flex min-w-[160px] items-center justify-center rounded-lg border-2 border-primary bg-white px-8 py-3 text-lg font-semibold text-primary transition hover:bg-primary-lighter"
        >
          Sign up
        </Link>
      </div>
    ) : (
      <Link
        to={
          user?.role === "admin" ? "/admin/dashboard" : "/dashboard"
        }
        className="inline-block rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white transition hover:bg-primary-dark"
      >
        Go to dashboard
      </Link>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader />
      <main
        className="container mx-auto px-4 pt-[calc(var(--header-height)+1.5rem)] pb-16"
        style={{ minHeight: "100vh" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="py-12 text-center sm:py-16">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
              AI-powered early disease insights
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl">
              Explore lab-based risk guidance and recommendations. Sign in for a
              secure account with JWT-protected APIs, or try a temporary demo
              with no password.
            </p>
            {showHeroCta}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-lighter">
                <FiActivity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">AI analysis</h3>
              <p className="text-gray-600">
                Rule-based and optional ML layers analyze your blood test
                values for disease risk signals.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-lighter">
                <FiShield className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Secure sign-in</h3>
              <p className="text-gray-600">
                Registered users get a signed token on each request. Demo mode
                stays local and temporary.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <FiFileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Reports</h3>
              <p className="text-gray-600">
                Export PDF or Excel with diet plans, medication notes, and
                timelines.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <FiTrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">History</h3>
              <p className="text-gray-600">
                Track trends over time—persisted for signed-in users; demo data
                is isolated per session.
              </p>
            </div>
          </div>

          <div className="mt-16 rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-8 text-center text-3xl font-bold">How it works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="mb-2 text-xl font-semibold">Enter lab values</h3>
                <p className="text-gray-600">
                  Add values from your report (or use reference defaults where
                  needed).
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="mb-2 text-xl font-semibold">Run analysis</h3>
                <p className="text-gray-600">
                  The backend calls the AI service with your authenticated or
                  demo context.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                  3
                </div>
                <h3 className="mb-2 text-xl font-semibold">Get guidance</h3>
                <p className="text-gray-600">
                  Review risk levels, diet ideas, and recovery milestones—always
                  with clinician oversight in real care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
