import { Dialog } from "@base-ui/react/dialog";
import { AlertCircle, Calendar, Loader2, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  SUBSCRIPTION_BILLING_CYCLE_LABELS,
} from "@/features/subscription/constants/subscription.constants";
import { useSubscriptionRenewal } from "@/features/subscription/hooks/useSubscriptionRenewal";
import type {
  BillingCycle,
  RenewalModalProps,
} from "@/features/subscription/types/subscription.types";
import {
  calculateProposedRenewalTerm,
  formatPlanDisplayName,
  resolveRenewalPlansByCycle,
} from "@/features/subscription/utils/subscription-renewal.utils";
import { RenewalBillingCycleSelector } from "@/features/subscription/components/RenewalBillingCycleSelector";
import { RenewalCurrentSubscription } from "@/features/subscription/components/RenewalCurrentSubscription";
import { cn } from "@/lib/utils/cn";

export function RenewalModal({
  open,
  onOpenChange,
  statusData,
  plans = [],
  isLoadingPlans = false,
  isPlansError = false,
  onRetryPlans,
  now,
}: RenewalModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const hasUserSelectedCycleRef = useRef(false);
  const wasOpenRef = useRef(false);

  const planCode = statusData?.subscriptionPlanCode ?? null;
  const endsAtIso = statusData?.subscriptionEndsAt ?? null;
  const subscriptionId = statusData?.subscription?.id ?? "";

  const plansByCycle = useMemo(
    () => resolveRenewalPlansByCycle(plans, planCode),
    [plans, planCode],
  );

  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(plansByCycle.initialCycle);

  const { initiateRenewal, isSubmitting, errorMessage, clearError, resetAttemptKey } =
    useSubscriptionRenewal({
      onSuccess: () => {
        hasUserSelectedCycleRef.current = false;
        onOpenChange(false);
      },
    });

  useEffect(() => {
    if (open) {
      if (!wasOpenRef.current) {
        hasUserSelectedCycleRef.current = false;
        setSelectedCycle(plansByCycle.initialCycle);
        clearError();
        resetAttemptKey();
      } else if (!hasUserSelectedCycleRef.current) {
        setSelectedCycle(plansByCycle.initialCycle);
      }
    }
    wasOpenRef.current = open;
  }, [open, plansByCycle.initialCycle, clearError, resetAttemptKey]);

  const selectedPlan = plansByCycle[selectedCycle];
  const hasValidPlanAndPrice =
    Boolean(selectedPlan?.id) &&
    typeof selectedPlan?.priceInRupees === "number" &&
    Number.isFinite(selectedPlan.priceInRupees) &&
    selectedPlan.priceInRupees > 0;

  const termPreview = useMemo(
    () => calculateProposedRenewalTerm(endsAtIso, selectedCycle, now),
    [endsAtIso, selectedCycle, now],
  );

  const currentPlanDisplayName = formatPlanDisplayName(
    selectedPlan?.name,
    selectedPlan?.code ?? planCode,
  );
  const currentCycleLabel = SUBSCRIPTION_BILLING_CYCLE_LABELS[plansByCycle.initialCycle];
  const selectedCycleLabel = SUBSCRIPTION_BILLING_CYCLE_LABELS[selectedCycle];

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) {
      return;
    }
    if (!nextOpen) {
      clearError();
      resetAttemptKey();
    }
    onOpenChange(nextOpen);
  };

  const handleSelectCycle = (cycle: BillingCycle) => {
    if (isSubmitting || !plansByCycle[cycle]) {
      return;
    }
    hasUserSelectedCycleRef.current = true;
    setSelectedCycle(cycle);
    clearError();
  };

  const handleContinueToPayment = async () => {
    if (isSubmitting || !hasValidPlanAndPrice || !selectedPlan || !subscriptionId) {
      return;
    }
    await initiateRenewal(subscriptionId, selectedPlan.id);
  };

  const canSubmit =
    !isLoadingPlans &&
    !isPlansError &&
    !isSubmitting &&
    hasValidPlanAndPrice &&
    Boolean(subscriptionId);

  return (
    <Dialog.Root open={open} onOpenChange={handleDialogOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop
          data-testid="renewal-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        />
        <Dialog.Popup
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          data-testid="renewal-modal"
          className={cn(
            "fixed z-50 flex flex-col gap-5 bg-white text-neutral-900 shadow-2xl outline-none",
            "bottom-0 left-0 right-0 max-h-[92vh] overflow-y-auto rounded-t-3xl border-t border-neutral-200 p-5",
            "sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:right-auto sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:border sm:border-neutral-200 sm:p-6",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Dialog.Title
                id={titleId}
                className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900"
              >
                Renew Subscription
              </Dialog.Title>
              <Dialog.Description
                id={descriptionId}
                className="text-xs sm:text-sm text-neutral-500 leading-relaxed"
              >
                Review your current subscription details and choose a billing cycle to extend
                uninterrupted SpotQ service.
              </Dialog.Description>
            </div>

            <button
              type="button"
              onClick={() => handleDialogOpenChange(false)}
              disabled={isSubmitting}
              aria-label="Close renewal modal"
              data-testid="renewal-modal-close-button"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-40"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <RenewalCurrentSubscription
            currentPlanDisplayName={currentPlanDisplayName}
            currentCycleLabel={currentCycleLabel}
            endsAtIso={endsAtIso}
            selectedCycleLabel={selectedCycleLabel}
            hasValidPlanAndPrice={hasValidPlanAndPrice}
            selectedPlanPrice={selectedPlan?.priceInRupees}
            selectedPlanCurrency={selectedPlan?.currency}
          />

          <RenewalBillingCycleSelector
            isLoadingPlans={isLoadingPlans}
            isPlansError={isPlansError}
            onRetryPlans={onRetryPlans}
            plansByCycle={plansByCycle}
            selectedCycle={selectedCycle}
            isSubmitting={isSubmitting}
            hasValidPlanAndPrice={hasValidPlanAndPrice}
            onSelectCycle={handleSelectCycle}
          />

          {termPreview && (
            <section
              aria-label="Renewal Term Preview"
              data-testid="renewal-term-preview"
              className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-2"
            >
              <div className="flex items-center gap-2 text-amber-950">
                <Calendar className="size-4 text-amber-700 shrink-0" aria-hidden="true" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Renewal Term Preview</h4>
              </div>
              <p
                data-testid="renewal-term-preview-text"
                className="text-sm font-bold text-neutral-900"
              >
                {termPreview.previewText}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div>
                  <span className="text-neutral-500 block">Current Expiry Date</span>
                  <span className="font-semibold text-neutral-800">
                    {termPreview.formattedCurrentExpiry}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Proposed Expiry Date</span>
                  <span
                    data-testid="modal-proposed-expiry"
                    className="font-semibold text-emerald-700"
                  >
                    {termPreview.formattedProposedExpiry}
                  </span>
                </div>
              </div>
              <p className="text-xs text-amber-900/80">
                {termPreview.isExpired
                  ? "Your subscription has expired. The new billing period starts upon payment confirmation."
                  : "Extends directly from your current expiry date with no lost remaining days."}
              </p>
            </section>
          )}

          {errorMessage && (
            <div
              role="alert"
              data-testid="renewal-modal-error"
              className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"
            >
              <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end pt-1">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleDialogOpenChange(false)}
              data-testid="renewal-modal-cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!canSubmit}
              onClick={handleContinueToPayment}
              data-testid="renewal-modal-continue-button"
              className="gap-2 bg-orange-600 text-white hover:bg-orange-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Processing...
                </>
              ) : (
                "Continue to Payment"
              )}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
