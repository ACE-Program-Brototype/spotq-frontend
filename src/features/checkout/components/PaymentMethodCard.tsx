import { CreditCard, Info, Store, Zap } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PaymentModeType } from "../types/checkout.types";

interface PaymentMethodCardProps {
  paymentMode: PaymentModeType;
  setPaymentMode: (mode: PaymentModeType) => void;
  isSubmitting?: boolean;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMode,
  setPaymentMode,
  isSubmitting = false,
}) => {
  return (
    <Card className="rounded-2xl border-neutral-200/80 bg-white shadow-xs">
      <CardHeader className="flex flex-row items-center gap-3 border-b border-neutral-100 pb-4 pt-5 px-5 sm:px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-[#ff6b00]">
          <CreditCard className="h-4.5 w-4.5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold text-neutral-900">Payment Method</CardTitle>
          <p className="text-xs text-neutral-500">Select how you would like to settle this order</p>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Payment Options */}
        <div className="space-y-3">
          {/* Option 1: ONLINE (Razorpay) */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setPaymentMode("ONLINE")}
            className={`w-full text-left rounded-2xl border p-4 sm:p-4.5 transition-all flex items-center justify-between gap-4 cursor-pointer ${
              paymentMode === "ONLINE"
                ? "border-orange-300 bg-gradient-to-r from-orange-50/70 via-amber-50/30 to-white shadow-xs ring-1 ring-[#ff6b00]/30"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/60"
            }`}
          >
            <div className="flex items-center gap-3.5">
              {/* Payment Logo Container */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200/70 bg-white p-2 shadow-2xs">
                {/* Razorpay / Gateway Icon */}
                <div className="flex flex-col items-center justify-center text-[#0c2340]">
                  <span className="text-[11px] font-black tracking-tight leading-none text-blue-900">
                    Razor<span className="text-sky-500">pay</span>
                  </span>
                  <div className="mt-0.5 flex gap-0.5">
                    <span className="h-1 w-2.5 rounded-xs bg-[#ff6b00]" />
                    <span className="h-1 w-2.5 rounded-xs bg-sky-500" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-neutral-900 text-sm sm:text-base">Razorpay</span>
                  <Badge className="bg-[#ff6b00] text-white border-none font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-0.5">
                    <Zap className="h-2.5 w-2.5 fill-white" />
                    FASTEST
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-[#ff6b00] mt-0.5">
                  Auto-selected — Payment via Razorpay
                </p>
                <p className="text-[11px] text-neutral-500">
                  Cards, UPI (GPay/PhonePe), Netbanking available
                </p>
              </div>
            </div>

            {/* Custom Radio Circle */}
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                paymentMode === "ONLINE"
                  ? "border-[#ff6b00] bg-white ring-2 ring-[#ff6b00]/20"
                  : "border-neutral-300 bg-white"
              }`}
            >
              {paymentMode === "ONLINE" && (
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff6b00]" />
              )}
            </div>
          </button>

          {/* Option 2: PAY_AT_COUNTER */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setPaymentMode("PAY_AT_COUNTER")}
            className={`w-full text-left rounded-2xl border p-4 sm:p-4.5 transition-all flex items-center justify-between gap-4 cursor-pointer ${
              paymentMode === "PAY_AT_COUNTER"
                ? "border-orange-300 bg-gradient-to-r from-orange-50/70 via-amber-50/30 to-white shadow-xs ring-1 ring-[#ff6b00]/30"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/60"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200/70 bg-white text-neutral-700 shadow-2xs">
                <Store className="h-6 w-6 text-neutral-600" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-neutral-900 text-sm sm:text-base">
                    Pay at Counter
                  </span>
                  <Badge
                    variant="outline"
                    className="border-neutral-300 text-neutral-600 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  >
                    POST-PAY / CASH
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-neutral-700 mt-0.5">
                  Settle bill at the counter when order is served
                </p>
                <p className="text-[11px] text-neutral-500">
                  Cash, Card swipe, or QR transfer at the restaurant counter
                </p>
              </div>
            </div>

            {/* Custom Radio Circle */}
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                paymentMode === "PAY_AT_COUNTER"
                  ? "border-[#ff6b00] bg-white ring-2 ring-[#ff6b00]/20"
                  : "border-neutral-300 bg-white"
              }`}
            >
              {paymentMode === "PAY_AT_COUNTER" && (
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff6b00]" />
              )}
            </div>
          </button>
        </div>

        {/* Footer info box matching the screenshot */}
        <div className="flex items-start gap-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 p-3.5 text-xs text-neutral-600">
          <Info className="h-4 w-4 shrink-0 text-neutral-400 mt-0.5" />
          <p>
            Other payment methods are currently disabled for this merchant&apos;s express checkout
            flow.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
