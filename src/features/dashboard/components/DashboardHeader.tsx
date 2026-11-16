import { useNavigate } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { SubscriptionExpiryBanner } from "@/features/subscription/components/SubscriptionExpiryBanner";
import { SubscriptionOverviewCard } from "@/features/subscription/components/SubscriptionOverviewCard";
import type { RestaurantStatusData, SubscriptionPlan } from "@/features/subscription/types/subscription.types";

interface DashboardHeaderProps {
  restaurantName?: string;
  restaurantEmail: string;
  statusData?: RestaurantStatusData | null;
  isLoadingStatus: boolean;
  isStatusError: boolean;
  userStatus?: string;
  plans: SubscriptionPlan[];
  onLogout: () => void;
  onOpenRenewal: () => void;
}

export function DashboardHeader({
  restaurantName,
  restaurantEmail,
  statusData,
  isLoadingStatus,
  isStatusError,
  userStatus,
  plans,
  onLogout,
  onOpenRenewal,
}: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
            Restaurant dashboard
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-900">
            {`Welcome, ${restaurantName || restaurantEmail}`}
          </h1>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="self-start sm:self-auto rounded-xl border border-[#eddcd4] px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors"
        >
          Logout
        </button>
      </div>

      <SubscriptionExpiryBanner
        statusData={statusData}
        isLoading={isLoadingStatus}
        isError={isStatusError}
        onRenewClick={onOpenRenewal}
      />

      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/60 p-5">
          <p className="text-xs font-medium text-neutral-500">Account status</p>
          <p className="mt-2 text-xl font-bold text-neutral-900">
            {userStatus ?? statusData?.verificationStatus ?? "Active"}
          </p>
        </div>

        <SubscriptionOverviewCard
          statusData={statusData}
          plans={plans}
          isLoading={isLoadingStatus}
          isError={isStatusError}
          onRenewClick={onOpenRenewal}
          onSubscribeClick={() => navigate(RESTAURANT_ROUTES.SUBSCRIPTION)}
        />
      </div>
    </div>
  );
}
