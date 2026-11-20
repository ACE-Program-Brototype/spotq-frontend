/**
 * TransactionDrawerFinancials Component
 * Displays itemized financial billing breakdown and refund details inside TransactionDetailDrawer.
 */

import { formatDate } from "@/lib/utils/date";
import { TRANSACTION_MESSAGES } from "@/features/transactions/constants/transaction-messages.constants";
import type {
  TransactionFinancialBreakdown,
  TransactionRefundDetails,
} from "@/features/transactions/types/transaction.types";

interface TransactionDrawerFinancialsProps {
  financialBreakdown?: TransactionFinancialBreakdown;
  refund?: TransactionRefundDetails | null;
}

export function TransactionDrawerFinancials({
  financialBreakdown,
  refund,
}: TransactionDrawerFinancialsProps) {
  return (
    <>
      {/* Section: Financial Billing Breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          {TRANSACTION_MESSAGES.SECTION_FINANCIAL}
        </h3>
        <div className="p-4 rounded-xl border border-neutral-200/80 bg-white space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-neutral-600">
            <span>{TRANSACTION_MESSAGES.LABEL_FOOD_SUBTOTAL}</span>
            <span className="font-medium text-neutral-900">
              {financialBreakdown?.subtotalFormatted || "₹0.00"}
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-600">
            <span>
              {TRANSACTION_MESSAGES.LABEL_GST} ({financialBreakdown?.gstPercentage ?? 5}%)
            </span>
            <span className="font-medium text-neutral-900">
              {financialBreakdown?.gstFormatted || "₹0.00"}
            </span>
          </div>

          {(financialBreakdown?.discountPaise ?? 0) > 0 && (
            <div className="flex items-center justify-between text-emerald-600">
              <span>{TRANSACTION_MESSAGES.LABEL_DISCOUNTS}</span>
              <span className="font-medium">
                -{financialBreakdown?.discountFormatted}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2.5 border-t border-neutral-200 text-sm font-bold text-neutral-900">
            <span>{TRANSACTION_MESSAGES.LABEL_TOTAL_AMOUNT}</span>
            <span className="text-base text-neutral-900">
              {financialBreakdown?.totalFormatted || "₹0.00"}
            </span>
          </div>
        </div>
      </div>

      {/* Section: Refund Record (if present) */}
      {refund && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600">
            {TRANSACTION_MESSAGES.SECTION_REFUND}
          </h3>
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">
                {TRANSACTION_MESSAGES.LABEL_REFUND_ID}
              </span>
              <span className="font-mono font-medium text-purple-900">
                {refund.id}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-purple-100">
              <span className="text-neutral-600">
                {TRANSACTION_MESSAGES.LABEL_REFUND_AMOUNT}
              </span>
              <span className="font-bold text-purple-900">
                {refund.amountFormatted}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-purple-100">
              <span className="text-neutral-600">
                {TRANSACTION_MESSAGES.LABEL_REFUND_REASON}
              </span>
              <span className="font-medium text-neutral-800">
                {refund.reason || "Customer requested"}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-purple-100">
              <span className="text-neutral-600">
                {TRANSACTION_MESSAGES.LABEL_REFUND_DATE}
              </span>
              <span className="font-medium text-neutral-800">
                {formatDate(refund.createdAt)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
