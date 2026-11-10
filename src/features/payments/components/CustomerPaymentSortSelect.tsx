/**
 * CustomerPaymentSortSelect Component
 * Compact dropdown selector for customer payment history sorting:
 * - Newest First (createdAt DESC)
 * - Oldest First (createdAt ASC)
 * - Amount: High to Low (amountPaise DESC)
 * - Amount: Low to High (amountPaise ASC)
 */

import { ArrowUpDown, ChevronDown } from "lucide-react";
import type * as React from "react";
import { CUSTOMER_PAYMENT_SORT_OPTIONS } from "@/features/payments/constants/customer-payment.constants";
import type {
  CustomerPaymentSortBy,
  CustomerPaymentSortOrder,
} from "@/features/payments/types/customer-payment.types";
import { cn } from "@/lib/utils/cn";

interface CustomerPaymentSortSelectProps {
  sortBy: CustomerPaymentSortBy;
  sortOrder: CustomerPaymentSortOrder;
  onChange: (sortBy: CustomerPaymentSortBy, sortOrder: CustomerPaymentSortOrder) => void;
  disabled?: boolean;
  className?: string;
}

export function CustomerPaymentSortSelect({
  sortBy,
  sortOrder,
  onChange,
  disabled = false,
  className,
}: CustomerPaymentSortSelectProps) {
  const currentValue = `${sortBy}:${sortOrder}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newSortOrder] = e.target.value.split(":") as [
      CustomerPaymentSortBy,
      CustomerPaymentSortOrder,
    ];
    onChange(newSortBy, newSortOrder);
  };

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <div className="pointer-events-none absolute left-3 flex items-center text-neutral-500">
        <ArrowUpDown className="size-3.5" />
      </div>
      <select
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        aria-label="Sort payment transactions"
        data-testid="customer-payment-sort-select"
        className={cn(
          "h-9 pl-8 pr-7 rounded-xl bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200/60",
          "text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer",
          "focus:outline-hidden focus:ring-2 focus:ring-[#ff6b00]/30 select-none appearance-none",
          disabled && "opacity-60 pointer-events-none",
        )}
      >
        {CUSTOMER_PAYMENT_SORT_OPTIONS.map((opt) => (
          <option key={`${opt.sortBy}:${opt.sortOrder}`} value={`${opt.sortBy}:${opt.sortOrder}`}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 flex items-center text-neutral-400">
        <ChevronDown className="size-3.5" />
      </div>
    </div>
  );
}
