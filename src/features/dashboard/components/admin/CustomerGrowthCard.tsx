import { ArrowRight, TrendingUp, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/router/admin/admin.routes.constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionUnavailableFallback } from "@/features/dashboard/components/admin/SectionUnavailableFallback";
import { ANALYTICS_SECTION_STATUSES } from "@/features/dashboard/constants/platform-analytics.constants";
import type { CustomerGrowthSection } from "@/features/dashboard/types/platform-analytics.types";
import { formatNumber } from "@/features/dashboard/utils/platform-analytics.utils";

export interface CustomerGrowthCardProps {
  customerGrowth?: CustomerGrowthSection;
  totalRestaurants?: number;
  periodLabel?: string;
  isLoading?: boolean;
  onRetry?: () => void;
}

export function CustomerGrowthCard({
  customerGrowth,
  periodLabel = "in selected period",
  isLoading = false,
  onRetry,
}: CustomerGrowthCardProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (customerGrowth?.status === ANALYTICS_SECTION_STATUSES.UNAVAILABLE) {
    return (
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardHeader className="pb-3">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Latest User Registrations
            </CardTitle>
            <p className="text-xs text-slate-500">
              Consumer acquisition &amp; registration telemetry
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <SectionUnavailableFallback
            title="User Growth Telemetry Unavailable"
            serviceName="spotq-user-service"
            errorMessage={customerGrowth.error?.message}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const newCustomers = customerGrowth?.newCustomersInPeriod ?? 0;
  const totalCustomers = customerGrowth?.totalRegisteredCustomers ?? 0;

  const growthPercentage =
    totalCustomers > 0 && newCustomers > 0 ? Math.round((newCustomers / totalCustomers) * 100) : 0;

  return (
    <Card className="border-slate-200/80 bg-white shadow-2xs flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <UserPlus className="size-4 text-purple-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              Latest User Registrations
            </CardTitle>
          </div>
          <p className="text-xs text-slate-500">
            Consumer acquisition &amp; community growth for selected period
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1 flex-1 flex flex-col justify-between">
        {/* Hero: New Users Joined Count */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-purple-50/40 p-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <UserPlus className="size-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {formatNumber(newCustomers)}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  New Users Registered
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Registered {periodLabel} (Asia/Kolkata timezone)
              </p>
            </div>
          </div>
          {growthPercentage > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
              <TrendingUp className="size-3" />
              {growthPercentage}% share
            </span>
          )}
        </div>

        {/* Acquisition Context Box */}
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Platform Community Share</span>
            <span className="font-bold text-slate-900">
              {formatNumber(newCustomers)} of {formatNumber(totalCustomers)} Total Users
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(growthPercentage, 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500">
            {growthPercentage}% of the platform&apos;s registered consumer base registered during
            this period.
          </p>
        </div>

        {/* Action: Link to User Management Directory */}
        <Link
          to={ADMIN_ROUTES.CUSTOMERS}
          className="inline-flex items-center justify-center gap-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <span>View All Registered Users</span>
          <ArrowRight className="size-3.5 text-slate-400" />
        </Link>
      </CardContent>
    </Card>
  );
}
