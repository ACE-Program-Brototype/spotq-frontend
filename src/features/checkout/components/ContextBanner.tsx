import { CheckCircle2, ShieldCheck, Store, Utensils } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";

interface ContextBannerProps {
  restaurantName?: string;
  tableNumber?: string | number | null;
}

export const ContextBanner: React.FC<ContextBannerProps> = ({ restaurantName, tableNumber }) => {
  return (
    <section aria-label="Dining context banner" className="mb-6">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-gradient-to-r from-orange-50/60 via-amber-50/30 to-white p-4 sm:p-5 shadow-xs transition-all">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ff6b00] text-white shadow-sm shadow-orange-500/20">
              <Utensils className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                  {restaurantName ? `Ordering from ${restaurantName}` : "Direct Kitchen Order"}
                </h3>
                {tableNumber && (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold px-2 py-0.5 text-xs flex items-center gap-1">
                    <Store className="h-3 w-3 text-emerald-600" />
                    Table {tableNumber}
                  </Badge>
                )}
                <Badge className="bg-orange-100 text-[#ff6b00] border-orange-200 font-semibold px-2 py-0.5 text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[#ff6b00]" />
                  Direct Kitchen Sync
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600">
                Freshly prepared food dispatched directly from the kitchen upon payment
                confirmation.
              </p>
            </div>
          </div>
          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/80 border border-neutral-200/80 px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            PCI-DSS Secure Prepay
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContextBanner;
