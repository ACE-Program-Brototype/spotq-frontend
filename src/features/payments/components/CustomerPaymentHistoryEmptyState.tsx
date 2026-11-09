/**
 * CustomerPaymentHistoryEmptyState Component
 * Displays helpful illustrations and messages when transactions list is empty.
 */

import { CreditCard, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CUSTOMER_PAYMENT_MESSAGES,
  PAYMENT_FILTER_STATUS,
} from "@/features/payments/constants/customer-payment.constants";
import type { PaymentFilterStatus } from "@/features/payments/types/customer-payment.types";

interface CustomerPaymentHistoryEmptyStateProps {
  statusFilter: PaymentFilterStatus;
  isFiltered?: boolean;
  onClearFilter: () => void;
}

export function CustomerPaymentHistoryEmptyState({
  statusFilter,
  isFiltered: explicitIsFiltered,
  onClearFilter,
}: CustomerPaymentHistoryEmptyStateProps) {
  const isFiltered = explicitIsFiltered ?? statusFilter !== PAYMENT_FILTER_STATUS.ALL;

  return (
    <div
      data-testid="customer-payment-history-empty-state"
      className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 sm:p-14 text-center border border-neutral-200/70 shadow-2xs gap-4"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600 border border-neutral-200/60 shadow-2xs">
        {isFiltered ? (
          <FilterX className="size-6 text-neutral-500" />
        ) : (
          <CreditCard className="size-6 text-neutral-500" />
        )}
      </div>

      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-base sm:text-lg font-bold text-neutral-900">
          {isFiltered
            ? CUSTOMER_PAYMENT_MESSAGES.EMPTY_FILTER_TITLE
            : CUSTOMER_PAYMENT_MESSAGES.EMPTY_TITLE}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          {isFiltered
            ? CUSTOMER_PAYMENT_MESSAGES.EMPTY_FILTER_DESCRIPTION(statusFilter)
            : CUSTOMER_PAYMENT_MESSAGES.EMPTY_DESCRIPTION}
        </p>
      </div>

      {isFiltered && (
        <Button
          type="button"
          onClick={onClearFilter}
          data-testid="clear-payment-filter-button"
          className="mt-2 bg-[#ff6b00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-semibold px-4 py-2 cursor-pointer shadow-xs"
        >
          {CUSTOMER_PAYMENT_MESSAGES.EMPTY_CLEAR_FILTER}
        </Button>
      )}
    </div>
  );
}
