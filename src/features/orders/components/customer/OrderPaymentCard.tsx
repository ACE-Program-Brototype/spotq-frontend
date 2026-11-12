import { CheckCircle2, CreditCard, ShieldCheck, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { CUSTOMER_PAYMENT_STATUS } from "../../constants/customer-order-details.constants";
import type {
  CustomerOrderPayment,
  CustomerOrderRefundStatus,
} from "../../types/customer-order-details.types";

export interface OrderPaymentCardProps {
  payment: CustomerOrderPayment;
  refundStatus?: CustomerOrderRefundStatus;
  isRefundLoading?: boolean;
  refundError?: string;
  className?: string;
}

export function OrderPaymentCard({
  payment,
  refundStatus,
  isRefundLoading = false,
  refundError,
  className = "",
}: OrderPaymentCardProps) {
  const isPaid = payment.status?.toUpperCase() === CUSTOMER_PAYMENT_STATUS.PAID;
  const isFailed = payment.status?.toUpperCase() === CUSTOMER_PAYMENT_STATUS.FAILED;

  return (
    <div
      data-testid="order-payment-card"
      className={`rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <CreditCard className="size-4 text-emerald-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Payment Information
          </h3>
        </div>

        <span
          data-testid="payment-status-badge"
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isPaid
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : isFailed
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {isPaid ? (
            <CheckCircle2 className="size-3.5" />
          ) : isFailed ? (
            <XCircle className="size-3.5" />
          ) : null}
          <span>{payment.status}</span>
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex justify-between items-center text-neutral-600">
          <span className="font-medium">Payment Mode</span>
          <span data-testid="payment-method" className="font-bold text-neutral-900">
            {payment.method}
          </span>
        </div>

        <div className="flex justify-between items-center text-neutral-600">
          <span className="font-medium">Amount Paid</span>
          <span
            data-testid="payment-amount-paid"
            className="font-bold text-neutral-900 text-sm font-mono"
          >
            {formatCurrency(payment.amount_paid)}
          </span>
        </div>

        {payment.payment_id && (
          <div className="pt-2 border-t border-neutral-100">
            <span className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">
              Transaction Reference ID
            </span>
            <p
              data-testid="payment-id"
              className="mt-0.5 font-mono text-[11px] text-neutral-600 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-200/60 truncate"
            >
              {payment.payment_id}
            </p>
          </div>
        )}

        {isPaid && (
          <div className="pt-2 flex items-center gap-1.5 text-[11px] text-neutral-400">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Verified Secure Payment</span>
          </div>
        )}

        {refundStatus && (
          <div
            data-testid="order-refund-status"
            className="space-y-2 border-t border-neutral-100 pt-3"
          >
            <div className="flex items-center justify-between gap-3 text-neutral-600">
              <span className="font-medium">Refund status</span>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                {refundStatus.status}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-neutral-600">
              <span className="font-medium">Refund amount</span>
              <span className="font-bold text-neutral-900">
                {formatCurrency(refundStatus.amountPaise / 100)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-neutral-600">
              <span className="font-medium">Initiated</span>
              <span className="text-right text-neutral-800">
                {formatDate(refundStatus.timeline.initiatedAt)}
              </span>
            </div>
            {refundStatus.timeline.gatewayProcessedAt && (
              <div className="flex items-center justify-between gap-3 text-neutral-600">
                <span className="font-medium">Processed</span>
                <span className="text-right text-neutral-800">
                  {formatDate(refundStatus.timeline.gatewayProcessedAt)}
                </span>
              </div>
            )}
            {refundStatus.reason && (
              <p className="text-[11px] leading-relaxed text-neutral-500">
                Reason: {refundStatus.reason}
              </p>
            )}
            {refundStatus.supportReference.arn && (
              <p className="break-all font-mono text-[11px] text-neutral-500">
                ARN: {refundStatus.supportReference.arn}
              </p>
            )}
          </div>
        )}

        {isRefundLoading && (
          <p className="border-t border-neutral-100 pt-3 text-xs text-neutral-500">
            Loading refund status…
          </p>
        )}
        {refundError && (
          <p role="alert" className="border-t border-neutral-100 pt-3 text-xs text-rose-700">
            {refundError}
          </p>
        )}
      </div>
    </div>
  );
}
