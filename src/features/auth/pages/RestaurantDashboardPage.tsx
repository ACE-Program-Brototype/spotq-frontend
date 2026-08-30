import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function RestaurantDashboardPage() {
  const navigate = useNavigate();
  const { user, accessToken, refreshToken } = useAuthStore();

  return (
    <div className="min-h-screen bg-neutral-100 px-6 py-12 text-neutral-900">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Restaurant dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Welcome back{user?.email ? `, ${user.email}` : ""}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate("/restaurant/email/verification", { replace: false })}
            className="rounded-lg border border-neutral-300 px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Back to email
          </button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="text-sm text-neutral-500">Account status</p>
            <p className="mt-2 text-xl font-semibold text-neutral-900">Active</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="text-sm text-neutral-500">Role</p>
            <p className="mt-2 text-xl font-semibold text-neutral-900">
              {user?.role ?? "RESTAURANT_ADMIN"}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
          <p className="text-sm text-neutral-500">Access token</p>
          <p className="mt-2 break-all font-mono text-xs text-neutral-700">
            {accessToken ?? "Not available"}
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
          <p className="text-sm text-neutral-500">Refresh token</p>
          <p className="mt-2 break-all font-mono text-xs text-neutral-700">
            {refreshToken ?? "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
}
