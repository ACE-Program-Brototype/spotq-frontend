import { IndianRupee, Percent, Receipt, TrendingUp } from "lucide-react";
import { AnalyticsMetricCard } from "@/features/analytics/components/common/AnalyticsMetricCard";
import { AnalyticsSectionUnavailable } from "@/features/analytics/components/common/AnalyticsSectionUnavailable";
import { ANALYTICS_SECTION_STATUSES } from "@/features/analytics/constants/restaurant-analytics.constants";
import type { RevenueSectionResultDto } from "@/features/analytics/types/restaurant-analytics.types";
import { formatCurrency } from "@/lib/utils/currency";

export interface RevenueKpisProps {
  revenue: RevenueSectionResultDto;
  onRetry?: () => void;
  className?: string;
}

export function RevenueKpis({ revenue, onRetry, className }: RevenueKpisProps) {
  if (revenue.status !== ANALYTICS_SECTION_STATUSES.AVAILABLE) {
    return (
      <AnalyticsSectionUnavailable
        title="Revenue Unavailable"
        error={revenue.error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  const { netSalesRupees, discountRupees, totalBillAmountRupees, growthPercentage } = revenue;

  const discountRate =
    totalBillAmountRupees > 0 ? ((discountRupees / totalBillAmountRupees) * 100).toFixed(1) : "0.0";

  return (
    <div
      className={
        className ?? "grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2.5 md:gap-3.5 lg:gap-4"
      }
    >
      {/* 1. Net Sales */}
      <AnalyticsMetricCard
        label="Net Sales"
        value={formatCurrency(netSalesRupees)}
        icon={IndianRupee}
        subtitle="Net sales after discounts"
        trendPercentage={growthPercentage}
        trendText="vs previous period"
        iconBgClassName="bg-emerald-50 border-emerald-200"
        iconClassName="text-emerald-700"
      />

      {/* 2. Total Bill Amount */}
      <AnalyticsMetricCard
        label="Gross Total Bill"
        value={formatCurrency(totalBillAmountRupees)}
        icon={Receipt}
        subtitle="Gross before discounts"
        iconBgClassName="bg-[#fef3ec] border-[#fae2d3]"
        iconClassName="text-[#9a3412]"
      />

      {/* 3. Total Discounts */}
      <AnalyticsMetricCard
        label="Discounts Given"
        value={formatCurrency(discountRupees)}
        icon={Percent}
        subtitle={`${discountRate}% of total billing`}
        iconBgClassName="bg-amber-50 border-amber-200"
        iconClassName="text-amber-700"
      />

      {/* 4. Revenue Growth */}
      <AnalyticsMetricCard
        label="Revenue Growth"
        value={`${growthPercentage > 0 ? "+" : ""}${growthPercentage}%`}
        icon={TrendingUp}
        subtitle="Period over period"
        trendPercentage={growthPercentage}
        iconBgClassName="bg-sky-50 border-sky-200"
        iconClassName="text-sky-700"
      />
    </div>
  );
}
