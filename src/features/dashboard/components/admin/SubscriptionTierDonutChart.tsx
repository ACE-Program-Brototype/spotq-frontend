import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlatformOverview } from "../../types/platform-analytics.types";
import { formatNumber, sanitizeTierLabel } from "../../utils/platform-analytics.utils";

export interface SubscriptionTierDonutChartProps {
  overview?: PlatformOverview;
  isLoading?: boolean;
}

const TIER_COLORS = [
  "#0F172A", // Slate 900 (e.g. QUEUE_PRO / main tier)
  "#475569", // Slate 600 (e.g. ENTERPRISE)
  "#64748B", // Slate 500
  "#94A3B8", // Slate 400 (e.g. BASIC / SPOTQ_PRO)
  "#CBD5E1", // Slate 300 (e.g. NOT_SUBSCRIBED / TRIAL)
  "#E2E8F0", // Slate 200
];

export function SubscriptionTierDonutChart({
  overview,
  isLoading = false,
}: SubscriptionTierDonutChartProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Skeleton className="size-40 rounded-full" />
          <div className="mt-6 space-y-2 w-full">
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const rawDistribution = overview?.subscriptionTierDistribution;
  const isAvailable = rawDistribution !== null && rawDistribution !== undefined;
  const totalRestaurants = overview?.totalRestaurants ?? 0;
  const activeSubscribed = overview?.activeSubscribedRestaurants ?? 0;

  const totalTierCount = isAvailable
    ? Object.values(rawDistribution).reduce((sum, c) => sum + c, 0)
    : 0;

  const denominator =
    totalTierCount > 0 ? totalTierCount : totalRestaurants > 0 ? totalRestaurants : 1;

  const tiers = isAvailable
    ? Object.entries(rawDistribution).map(([tier, count], index) => {
        const color = TIER_COLORS[index % TIER_COLORS.length];
        const percentage = Math.round((count / denominator) * 100);
        return {
          tier,
          label: sanitizeTierLabel(tier),
          count,
          percentage,
          color,
        };
      })
    : [];

  // Donut geometry constants
  const radius = 62;
  const circumference = 2 * Math.PI * radius; // ~389.55
  let cumulativeOffset = 0;

  return (
    <Card className="border-slate-200/80 bg-white shadow-2xs flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-900">Subscription Tiers</CardTitle>
        <p className="text-xs text-slate-500">Tier distribution across partner restaurants</p>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-between flex-1 pt-2 pb-4">
        {!isAvailable || tiers.length === 0 ? (
          <div className="flex h-56 w-full items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
            Subscription tier data currently unavailable.
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {/* SVG Donut Centered on Top */}
            <div className="relative flex shrink-0 items-center justify-center my-3">
              <svg width="168" height="168" viewBox="0 0 168 168" className="rotate-[-90deg]">
                {/* Background ring */}
                <circle
                  cx="84"
                  cy="84"
                  r={radius}
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="20"
                />

                {/* Segments */}
                {tiers.map((t) => {
                  const strokeDash = (t.percentage / 100) * circumference;
                  const offset = cumulativeOffset;
                  cumulativeOffset += strokeDash;

                  return (
                    <circle
                      key={t.tier}
                      cx="84"
                      cy="84"
                      r={radius}
                      fill="none"
                      stroke={t.color}
                      strokeWidth="20"
                      strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
                      strokeDashoffset={-offset}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>

              {/* Center Metric Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-slate-900">
                  {formatNumber(activeSubscribed)}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Subscribed ({formatNumber(totalRestaurants)})
                </span>
              </div>
            </div>

            {/* Legend Under the Donut */}
            <div className="mt-4 w-full space-y-2">
              {tiers.map((t) => (
                <div
                  key={t.tier}
                  className="flex items-center justify-between rounded-lg border border-slate-200/70 bg-slate-50/60 px-3.5 py-2 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="size-3 shrink-0 rounded-xs"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="text-xs font-semibold text-slate-800 truncate" title={t.label}>
                      {t.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-extrabold text-slate-900">
                      {formatNumber(t.count)}
                    </span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                      {t.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
