import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import { FiUser, FiMail, FiCalendar } from "react-icons/fi";

export default function ProfileSettings() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">
            Your account comes from the backend API (login / register).
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="mb-6 flex items-center gap-4 border-b border-gray-200 pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <FiUser className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold">{user?.name}</p>
              <p className="text-sm capitalize text-gray-600">{user?.role}</p>
            </div>
          </div>

          <dl className="space-y-4">
            <div>
              <dt className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                <FiMail className="h-4 w-4" />
                Email
              </dt>
              <dd className="rounded-lg bg-gray-50 px-4 py-2 text-gray-900">
                {user?.email}
              </dd>
            </div>
            <div>
              <dt className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                <FiCalendar className="h-4 w-4" />
                Member since
              </dt>
              <dd className="rounded-lg bg-gray-50 px-4 py-2 text-gray-900">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>

          <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Profile editing is not exposed in the API yet. Admins can manage users
            from the admin panel; contact an admin to change your name or email.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
