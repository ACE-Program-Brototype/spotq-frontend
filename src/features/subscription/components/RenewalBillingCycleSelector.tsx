import { CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SUBSCRIPTION_BILLING_CYCLE_LABELS,
  SUBSCRIPTION_BILLING_CYCLE_OPTIONS,
} from "@/features/subscription/constants/subscription.constants";
import type { BillingCycle, SubscriptionPlan } from "@/features/subscription/types/subscription.types";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/currency";

interface RenewalBillingCycleSelectorProps {
  isLoadingPlans: boolean;
  isPlansError: boolean;
  onRetryPlans?: () => void;
  plansByCycle: Record<BillingCycle, SubscriptionPlan | null>;
  selectedCycle: BillingCycle;
  isSubmitting: boolean;
  hasValidPlanAndPrice: boolean;
  onSelectCycle: (cycle: BillingCycle) => void;
}

export function RenewalBillingCycleSelector({
  isLoadingPlans,
  isPlansError,
  onRetryPlans,
  plansByCycle,
  selectedCycle,
  isSubmitting,
  hasValidPlanAndPrice,
  onSelectCycle,
}: RenewalBillingCycleSelectorProps) {
  return (
    <section className="space-y-2.5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
        Select Billing Cycle
      </h4>

      {isLoadingPlans ? (
        <div
          data-testid="modal-plans-loading"
          className="flex items-center gap-2 rounded-xl border border-neutral-200 p-4 text-sm text-neutral-600"
        >
          <Loader2 className="size-4 animate-spin text-orange-600" aria-hidden="true" />
          <span>Loading available billing cycles...</span>
        </div>
      ) : isPlansError ? (
        <div
          role="alert"
          data-testid="modal-plans-error"
          className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"
        >
          <span>Unable to load renewal pricing right now. Please retry.</span>
          {onRetryPlans && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onRetryPlans}
              className="gap-1.5 border-red-200 bg-white text-red-800 hover:bg-red-100 shrink-0"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Retry
            </Button>
          )}
        </div>
      ) : (
        <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2 border-0 p-0 m-0">
          <legend className="sr-only">Select Billing Cycle</legend>
          {SUBSCRIPTION_BILLING_CYCLE_OPTIONS.map((cycle) => {
            const planOption = plansByCycle[cycle];
            const isSupported = Boolean(planOption);
            const isSelected = selectedCycle === cycle && isSupported;

            return (
              <button
                key={cycle}
                type="button"
                aria-pressed={isSelected}
                disabled={!isSupported || isSubmitting}
                data-testid={`cycle-option-${cycle.toLowerCase()}`}
                onClick={() => onSelectCycle(cycle)}
                className={cn(
                  "flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                  isSelected
                    ? "border-orange-600 bg-orange-50/70 ring-1 ring-orange-600"
                    : isSupported
                      ? "border-neutral-200 bg-white hover:border-orange-300"
                      : "border-neutral-200 bg-neutral-100/80 opacity-60 cursor-not-allowed",
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-bold text-neutral-900">
                    {SUBSCRIPTION_BILLING_CYCLE_LABELS[cycle]}
                  </span>
                  {isSelected && (
                    <CheckCircle2
                      className="size-4 text-orange-600 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <span className="mt-1 text-xs font-semibold text-neutral-700">
                  {planOption
                    ? `${formatCurrency(planOption.priceInRupees)} / ${SUBSCRIPTION_BILLING_CYCLE_LABELS[cycle].toLowerCase()}`
                    : "Not available for this plan"}
                </span>
              </button>
            );
          })}
        </fieldset>
      )}

      {!isLoadingPlans && !isPlansError && !hasValidPlanAndPrice && (
        <p role="alert" className="text-xs font-medium text-amber-800">
          No valid renewal pricing is available for the selected billing cycle.
        </p>
      )}
    </section>
  );
}
