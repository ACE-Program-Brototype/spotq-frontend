import { Utensils } from "lucide-react";
import { AnalyticsSectionUnavailable } from "@/features/analytics/components/common/AnalyticsSectionUnavailable";
import { SlowMovingRuleBanner } from "@/features/analytics/components/menu/SlowMovingRuleBanner";
import { SlowMovingTable } from "@/features/analytics/components/menu/SlowMovingTable";
import { TopSellingTable } from "@/features/analytics/components/menu/TopSellingTable";
import { useRestaurantAnalyticsContext } from "@/features/analytics/layouts/RestaurantAnalyticsLayout";

export default function RestaurantMenuPerformancePage() {
  const { data, refetch, filters } = useRestaurantAnalyticsContext();

  if (!data) {
    return null;
  }

  const { products } = data;

  if (products.status !== "AVAILABLE") {
    return (
      <AnalyticsSectionUnavailable
        title="Menu Analytics Unavailable"
        error={products.error}
        onRetry={refetch}
      />
    );
  }

  const { totalProductsCount, topSelling, slowMoving } = products;

  return (
    <div className="space-y-6">
      {/* 1. Catalog Context Header */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-[#eddcd4] bg-[#faf7f5]">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#fef3ec] text-[#9a3412] border border-[#fae2d3]">
            <Utensils className="size-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-900">Menu Catalog Analytics</p>
            <p className="text-[11px] text-neutral-500">
              Tracking performance across active and past dishes
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm sm:text-base font-extrabold text-neutral-900">
            {totalProductsCount}
          </span>
          <span className="text-[11px] text-neutral-500 block">total dishes in catalog</span>
        </div>
      </div>

      {/* 2. Top-Selling Items Ranked Table */}
      <section aria-label="Top Selling Dishes">
        <TopSellingTable
          items={topSelling.items}
          pagination={topSelling.pagination}
          onPageChange={filters.setPage}
        />
      </section>

      {/* 3. Slow-Moving Diagnostics & Rule Explanation */}
      <section aria-label="Slow Moving Dishes" className="space-y-4">
        <SlowMovingRuleBanner />
        <SlowMovingTable
          items={slowMoving.items}
          pagination={slowMoving.pagination}
          onPageChange={filters.setPage}
        />
      </section>
    </div>
  );
}
