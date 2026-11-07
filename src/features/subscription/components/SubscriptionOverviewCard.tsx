import { CheckCircle2, CreditCard, Info, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  SUBSCRIPTION_BILLING_CYCLE_LABELS,
  SUBSCRIPTION_RENEWAL_TEXTS,
} from "@/features/subscription/constants/subscription.constants";
import type { SubscriptionOverviewCardProps } from "@/features/subscription/types/subscription.types";
import {
  evaluateRenewalEligibility,
  formatPlanDisplayName,
  formatSubscriptionCalendarDate,
  resolveRenewalPlansByCycle,
} from "@/features/subscription/utils/subscription-renewal.utils";

export function SubscriptionOverviewCard({
  statusData,
  plans = [],
  isLoading = false,
  isError = false,
  onRenewClick,
  onSubscribeClick,
  now,
}: SubscriptionOverviewCardProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  if (isLoading) {
    return (
      <section
        aria-busy="true"
        data-testid="subscription-overview-card-loading"
        aria-label={SUBSCRIPTION_RENEWAL_TEXTS.OVERVIEW_LOADING_TEXT}
        className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/60 p-5"
      >
        <p className="text-xs font-medium text-neutral-500">
          {SUBSCRIPTION_RENEWAL_TEXTS.OVERVIEW_CARD_TITLE}
        </p>
        <Skeleton className="mt-2 h-7 w-40 rounded-md" />
        <Skeleton className="mt-2 h-4 w-32 rounded-md" />
      </section>
    );
  }

  const isSubscriptionActive = Boolean(statusData?.isSubscriptionActive);
  const endsAtIso =
    statusData?.subscription?.currentPeriodEnd ?? statusData?.subscriptionEndsAt ?? null;
  const planCode = statusData?.subscription?.planCode ?? statusData?.subscriptionPlanCode ?? null;
  const planName = statusData?.subscription?.planName ?? null;
  const planDisplayName = formatPlanDisplayName(planName, planCode);
  const eligibility = evaluateRenewalEligibility(statusData, now);
  const plansByCycle = resolveRenewalPlansByCycle(plans, planCode);
  const hasResolvedPlan = Boolean(plansByCycle.MONTHLY || plansByCycle.YEARLY);
  const cycleLabel = hasResolvedPlan
    ? SUBSCRIPTION_BILLING_CYCLE_LABELS[plansByCycle.initialCycle]
    : null;

  const isDisabledWithTooltip = eligibility.isOutsideWindow && Boolean(eligibility.tooltipMessage);
  const canLaunchRenewal = !isError && eligibility.isEligible;

  return (
    <div
      data-testid="subscription-overview-card"
      className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/60 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-neutral-500">
            {SUBSCRIPTION_RENEWAL_TEXTS.OVERVIEW_CARD_TITLE}
          </p>

          {isSubscriptionActive ? (
            <div className="mt-2 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" aria-hidden="true" />
                <span className="text-xl font-bold text-neutral-900">{planDisplayName}</span>
                {cycleLabel && (
                  <span className="rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-neutral-600">
                    {cycleLabel}
                  </span>
                )}
              </div>
              {endsAtIso && (
                <p
                  data-testid="subscription-overview-expiry"
                  className="text-xs font-medium text-neutral-600"
                >
                  {`${SUBSCRIPTION_RENEWAL_TEXTS.OVERVIEW_EXPIRES_ON_PREFIX} ${formatSubscriptionCalendarDate(endsAtIso)}`}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-2">
              <span className="text-lg font-medium text-amber-700">
                {SUBSCRIPTION_RENEWAL_TEXTS.OVERVIEW_STATUS_INACTIVE}
              </span>
            </div>
          )}
        </div>

        {isSubscriptionActive ? (
          <div className="relative shrink-0">
            {isDisabledWithTooltip ? (
              <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      aria-disabled="true"
                      data-testid="overview-renew-button"
                      onClick={(event) => {
                        event.preventDefault();
                        setTooltipOpen((prev) => !prev);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-400 cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                      <RefreshCw className="size-3.5" aria-hidden="true" />
                      {SUBSCRIPTION_RENEWAL_TEXTS.RENEW_NOW_BUTTON}
                      <Info className="size-3.5 text-neutral-400" aria-hidden="true" />
                    </button>
                  }
                />
                <TooltipContent data-testid="renewal-eligibility-tooltip" className="max-w-[240px]">
                  {eligibility.tooltipMessage}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!canLaunchRenewal}
                onClick={onRenewClick}
                data-testid="overview-renew-button"
                className="gap-1.5 border-orange-200 bg-white text-orange-700 hover:bg-orange-50 hover:text-orange-800"
              >
                <RefreshCw className="size-3.5" aria-hidden="true" />
                {SUBSCRIPTION_RENEWAL_TEXTS.RENEW_NOW_BUTTON}
              </Button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={onSubscribeClick}
            data-testid="overview-subscribe-button"
            className="flex items-center gap-1 text-sm font-semibold text-orange-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md px-1"
          >
            <CreditCard className="size-4" aria-hidden="true" />
            {SUBSCRIPTION_RENEWAL_TEXTS.SUBSCRIBE_BUTTON}
          </button>
        )}
      </div>
    </div>
  );
}
