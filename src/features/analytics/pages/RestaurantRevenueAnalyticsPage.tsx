import { OrderStatusDistributionCard } from "../components/overview/OrderStatusDistributionCard";
import { RevenueBreakdownCard } from "../components/revenue/RevenueBreakdownCard";
import { RevenueKpis } from "../components/revenue/RevenueKpis";
import { useRestaurantAnalyticsContext } from "../layouts/RestaurantAnalyticsLayout";

export default function RestaurantRevenueAnalyticsPage() {
  const { data, refetch } = useRestaurantAnalyticsContext();

  if (!data) {
    return null;
  }

  const { overview, orderStatusBreakdown } = data;

  const totalOrders = overview.orders.status === "AVAILABLE" ? overview.orders.totalOrderCount : 0;

  return (
    <div className="space-y-6">
      {/* 1. Core Revenue Metrics */}
      <section aria-label="Revenue Summary KPIs">
        <RevenueKpis revenue={overview.revenue} onRetry={refetch} />
      </section>

      {/* 2. Realization Stack & Status Breakdown */}
      {overview.revenue.status === "AVAILABLE" && (
        <section
          aria-label="Revenue Realization Details"
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
        >
          <RevenueBreakdownCard revenue={overview.revenue} totalOrders={totalOrders} />
          <OrderStatusDistributionCard breakdown={orderStatusBreakdown} />
        </section>
      )}
    </div>
  );
}
