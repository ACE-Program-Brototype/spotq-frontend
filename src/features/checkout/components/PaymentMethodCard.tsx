import { SiRazorpay } from "@icons-pack/react-simple-icons";
import { CreditCard, Zap } from "lucide-react";
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
    <Card className="rounded-lg sm:rounded-xl border border-[#eddcd4] bg-white shadow-2xs">
      <CardHeader className="flex flex-row items-center gap-2 sm:gap-2.5 border-b border-[#eddcd4]/50 px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="flex size-6 sm:size-7 items-center justify-center rounded-md bg-orange-50 text-[#e8631b]">
          <CreditCard className="size-3 sm:size-3.5" />
        </div>
        <div>
          <CardTitle className="text-xs sm:text-sm font-bold text-neutral-900">Payment Method</CardTitle>
          <p className="text-[10px] sm:text-[11px] text-neutral-500">Pay securely online with Razorpay</p>
        </div>
      </CardHeader>

      <CardContent className="p-2.5 sm:p-3.5 space-y-2">
        {/* Single Online Payment Option: Razorpay */}
        <section
          aria-label="Razorpay Payment Method"
          className="w-full text-left rounded-lg border border-[#e8631b]/30 bg-linear-to-r from-orange-50/40 via-amber-50/15 to-white shadow-2xs ring-1 ring-[#e8631b]/15 p-2.5 sm:p-3 flex items-center justify-between gap-2.5"
        >
          <div className="flex items-center gap-2.5">
            {/* Payment Logo Container */}
            <div className="flex size-8 sm:size-8.5 shrink-0 items-center justify-center rounded-md border border-[#eddcd4] bg-white p-1.5 shadow-2xs">
              <SiRazorpay className="size-4.5 text-[#0c2340]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-1">
                <span className="font-bold text-neutral-900 text-xs sm:text-[13px]">Razorpay</span>
                <Badge className="bg-[#e8631b] text-white border-none font-bold text-[8.5px] tracking-wider uppercase px-1 py-0.2 rounded-full shadow-2xs flex items-center gap-0.5">
                  <Zap className="size-2 fill-white" />
                  FASTEST
                </Badge>
              </div>
              <p className="text-[10.5px] sm:text-[11px] font-semibold text-[#e8631b] mt-0.5">
                Online Payment (UPI, Cards & Netbanking)
              </p>
              <p className="text-[9.5px] sm:text-[10px] text-neutral-500">
                Supports Google Pay, PhonePe, Paytm, All Major Cards & Netbanking
              </p>
            </div>
          </div>

          {/* Active Selection Indicator */}
          <div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-[#e8631b] bg-white ring-1 ring-[#e8631b]/20">
            <div className="size-1.5 rounded-full bg-[#e8631b]" />
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
