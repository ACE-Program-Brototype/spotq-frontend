import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  LogOut,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import {
  ANALYTICS_SECTION_STATUSES,
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
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-3.5 sm:p-5 md:p-6 lg:p-8 shadow-xs">
        {/* Top Row: Welcome + Logout */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
              Restaurant dashboard
            </p>
            <h1 className="mt-0.5 md:mt-1 text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900 truncate">
              {`Welcome, ${statusData?.restaurantName || restaurantEmail}`}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
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
            <p className="md:mt-1 md:text-xl md:font-bold">{userStatus ?? "Active"}</p>
          </div>

          {/* Card 2: Subscription Card */}
          <SubscriptionOverviewCard
            statusData={statusData}
            plans={plans}
            isLoading={isLoadingStatus}
            isError={isStatusError}
            onRenewClick={() => setIsRenewalModalOpen(true)}
            onSubscribeClick={() => navigate(RESTAURANT_ROUTES.SUBSCRIPTION)}
          />
        </div>

        <SubscriptionExpiryBanner
          statusData={statusData}
          isLoading={isLoadingStatus}
          isError={isStatusError}
          onRenewClick={() => setIsRenewalModalOpen(true)}
        />
      </div>

      {/* 2. Restaurant Analytics & Operational Reporting */}
      <section aria-label="Restaurant Analytics Overview" className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-neutral-900 tracking-tight">
              Restaurant Analytics &amp; Performance
            </h2>
            <p className="hidden md:block mt-0.5 text-xs text-neutral-500">
              Live operational metrics, order fulfillment health, and revenue trends.
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
            <Link
              to={RESTAURANT_ROUTES.ANALYTICS.ROOT}
              className="inline-flex items-center gap-1 md:gap-1.5 rounded-lg md:rounded-xl border border-[#eddcd4] bg-white px-2 py-1 md:px-3.5 md:py-2 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors shadow-2xs"
            >
              <BarChart3 className="size-3 md:size-3.5 text-[#e8631b] shrink-0" />
              <span className="hidden sm:inline">Full Analytics Hub</span>
              <span className="sm:hidden">Hub</span>
            </Link>
            <Link
              to={RESTAURANT_ROUTES.ANALYTICS.REVENUE}
              className="inline-flex items-center gap-1 md:gap-1.5 rounded-lg md:rounded-xl border border-[#eddcd4] bg-white px-2 py-1 md:px-3.5 md:py-2 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors shadow-2xs"
            >
              <TrendingUp className="size-3 md:size-3.5 text-[#e8631b] shrink-0" />
              <span className="hidden sm:inline">Revenue Details</span>
              <span className="sm:hidden">Revenue</span>
            </Link>
            <Link
              to={RESTAURANT_ROUTES.ANALYTICS.MENU}
              className="inline-flex items-center gap-1 md:gap-1.5 rounded-lg md:rounded-xl border border-[#eddcd4] bg-white px-2 py-1 md:px-3.5 md:py-2 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors shadow-2xs"
            >
              <UtensilsCrossed className="size-3 md:size-3.5 text-[#e8631b] shrink-0" />
              <span className="hidden sm:inline">Menu Velocity</span>
              <span className="sm:hidden">Menu</span>
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
          <div className="space-y-3.5 sm:space-y-5 md:space-y-6">
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
            {analyticsData.products.status === ANALYTICS_SECTION_STATUSES.AVAILABLE && (
              <div className="rounded-2xl border border-[#eddcd4] bg-white p-4 sm:p-6 shadow-2xs space-y-4">
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
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-50/80 px-3 py-2 text-xs font-medium text-emerald-800 border border-emerald-200/60">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                        <span>Healthy velocity! No items below threshold.</span>
                      </div>
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
