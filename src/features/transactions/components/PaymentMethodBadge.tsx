/**
 * PaymentMethodBadge Component
 * Displays payment method (UPI, CARD, NETBANKING) with specialized styling and icon.
 */

import { CreditCard, Landmark, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { PaymentMethod } from "../types/transaction.types";

interface PaymentMethodBadgeProps {
  method: PaymentMethod | string;
  className?: string;
  showIcon?: boolean;
}

export function PaymentMethodBadge({
  method,
  className,
  showIcon = true,
}: PaymentMethodBadgeProps) {
  const normalizedMethod = (method || "").toUpperCase();

  switch (normalizedMethod) {
    case "UPI":
      return (
        <span
          data-testid="payment-method-badge-upi"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
            className,
          )}
        >
          {showIcon && (
            <Smartphone className="size-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
          )}
          <span>UPI</span>
        </span>
      );

    case "CARD":
      return (
        <span
          data-testid="payment-method-badge-card"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800",
            className,
          )}
        >
          {showIcon && (
            <CreditCard className="size-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
          )}
          <span>CARD</span>
        </span>
      );

    case "NETBANKING":
      return (
        <span
          data-testid="payment-method-badge-netbanking"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
            className,
          )}
        >
          {showIcon && <Landmark className="size-3.5 shrink-0 text-sky-600 dark:text-sky-400" />}
          <span>NETBANKING</span>
        </span>
      );

    default:
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700",
            className,
          )}
        >
          <span>{method || "OTHER"}</span>
        </span>
      );
  }
}
