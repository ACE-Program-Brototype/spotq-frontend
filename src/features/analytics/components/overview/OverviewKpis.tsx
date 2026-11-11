import { IndianRupee, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { AnalyticsMetricCard } from "@/features/analytics/components/common/AnalyticsMetricCard";
import { AnalyticsSectionUnavailable } from "@/features/analytics/components/common/AnalyticsSectionUnavailable";
import type {
  OperationSectionResultDto,
  OrderSectionResultDto,
  RevenueSectionResultDto,
} from "@/features/analytics/types/restaurant-analytics.types";
import { formatCurrency } from "@/lib/utils/currency";

export interface OverviewKpisProps {
  revenue: RevenueSectionResultDto;
  orders: OrderSectionResultDto;
  operations: OperationSectionResultDto;
  onRetry?: () => void;
  className?: string;
}

export function OverviewKpis({
  revenue,
  orders,
  operations,
  onRetry,
  className,
}: OverviewKpisProps) {
  const isRevenueAvailable = revenue.status === "AVAILABLE";
  const isOrdersAvailable = orders.status === "AVAILABLE";
  const isOperationsAvailable = operations.status === "AVAILABLE";

  // Calculate Average Order Value (AOV) safely
  const netSales = isRevenueAvailable ? revenue.netSalesRupees : 0;
  const orderCount = isOrdersAvailable ? orders.totalOrderCount : 0;
  const aov = orderCount > 0 ? netSales / orderCount : 0;

  return (
    <div className={className ?? "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 lg:gap-4"}>
      {/* 1. Net Revenue */}
      {isRevenueAvailable ? (
        <AnalyticsMetricCard
          label="Net Revenue"
          value={formatCurrency(revenue.netSalesRupees)}
          icon={IndianRupee}
          trendPercentage={revenue.growthPercentage}
          trendText="vs previous period"
          iconBgClassName="bg-emerald-50 border-emerald-200"
          iconClassName="text-emerald-700"
        />
      ) : (
        <AnalyticsSectionUnavailable
          title="Revenue Unavailable"
          error={revenue.error}
          onRetry={onRetry}
        />
      )}

      {/* 2. Total Order Volume */}
      {isOrdersAvailable ? (
        <AnalyticsMetricCard
          label="Total Orders"
          value={orders.totalOrderCount.toLocaleString()}
          icon={ShoppingBag}
          trendPercentage={orders.growthPercentage}
          trendText="vs previous period"
          iconBgClassName="bg-[#fef3ec] border-[#fae2d3]"
          iconClassName="text-[#9a3412]"
        />
      ) : (
        <AnalyticsSectionUnavailable
          title="Orders Unavailable"
          error={orders.error}
          onRetry={onRetry}
        />
      )}

      {/* 3. Average Order Value (AOV) */}
      {isRevenueAvailable && isOrdersAvailable ? (
        <AnalyticsMetricCard
          label="Avg. Order Value"
          value={formatCurrency(aov)}
          icon={TrendingUp}
          subtitle={orderCount > 0 ? "Per placed order" : "No orders in period"}
          iconBgClassName="bg-sky-50 border-sky-200"
          iconClassName="text-sky-700"
        />
      ) : (
        <AnalyticsMetricCard
          label="Avg. Order Value"
          value="--"
          icon={TrendingUp}
          subtitle="Awaiting metrics sync"
          iconBgClassName="bg-neutral-50 border-neutral-200"
          iconClassName="text-neutral-400"
        />
      )}

      {/* 4. Unique Customers */}
      {isOperationsAvailable ? (
        <AnalyticsMetricCard
          label="Unique Customers"
          value={operations.uniqueCustomersCount.toLocaleString()}
          icon={Users}
          subtitle="Distinct patrons served"
          iconBgClassName="bg-violet-50 border-violet-200"
          iconClassName="text-violet-700"
        />
      ) : (
        <AnalyticsSectionUnavailable
          title="Operations Unavailable"
          error={operations.error}
          onRetry={onRetry}
        />
      )}
    </div>
  );
}
