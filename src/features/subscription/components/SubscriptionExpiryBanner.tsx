import { AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_RENEWAL_TEXTS } from "@/features/subscription/constants/subscription.constants";
import type { SubscriptionExpiryBannerProps } from "@/features/subscription/types/subscription.types";
import {
  evaluateRenewalEligibility,
  formatExpiryBannerMessage,
  formatPlanDisplayName,
  formatRemainingDaysBadge,
} from "@/features/subscription/utils/subscription-renewal.utils";

export function SubscriptionExpiryBanner({
  statusData,
  isLoading = false,
  isError = false,
  onRenewClick,
  now,
}: SubscriptionExpiryBannerProps) {
  if (isLoading || isError || !statusData) {
    return null;
  }

  const eligibility = evaluateRenewalEligibility(statusData, now);
  if (!eligibility.showExpiryBanner || eligibility.daysRemaining === null) {
    return null;
  }

  const planDisplayName = formatPlanDisplayName(
    statusData.subscription?.planName,
    statusData.subscription?.planCode ?? statusData.subscriptionPlanCode,
  );

  const isExpired = eligibility.daysRemaining !== null && eligibility.daysRemaining < 0;

  return (
    <section
      aria-label={SUBSCRIPTION_RENEWAL_TEXTS.BANNER_REGION_LABEL}
      data-testid="subscription-expiry-banner"
      className="mt-6 overflow-hidden rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50/80 to-orange-50 p-5 sm:p-6 shadow-xs"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
            <AlertTriangle className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-amber-950">
                {isExpired
                  ? SUBSCRIPTION_RENEWAL_TEXTS.BANNER_TITLE_EXPIRED
                  : SUBSCRIPTION_RENEWAL_TEXTS.BANNER_TITLE}
              </h3>
              <span
                data-testid="subscription-expiry-days-badge"
                className="inline-flex items-center rounded-full border border-amber-300 bg-amber-100/90 px-2.5 py-0.5 text-xs font-semibold text-amber-900"
              >
                {formatRemainingDaysBadge(eligibility.daysRemaining)}
              </span>
            </div>
            <p className="mt-1 text-sm text-amber-900/90 leading-relaxed">
              {formatExpiryBannerMessage(planDisplayName, eligibility.daysRemaining)}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={onRenewClick}
          data-testid="banner-renew-now-button"
          className="gap-2 bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500 shrink-0 self-start sm:self-center"
        >
          {SUBSCRIPTION_RENEWAL_TEXTS.RENEW_NOW_BUTTON}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
