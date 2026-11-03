/**
 * SettlementStatusBadge Component
 * Displays settlement lifecycle status (PENDING_EOD, SETTLED, DEDUCTED_EOD).
 */

import { cn } from "@/lib/utils/cn";
import { TRANSACTION_MESSAGES } from "../constants/transaction-messages.constants";
import type { SettlementStatus } from "../types/transaction.types";

interface SettlementStatusBadgeProps {
  status: SettlementStatus | string;
  className?: string;
}

export function SettlementStatusBadge({ status, className }: SettlementStatusBadgeProps) {
  const normalizedStatus = (status || "").toUpperCase();

  switch (normalizedStatus) {
    case "SETTLED":
      return (
        <span
          data-testid="settlement-status-badge-settled"
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide uppercase",
            "bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
            className,
          )}
        >
          {TRANSACTION_MESSAGES.SETTLEMENT_LABELS.SETTLED}
        </span>
      );

    case "PENDING_EOD":
      return (
        <span
          data-testid="settlement-status-badge-pending-eod"
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide uppercase",
            "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
            className,
          )}
        >
          {TRANSACTION_MESSAGES.SETTLEMENT_LABELS.PENDING_EOD}
        </span>
      );

    case "DEDUCTED_EOD":
      return (
        <span
          data-testid="settlement-status-badge-deducted-eod"
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide uppercase",
            "bg-orange-100/80 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300",
            className,
          )}
        >
          {TRANSACTION_MESSAGES.SETTLEMENT_LABELS.DEDUCTED_EOD}
        </span>
      );

    default:
      return (
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide uppercase",
            "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
            className,
          )}
        >
          {status || TRANSACTION_MESSAGES.SETTLEMENT_LABELS.N_A}
        </span>
      );
  }
}
