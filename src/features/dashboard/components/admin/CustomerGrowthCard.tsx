import { ShieldCheck, TrendingUp, UserPlus, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CustomerGrowthSection } from "../../types/platform-analytics.types";
import { formatNumber } from "../../utils/platform-analytics.utils";
import { SectionUnavailableFallback } from "./SectionUnavailableFallback";

export interface CustomerGrowthCardProps {
  customerGrowth?: CustomerGrowthSection;
  totalRestaurants?: number;
  periodLabel?: string;
  isLoading?: boolean;
  onRetry?: () => void;
}

export function CustomerGrowthCard({
  customerGrowth,
  totalRestaurants = 0,
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
          <div className="grid grid-cols-2 gap-2.5">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (customerGrowth?.status === "UNAVAILABLE") {
    return (
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Customer Growth &amp; Registrations
            </CardTitle>
            <p className="text-xs text-slate-500">
              Consumer acquisition &amp; registration telemetry
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <SectionUnavailableFallback
            title="Customer Growth Telemetry Unavailable"
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
  const dinersPerVenue =
    totalRestaurants > 0 && totalCustomers > 0
      ? Math.round(totalCustomers / totalRestaurants)
      : null;

  const growthShare =
    totalCustomers > 0 && newCustomers > 0
      ? ((newCustomers / totalCustomers) * 100).toFixed(2)
      : null;

  return (
    <Card className="border-slate-200/80 bg-white shadow-2xs">
      <CardHeader className="pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <UserPlus className="size-4 text-purple-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              New Customer Registrations
            </CardTitle>
          </div>
          <p className="text-xs text-slate-500">
            Real-time consumer registrations &amp; platform community base
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5 pt-1">
        {/* Hero Banner: Prominent New Users Count */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <UserPlus className="size-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {formatNumber(newCustomers)}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  New Users Registered
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Filtered {periodLabel} (Asia/Kolkata timezone)
              </p>
            </div>
          </div>
          {growthShare && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
              <TrendingUp className="size-3" />
              +{growthShare}% growth
            </span>
          )}
        </div>

        {/* Aggregate Platform Network Telemetry Grid */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {/* Total Registered Consumers */}
          <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
              <Users className="size-3 text-slate-400" />
              Total Consumer Base
            </div>
            <p className="mt-1 text-base font-bold text-slate-900">
              {formatNumber(totalCustomers)}
            </p>
            <p className="text-[10px] text-slate-400">Platform-wide registered users</p>
          </div>

          {/* Diners per Venue */}
          <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
              <TrendingUp className="size-3 text-slate-400" />
              Diners per Restaurant
            </div>
            <p className="mt-1 text-base font-bold text-slate-900">
              {dinersPerVenue ? `${dinersPerVenue} diners` : "—"}
            </p>
            <p className="text-[10px] text-slate-400">Average customer network ratio</p>
          </div>
        </div>

        {/* Privacy & Compliance Assurance Banner */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-[11px] text-slate-500">
          <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
          <span>
            Zero consumer PII stored or exposed. Real-time telemetry securely aggregated via User Service S2S.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

