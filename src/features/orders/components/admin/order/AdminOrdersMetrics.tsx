/**
 * Platform Admin Orders Metrics Component
 * Displays system-wide order volume, platform gross order value (GMV),
 * completed orders, active in-progress orders, and cancellation stats.
 */

import { Activity, CheckCircle2, IndianRupee, ShoppingBag, XCircle } from "lucide-react";
import { OrderMetricCard } from "@/features/orders/components/admin/order/OrderMetricCard";
import { ADMIN_ORDERS_METRICS_LABELS } from "@/features/orders/constants/admin-orders.constants";
import type { AdminOrdersMetricsData } from "@/features/orders/types/admin-orders.types";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
} from "@/lib/utils/currency";

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
    totalOrders > 0
      ? `${((completedCount / totalOrders) * 100).toFixed(1)}% ${ADMIN_ORDERS_METRICS_LABELS.RATE_COMPLETED}`
      : undefined;
  const cancellationRate =
    totalOrders > 0
      ? `${((cancelledCount / totalOrders) * 100).toFixed(1)}% ${ADMIN_ORDERS_METRICS_LABELS.RATE_CANCELLED}`
      : undefined;

  return (
    <section
      aria-label={ADMIN_ORDERS_METRICS_LABELS.SECTION_ARIA}
      className={className ?? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"}
    >
      {/* 1. Total Orders */}
      <OrderMetricCard
        label={ADMIN_ORDERS_METRICS_LABELS.TOTAL_ORDERS}
        value={formatCompactNumber(totalOrders)}
        fullValue={totalOrders.toLocaleString()}
        icon={ShoppingBag}
        subtitle={ADMIN_ORDERS_METRICS_LABELS.TOTAL_ORDERS_SUBTITLE}
        iconBgClassName="bg-blue-50 border-blue-200"
        iconClassName="text-blue-600"
      />

      {/* 2. Platform Gross Volume */}
      <OrderMetricCard
        label={ADMIN_ORDERS_METRICS_LABELS.GROSS_ORDER_VALUE}
        value={formatCompactCurrency(metrics.totalOrderValue ?? 0)}
        fullValue={formatCurrency(metrics.totalOrderValue ?? 0)}
        icon={IndianRupee}
        subtitle={ADMIN_ORDERS_METRICS_LABELS.GROSS_ORDER_VALUE_SUBTITLE}
        iconBgClassName="bg-emerald-50 border-emerald-200"
        iconClassName="text-emerald-600"
      />

      {/* 3. Completed Orders */}
      <OrderMetricCard
        label={ADMIN_ORDERS_METRICS_LABELS.COMPLETED}
        value={formatCompactNumber(completedCount)}
        fullValue={completedCount.toLocaleString()}
        icon={CheckCircle2}
        subtitle={completionRate}
        trendDirection="up"
        iconBgClassName="bg-teal-50 border-teal-200"
        iconClassName="text-teal-600"
      />

      {/* 4. Active / In-Progress */}
      <OrderMetricCard
        label={ADMIN_ORDERS_METRICS_LABELS.ACTIVE_ORDERS}
        value={formatCompactNumber(activeCount)}
        fullValue={activeCount.toLocaleString()}
        icon={Activity}
        subtitle={ADMIN_ORDERS_METRICS_LABELS.ACTIVE_ORDERS_SUBTITLE}
        iconBgClassName="bg-amber-50 border-amber-200"
        iconClassName="text-amber-600"
      />

      {/* 5. Cancelled Orders */}
      <OrderMetricCard
        label={ADMIN_ORDERS_METRICS_LABELS.CANCELLED}
        value={formatCompactNumber(cancelledCount)}
        fullValue={cancelledCount.toLocaleString()}
        icon={XCircle}
        subtitle={cancellationRate}
        trendDirection={cancelledCount > 0 ? "down" : "neutral"}
        iconBgClassName="bg-rose-50 border-rose-200"
        iconClassName="text-rose-600"
      />
    </section>
  );
}
