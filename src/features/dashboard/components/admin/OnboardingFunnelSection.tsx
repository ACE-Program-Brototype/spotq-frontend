import { ArrowDown, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ONBOARDING_FUNNEL_STAGES } from "@/features/dashboard/constants/platform-analytics.constants";
import type { FunnelStageItem } from "@/features/dashboard/types/platform-analytics.types";
import { formatNumber } from "@/features/dashboard/utils/platform-analytics.utils";

export interface OnboardingFunnelSectionProps {
  funnel?: FunnelStageItem[];
  isLoading?: boolean;
}

export function OnboardingFunnelSection({
  funnel = [],
  isLoading = false,
}: OnboardingFunnelSectionProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  // Only Verified and Approved statuses are required
  const registeredStage =
    funnel.find((f) => f.stage === ONBOARDING_FUNNEL_STAGES.REGISTERED) || funnel[0];
  const approvedStage =
    funnel.find(
      (f) =>
        f.stage === ONBOARDING_FUNNEL_STAGES.APPROVED_ACTIVE ||
        f.stage === ONBOARDING_FUNNEL_STAGES.APPROVED ||
        f.label?.toLowerCase().includes("approved"),
    ) || funnel[funnel.length - 1];

  const stage1 = registeredStage
    ? {
        count: registeredStage.count,
        label: "Email Verified / Logged In",
        subtitle: "Initial restaurant owner registration and email verification completed",
      }
    : null;

  const stage2 =
    approvedStage && approvedStage !== registeredStage
      ? {
          count: approvedStage.count,
          label: "Verified by Admin & Live",
          subtitle: "Approved by Platform Superadmin, active and taking orders/queues",
        }
      : null;

  const conversionRate =
    stage1 && stage2 && stage1.count > 0 ? Math.round((stage2.count / stage1.count) * 100) : null;

  return (
    <Card className="border-slate-200/80 bg-white shadow-2xs">
      <CardHeader className="pb-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900">
            Restaurant Onboarding Funnel
          </CardTitle>
          <p className="text-xs text-slate-500">Merchant onboarding progression stages</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        {!stage1 ? (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
            No onboarding activity in this period.
          </div>
        ) : (
          <>
            {/* Stage 1: Email Verified */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 sm:p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                  1
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{stage1.label}</h4>
                  <p className="text-[11px] text-slate-500 hidden sm:block">{stage1.subtitle}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {formatNumber(stage1.count)}
                </span>
                <span className="block text-[10px] text-slate-400 uppercase font-medium">
                  Registered
                </span>
              </div>
            </div>

            {/* Conversion Connector */}
            {conversionRate !== null && (
              <div className="flex items-center justify-center gap-2 py-0.5 text-xs text-slate-500">
                <ArrowDown className="size-3.5 text-slate-400" />
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
                  {conversionRate}% completion rate
                </span>
              </div>
            )}

            {/* Stage 2: Approved & Live */}
            {stage2 && (
              <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    <Check className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{stage2.label}</h4>
                    <p className="text-[11px] text-slate-500 hidden sm:block">{stage2.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-extrabold text-emerald-700">
                    {formatNumber(stage2.count)}
                  </span>
                  <span className="block text-[10px] text-emerald-600/80 uppercase font-medium">
                    Live Venues
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
