/**
 * TransactionDrawerGateway Component
 * Displays payment gateway details, settlement status, and IDs inside TransactionDetailDrawer.
 */

import { Building2, Copy, CreditCard } from "lucide-react";
import { TRANSACTION_MESSAGES } from "@/features/transactions/constants/transaction-messages.constants";
import type { TransactionGatewayDetails } from "@/features/transactions/types/transaction.types";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { SettlementStatusBadge } from "./SettlementStatusBadge";

interface TransactionDrawerGatewayProps {
  gateway?: TransactionGatewayDetails;
  onCopy: (text: string, label: string) => void;
}

export function TransactionDrawerGateway({ gateway, onCopy }: TransactionDrawerGatewayProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
        {TRANSACTION_MESSAGES.SECTION_GATEWAY}
      </h3>
      <div className="p-4 rounded-xl border border-neutral-200/80 bg-white space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-neutral-500 flex items-center gap-1.5">
            <Building2 className="size-3.5 text-neutral-400" />
            {TRANSACTION_MESSAGES.LABEL_GATEWAY_PROVIDER}
          </span>
          <span className="font-semibold text-neutral-900">
            {gateway?.name || "Razorpay"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <span className="text-neutral-500">
            {TRANSACTION_MESSAGES.LABEL_PAYMENT_ID}
          </span>
          <div className="flex items-center gap-1.5 font-mono text-neutral-800">
            <span className="truncate max-w-[170px]">
              {gateway?.paymentId || "N/A"}
            </span>
            {gateway?.paymentId && (
              <button
                type="button"
                onClick={() =>
                  onCopy(gateway.paymentId, TRANSACTION_MESSAGES.LABEL_PAYMENT_ID)
                }
                className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded"
                title={TRANSACTION_MESSAGES.COPY}
              >
                <Copy className="size-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <span className="text-neutral-500 flex items-center gap-1.5">
            <CreditCard className="size-3.5 text-neutral-400" />
            {TRANSACTION_MESSAGES.LABEL_VPA_CARD}
          </span>
          <div className="flex items-center gap-2">
            <PaymentMethodBadge method={gateway?.method || "UPI"} />
            <span className="font-medium text-neutral-800 font-mono">
              {gateway?.vpaOrCard || "N/A"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <span className="text-neutral-500">
            {TRANSACTION_MESSAGES.LABEL_BANK_RRN}
          </span>
          <div className="flex items-center gap-1.5 font-mono text-neutral-800">
            <span>{gateway?.bankRrn || "N/A"}</span>
            {gateway?.bankRrn && (
              <button
                type="button"
                onClick={() =>
                  onCopy(gateway.bankRrn, TRANSACTION_MESSAGES.LABEL_BANK_RRN)
                }
                className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded"
                title={TRANSACTION_MESSAGES.COPY}
              >
                <Copy className="size-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <span className="text-neutral-500">
            {TRANSACTION_MESSAGES.LABEL_SETTLEMENT_STATUS}
          </span>
          <SettlementStatusBadge
            status={gateway?.settlementStatus || "PENDING_EOD"}
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <span className="text-neutral-500">
            {TRANSACTION_MESSAGES.LABEL_SETTLEMENT_DATE}
          </span>
          <span className="font-medium text-neutral-800">
            {gateway?.expectedSettlementDate || "Next Business Day"}
          </span>
        </div>
      </div>
    </div>
  );
}
