/**
 * TransactionMobileCard Component
 * Modern stacked card presentation of a payment transaction for mobile viewports (< 640px).
 */

import { Eye, User } from "lucide-react";
import { TRANSACTION_MESSAGES } from "@/features/transactions/constants/transaction-messages.constants";
import type { PaymentTransactionItem } from "@/features/transactions/types/transaction.types";
import { formatDate } from "@/lib/utils/date";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { SettlementStatusBadge } from "./SettlementStatusBadge";
import { TransactionStatusBadge } from "./TransactionStatusBadge";

interface TransactionMobileCardProps {
  transaction: PaymentTransactionItem;
  onSelect: (id: string) => void;
}

export function TransactionMobileCard({ transaction, onSelect }: TransactionMobileCardProps) {
  const formattedAmount =
    transaction.amountFormatted || `₹${(transaction.amountPaise / 100).toFixed(2)}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(transaction.id)}
      data-testid={`transaction-card-${transaction.id}`}
      aria-label={`Transaction for ${transaction.customerName || "Guest"}, ${formattedAmount}`}
      className="w-full rounded-[14px] border border-neutral-200/80 bg-white p-3.5 sm:p-4 shadow-2xs hover:border-[#eddcd4] hover:shadow-xs active:bg-neutral-50/80 transition-all flex flex-col gap-3 cursor-pointer text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#e8631b]"
    >
      {/* Top Row: Customer Avatar & Name (Left) + Amount (Right) */}
      <div className="flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="size-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0 border border-neutral-200/60">
            <User className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="text-sm font-bold text-neutral-900 truncate max-w-[140px] sm:max-w-[200px]"
                title={transaction.customerName || "Guest"}
              >
                {transaction.customerName || "Guest"}
              </span>
              {transaction.orderNumber && (
                <span className="inline-flex items-center font-mono text-[11px] font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded-md border border-neutral-200/80 shrink-0">
                  #{transaction.orderNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Payment Amount: Clearly visible and emphasized, never clipped */}
        <div className="shrink-0 text-right">
          <span className="text-base sm:text-lg font-bold text-neutral-900 whitespace-nowrap">
            {formattedAmount}
          </span>
        </div>
      </div>

      {/* Middle Row: Status & Settlement Badges (Left) + Date (Right) */}
      <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <TransactionStatusBadge status={transaction.status} />
          <SettlementStatusBadge status={transaction.settlementStatus} />
        </div>
        <span className="text-[11px] font-medium text-neutral-500 whitespace-nowrap">
          {formatDate(transaction.createdAt)}
        </span>
      </div>

      {/* Bottom Row: Payment Method Badge (Left) + View Details Action (Right) */}
      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-neutral-100 text-xs">
        <div className="shrink-0">
          <PaymentMethodBadge method={transaction.paymentMethod} />
        </div>

        <span
          data-testid={`view-details-${transaction.id}`}
          className="inline-flex items-center h-7 px-2.5 text-xs font-semibold text-[#9a3412] rounded-lg gap-1.5 shrink-0"
        >
          <Eye className="size-3.5" />
          <span>{TRANSACTION_MESSAGES.VIEW_DETAILS}</span>
        </span>
      </div>
    </button>
  );
}
