import { TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionUnavailableFallback } from "@/features/dashboard/components/admin/SectionUnavailableFallback";
import {
  ANALYTICS_SECTION_STATUSES,
  REVENUE_TIMELINE_CONSTANTS,
} from "@/features/dashboard/constants/platform-analytics.constants";
import type {
  RevenueSection,
  RevenueTimelinePoint,
} from "@/features/dashboard/types/platform-analytics.types";
import {
  formatNumber,
  formatPercentage,
  formatRupees,
} from "@/features/dashboard/utils/platform-analytics.utils";

export interface RevenueTimelineChartProps {
  revenue?: RevenueSection;
  isLoading?: boolean;
  onRetry?: () => void;
}

interface CustomRevenueTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: RevenueTimelinePoint;
  }>;
}

function CustomRevenueTooltip({ active, payload }: CustomRevenueTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;
  if (!data) return null;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 text-xs text-white shadow-xl backdrop-blur-xs pointer-events-none z-50">
      <div className="font-bold text-slate-100 border-b border-slate-800 pb-1.5 mb-2">
        {data.bucketLabel}
      </div>
      <div className="space-y-1.5 text-[11px] text-slate-300">
        <div className="flex items-center justify-between gap-6">
          <span className="text-slate-400">{REVENUE_TIMELINE_CONSTANTS.TOOLTIP_GROSS}</span>
          <strong className="text-white font-bold">{formatRupees(data.grossRevenueRupees)}</strong>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-slate-400">{REVENUE_TIMELINE_CONSTANTS.TOOLTIP_MRR}</span>
          <strong className="text-emerald-400 font-bold">{formatRupees(data.mrrRupees)}</strong>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-slate-400">{REVENUE_TIMELINE_CONSTANTS.TOOLTIP_NEW_SUBSCRIPTIONS}</span>
          <strong className="text-white font-bold">
            {formatNumber(data.newSubscriptionsCount)}
          </strong>
        </div>
      </div>
    </div>
  );
}

export function RevenueTimelineChart({
  revenue,
  isLoading = false,
  onRetry,
}: RevenueTimelineChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
          <div className="flex h-56 items-end gap-3 pt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              <Skeleton key={i} className="h-full flex-1 rounded-t-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (revenue?.status === ANALYTICS_SECTION_STATUSES.UNAVAILABLE) {
    return (
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              {REVENUE_TIMELINE_CONSTANTS.TITLE}
            </CardTitle>
            <p className="text-xs text-slate-500">
              {REVENUE_TIMELINE_CONSTANTS.SUBTITLE}
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <SectionUnavailableFallback
            title={REVENUE_TIMELINE_CONSTANTS.UNAVAILABLE_TITLE}
            serviceName={REVENUE_TIMELINE_CONSTANTS.UNAVAILABLE_SERVICE}
            errorMessage={revenue.error?.message}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const timeline = revenue?.timeline ?? [];
  const growth = revenue?.growthPercentage;

  return (
    <Card className="border-slate-200/80 bg-white shadow-2xs">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-slate-900">
              {REVENUE_TIMELINE_CONSTANTS.TITLE}
            </CardTitle>
            {growth != null && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
                <TrendingUp className="size-3" />
                {formatPercentage(growth)}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {REVENUE_TIMELINE_CONSTANTS.SUBTITLE}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        {/* Metric Highlight Summary Boxes */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 mb-6">
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3">
            <p className="text-[11px] font-medium text-slate-500">
              {REVENUE_TIMELINE_CONSTANTS.GROSS_REVENUE_LABEL}
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatRupees(revenue?.grossSubscriptionRevenueRupees)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3">
            <p className="text-[11px] font-medium text-slate-500">
              {REVENUE_TIMELINE_CONSTANTS.MRR_LABEL}
            </p>
            <p className="mt-1 text-lg font-bold text-emerald-700">
              {formatRupees(revenue?.currentMrrRupees)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3">
            <p className="text-[11px] font-medium text-slate-500">
              {REVENUE_TIMELINE_CONSTANTS.ARR_LABEL}
            </p>
            <p className="mt-1 text-lg font-bold text-slate-700">
              {formatRupees(revenue?.currentArrRupees)}
            </p>
          </div>
        </div>

        {/* Timeline Recharts Bar Chart */}
        {timeline.length === 0 ? (
          <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
            {REVENUE_TIMELINE_CONSTANTS.EMPTY_TIMELINE}
          </div>
        ) : (
          <div className="relative pt-2 min-w-0">
            <div className="h-60 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeline}
                  margin={{ top: 12, right: 12, left: -14, bottom: 0 }}
                  onMouseMove={(state) => {
                    if (state?.activeTooltipIndex != null) {
                      setActiveIndex(Number(state.activeTooltipIndex));
                    }
                  }}
                  onMouseLeave={() => {
                    setActiveIndex(null);
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="bucketLabel"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    dy={4}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val: number) => formatRupees(val, true)}
                    width={52}
                  />
                  <Tooltip
                    content={<CustomRevenueTooltip />}
                    cursor={{ fill: "rgba(241, 245, 249, 0.75)" }}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="grossRevenueRupees"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  >
                    {timeline.map((entry, index) => (
                      <Cell
                        key={`bar-cell-${entry.bucketLabel}`}
                        fill={activeIndex === index ? "#0f172a" : "#cbd5e1"}
                        className="transition-colors duration-150 cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <span>{REVENUE_TIMELINE_CONSTANTS.FOOTER_TIMEZONE}</span>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-xs bg-slate-900" />{" "}
                  {REVENUE_TIMELINE_CONSTANTS.LEGEND_GROSS}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
