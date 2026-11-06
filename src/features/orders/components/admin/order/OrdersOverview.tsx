import { CheckCircle2, IndianRupee, ShoppingBag, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import type { RestaurantOrderMetrics } from "../../../types/restaurant-orders.types";
import { OrderMetricCard } from "./OrderMetricCard";

interface OrdersOverviewProps {
  metrics: RestaurantOrderMetrics;
  className?: string;
}

export function OrdersOverview({ metrics, className }: OrdersOverviewProps) {
  return (
    <section
      aria-label="Order Metrics Overview"
      className={className ?? "grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4"}
    >
      {/* 1. Total Orders */}
      <OrderMetricCard
        label="Total Orders"
        value={metrics.totalOrders.toLocaleString()}
        icon={ShoppingBag}
        trendText={metrics.totalOrdersTrend}
        trendDirection="up"
        iconBgClassName="bg-[#fef3ec] border-[#fae2d3]"
        iconClassName="text-[#e8631b]"
      />

      {/* 2. Gross Revenue */}
      <OrderMetricCard
        label="Gross Revenue"
        value={formatCurrency(metrics.grossRevenue)}
        icon={IndianRupee}
        trendText={metrics.grossRevenueTrend}
        trendDirection="up"
        iconBgClassName="bg-emerald-50 border-emerald-200"
        iconClassName="text-emerald-600"
      />

      {/* 3. Completed Orders */}
      <OrderMetricCard
        label="Completed Orders"
        value={metrics.completedOrders.toLocaleString()}
        icon={CheckCircle2}
        trendText={metrics.completedOrdersRate}
        trendDirection="up"
        iconBgClassName="bg-sky-50 border-sky-200"
        iconClassName="text-sky-600"
      />

      {/* 4. Cancelled Orders */}
      <OrderMetricCard
        label="Cancelled Orders"
        value={metrics.cancelledOrders.toLocaleString()}
        icon={XCircle}
        trendText={metrics.cancelledOrdersRate}
        trendDirection="down"
        iconBgClassName="bg-rose-50 border-rose-200"
        iconClassName="text-rose-600"
      />
    </section>
  );
}
