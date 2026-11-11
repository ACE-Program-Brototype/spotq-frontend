import { ChannelDistributionCard } from "@/features/analytics/components/overview/ChannelDistributionCard";
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
    <div className="space-y-6">
      {/* 1. Core Overview KPI Cards */}
      <section aria-label="Executive Overview KPIs">
        <OverviewKpis
          revenue={overview.revenue}
          orders={overview.orders}
          operations={overview.operations}
          onRetry={refetch}
        />
      </section>

      {/* 2. Channel Distribution & Order Status Breakdown */}
      <section
        aria-label="Fulfillment and Channels Breakdown"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
      >
        <ChannelDistributionCard orders={overview.orders} />
        <OrderStatusDistributionCard breakdown={orderStatusBreakdown} />
      </section>
    </div>
  );
}
