import { OrderStatusDistributionCard } from "@/features/analytics/components/overview/OrderStatusDistributionCard";
import { OverviewKpis } from "@/features/analytics/components/overview/OverviewKpis";
import { useRestaurantAnalyticsContext } from "@/features/analytics/layouts/RestaurantAnalyticsLayout";

export default function RestaurantAnalyticsOverviewPage() {
  const { data, refetch } = useRestaurantAnalyticsContext();

  if (!data) {
    return null;
  }

  const { overview, orderStatusBreakdown } = data;

  return (
    <div className="space-y-3.5 sm:space-y-5 md:space-y-6">
      {/* 1. Core Overview KPI Cards */}
      <section aria-label="Executive Overview KPIs">
        <OverviewKpis
          revenue={overview.revenue}
          orders={overview.orders}
          operations={overview.operations}
          onRetry={refetch}
        />
      </section>

      {/* 2. Order Status Breakdown */}
      <section aria-label="Order Status Fulfillment Breakdown">
        <OrderStatusDistributionCard breakdown={orderStatusBreakdown} />
      </section>
    </div>
  );
}
