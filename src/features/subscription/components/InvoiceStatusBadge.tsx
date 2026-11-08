import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SUBSCRIPTION_HISTORY_MESSAGES } from "../constants/subscription-history.constants";
import type { SubscriptionBillingStatus } from "../types/subscription-history.types";

export interface InvoiceStatusBadgeProps {
  status: SubscriptionBillingStatus | string;
  className?: string;
  showIcon?: boolean;
}

export function InvoiceStatusBadge({
  status,
  className,
  showIcon = true,
}: InvoiceStatusBadgeProps) {
  const normalizedStatus = (status || "").toUpperCase();

  switch (normalizedStatus) {
    case "SUCCESS":
      return (
        <span
          data-testid="invoice-status-badge-success"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
            className,
          )}
        >
          {showIcon && (
            <CheckCircle2
              className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />
          )}
          <span>{SUBSCRIPTION_HISTORY_MESSAGES.STATUS_SUCCESS_LABEL}</span>
        </span>
      );

    case "FAILED":
      return (
        <span
          data-testid="invoice-status-badge-failed"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
            className,
          )}
        >
          {showIcon && (
            <AlertCircle
              className="size-3.5 shrink-0 text-rose-600 dark:text-rose-400"
              aria-hidden="true"
            />
          )}
          <span>{SUBSCRIPTION_HISTORY_MESSAGES.STATUS_FAILED_LABEL}</span>
        </span>
      );

    case "CREATED":
      return (
        <span
          data-testid="invoice-status-badge-created"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
            className,
          )}
        >
          {showIcon && (
            <Clock
              className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
          )}
          <span>{SUBSCRIPTION_HISTORY_MESSAGES.STATUS_CREATED_LABEL}</span>
        </span>
      );

    default:
      return (
        <span
          data-testid="invoice-status-badge-created"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
            className,
          )}
        >
          {showIcon && (
            <Clock
              className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
          )}
          <span>{SUBSCRIPTION_HISTORY_MESSAGES.STATUS_CREATED_LABEL}</span>
        </span>
      );
  }
}
