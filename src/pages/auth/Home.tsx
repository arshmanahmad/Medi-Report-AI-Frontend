import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiActivity, FiShield, FiFileText, FiTrendingUp } from "react-icons/fi";
import Layout from "../../components/Layout/Layout";

export default function Home() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI-Powered Early Disease Prediction
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Understand your medical test results instantly. Get personalized
            health insights, recommendations, and early disease predictions
            powered by advanced machine learning.
          </p>
          {!user ? (
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold border-2 border-primary hover:bg-primary-lighter transition"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Link
              to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center mb-4">
              <FiActivity className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-600">
              Advanced ML models analyze your blood test values to predict
              disease risks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-secondary-lighter rounded-lg flex items-center justify-center mb-4">
              <FiShield className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Risk Assessment</h3>
            <p className="text-gray-600">
              Get clear Low, Moderate, or High risk levels for common diseases.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FiFileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Reports</h3>
            <p className="text-gray-600">
              Download detailed PDF or Excel reports with recommendations and
              diet plans.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <FiTrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Health Tracking</h3>
            <p className="text-gray-600">
              Monitor your health over time with detailed history and progress
              tracking.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Test Values</h3>
              <p className="text-gray-600">
                Input your blood test results including glucose, hemoglobin,
                liver enzymes, and more.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our machine learning models analyze your values and predict
                disease risks.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Get Recommendations
              </h3>
              <p className="text-gray-600">
                Receive personalized diet plans, medication suggestions, and
                recovery timelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
