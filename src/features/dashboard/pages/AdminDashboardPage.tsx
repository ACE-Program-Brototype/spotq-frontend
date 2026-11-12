import { AlertTriangle, RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomerGrowthCard } from "@/features/dashboard/components/admin/CustomerGrowthCard";
import { ExportReportsModal } from "@/features/dashboard/components/admin/ExportReportsModal";
import { OnboardingFunnelSection } from "@/features/dashboard/components/admin/OnboardingFunnelSection";
import { PlatformDashboardHeader } from "@/features/dashboard/components/admin/PlatformDashboardHeader";
import { PlatformFilterBar } from "@/features/dashboard/components/admin/PlatformFilterBar";
import { PlatformKpisSection } from "@/features/dashboard/components/admin/PlatformKpisSection";
import { RevenueTimelineChart } from "@/features/dashboard/components/admin/RevenueTimelineChart";
import { SubscriptionTierDonutChart } from "@/features/dashboard/components/admin/SubscriptionTierDonutChart";
import {
  ANALYTICS_PERIOD_VALUES,
  getDefaultFilters,
  PLATFORM_ANALYTICS_MESSAGES,
} from "@/features/dashboard/constants/platform-analytics.constants";
import { usePlatformAdminDashboardAnalytics } from "@/features/dashboard/hooks/usePlatformAdminDashboardAnalytics";
import type { PlatformDashboardFilters } from "@/features/dashboard/types/platform-analytics.types";

export default function AdminDashboardPage() {
  const [filters, setFilters] = useState<PlatformDashboardFilters>(getDefaultFilters);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const { data, isLoading, isError, error, isFetching, refetch } =
    usePlatformAdminDashboardAnalytics(filters);

  const handleFilterChange = useCallback((updated: Partial<PlatformDashboardFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...updated,
    }));
  }, []);

  const getPeriodLabel = () => {
    switch (filters.period) {
      case ANALYTICS_PERIOD_VALUES.DAY:
        return "today";
      case ANALYTICS_PERIOD_VALUES.WEEK:
        return "this week";
      case ANALYTICS_PERIOD_VALUES.MONTH:
        return "this month";
      case ANALYTICS_PERIOD_VALUES.YEAR:
        return "this year";
      default:
        return "in selected period";
    }
  };

  return (
    <div className="space-y-6 max-w-full pb-10">
      {/* 1. Header with Last Synced & Export Action */}
      <PlatformDashboardHeader
        generatedAt={data?.generatedAt}
        isFetching={isFetching}
        onRefresh={() => void refetch()}
        onExportClick={() => setIsExportModalOpen(true)}
      />

      {/* 2. Unified Timeline & Granularity Filter Bar */}
      <PlatformFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        isLoading={isFetching}
      />

      {/* Full Error State (Network or Gateway Down) */}
      {isError && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/60 p-8 text-center shadow-xs">
          <div className="flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertTriangle className="size-6" />
          </div>
          <h2 className="mt-3 text-base font-bold text-slate-900">
            {PLATFORM_ANALYTICS_MESSAGES.ERROR_TITLE}
          </h2>
          <p className="mt-1 max-w-md text-xs sm:text-sm text-slate-600">
            {error instanceof Error ? error.message : PLATFORM_ANALYTICS_MESSAGES.ERROR_DESCRIPTION}
          </p>
          <Button
            type="button"
            size="sm"
            onClick={() => void refetch()}
            className="mt-4 gap-1.5 bg-rose-600 text-white hover:bg-rose-700 text-xs font-semibold shadow-xs"
          >
            <RefreshCw className="size-3.5" />
            {PLATFORM_ANALYTICS_MESSAGES.RETRY}
          </Button>
        </div>
      )}

      {/* Section 1: Executive KPI Cards */}
      <section aria-label="Executive Overview" className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Executive Overview
        </h2>
        <PlatformKpisSection
          overview={data?.overview}
          customerGrowth={data?.customerGrowth}
          revenue={data?.revenue}
          isLoading={isLoading}
        />
      </section>

      {/* Section 2: Subscription & Revenue Analytics */}
      <section aria-label="Subscription & Revenue Analytics" className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Subscription &amp; Revenue Analytics
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueTimelineChart
              revenue={data?.revenue}
              isLoading={isLoading}
              onRetry={() => void refetch()}
            />
          </div>
          <div>
            <SubscriptionTierDonutChart overview={data?.overview} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* Section 3: Restaurant Growth & Customer Acquisition */}
      <section aria-label="Restaurant Growth Analytics" className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Restaurant Growth &amp; Customer Acquisition
        </h2>

        {/* Row 3 (Wireframe Split: Onboarding Funnel & Customer Growth with Prominent New Users Count) */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <OnboardingFunnelSection
              funnel={data?.growth?.onboardingFunnel}
              isLoading={isLoading}
            />
          </div>
          <div>
            <CustomerGrowthCard
              customerGrowth={data?.customerGrowth}
              totalRestaurants={data?.overview?.totalRestaurants}
              periodLabel={getPeriodLabel()}
              isLoading={isLoading}
              onRetry={() => void refetch()}
            />
          </div>
        </div>
      </section>

      {/* Export Reports Modal (SCRUM-804 entry point) */}
      <ExportReportsModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
}
