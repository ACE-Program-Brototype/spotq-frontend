import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function RestaurantDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const restaurantEmail = user?.email || "restaurant";

  return (
    <div className="space-y-6 max-w-full">
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
              Restaurant dashboard
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-900">
              Welcome, {restaurantEmail}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate("/restaurant/email/verification", { replace: false })}
            className="self-start sm:self-auto rounded-xl border border-[#eddcd4] px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors"
          >
            Back to email
          </button>
        </div>

        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/60 p-5">
            <p className="text-xs font-medium text-neutral-500">Account status</p>
            <p className="mt-2 text-xl font-bold text-neutral-900">Active</p>
          </div>
          <div className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/60 p-5">
            <p className="text-xs font-medium text-neutral-500">Role</p>
            <p className="mt-2 text-xl font-bold text-neutral-900">
              {user?.role ?? "RESTAURANT_ADMIN"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
