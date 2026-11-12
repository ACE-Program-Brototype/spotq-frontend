import { CheckCircle2, CreditCard, Info, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SUBSCRIPTION_BILLING_CYCLE_LABELS } from "@/features/subscription/constants/subscription.constants";
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
        aria-label="Loading subscription details..."
        className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/60 p-5"
      >
        <p className="text-xs font-medium text-neutral-500">Subscription</p>
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
      className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/60 px-2.5 py-1 md:p-4 flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-center gap-2 md:gap-1.5 shrink-0 md:shrink"
    >
      <div className="flex items-center md:block gap-1.5 md:space-y-1 min-w-0">
        <p className="hidden md:block text-xs font-medium text-neutral-500">Subscription</p>

        {isSubscriptionActive ? (
          <div className="flex items-center md:block gap-1.5 md:mt-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
              <CheckCircle2
                className="size-3.5 md:size-5 text-emerald-600 shrink-0"
                aria-hidden="true"
              />
              <span className="text-xs sm:text-sm md:text-xl font-semibold md:font-bold text-neutral-900 truncate">
                {planDisplayName}
              </span>
              {cycleLabel && (
                <span className="hidden md:inline-block rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-neutral-600">
                  {cycleLabel}
                </span>
              )}

              {/* Renew button right next to Queue Pro */}
              <div className="relative shrink-0 md:ml-2">
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
                          className="inline-flex items-center gap-1 md:gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100 px-2 py-0.5 md:px-2.5 md:py-1 text-xs font-semibold text-neutral-400 cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                        >
                          <RefreshCw className="size-3 md:size-3.5" aria-hidden="true" />
                          <span>Renew Now</span>
                          <Info
                            className="size-3 md:size-3.5 text-neutral-400 hidden md:inline"
                            aria-hidden="true"
                          />
                        </button>
                      }
                    />
                    <TooltipContent
                      data-testid="renewal-eligibility-tooltip"
                      className="max-w-[240px]"
                    >
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
                    className="h-6 md:h-7 px-2 md:px-2.5 text-xs gap-1 md:gap-1.5 border-orange-200 bg-white text-orange-700 hover:bg-orange-50 hover:text-orange-800 shadow-2xs"
                  >
                    <RefreshCw className="size-3 md:size-3.5" aria-hidden="true" />
                    <span>Renew Now</span>
                  </Button>
                )}
              </div>
            </div>

            {endsAtIso && (
              <p
                data-testid="subscription-overview-expiry"
                className="text-[11px] md:text-xs font-normal md:font-medium text-neutral-500 md:text-neutral-600 truncate hidden min-[440px]:inline md:block md:mt-0.5"
              >
                <span className="md:hidden">
                  ({`Expires ${formatSubscriptionCalendarDate(endsAtIso)}`})
                </span>
                <span className="hidden md:inline">
                  {`Expires ${formatSubscriptionCalendarDate(endsAtIso)}`}
                </span>
              </p>
            )}
          </div>
        ) : (
          <div className="mt-0 md:mt-1 flex items-center gap-2">
            <span className="text-xs md:text-lg font-semibold md:font-medium text-amber-700">
              Inactive
            </span>
            <button
              type="button"
              onClick={onSubscribeClick}
              data-testid="overview-subscribe-button"
              className="flex items-center gap-1 text-xs md:text-sm font-semibold text-orange-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md px-1"
            >
              <CreditCard className="size-3.5 md:size-4" aria-hidden="true" />
              <span>Subscribe</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
