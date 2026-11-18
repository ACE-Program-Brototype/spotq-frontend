import { LogOut } from "lucide-react";
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
    <div className="rounded-2xl border border-[#eddcd4] bg-white p-3.5 sm:p-5 md:p-6 lg:p-8 shadow-xs">
      {/* Top Row: Welcome + Logout */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
            Restaurant dashboard
          </p>
          <h1 className="mt-0.5 md:mt-1 text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900 truncate">
            {`Welcome, ${restaurantName || restaurantEmail}`}
          </h1>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#eddcd4] bg-white px-2.5 py-1 md:px-4 md:py-2 text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors shadow-2xs shrink-0"
        >
          <LogOut className="size-3.5 text-neutral-500" />
          <span>Logout</span>
        </button>
      </div>

      {/* Status & Subscription Section */}
      {/* On mobile (<md): single compact horizontal line. On desktop (md+): normal 2-card grid */}
      <div className="mt-2.5 md:mt-4.5 pt-2.5 md:pt-0 border-t md:border-0 border-[#eddcd4]/70 flex flex-wrap md:grid md:grid-cols-2 items-center md:items-stretch gap-1.5 sm:gap-2 md:gap-3">
        {/* Card 1: Account Status */}
        <div className="inline-flex md:flex md:flex-col md:justify-center items-center md:items-start gap-1.5 md:gap-0 rounded-xl border border-emerald-200 md:border-[#eddcd4] bg-emerald-50 md:bg-[#faf7f5]/60 px-2.5 py-1 md:p-4 text-xs font-semibold text-emerald-800 md:text-neutral-900 shrink-0 md:shrink">
          <span className="size-1.5 rounded-full bg-emerald-500 md:hidden" />
          <p className="hidden md:block text-xs font-medium text-neutral-500">Account status</p>
          <p className="md:mt-1 md:text-xl md:font-bold">
            {userStatus ?? statusData?.verificationStatus ?? "Active"}
          </p>
        </div>

        {/* Card 2: Subscription Card */}
        <SubscriptionOverviewCard
          statusData={statusData}
          plans={plans}
          isLoading={isLoadingStatus}
          isError={isStatusError}
          onRenewClick={onOpenRenewal}
          onSubscribeClick={() => navigate(RESTAURANT_ROUTES.SUBSCRIPTION)}
        />
      </div>

      <SubscriptionExpiryBanner
        statusData={statusData}
        isLoading={isLoadingStatus}
        isError={isStatusError}
        onRenewClick={onOpenRenewal}
      />
    </div>
  );
}
