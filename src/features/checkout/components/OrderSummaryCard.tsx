import { ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import type { PaymentModeType, PriceBreakdown } from "../types/checkout.types";

interface OrderSummaryCardProps {
  priceBreakdown: PriceBreakdown;
  paymentMode?: PaymentModeType;
  isSubmitting: boolean;
  onCheckout: () => void;
  itemCount: number;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  priceBreakdown,
  isSubmitting,
  onCheckout,
  itemCount,
}) => {
  const { itemsSubtotal, gstAmount, gstRate, platformFee, grandTotal } = priceBreakdown;
  const gstPercentage = Math.round((gstRate ?? 0.05) * 100);

  // Button label with formatted amount
  const getButtonLabel = () => {
    if (isSubmitting) {
      return "Processing Order...";
    }

    return `Pay Now ${formatCurrency(grandTotal)}`;
  };

  return (
    <Card className="rounded-lg sm:rounded-xl border border-[#eddcd4] bg-white shadow-2xs">
      <CardHeader className="border-b border-[#eddcd4]/50 px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm font-bold text-neutral-900">Order Summary</CardTitle>
          <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-500">
            {itemCount} {itemCount === 1 ? "Item" : "Items"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-2.5 sm:p-3.5 space-y-2.5 sm:space-y-3">
        {/* Price Breakdown */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-neutral-600">
            <span>Item Total</span>
            <span className="font-semibold text-neutral-900">{formatCurrency(itemsSubtotal)}</span>
          </div>

          <div className="flex items-center justify-between text-neutral-600">
            <span className="flex items-center gap-1.5">
              <span>Taxes & GST ({gstPercentage}%)</span>
            </span>
            <span className="font-semibold text-neutral-900">{formatCurrency(gstAmount)}</span>
          </div>

          <div className="flex items-center justify-between text-neutral-600">
            <span className="flex items-center gap-1">
              <span>SpotQ Platform Fee</span>
              <span
                className={`rounded-xs px-1 py-0.2 text-[8.5px] sm:text-[9px] font-bold ${
                  platformFee === 0
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-orange-100 text-[#e8631b]"
                }`}
              >
                {platformFee === 0 ? "FREE" : "FIXED"}
              </span>
            </span>
            <span className="font-semibold text-neutral-900">{formatCurrency(platformFee)}</span>
          </div>
        </div>

        <Separator className="bg-[#eddcd4]/50" />

        {/* Grand Total Row */}
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900">Grand Total</h3>
            <p className="text-[9.5px] sm:text-[10px] text-neutral-400">Inclusive of all taxes</p>
          </div>
          <div className="text-right">
            <span className="text-lg sm:text-xl font-black text-[#e8631b] tracking-tight">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>

        {/* Pre-payment CTA Button */}
        <div className="pt-0.5">
          <Button
            type="button"
            disabled={isSubmitting || itemCount === 0}
            onClick={onCheckout}
            className="w-full h-9.5 sm:h-10 rounded-lg bg-[#e8631b] hover:bg-[#9a3412] text-white text-xs sm:text-sm font-bold shadow-sm shadow-orange-500/20 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <span>{getButtonLabel()}</span>
                <ChevronRight className="size-3.5 stroke-[2.5]" />
              </>
            )}
          </Button>
        </div>

        {/* Safe & Secure Guarantee matching screenshot */}
        <div className="flex items-center justify-center gap-1 pt-0.5 text-[10px] text-neutral-500">
          <ShieldCheck className="size-3 text-emerald-600" />
          <span className="font-medium">Safe and Secure Payments</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
