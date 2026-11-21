import { formatSubscriptionCalendarDate } from "@/features/subscription/utils/subscription-renewal.utils";
import { formatCurrency } from "@/lib/utils/currency";

interface RenewalCurrentSubscriptionProps {
  currentPlanDisplayName: string;
  currentCycleLabel: string;
  endsAtIso: string | null;
  selectedCycleLabel: string;
  hasValidPlanAndPrice: boolean;
  selectedPlanPrice?: number;
  selectedPlanCurrency?: string;
}

export function RenewalCurrentSubscription({
  currentPlanDisplayName,
  currentCycleLabel,
  endsAtIso,
  selectedCycleLabel,
  hasValidPlanAndPrice,
  selectedPlanPrice,
  selectedPlanCurrency,
}: RenewalCurrentSubscriptionProps) {
  return (
    <section
      aria-label="Current Subscription"
      className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 space-y-3"
    >
      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
        Current Subscription
      </h4>
      <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-sm">
        <div>
          <dt className="text-xs text-neutral-500">Current Plan</dt>
          <dd data-testid="modal-current-plan" className="font-semibold text-neutral-900">
            {currentPlanDisplayName}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-neutral-500">Current Billing Cycle</dt>
          <dd data-testid="modal-current-cycle" className="font-semibold text-neutral-900">
            {currentCycleLabel}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-neutral-500">Current Expiry Date</dt>
          <dd data-testid="modal-current-expiry" className="font-semibold text-neutral-900">
            {formatSubscriptionCalendarDate(endsAtIso)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-neutral-500">Selected Renewal Cycle</dt>
          <dd data-testid="modal-selected-cycle" className="font-semibold text-neutral-900">
            {selectedCycleLabel}
          </dd>
        </div>
        <div className="sm:col-span-2 pt-2 border-t border-neutral-200 flex items-center justify-between">
          <dt className="text-xs font-medium text-neutral-600">Renewal Price</dt>
          <dd
            data-testid="modal-renewal-price"
            className="text-base font-bold text-orange-700"
          >
            {hasValidPlanAndPrice && selectedPlanPrice != null
              ? `${formatCurrency(selectedPlanPrice)} (${selectedPlanCurrency || "INR"})`
              : "N/A"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
