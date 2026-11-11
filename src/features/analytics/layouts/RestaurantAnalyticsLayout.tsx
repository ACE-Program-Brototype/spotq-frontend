import { AlertCircle } from "lucide-react";
import { Outlet, useOutletContext } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { AnalyticsFilterToolbar } from "../components/common/AnalyticsFilterToolbar";
import { AnalyticsHeader } from "../components/common/AnalyticsHeader";
import { AnalyticsSkeleton } from "../components/common/AnalyticsSkeleton";
import { AnalyticsTabNav } from "../components/common/AnalyticsTabNav";
import { useAnalyticsFilters } from "../hooks/use-analytics-filters";
import { useRestaurantAnalytics } from "../hooks/use-restaurant-analytics";
import type { RestaurantAnalyticsDashboardResponseDto } from "../types/restaurant-analytics.types";

export interface RestaurantAnalyticsContextType {
  data: RestaurantAnalyticsDashboardResponseDto | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  filters: ReturnType<typeof useAnalyticsFilters>;
}

export function useRestaurantAnalyticsContext(): RestaurantAnalyticsContextType {
  return useOutletContext<RestaurantAnalyticsContextType>();
}

export default function RestaurantAnalyticsLayout() {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";
  const restaurantName = user?.name || "Restaurant";

  const filters = useAnalyticsFilters();
  const { data, isLoading, isFetching, isError, refetch } = useRestaurantAnalytics(
    restaurantId,
    filters.queryParams,
  );

  if (!restaurantId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 sm:p-8 text-center space-y-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800 mx-auto">
          <AlertCircle className="size-6" />
        </div>
        <h2 className="text-lg font-bold text-neutral-900">Restaurant Context Required</h2>
        <p className="text-xs text-neutral-600 max-w-md mx-auto">
          No active restaurant was found linked to your account. Please ensure you are logged into a
          verified restaurant account.
        </p>
      </div>
    );
  }

  const contextValue: RestaurantAnalyticsContextType = {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
    filters,
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* 1. Header with Live Status & Refresh */}
      <AnalyticsHeader
        restaurantName={restaurantName}
        generatedAt={data?.generatedAt}
        isFetching={isFetching}
        onRefresh={() => refetch()}
      />

      {/* 2. Top-level View Navigation Tabs */}
      <AnalyticsTabNav />

      {/* 3. Global Strict Filter Toolbar */}
      <AnalyticsFilterToolbar
        interval={filters.interval}
        day={filters.day}
        month={filters.month}
        year={filters.year}
        status={filters.status}
        onIntervalChange={filters.setInterval}
        onDayChange={filters.setDay}
        onMonthChange={filters.setMonth}
        onYearChange={filters.setYear}
        onStatusChange={filters.setStatus}
        onReset={filters.resetFilters}
      />

      {/* 4. Active Sub-View Outlet or Full Loading Skeleton */}
      {isLoading ? (
        <AnalyticsSkeleton />
      ) : isError && !data ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 sm:p-8 text-center space-y-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-rose-100 text-rose-800 mx-auto">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900">Failed to Load Analytics</h2>
          <p className="text-xs text-neutral-600 max-w-md mx-auto">
            An error occurred while fetching the analytics dashboard. Please check your connection
            and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 inline-flex items-center px-4 py-2 rounded-xl bg-[#9a3412] text-white text-xs font-semibold hover:bg-[#7c2d12] transition-colors"
          >
            Retry Fetching
          </button>
        </div>
      ) : (
        <Outlet context={contextValue} />
      )}
    </div>
  );
}
