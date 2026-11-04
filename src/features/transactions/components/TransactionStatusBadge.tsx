/**
 * TransactionStatusBadge Component
 * Color-coded status indicator matching SpotQ design system.
 */

import { AlertCircle, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { TRANSACTION_MESSAGES } from "../constants/transaction-messages.constants";
import type { TransactionStatus } from "../types/transaction.types";

interface TransactionStatusBadgeProps {
  status: TransactionStatus | string;
  className?: string;
  showIcon?: boolean;
}

export function TransactionStatusBadge({
  status,
  className,
  showIcon = true,
}: TransactionStatusBadgeProps) {
  const normalizedStatus = (status || "").toUpperCase() as TransactionStatus;

  switch (normalizedStatus) {
    case "SUCCESS":
      return (
        <span
          data-testid="transaction-status-badge-success"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
            className,
          )}
        >
          {showIcon && (
            <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          )}
          <span>{TRANSACTION_MESSAGES.STATUS_LABELS.SUCCESS}</span>
        </span>
      );

    case "PENDING":
      return (
        <span
          data-testid="transaction-status-badge-pending"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
            className,
          )}
        >
          {showIcon && <Clock className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />}
          <span>{TRANSACTION_MESSAGES.STATUS_LABELS.PENDING}</span>
        </span>
      );

    case "FAILED":
      return (
        <span
          data-testid="transaction-status-badge-failed"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
            className,
          )}
        >
          {showIcon && (
            <AlertCircle className="size-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{TRANSACTION_MESSAGES.STATUS_LABELS.FAILED}</span>
        </span>
      );

    case "REFUNDED":
      return (
        <span
          data-testid="transaction-status-badge-refunded"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
            className,
          )}
        >
          {showIcon && (
            <RotateCcw className="size-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
          )}
          <span>{TRANSACTION_MESSAGES.STATUS_LABELS.REFUNDED}</span>
        </span>
      );

    default:
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700",
            className,
          )}
        >
          <span>{status || "UNKNOWN"}</span>
        </span>
      );
  }
}
