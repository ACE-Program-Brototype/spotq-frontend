import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { RevenueSection } from "../../types/platform-analytics.types";
import { formatNumber, formatPercentage, formatRupees } from "../../utils/platform-analytics.utils";
import { SectionUnavailableFallback } from "./SectionUnavailableFallback";

export interface RevenueTimelineChartProps {
  revenue?: RevenueSection;
  isLoading?: boolean;
  onRetry?: () => void;
}

export function RevenueTimelineChart({
  revenue,
  isLoading = false,
  onRetry,
}: RevenueTimelineChartProps) {
  const [activeBucket, setActiveBucket] = useState<number | null>(null);

  if (isLoading) {
    return (
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
          <div className="flex h-48 items-end gap-3 pt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              <Skeleton key={i} className="h-full flex-1 rounded-t-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (revenue?.status === "UNAVAILABLE") {
    return (
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Revenue & Growth Timeline
            </CardTitle>
            <p className="text-xs text-slate-500">
              Subscription revenue performance & monthly revenue run-rate
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <SectionUnavailableFallback
            title="Subscription Revenue Metrics Unavailable"
            serviceName="spotq-payment-service"
            errorMessage={revenue.error?.message}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const timeline = revenue?.timeline ?? [];
  const maxRevenue = Math.max(...timeline.map((t) => t.grossRevenueRupees), 1000);
  const growth = revenue?.growthPercentage;

  return (
    <Card className="border-slate-200/80 bg-white shadow-2xs">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-slate-900">
              Revenue & Growth Timeline
            </CardTitle>
            {growth !== null && growth !== undefined && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
                <TrendingUp className="size-3" />
                {formatPercentage(growth)}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Subscription revenue performance & monthly revenue run-rate
          </p>
        </div>
      </CardHeader>

      <CardContent>
        {/* Metric Highlight Summary Boxes */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 mb-6">
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3">
            <p className="text-[11px] font-medium text-slate-500">Gross Subscription Revenue</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatRupees(revenue?.grossSubscriptionRevenueRupees)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3">
            <p className="text-[11px] font-medium text-slate-500">Monthly Revenue</p>
            <p className="mt-1 text-lg font-bold text-emerald-700">
              {formatRupees(revenue?.currentMrrRupees)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3">
            <p className="text-[11px] font-medium text-slate-500">Annual Revenue</p>
            <p className="mt-1 text-lg font-bold text-slate-700">
              {formatRupees(revenue?.currentArrRupees)}
            </p>
          </div>
        </div>

        {/* Timeline Bar Chart */}
        {timeline.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
            No revenue activity recorded in selected timeframe.
          </div>
        ) : (
          <div className="relative pt-6">
            {/* Tooltip Overlay */}
            {activeBucket !== null && timeline[activeBucket] && (
              <div className="mb-3 rounded-lg border border-slate-200 bg-slate-900 p-2.5 text-xs text-white shadow-md transition-all">
                <div className="font-semibold text-slate-100">
                  {timeline[activeBucket].bucketLabel}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-300">
                  <span>
                    Gross Revenue:{" "}
                    <strong className="text-white">
                      {formatRupees(timeline[activeBucket].grossRevenueRupees)}
                    </strong>
                  </span>
                  <span>
                    Monthly Revenue:{" "}
                    <strong className="text-white">
                      {formatRupees(timeline[activeBucket].mrrRupees)}
                    </strong>
                  </span>
                  <span>
                    New Subscriptions:{" "}
                    <strong className="text-white">
                      {formatNumber(timeline[activeBucket].newSubscriptionsCount)}
                    </strong>
                  </span>
                </div>
              </div>
            )}

            {/* Bars container */}
            <div className="flex h-52 items-end gap-2 sm:gap-4 border-b border-slate-200 pb-2">
              {timeline.map((point, index) => {
                const heightPercent = Math.max(
                  Math.round((point.grossRevenueRupees / maxRevenue) * 100),
                  6,
                );
                const isHovered = activeBucket === index;

                return (
                  <div
                    key={point.bucketLabel}
                    className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-pointer"
                    onMouseEnter={() => setActiveBucket(index)}
                    onMouseLeave={() => setActiveBucket(null)}
                  >
                    {/* Amount pill above bar */}
                    <span
                      className={`mb-1.5 text-[10px] font-semibold transition-colors ${
                        isHovered ? "text-slate-900 font-bold" : "text-slate-400"
                      }`}
                    >
                      {formatRupees(point.grossRevenueRupees, true)}
                    </span>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[42px] rounded-t-md transition-all ${
                        isHovered ? "bg-slate-900 shadow-xs" : "bg-slate-300 hover:bg-slate-400"
                      }`}
                    />

                    {/* X-axis label */}
                    <span className="mt-2 text-[10px] sm:text-xs font-medium text-slate-500 truncate max-w-[60px] text-center">
                      {point.bucketLabel}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>Timeline breakdown (Asia/Kolkata)</span>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-sm bg-slate-900" /> Gross Revenue
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
