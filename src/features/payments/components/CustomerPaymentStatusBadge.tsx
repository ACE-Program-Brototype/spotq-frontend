/**
 * CustomerPaymentStatusBadge Component
 * Displays distinct colored badges for customer payment states:
 * [SUCCESS] (Green), [FAILED] (Red), [REFUNDED] (Purple).
 */

import { AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { CUSTOMER_PAYMENT_MESSAGES } from "@/features/payments/constants/customer-payment.constants";
import type { CustomerPaymentStatus } from "@/features/payments/types/customer-payment.types";
import { normalizePaymentStatus } from "@/features/payments/utils/customer-payment.utils";
import { cn } from "@/lib/utils/cn";

interface CustomerPaymentStatusBadgeProps {
  status: CustomerPaymentStatus | string;
  className?: string;
}

export function CustomerPaymentStatusBadge({ status, className }: CustomerPaymentStatusBadgeProps) {
  const normalized = normalizePaymentStatus(status);

  switch (normalized) {
    case "SUCCESS":
      return (
        <span
          data-testid="customer-payment-status-badge-success"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase select-none",
            "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
            className,
          )}
        >
          <CheckCircle2 className="size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{CUSTOMER_PAYMENT_MESSAGES.STATUS_SUCCESS}</span>
        </span>
      );

    case "FAILED":
      return (
        <span
          data-testid="customer-payment-status-badge-failed"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase select-none",
            "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
            className,
          )}
        >
          <AlertCircle className="size-3 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{CUSTOMER_PAYMENT_MESSAGES.STATUS_FAILED}</span>
        </span>
      );

    case "REFUNDED":
      return (
        <span
          data-testid="customer-payment-status-badge-refunded"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase select-none",
            "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
            className,
          )}
        >
          <RotateCcw className="size-3 shrink-0 text-purple-600 dark:text-purple-400" />
          <span>{CUSTOMER_PAYMENT_MESSAGES.STATUS_REFUNDED}</span>
        </span>
      );

    default:
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium select-none",
            "bg-neutral-100 text-neutral-600 border border-neutral-200",
            className,
          )}
        >
          <span>{status}</span>
        </span>
      );
  }
}
