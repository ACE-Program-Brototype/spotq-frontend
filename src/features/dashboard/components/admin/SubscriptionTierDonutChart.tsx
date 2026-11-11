import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlatformOverview } from "../../types/platform-analytics.types";
import { formatNumber, sanitizeTierLabel } from "../../utils/platform-analytics.utils";
import { ServiceHealthBadge } from "./ServiceHealthBadge";

export interface SubscriptionTierDonutChartProps {
  overview?: PlatformOverview;
  isLoading?: boolean;
}

const TIER_COLORS = [
  "#0F172A", // Slate 900 (e.g. QUEUE_PRO / main tier)
  "#475569", // Slate 600 (e.g. ENTERPRISE)
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
          <div className="mt-4 space-y-2 w-full max-w-[200px]">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const rawDistribution = overview?.subscriptionTierDistribution;
  const isAvailable = rawDistribution !== null && rawDistribution !== undefined;
  const totalRestaurants = overview?.totalRestaurants ?? 0;
  const activeSubscribed = overview?.activeSubscribedRestaurants ?? 0;

  const tiers = isAvailable
    ? Object.entries(rawDistribution).map(([tier, count], index) => {
        const color = TIER_COLORS[index % TIER_COLORS.length];
        const percentage = totalRestaurants > 0 ? Math.round((count / totalRestaurants) * 100) : 0;
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
    <Card className="border-slate-200/80 bg-white shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900">Subscription Tiers</CardTitle>
          <p className="text-xs text-slate-500">Tier distribution across partner restaurants</p>
        </div>
        <ServiceHealthBadge serviceName="payment-svc" isAvailable={isAvailable} />
      </CardHeader>

      <CardContent>
        {!isAvailable || tiers.length === 0 ? (
          <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
            Subscription tier data currently unavailable.
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row pt-2 pb-2">
            {/* SVG Donut */}
            <div className="relative flex shrink-0 items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160" className="rotate-[-90deg]">
                {/* Background ring */}
                <circle
                  cx="80"
                  cy="80"
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
                      cx="80"
                      cy="80"
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
                <span className="text-xl font-extrabold text-slate-900">
                  {formatNumber(activeSubscribed)}
                </span>
                <span className="text-[10px] font-medium text-slate-500">
                  Subscribed ({formatNumber(totalRestaurants)})
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2.5 w-full max-w-[200px]">
              {tiers.map((t) => (
                <div key={t.tier} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="size-2.5 shrink-0 rounded-xs"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="font-semibold text-slate-800 truncate" title={t.label}>
                      {t.label}
                    </span>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className="font-medium text-slate-900">{formatNumber(t.count)}</span>
                    <span className="text-slate-400 ml-1">({t.percentage}%)</span>
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
