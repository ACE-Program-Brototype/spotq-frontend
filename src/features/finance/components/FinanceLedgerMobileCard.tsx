/**
 * FinanceLedgerMobileCard Component
 * Responsive card presentation of a master ledger entry for mobile viewports (< 640px).
 */

import { LEDGER_ENTRY_TYPE } from "@/features/finance/constants/finance.constants";
import type { LedgerEntryType, MasterLedgerEntry } from "@/features/finance/types/finance.types";
import {
  formatDate,
  formatPaise,
  typeLabels,
  typeStyles,
} from "@/features/finance/utils/finance-display.utils";
import { cn } from "@/lib/utils/cn";

interface FinanceLedgerMobileCardProps {
  entry: MasterLedgerEntry;
  restaurantName: string;
  onClick: (entry: MasterLedgerEntry) => void;
}

export function FinanceLedgerMobileCard({
  entry,
  restaurantName,
  onClick,
}: FinanceLedgerMobileCardProps) {
  const positive = entry.type === LEDGER_ENTRY_TYPE.CUSTOMER_PAYMENT_INTAKE;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(entry)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(entry);
        }
      }}
      data-testid={`ledger-mobile-card-${entry.id}`}
      aria-label={`Ledger transaction for ${restaurantName}, ${entry.type}`}
      className="w-full rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-indigo-200 hover:shadow-xs active:bg-slate-50 transition-all flex flex-col gap-3 cursor-pointer text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {/* Top Row: Restaurant Name & Order ID (Left) + Amount (Right) */}
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          <span className="text-sm font-bold text-slate-900 break-words line-clamp-1">
            {restaurantName}
          </span>
          {entry.referenceId && (
            <span
              className="mt-1 inline-block max-w-[160px] truncate rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-600 border border-slate-200/60"
              title={entry.referenceId}
            >
              {entry.referenceId}
            </span>
          )}
        </div>

        {/* Amount */}
        <div className="shrink-0 text-right">
          <span
            className={cn(
              "font-mono text-base font-bold tabular-nums whitespace-nowrap",
              positive
                ? "text-emerald-700"
                : entry.type === LEDGER_ENTRY_TYPE.REFUND_EXPENSE
                  ? "text-rose-700"
                  : "text-purple-700",
            )}
          >
            {positive ? "+" : "−"}
            {formatPaise(entry.amountPaise)}
          </span>
        </div>
      </div>

      {/* Bottom Row: Type Badge (Left) + Date & Time (Right) */}
      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100 min-w-0">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
            typeStyles[entry.type as LedgerEntryType] ||
              "border-slate-200 bg-slate-50 text-slate-700",
          )}
        >
          {typeLabels[entry.type as LedgerEntryType] || entry.type}
        </span>
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatDate(entry.createdAt)}
        </span>
      </div>
    </div>
  );
}

