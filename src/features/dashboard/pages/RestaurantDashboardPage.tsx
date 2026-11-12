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
import { RenewalModal } from "@/features/subscription/components/RenewalModal";
import { SubscriptionExpiryBanner } from "@/features/subscription/components/SubscriptionExpiryBanner";
import { SubscriptionOverviewCard } from "@/features/subscription/components/SubscriptionOverviewCard";
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
      {/* 1. Header & Subscription Banner */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
              Restaurant dashboard
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-900">
              {`Welcome, ${statusData?.restaurantName || restaurantEmail}`}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="self-start sm:self-auto rounded-xl border border-[#eddcd4] px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors"
          >
            Logout
          </button>
        </div>

        <SubscriptionExpiryBanner
          statusData={statusData}
          isLoading={isLoadingStatus}
          isError={isStatusError}
          onRenewClick={() => setIsRenewalModalOpen(true)}
        />

        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/60 p-5">
            <p className="text-xs font-medium text-neutral-500">Account status</p>
            <p className="mt-2 text-xl font-bold text-neutral-900">
              {user?.status ?? statusData?.verificationStatus ?? "Active"}
            </p>
          </div>

          <SubscriptionOverviewCard
            statusData={statusData}
            plans={plans}
            isLoading={isLoadingStatus}
            isError={isStatusError}
            onRenewClick={() => setIsRenewalModalOpen(true)}
            onSubscribeClick={() => navigate(RESTAURANT_ROUTES.SUBSCRIPTION)}
          />
        </div>
      </div>

      {/* 2. Restaurant Analytics & Operational Reporting */}
      <section aria-label="Restaurant Analytics Overview" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Restaurant Analytics & Performance
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              Live operational metrics, order fulfillment health, and revenue trends.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={RESTAURANT_ROUTES.ANALYTICS.ROOT}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#eddcd4] bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors shadow-2xs"
            >
              <BarChart3 className="size-3.5 text-[#e8631b]" />
              Full Analytics Hub
            </Link>
            <Link
              to={RESTAURANT_ROUTES.ANALYTICS.REVENUE}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#eddcd4] bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors shadow-2xs"
            >
              <TrendingUp className="size-3.5 text-[#e8631b]" />
              Revenue Details
            </Link>
            <Link
              to={RESTAURANT_ROUTES.ANALYTICS.MENU}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#eddcd4] bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors shadow-2xs"
            >
              <UtensilsCrossed className="size-3.5 text-[#e8631b]" />
              Menu Velocity
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
          <div className="space-y-6">
            {/* 1. Core Overview KPI Cards */}
            <OverviewKpis
              revenue={analyticsData.overview.revenue}
              orders={analyticsData.overview.orders}
              operations={analyticsData.overview.operations}
              onRetry={refetchAnalytics}
            />

            {/* 2. Order Status Fulfillment Breakdown */}
            <div>
              <OrderStatusDistributionCard breakdown={analyticsData.orderStatusBreakdown} />
            </div>

            {/* 3. Menu Performance Preview */}
            {analyticsData.products.status === "AVAILABLE" && (
              <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">
                      Menu Performance Highlights
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Top sellers and slow-moving items requiring inventory decisions.
                    </p>
                  </div>
                  <Link
                    to={RESTAURANT_ROUTES.ANALYTICS.MENU}
                    className="text-xs font-semibold text-[#9a3412] hover:underline"
                  >
                    View All Items &amp; Threshold Rules &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Top Sellers Preview */}
                  <div className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/50 p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Top Selling Items
                    </p>
                    {analyticsData.products.topSelling.items.length === 0 ? (
                      <p className="text-xs text-neutral-400">No sales recorded for this period.</p>
                    ) : (
                      <div className="space-y-2">
                        {analyticsData.products.topSelling.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={item.menuItemId}
                            className="flex items-center justify-between text-xs py-1.5 border-b border-[#eddcd4]/50 last:border-0"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#fef3ec] text-[10px] font-bold text-[#9a3412]">
                                {idx + 1}
                              </span>
                              <span className="font-medium text-neutral-900 truncate">
                                {item.name}
                              </span>
                            </div>
                            <span className="font-semibold text-neutral-800 shrink-0 ml-2">
                              {item.quantitySold} sold
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Slow Moving Summary Preview */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                        Slow-Moving Items
                      </p>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                        Threshold: &le; 3 sales
                      </span>
                    </div>
                    {analyticsData.products.slowMoving.items.length === 0 ? (
                      <p className="text-xs text-emerald-700 font-medium">
                        &check; Healthy velocity! No items below threshold.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {analyticsData.products.slowMoving.items.slice(0, 3).map((item) => (
                          <div
                            key={item.menuItemId}
                            className="flex items-center justify-between text-xs py-1.5 border-b border-amber-200/50 last:border-0"
                          >
                            <span className="font-medium text-neutral-900 truncate">
                              {item.name}
                            </span>
                            <span className="font-semibold text-amber-800 shrink-0 ml-2">
                              {item.quantitySold} sales
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
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
