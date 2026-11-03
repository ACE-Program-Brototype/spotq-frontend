/**
 * TransactionDetailDrawer Component
 * 480px interactive slide-over drawer displaying deep transaction details,
 * itemized financial billing breakdown, customer context, and Razorpay gateway metadata.
 */

import {
  AlertTriangle,
  Building2,
  Calendar,
  Copy,
  CreditCard,
  Receipt,
  RotateCcw,
  User,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/date";
import { TRANSACTION_MESSAGES } from "../constants/transaction-messages.constants";
import { useTransactionDetail } from "../hooks/useTransactionDetail";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { SettlementStatusBadge } from "./SettlementStatusBadge";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { TransactionDrawerSkeleton } from "./TransactionsSkeleton";

interface TransactionDetailDrawerProps {
  transactionId: string | null;
  onClose: () => void;
}

export function TransactionDetailDrawer({ transactionId, onClose }: TransactionDetailDrawerProps) {
  const isOpen = Boolean(transactionId);
  const { data: detail, isLoading, isError, refetch } = useTransactionDetail(transactionId);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} ${TRANSACTION_MESSAGES.COPIED}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={TRANSACTION_MESSAGES.DRAWER_TITLE}
      className="fixed inset-0 z-50 overflow-hidden"
      data-testid="transaction-detail-drawer"
    >
      {/* Semi-transparent Backdrop Overlay */}
      <button
        type="button"
        aria-label="Close drawer overlay"
        data-testid="transaction-drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 w-full h-full bg-neutral-900/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-default border-0"
      />

      {/* 480px Slide-Over Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="w-screen max-w-md md:max-w-lg bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white/90 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="size-4 text-neutral-500" />
                <h2 className="text-base font-semibold text-neutral-900">
                  {TRANSACTION_MESSAGES.DRAWER_TITLE}
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {TRANSACTION_MESSAGES.DRAWER_SUBTITLE}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              data-testid="transaction-drawer-close-button"
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label={TRANSACTION_MESSAGES.CLOSE}
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 px-6 py-5 space-y-6">
            {isLoading && <TransactionDrawerSkeleton />}

            {isError && (
              <div className="p-6 text-center space-y-3 bg-rose-50/50 rounded-2xl border border-rose-100">
                <AlertTriangle className="size-8 text-rose-500 mx-auto" />
                <p className="text-sm font-medium text-rose-900">
                  {TRANSACTION_MESSAGES.DRAWER_ERROR}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-100 gap-1.5"
                >
                  <RotateCcw className="size-3.5" />
                  <span>{TRANSACTION_MESSAGES.RETRY}</span>
                </Button>
              </div>
            )}

            {detail && (
              <>
                {/* Status & Overview Bar */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/60">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                      {TRANSACTION_MESSAGES.LABEL_ORDER_NUMBER}
                    </span>
                    <div className="text-base font-bold text-neutral-900">
                      #{detail.order?.orderNumber || "N/A"}
                    </div>
                  </div>
                  <TransactionStatusBadge status={detail.status} />
                </div>

                {/* Section: Transaction Overview IDs */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {TRANSACTION_MESSAGES.SECTION_CONTEXT}
                  </h3>
                  <div className="p-4 rounded-xl border border-neutral-200/80 bg-white space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">
                        {TRANSACTION_MESSAGES.LABEL_TRANSACTION_ID}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono font-medium text-neutral-800">
                        <span className="truncate max-w-[180px]">{detail.id}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(detail.id, TRANSACTION_MESSAGES.LABEL_TRANSACTION_ID)
                          }
                          className="text-neutral-400 hover:text-neutral-700 p-1 rounded hover:bg-neutral-100"
                          title={TRANSACTION_MESSAGES.COPY}
                        >
                          <Copy className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-100">
                      <span className="text-neutral-500">
                        {TRANSACTION_MESSAGES.LABEL_TIMESTAMP}
                      </span>
                      <span className="font-medium text-neutral-800 flex items-center gap-1.5">
                        <Calendar className="size-3 text-neutral-400" />
                        {formatDate(detail.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section: Customer & Dining Context */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {TRANSACTION_MESSAGES.SECTION_CUSTOMER}
                  </h3>
                  <div className="p-4 rounded-xl border border-neutral-200/80 bg-white space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 flex items-center gap-1.5">
                        <User className="size-3.5 text-neutral-400" />
                        {TRANSACTION_MESSAGES.LABEL_CUSTOMER_NAME}
                      </span>
                      <span className="font-semibold text-neutral-900">
                        {detail.customer?.name || "Guest Customer"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <span className="text-neutral-500">
                        {TRANSACTION_MESSAGES.LABEL_CUSTOMER_CONTACT}
                      </span>
                      <span className="font-medium text-neutral-700">
                        {detail.customer?.contact || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <span className="text-neutral-500">
                        {TRANSACTION_MESSAGES.LABEL_TABLE_TOKEN}
                      </span>
                      <span className="font-medium text-neutral-900 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                        Table {detail.customer?.tableNumber || "N/A"} (Token{" "}
                        {detail.customer?.tokenNumber || "N/A"})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section: Financial Billing Breakdown */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {TRANSACTION_MESSAGES.SECTION_FINANCIAL}
                  </h3>
                  <div className="p-4 rounded-xl border border-neutral-200/80 bg-white space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>{TRANSACTION_MESSAGES.LABEL_FOOD_SUBTOTAL}</span>
                      <span className="font-medium text-neutral-900">
                        {detail.financialBreakdown?.subtotalFormatted || "₹0.00"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-600">
                      <span>
                        {TRANSACTION_MESSAGES.LABEL_GST} (
                        {detail.financialBreakdown?.gstPercentage ?? 5}%)
                      </span>
                      <span className="font-medium text-neutral-900">
                        {detail.financialBreakdown?.gstFormatted || "₹0.00"}
                      </span>
                    </div>

                    {detail.financialBreakdown?.discountPaise > 0 && (
                      <div className="flex items-center justify-between text-emerald-600">
                        <span>{TRANSACTION_MESSAGES.LABEL_DISCOUNTS}</span>
                        <span className="font-medium">
                          -{detail.financialBreakdown?.discountFormatted}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2.5 border-t border-neutral-200 text-sm font-bold text-neutral-900">
                      <span>{TRANSACTION_MESSAGES.LABEL_TOTAL_AMOUNT}</span>
                      <span className="text-base text-neutral-900">
                        {detail.financialBreakdown?.totalFormatted || "₹0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section: Payment Gateway Metadata */}
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
                        {detail.gateway?.name || "Razorpay"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <span className="text-neutral-500">
                        {TRANSACTION_MESSAGES.LABEL_PAYMENT_ID}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-neutral-800">
                        <span className="truncate max-w-[170px]">
                          {detail.gateway?.paymentId || "N/A"}
                        </span>
                        {detail.gateway?.paymentId && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                detail.gateway.paymentId,
                                TRANSACTION_MESSAGES.LABEL_PAYMENT_ID,
                              )
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
                        <PaymentMethodBadge method={detail.gateway?.method || "UPI"} />
                        <span className="font-medium text-neutral-800 font-mono">
                          {detail.gateway?.vpaOrCard || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <span className="text-neutral-500">
                        {TRANSACTION_MESSAGES.LABEL_BANK_RRN}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-neutral-800">
                        <span>{detail.gateway?.bankRrn || "N/A"}</span>
                        {detail.gateway?.bankRrn && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                detail.gateway.bankRrn,
                                TRANSACTION_MESSAGES.LABEL_BANK_RRN,
                              )
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
                        status={detail.gateway?.settlementStatus || "PENDING_EOD"}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <span className="text-neutral-500">
                        {TRANSACTION_MESSAGES.LABEL_SETTLEMENT_DATE}
                      </span>
                      <span className="font-medium text-neutral-800">
                        {detail.gateway?.expectedSettlementDate || "Next Business Day"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section: Refund Record (if present) */}
                {detail.refund && (
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
                          {detail.refund.id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-purple-100">
                        <span className="text-neutral-600">
                          {TRANSACTION_MESSAGES.LABEL_REFUND_AMOUNT}
                        </span>
                        <span className="font-bold text-purple-900">
                          {detail.refund.amountFormatted}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-purple-100">
                        <span className="text-neutral-600">
                          {TRANSACTION_MESSAGES.LABEL_REFUND_REASON}
                        </span>
                        <span className="font-medium text-neutral-800">
                          {detail.refund.reason || "Customer requested"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-purple-100">
                        <span className="text-neutral-600">
                          {TRANSACTION_MESSAGES.LABEL_REFUND_DATE}
                        </span>
                        <span className="font-medium text-neutral-800">
                          {formatDate(detail.refund.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 z-10 px-6 py-4 border-t border-neutral-200 bg-white/95 backdrop-blur-md flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl border-neutral-200 text-neutral-700 hover:bg-neutral-100"
            >
              {TRANSACTION_MESSAGES.CLOSE}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
