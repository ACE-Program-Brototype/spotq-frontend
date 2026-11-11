import { Receipt } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import type { CustomerOrderPricing } from "../../types/customer-order-details.types";

export interface OrderPricingCardProps {
  pricing: CustomerOrderPricing;
  className?: string;
}

export function OrderPricingCard({ pricing, className = "" }: OrderPricingCardProps) {
  return (
    <div
      data-testid="order-pricing-card"
      className={`rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs space-y-4 ${className}`}
    >
      <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
        <Receipt className="size-4 text-[#e8631b]" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
          Bill Details
        </h3>
      </div>

      <div className="space-y-2.5 text-xs text-neutral-600">
        <div className="flex justify-between items-center">
          <span>Item Subtotal</span>
          <span data-testid="pricing-subtotal" className="font-semibold text-neutral-900 font-mono">
            {formatCurrency(pricing.subtotal)}
          </span>
        </div>

        {pricing.discounts > 0 && (
          <div className="flex justify-between items-center text-emerald-700">
            <span>Discount</span>
            <span
              data-testid="pricing-discounts"
              className="font-semibold text-emerald-700 font-mono"
            >
              -{formatCurrency(pricing.discounts)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>Taxes & GST</span>
          <span data-testid="pricing-taxes" className="font-semibold text-neutral-900 font-mono">
            {formatCurrency(pricing.taxes)}
          </span>
        </div>

        {pricing.platform_fee > 0 && (
          <div className="flex justify-between items-center">
            <span>Platform Fee</span>
            <span
              data-testid="pricing-platform-fee"
              className="font-semibold text-neutral-900 font-mono"
            >
              {formatCurrency(pricing.platform_fee)}
            </span>
          </div>
        )}

        <div className="pt-3 border-t border-dashed border-neutral-200 flex justify-between items-baseline">
          <span className="font-bold text-sm text-neutral-900 uppercase tracking-wider">
            Grand Total
          </span>
          <span
            data-testid="pricing-grand-total"
            className="text-xl font-black text-[#e8631b] font-mono"
          >
            {formatCurrency(pricing.grand_total)}
          </span>
        </div>
      </div>
    </div>
  );
}
