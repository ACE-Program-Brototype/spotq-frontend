import { Dialog } from "@base-ui/react/dialog";
import { AlertCircle, Calendar, CheckCircle2, Loader2, RefreshCw, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  SUBSCRIPTION_BILLING_CYCLE_LABELS,
  SUBSCRIPTION_BILLING_CYCLE_OPTIONS,
  SUBSCRIPTION_RENEWAL_TEXTS,
} from "@/features/subscription/constants/subscription.constants";
import { useSubscriptionRenewal } from "@/features/subscription/hooks/useSubscriptionRenewal";
import type {
  BillingCycle,
  RenewalModalProps,
} from "@/features/subscription/types/subscription.types";
import {
  calculateProposedRenewalTerm,
  formatPlanDisplayName,
  formatSubscriptionCalendarDate,
  resolveRenewalPlansByCycle,
} from "@/features/subscription/utils/subscription-renewal.utils";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/currency";

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

  const planCode = statusData?.subscription?.planCode ?? statusData?.subscriptionPlanCode ?? null;
  const planName = statusData?.subscription?.planName ?? null;
  const endsAtIso =
    statusData?.subscription?.currentPeriodEnd ?? statusData?.subscriptionEndsAt ?? null;
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
    selectedPlan?.name ?? planName,
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
                {SUBSCRIPTION_RENEWAL_TEXTS.MODAL_TITLE}
              </Dialog.Title>
              <Dialog.Description
                id={descriptionId}
                className="text-xs sm:text-sm text-neutral-500 leading-relaxed"
              >
                {SUBSCRIPTION_RENEWAL_TEXTS.MODAL_DESCRIPTION}
              </Dialog.Description>
            </div>

            <button
              type="button"
              onClick={() => handleDialogOpenChange(false)}
              disabled={isSubmitting}
              aria-label={SUBSCRIPTION_RENEWAL_TEXTS.CLOSE_MODAL_ARIA_LABEL}
              data-testid="renewal-modal-close-button"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-40"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <section
            aria-label={SUBSCRIPTION_RENEWAL_TEXTS.SUMMARY_SECTION_TITLE}
            className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 space-y-3"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {SUBSCRIPTION_RENEWAL_TEXTS.SUMMARY_SECTION_TITLE}
            </h4>
            <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-xs text-neutral-500">
                  {SUBSCRIPTION_RENEWAL_TEXTS.CURRENT_PLAN_LABEL}
                </dt>
                <dd data-testid="modal-current-plan" className="font-semibold text-neutral-900">
                  {currentPlanDisplayName}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">
                  {SUBSCRIPTION_RENEWAL_TEXTS.CURRENT_CYCLE_LABEL}
                </dt>
                <dd data-testid="modal-current-cycle" className="font-semibold text-neutral-900">
                  {currentCycleLabel}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">
                  {SUBSCRIPTION_RENEWAL_TEXTS.CURRENT_EXPIRY_LABEL}
                </dt>
                <dd data-testid="modal-current-expiry" className="font-semibold text-neutral-900">
                  {formatSubscriptionCalendarDate(endsAtIso)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">
                  {SUBSCRIPTION_RENEWAL_TEXTS.SELECTED_CYCLE_LABEL}
                </dt>
                <dd data-testid="modal-selected-cycle" className="font-semibold text-neutral-900">
                  {selectedCycleLabel}
                </dd>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-neutral-200 flex items-center justify-between">
                <dt className="text-xs font-medium text-neutral-600">
                  {SUBSCRIPTION_RENEWAL_TEXTS.RENEWAL_PRICE_LABEL}
                </dt>
                <dd
                  data-testid="modal-renewal-price"
                  className="text-base font-bold text-orange-700"
                >
                  {hasValidPlanAndPrice && selectedPlan
                    ? `${formatCurrency(selectedPlan.priceInRupees)} (${selectedPlan.currency})`
                    : SUBSCRIPTION_RENEWAL_TEXTS.NOT_AVAILABLE_FALLBACK}
                </dd>
              </div>
            </dl>
          </section>

          <section className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {SUBSCRIPTION_RENEWAL_TEXTS.BILLING_CYCLE_SECTION_TITLE}
            </h4>

            {isLoadingPlans ? (
              <div
                data-testid="modal-plans-loading"
                className="flex items-center gap-2 rounded-xl border border-neutral-200 p-4 text-sm text-neutral-600"
              >
                <Loader2 className="size-4 animate-spin text-orange-600" aria-hidden="true" />
                <span>{SUBSCRIPTION_RENEWAL_TEXTS.PLANS_LOADING_TEXT}</span>
              </div>
            ) : isPlansError ? (
              <div
                role="alert"
                data-testid="modal-plans-error"
                className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"
              >
                <span>{SUBSCRIPTION_RENEWAL_TEXTS.PLANS_LOAD_ERROR_TEXT}</span>
                {onRetryPlans && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={onRetryPlans}
                    className="gap-1.5 border-red-200 bg-white text-red-800 hover:bg-red-100 shrink-0"
                  >
                    <RefreshCw className="size-3.5" aria-hidden="true" />
                    {SUBSCRIPTION_RENEWAL_TEXTS.RETRY_PLANS_BUTTON}
                  </Button>
                )}
              </div>
            ) : (
              <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2 border-0 p-0 m-0">
                <legend className="sr-only">
                  {SUBSCRIPTION_RENEWAL_TEXTS.BILLING_CYCLE_SECTION_TITLE}
                </legend>
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
                      onClick={() => handleSelectCycle(cycle)}
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
                          : SUBSCRIPTION_RENEWAL_TEXTS.CYCLE_UNAVAILABLE_LABEL}
                      </span>
                    </button>
                  );
                })}
              </fieldset>
            )}

            {!isLoadingPlans && !isPlansError && !hasValidPlanAndPrice && (
              <p role="alert" className="text-xs font-medium text-amber-800">
                {SUBSCRIPTION_RENEWAL_TEXTS.NO_VALID_PRICE_TEXT}
              </p>
            )}
          </section>

          {termPreview && (
            <section
              aria-label={SUBSCRIPTION_RENEWAL_TEXTS.TERM_PREVIEW_SECTION_TITLE}
              data-testid="renewal-term-preview"
              className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-2"
            >
              <div className="flex items-center gap-2 text-amber-950">
                <Calendar className="size-4 text-amber-700 shrink-0" aria-hidden="true" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {SUBSCRIPTION_RENEWAL_TEXTS.TERM_PREVIEW_SECTION_TITLE}
                </h4>
              </div>
              <p
                data-testid="renewal-term-preview-text"
                className="text-sm font-bold text-neutral-900"
              >
                {termPreview.previewText}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div>
                  <span className="text-neutral-500 block">
                    {SUBSCRIPTION_RENEWAL_TEXTS.CURRENT_EXPIRY_LABEL}
                  </span>
                  <span className="font-semibold text-neutral-800">
                    {termPreview.formattedCurrentExpiry}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">
                    {SUBSCRIPTION_RENEWAL_TEXTS.PROPOSED_EXPIRY_LABEL}
                  </span>
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
                  ? SUBSCRIPTION_RENEWAL_TEXTS.EXPIRED_SUBSCRIPTION_NOTE
                  : SUBSCRIPTION_RENEWAL_TEXTS.ACTIVE_EXTENSION_NOTE}
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
              {SUBSCRIPTION_RENEWAL_TEXTS.CANCEL_BUTTON}
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
                  {SUBSCRIPTION_RENEWAL_TEXTS.PROCESSING_RENEWAL_BUTTON}
                </>
              ) : (
                SUBSCRIPTION_RENEWAL_TEXTS.CONTINUE_TO_PAYMENT_BUTTON
              )}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
