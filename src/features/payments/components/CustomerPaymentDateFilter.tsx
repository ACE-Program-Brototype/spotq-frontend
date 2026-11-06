/**
 * CustomerPaymentDateFilter Component
 * Compact date range picker (Start Date to End Date) for filtering customer payment history.
 */

import { Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CUSTOMER_PAYMENT_MESSAGES } from "../constants/customer-payment.constants";

interface CustomerPaymentDateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear: () => void;
  disabled?: boolean;
  className?: string;
}

export function CustomerPaymentDateFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  disabled = false,
  className,
}: CustomerPaymentDateFilterProps) {
  const hasActiveDates = Boolean(startDate || endDate);

  return (
    <div
      data-testid="customer-payment-date-filter"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {/* Start Date Input */}
      <div
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200/60 transition-colors",
          "focus-within:ring-2 focus-within:ring-[#ff6b00]/30 focus-within:border-[#ff6b00]/50",
          disabled && "opacity-60 pointer-events-none",
        )}
      >
        <Calendar className="size-3.5 text-neutral-400 shrink-0" />
        <label
          htmlFor="customer-payment-start-date"
          className="text-xs font-semibold text-neutral-500 shrink-0 select-none cursor-pointer"
        >
          {CUSTOMER_PAYMENT_MESSAGES.DATE_FILTER_FROM}
        </label>
        <input
          id="customer-payment-start-date"
          type="date"
          value={startDate}
          max={endDate || undefined}
          disabled={disabled}
          onChange={(e) => onStartDateChange(e.target.value)}
          aria-label={CUSTOMER_PAYMENT_MESSAGES.DATE_FILTER_START_LABEL}
          data-testid="payment-start-date-input"
          className="bg-transparent text-xs font-semibold text-neutral-800 focus:outline-hidden cursor-pointer"
        />
      </div>

      {/* End Date Input */}
      <div
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200/60 transition-colors",
          "focus-within:ring-2 focus-within:ring-[#ff6b00]/30 focus-within:border-[#ff6b00]/50",
          disabled && "opacity-60 pointer-events-none",
        )}
      >
        <label
          htmlFor="customer-payment-end-date"
          className="text-xs font-semibold text-neutral-500 shrink-0 select-none cursor-pointer"
        >
          {CUSTOMER_PAYMENT_MESSAGES.DATE_FILTER_TO}
        </label>
        <input
          id="customer-payment-end-date"
          type="date"
          value={endDate}
          min={startDate || undefined}
          disabled={disabled}
          onChange={(e) => onEndDateChange(e.target.value)}
          aria-label={CUSTOMER_PAYMENT_MESSAGES.DATE_FILTER_END_LABEL}
          data-testid="payment-end-date-input"
          className="bg-transparent text-xs font-semibold text-neutral-800 focus:outline-hidden cursor-pointer"
        />
      </div>

      {/* Clear Date Filter Button */}
      {hasActiveDates && (
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          data-testid="clear-date-filter-button"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/70 rounded-xl transition-colors cursor-pointer select-none border border-neutral-200/60"
          title={CUSTOMER_PAYMENT_MESSAGES.DATE_FILTER_CLEAR_TITLE}
        >
          <X className="size-3" />
          <span>{CUSTOMER_PAYMENT_MESSAGES.DATE_FILTER_CLEAR}</span>
        </button>
      )}
    </div>
  );
}
