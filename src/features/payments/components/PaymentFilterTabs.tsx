/**
 * PaymentFilterTabs Component
 * Segmented horizontal filter tabs for filtering customer payment history:
 * [All], [Success], [Failed], [Refunded].
 */

import { cn } from "@/lib/utils/cn";
import { PAYMENT_FILTER_STATUS } from "../constants/customer-payment.constants";
import type { PaymentFilterStatus } from "../types/customer-payment.types";

interface PaymentFilterTabsProps {
  selectedStatus: PaymentFilterStatus;
  onSelect: (status: PaymentFilterStatus) => void;
  disabled?: boolean;
  className?: string;
}

const FILTER_OPTIONS: { id: PaymentFilterStatus; label: string }[] = [
  { id: PAYMENT_FILTER_STATUS.ALL, label: "All" },
  { id: PAYMENT_FILTER_STATUS.SUCCESS, label: "Success" },
  { id: PAYMENT_FILTER_STATUS.FAILED, label: "Failed" },
  { id: PAYMENT_FILTER_STATUS.REFUNDED, label: "Refunded" },
];

export function PaymentFilterTabs({
  selectedStatus,
  onSelect,
  disabled = false,
  className,
}: PaymentFilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Payment status filters"
      className={cn(
        "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none",
        disabled && "opacity-60 pointer-events-none",
        className,
      )}
    >
      {FILTER_OPTIONS.map((tab) => {
        const isActive =
          selectedStatus === tab.id ||
          (tab.id === PAYMENT_FILTER_STATUS.CAPTURED && selectedStatus === "SUCCESS");

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => onSelect(tab.id)}
            data-testid={`payment-filter-tab-${tab.id === "CAPTURED" ? "success" : tab.id.toLowerCase()}`}
            className={cn(
              "shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 select-none cursor-pointer",
              isActive
                ? "bg-[#ff6b00] text-white shadow-xs"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-900 border border-neutral-200/50",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
