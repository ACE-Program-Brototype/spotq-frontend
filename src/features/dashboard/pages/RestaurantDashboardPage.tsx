import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, BarChart3, TrendingUp, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import {
  AnalyticsFilterToolbar,
  AnalyticsSkeleton,
  OrderStatusDistributionCard,
  OverviewKpis,
  useAnalyticsFilters,
  useRestaurantAnalytics,
} from "@/features/analytics";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { User } from "@/features/auth/types/auth.types";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardMenuPerformance } from "@/features/dashboard/components/DashboardMenuPerformance";
import { RenewalModal } from "@/features/subscription/components/RenewalModal";
import {
  RESTAURANT_VERIFICATION_STATUSES,
  SUBSCRIPTION_QUERY_KEYS,
} from "@/features/subscription/constants/subscription.constants";
import { subscriptionService } from "@/features/subscription/services/subscription.service";

export default function RestaurantDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, clearAuth, setUser } = useAuthStore();
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);

  const restaurantEmail = user?.email || "restaurant";

  const {
    data: statusData,
    isLoading: isLoadingStatus,
    isError: isStatusError,
  } = useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEYS.RESTAURANT_STATUS,
    queryFn: () => subscriptionService.fetchRestaurantStatus(),
    retry: 1,
  });

  const isSubscriptionActive = statusData?.isSubscriptionActive ?? false;

  const {
    data: plans = [],
    isLoading: isLoadingPlans,
    isError: isPlansError,
    refetch: refetchPlans,
  } = useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEYS.PLANS,
    queryFn: () => subscriptionService.fetchPlans(),
    enabled: isRenewalModalOpen,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const userStatus = user?.status ?? statusData?.verificationStatus;
  const isApprovedOrActive =
    userStatus === RESTAURANT_VERIFICATION_STATUSES.APPROVED ||
    userStatus === RESTAURANT_VERIFICATION_STATUSES.ACTIVE ||
    userStatus === RESTAURANT_VERIFICATION_STATUSES.VERIFIED;
  const needsSubscription = isApprovedOrActive && !isSubscriptionActive && !isStatusError;

  // Resolve restaurant ID for analytics fetching
  const restaurantId = statusData?.restaurantId || user?.restaurantId || user?.id || "";
  const filters = useAnalyticsFilters();
  const {
    data: analyticsData,
    isLoading: isLoadingAnalytics,
    isError: isAnalyticsError,
    refetch: refetchAnalytics,
  } = useRestaurantAnalytics(restaurantId, filters.queryParams, {
    enabled: Boolean(restaurantId) && !needsSubscription,
  });

  useEffect(() => {
    if (statusData?.verificationStatus && user) {
      if (user.status !== statusData.verificationStatus) {
        setUser({
          ...user,
          status: statusData.verificationStatus as User["status"],
          onboardingStatus: "COMPLETED",
        });
      }
    }
  }, [statusData, user, setUser]);

  useEffect(() => {
    if (!isLoadingStatus && needsSubscription) {
      navigate(RESTAURANT_ROUTES.SUBSCRIPTION, { replace: true });
    }
  }, [isLoadingStatus, needsSubscription, navigate]);

  if (!isLoadingStatus && needsSubscription) {
    return null;
  }

  const handleLogout = () => {
    clearAuth();
    queryClient.clear();
    navigate(RESTAURANT_ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* 1. Header & Subscription Overview */}
      <DashboardHeader
        restaurantName={statusData?.restaurantName}
        restaurantEmail={restaurantEmail}
        statusData={statusData}
        isLoadingStatus={isLoadingStatus}
        isStatusError={isStatusError}
        userStatus={user?.status}
        plans={plans}
        onLogout={handleLogout}
        onOpenRenewal={() => setIsRenewalModalOpen(true)}
      />

      {/* 2. Restaurant Analytics & Operational Reporting */}
      <section aria-label="Restaurant Analytics Overview" className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3">
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
              Restaurant Analytics & Performance
            </h2>
            <p className="mt-0.5 text-[11px] sm:text-xs text-neutral-500">
              Live operational metrics, order fulfillment health, and revenue trends.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Link
              to={RESTAURANT_ROUTES.ANALYTICS.ROOT}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl border border-[#eddcd4] bg-white px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors shadow-2xs"
            >
              <BarChart3 className="size-3.5 text-[#e8631b]" />
              <span>Full Analytics Hub</span>
            </Link>
            <Link
              to={RESTAURANT_ROUTES.ANALYTICS.REVENUE}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl border border-[#eddcd4] bg-white px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors shadow-2xs"
            >
              <TrendingUp className="size-3.5 text-[#e8631b]" />
              <span>Revenue Details</span>
            </Link>
            <Link
              to={RESTAURANT_ROUTES.ANALYTICS.MENU}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl border border-[#eddcd4] bg-white px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors shadow-2xs"
            >
              <UtensilsCrossed className="size-3.5 text-[#e8631b]" />
              <span>Menu Velocity</span>
            </Link>
          </div>
        </div>

        {/* Global Date & Interval Filter Toolbar */}
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

        {/* Analytics Body */}
        {isLoadingAnalytics ? (
          <AnalyticsSkeleton />
        ) : isAnalyticsError && !analyticsData ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 sm:p-8 text-center space-y-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-rose-100 text-rose-800 mx-auto">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Unable to Load Live Restaurant Analytics
            </h3>
            <p className="text-xs text-neutral-600 max-w-md mx-auto">
              We couldn&apos;t connect to the restaurant analytics service for this period.
            </p>
            <button
              type="button"
              onClick={() => refetchAnalytics()}
              className="rounded-xl bg-[#9a3412] px-4 py-2 text-xs font-semibold text-white hover:bg-[#7c2d12] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : analyticsData ? (
          <div className="space-y-3.5 sm:space-y-6">
            {/* Core Overview KPI Cards */}
            <OverviewKpis
              revenue={analyticsData.overview.revenue}
              orders={analyticsData.overview.orders}
              operations={analyticsData.overview.operations}
              onRetry={refetchAnalytics}
            />

            {/* Order Status Fulfillment Breakdown */}
            <div>
              <OrderStatusDistributionCard breakdown={analyticsData.orderStatusBreakdown} />
            </div>

            {/* Menu Performance Highlights */}
            <DashboardMenuPerformance products={analyticsData.products} />
          </div>
        ) : null}
      </section>

      {/* 3. Renewal Modal */}
      <RenewalModal
        open={isRenewalModalOpen}
        onOpenChange={setIsRenewalModalOpen}
        statusData={statusData}
        plans={plans}
        isLoadingPlans={isLoadingPlans}
        isPlansError={isPlansError}
        onRetryPlans={() => {
          refetchPlans();
        }}
      />
    </div>
  );
}
