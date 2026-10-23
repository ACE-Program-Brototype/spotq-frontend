import { ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PaymentModeType, PriceBreakdown } from "../types/checkout.types";

interface OrderSummaryCardProps {
  priceBreakdown: PriceBreakdown;
  paymentMode: PaymentModeType;
  flow?: string;
  isSubmitting: boolean;
  onCheckout: () => void;
  itemCount: number;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  priceBreakdown,
  paymentMode,
  isSubmitting,
  onCheckout,
  itemCount,
}) => {
  const { itemsSubtotal, gstAmount, platformFee, grandTotal } = priceBreakdown;

  const isOnline = paymentMode === "ONLINE";

  // Dynamic button label according to payment mode
  const getButtonLabel = () => {
    if (isSubmitting) {
      return "Processing Order...";
    }

    const formattedTotal = grandTotal.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    });

    return isOnline ? `Pay Now ₹${formattedTotal}` : `Confirm Order ₹${formattedTotal}`;
  };

  return (
    <Card className="rounded-2xl border-neutral-200/80 bg-white shadow-xs">
      <CardHeader className="border-b border-neutral-100 pb-4 pt-5 px-5 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-neutral-900">Order Summary</CardTitle>
          <span className="text-xs font-semibold text-neutral-500">
            {itemCount} {itemCount === 1 ? "Item" : "Items"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Price Breakdown */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between text-neutral-600">
            <span>Item Total</span>
            <span className="font-semibold text-neutral-900">
              ₹{itemsSubtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-600">
            <span className="flex items-center gap-1.5">
              <span>Taxes & GST (5%)</span>
            </span>
            <span className="font-semibold text-neutral-900">
              ₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-600">
            <span className="flex items-center gap-1.5">
              <span>SpotQ Platform Fee</span>
              <span
                className={`rounded-xs px-1 py-0.2 text-[10px] font-bold ${
                  platformFee === 0
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {platformFee === 0 ? "FREE" : "FIXED"}
              </span>
            </span>
            <span className="font-semibold text-neutral-900">
              ₹{platformFee.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <Separator className="bg-neutral-100" />

        {/* Grand Total Row */}
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Grand Total</h3>
            <p className="text-[11px] text-neutral-400">Inclusive of all taxes</p>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#ff6b00] tracking-tight">
              ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Pre-payment CTA Button */}
        <div className="pt-2">
          <Button
            type="button"
            disabled={isSubmitting || itemCount === 0}
            onClick={onCheckout}
            className="w-full h-13 rounded-2xl bg-[#ff6b00] hover:bg-[#e65a00] text-white text-base font-bold shadow-lg shadow-orange-500/25 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <span>{getButtonLabel()}</span>
                <ChevronRight className="h-5 w-5 stroke-[2.5]" />
              </>
            )}
          </Button>
        </div>

        {/* Safe & Secure Guarantee matching screenshot */}
        <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-neutral-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="font-medium">Safe and Secure Payments</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
