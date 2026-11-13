/**
 * Platform Admin Orders Metrics Component
 * Displays system-wide order volume, platform gross order value (GMV),
 * completed orders, active in-progress orders, and cancellation stats.
 */

import { Activity, CheckCircle2, IndianRupee, ShoppingBag, XCircle } from "lucide-react";
import type { AdminOrdersMetricsData } from "@/features/orders/types/admin-orders.types";
import { formatCurrency } from "@/lib/utils/currency";
import { OrderMetricCard } from "./OrderMetricCard";

interface AdminOrdersMetricsProps {
  metrics: AdminOrdersMetricsData;
  className?: string;
}

export function AdminOrdersMetrics({ metrics, className }: AdminOrdersMetricsProps) {
  const statusCounts = metrics.ordersByStatus ?? {};

  const completedCount = statusCounts.COMPLETED ?? 0;
  const cancelledCount = statusCounts.CANCELLED ?? 0;
  const activeCount =
    (statusCounts.PLACED ?? 0) +
    (statusCounts.CONFIRMED ?? 0) +
    (statusCounts.PREPARING ?? 0) +
    (statusCounts.READY ?? 0) +
    (statusCounts.SERVED ?? 0);

  const totalOrders = metrics.totalOrders ?? 0;
  const completionRate =
    totalOrders > 0 ? `${((completedCount / totalOrders) * 100).toFixed(1)}% completed` : undefined;
  const cancellationRate =
    totalOrders > 0 ? `${((cancelledCount / totalOrders) * 100).toFixed(1)}% rate` : undefined;

  return (
    <section
      aria-label="Platform Order Metrics"
      className={className ?? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"}
    >
      {/* 1. Total Orders */}
      <OrderMetricCard
        label="Total Orders"
        value={totalOrders.toLocaleString()}
        icon={ShoppingBag}
        subtitle="All-time orders"
        iconBgClassName="bg-blue-50 border-blue-200"
        iconClassName="text-blue-600"
      />

      {/* 2. Platform Gross Volume */}
      <OrderMetricCard
        label="Gross Order Value"
        value={formatCurrency(metrics.totalOrderValue ?? 0)}
        icon={IndianRupee}
        subtitle="Platform GMV"
        iconBgClassName="bg-emerald-50 border-emerald-200"
        iconClassName="text-emerald-600"
      />

      {/* 3. Completed Orders */}
      <OrderMetricCard
        label="Completed"
        value={completedCount.toLocaleString()}
        icon={CheckCircle2}
        subtitle={completionRate}
        trendDirection="up"
        iconBgClassName="bg-teal-50 border-teal-200"
        iconClassName="text-teal-600"
      />

      {/* 4. Active / In-Progress */}
      <OrderMetricCard
        label="Active Orders"
        value={activeCount.toLocaleString()}
        icon={Activity}
        subtitle="Kitchen & Service"
        iconBgClassName="bg-amber-50 border-amber-200"
        iconClassName="text-amber-600"
      />

      {/* 5. Cancelled Orders */}
      <OrderMetricCard
        label="Cancelled"
        value={cancelledCount.toLocaleString()}
        icon={XCircle}
        subtitle={cancellationRate}
        trendDirection={cancelledCount > 0 ? "down" : "neutral"}
        iconBgClassName="bg-rose-50 border-rose-200"
        iconClassName="text-rose-600"
      />
    </section>
  );
}
