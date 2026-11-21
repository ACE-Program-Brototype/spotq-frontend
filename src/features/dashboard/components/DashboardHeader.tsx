import { LogOut, RefreshCw } from "lucide-react";
import { SubscriptionExpiryBanner } from "@/features/subscription/components/SubscriptionExpiryBanner";
import type { RestaurantStatusData, SubscriptionPlan } from "@/features/subscription/types/subscription.types";

interface DashboardHeaderProps {
  restaurantName?: string;
  restaurantEmail: string;
  statusData?: RestaurantStatusData | null;
  isLoadingStatus: boolean;
  isStatusError: boolean;
  userStatus?: string;
  plans?: SubscriptionPlan[];
  onLogout: () => void;
  onOpenRenewal: () => void;
}

export function DashboardHeader({
  restaurantName,
  restaurantEmail,
  statusData,
  isLoadingStatus,
  isStatusError,
  onLogout,
  onOpenRenewal,
}: DashboardHeaderProps) {
  return (
    <div className="rounded-2xl border border-[#eddcd4] bg-white p-3.5 sm:p-5 md:p-6 lg:p-8 shadow-xs">
      {/* Top Row: Welcome + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
            Restaurant dashboard
          </p>
          <h1 className="mt-0.5 md:mt-1 text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900 truncate">
            {`Welcome, ${restaurantName || restaurantEmail}`}
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {statusData?.isSubscriptionActive && (
            <button
              type="button"
              onClick={onOpenRenewal}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#eddcd4] bg-white px-2.5 py-1 md:px-4 md:py-2 text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] hover:text-[#9a3412] transition-colors shadow-2xs shrink-0 cursor-pointer"
            >
              <RefreshCw className="size-3.5 text-[#e8631b]" />
              <span>Renew Subscription</span>
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#eddcd4] bg-white px-2.5 py-1 md:px-4 md:py-2 text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            <LogOut className="size-3.5 text-neutral-500" />
            <span>Logout</span>
          </button>
        </div>
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
