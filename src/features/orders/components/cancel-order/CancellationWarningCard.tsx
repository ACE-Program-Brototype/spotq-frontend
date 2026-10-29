/**
 * CancellationWarningCard Component
 * High-contrast informational alert banner outlining kitchen cutoffs and refund expectations.
 */

import { AlertTriangle, Info } from "lucide-react";
import { CANCEL_ORDER_MESSAGES } from "../../constants/cancel-order.constants";

export interface CancellationWarningCardProps {
  className?: string;
}

export function CancellationWarningCard({ className = "" }: CancellationWarningCardProps) {
  return (
    <section
      data-testid="cancellation-warning-card"
      aria-label={CANCEL_ORDER_MESSAGES.WARNING_TITLE}
      className={`rounded-2xl border border-amber-200/90 bg-amber-50/70 p-4 text-amber-950 transition-colors ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100/90 text-amber-700">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>

        <div className="flex flex-1 flex-col gap-1.5 min-w-0">
          <h4
            data-testid="cancellation-warning-title"
            className="text-sm font-bold tracking-tight text-amber-900"
          >
            {CANCEL_ORDER_MESSAGES.WARNING_TITLE}
          </h4>

          <p
            data-testid="cancellation-warning-body"
            className="text-xs font-medium leading-relaxed text-amber-800"
          >
            {CANCEL_ORDER_MESSAGES.WARNING_BODY}
          </p>

          <div className="mt-1 flex items-start gap-1.5 pt-2 border-t border-amber-200/60 text-[11px] font-semibold text-amber-900/90">
            <Info className="size-3.5 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
            <span data-testid="cancellation-refund-info">
              {CANCEL_ORDER_MESSAGES.WARNING_REFUND_INFO}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CancellationWarningCard;
