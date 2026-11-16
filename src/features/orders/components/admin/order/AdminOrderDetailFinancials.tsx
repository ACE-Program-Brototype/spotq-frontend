import { Check, Copy, CreditCard, Store, User } from "lucide-react";
import {
  ADMIN_ORDERS_TABLE_LABELS,
  ADMIN_ORDER_COPY_FIELDS,
  ADMIN_ORDER_DETAIL_LABELS,
} from "@/features/orders/constants/admin-orders.constants";
import type { AdminOrderListItem } from "@/features/orders/types/admin-orders.types";
import { formatCurrency } from "@/lib/utils/currency";

interface AdminOrderDetailFinancialsProps {
  order: AdminOrderListItem;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}

export function AdminOrderDetailFinancials({
  order,
  copiedField,
  onCopy,
}: AdminOrderDetailFinancialsProps) {
  const paymentRef = order.paymentReference;

  return (
    <>
      {/* Restaurant & Customer Context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Restaurant */}
        <div className="rounded-xl border border-slate-200/80 p-4 bg-white shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Store className="size-3.5 text-slate-400" />
            <span>{ADMIN_ORDER_DETAIL_LABELS.RESTAURANT}</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {order.restaurantName || ADMIN_ORDERS_TABLE_LABELS.DEFAULT_RESTAURANT_NAME}
          </p>
        </div>

        {/* Customer */}
        <div className="rounded-xl border border-slate-200/80 p-4 bg-white shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <User className="size-3.5 text-slate-400" />
            <span>{ADMIN_ORDER_DETAIL_LABELS.CUSTOMER}</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {order.customerId
              ? ADMIN_ORDER_DETAIL_LABELS.REGISTERED_CUSTOMER
              : ADMIN_ORDER_DETAIL_LABELS.GUEST_CUSTOMER}
          </p>
        </div>
      </div>

      {/* Payment Reference */}
      <div className="rounded-xl border border-slate-200/80 p-4 bg-white shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <CreditCard className="size-3.5 text-slate-400" />
            <span>{ADMIN_ORDER_DETAIL_LABELS.PAYMENT_REFERENCE}</span>
          </div>
          {paymentRef && (
            <button
              type="button"
              onClick={() => onCopy(paymentRef, ADMIN_ORDER_COPY_FIELDS.PAYMENT_REF)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#0052cc] hover:underline cursor-pointer"
              aria-label={ADMIN_ORDER_DETAIL_LABELS.COPY}
            >
              {copiedField === ADMIN_ORDER_COPY_FIELDS.PAYMENT_REF ? (
                <>
                  <Check className="size-3 text-emerald-600" />
                  <span>{ADMIN_ORDER_DETAIL_LABELS.COPIED}</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>{ADMIN_ORDER_DETAIL_LABELS.COPY}</span>
                </>
              )}
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm font-mono text-slate-800 break-all bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
          {paymentRef || ADMIN_ORDER_DETAIL_LABELS.NO_GATEWAY_REFERENCE}
        </p>
      </div>

      {/* Pricing Ledger / Financial Breakdown */}
      <div className="rounded-xl border border-slate-200/80 p-4 bg-white shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {ADMIN_ORDER_DETAIL_LABELS.FINANCIAL_BREAKDOWN}
        </h3>

        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-slate-600">
            <span>{ADMIN_ORDER_DETAIL_LABELS.SUBTOTAL}</span>
            <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>{ADMIN_ORDER_DETAIL_LABELS.TAX_AMOUNT}</span>
            <span className="font-semibold">{formatCurrency(order.taxAmount)}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>{ADMIN_ORDER_DETAIL_LABELS.PLATFORM_FEE}</span>
            <span className="font-semibold text-[#0052cc]">
              {formatCurrency(order.platformFeeAssessed)}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between text-sm sm:text-base font-black text-slate-900">
            <span>{ADMIN_ORDER_DETAIL_LABELS.GRAND_TOTAL}</span>
            <span className="text-emerald-600">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
