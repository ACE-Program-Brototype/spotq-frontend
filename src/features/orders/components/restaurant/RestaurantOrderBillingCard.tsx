import { CreditCard } from "lucide-react";
import { ORDER_PAYMENT_STATUS } from "@/features/orders/constants/orders.constants";
import type { RestaurantOrderDetail } from "@/features/orders/types/restaurant-orders.types";
import { formatCurrency } from "@/lib/utils/currency";

interface RestaurantOrderBillingCardProps {
  pricing: RestaurantOrderDetail["pricing"];
  paymentMode: string;
  paymentStatus: string;
}

export function RestaurantOrderBillingCard({
  pricing,
  paymentMode,
  paymentStatus,
}: RestaurantOrderBillingCardProps) {
  return (
    <div className="rounded-2xl border border-[#eddcd4] bg-white p-4 sm:p-5 shadow-2xs space-y-3.5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
        <CreditCard className="size-4 text-emerald-600" />
        <span>Payment &amp; Billing</span>
      </h3>

      {/* Payment Mode & Status badge */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[#faf7f5] border border-[#eddcd4] text-xs">
        <span className="font-semibold text-neutral-600">
          Mode: <strong className="text-neutral-900">{paymentMode}</strong>
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
            paymentStatus === ORDER_PAYMENT_STATUS.PAID
              ? "bg-emerald-100 text-emerald-800"
              : paymentStatus === ORDER_PAYMENT_STATUS.REFUNDED
                ? "bg-purple-100 text-purple-800"
                : paymentStatus === ORDER_PAYMENT_STATUS.FAILED
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800"
          }`}
        >
          {paymentStatus}
        </span>
      </div>

      {/* Itemized charges */}
      <div className="space-y-2 text-xs text-neutral-600 pt-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-neutral-900 font-mono">
            {formatCurrency(pricing?.subtotal ?? 0)}
          </span>
        </div>

        {(pricing?.discountAmount ?? 0) > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <span>
              Discount {pricing?.couponCode ? `(${pricing.couponCode})` : ""}
            </span>
            <span className="font-mono">-{formatCurrency(pricing?.discountAmount ?? 0)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Taxes (GST 5%)</span>
          <span className="font-medium text-neutral-900 font-mono">
            {formatCurrency(pricing?.taxAmount ?? 0)}
          </span>
        </div>

        {(pricing?.platformFee ?? 0) > 0 && (
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span className="font-medium text-neutral-900 font-mono">
              {formatCurrency(pricing?.platformFee ?? 0)}
            </span>
          </div>
        )}

        <div className="pt-3 border-t border-[#eddcd4] flex justify-between items-center text-sm font-bold text-neutral-900">
          <span className="text-sm uppercase tracking-wider text-neutral-600">
            Grand Total
          </span>
          <span className="text-xl text-[#9a3412] font-mono">
            {formatCurrency(pricing?.grandTotal ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
