import { CreditCard, ShieldCheck, Zap } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PaymentModeType } from "../types/checkout.types";

interface PaymentMethodCardProps {
  paymentMode?: PaymentModeType;
  setPaymentMode?: (mode: PaymentModeType) => void;
  isSubmitting?: boolean;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = () => {
  return (
    <Card className="rounded-2xl border-neutral-200/80 bg-white shadow-xs">
      <CardHeader className="flex flex-row items-center gap-3 border-b border-neutral-100 pb-4 pt-5 px-5 sm:px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-[#ff6b00]">
          <CreditCard className="h-4.5 w-4.5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold text-neutral-900">Payment Method</CardTitle>
          <p className="text-xs text-neutral-500">Pay securely online with Razorpay</p>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Single Online Payment Option: Razorpay */}
        <section
          aria-label="Razorpay Payment Method"
          className="w-full text-left rounded-2xl border border-orange-300 bg-gradient-to-r from-orange-50/70 via-amber-50/30 to-white shadow-xs ring-1 ring-[#ff6b00]/30 p-4 sm:p-4.5 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            {/* Payment Logo Container */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200/70 bg-white p-2 shadow-2xs">
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
                Online Payment (UPI, Cards & Netbanking)
              </p>
              <p className="text-[11px] text-neutral-500">
                Supports Google Pay, PhonePe, Paytm, All Major Cards & Netbanking
              </p>
            </div>
          </div>

          {/* Active Selection Indicator */}
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#ff6b00] bg-white ring-2 ring-[#ff6b00]/20">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff6b00]" />
          </div>
        </section>

        {/* Security & Guarantee Note */}
        <div className="flex items-start gap-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 p-3.5 text-xs text-neutral-600">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          <p>
            Orders are confirmed directly upon instant payment verification. 100% secure with
            256-bit encryption.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
