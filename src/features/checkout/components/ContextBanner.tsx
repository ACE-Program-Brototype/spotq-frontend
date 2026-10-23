import { CheckCircle2, Clock, Sparkles, Store, Utensils, Zap } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import type { DiningContext, OrderFlowType } from "../types/checkout.types";

interface ContextBannerProps {
  context: DiningContext;
  onSwitchFlow?: (flow: OrderFlowType) => void;
}

export const ContextBanner: React.FC<ContextBannerProps> = ({ context, onSwitchFlow }) => {
  const { flow, tableNumber, restaurantName, queueToken, estimatedWaitMinutes } = context;

  return (
    <section aria-label="Dining context banner" className="mb-6 space-y-3">
      {/* Interactive Quick Mode Switcher for seamless demonstration & evaluation */}
      {onSwitchFlow && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-neutral-100/80 p-1.5 text-xs">
          <span className="px-2 font-medium text-neutral-500">Service Mode:</span>
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => onSwitchFlow("SELF_SERVICE_TABLE")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
                flow === "SELF_SERVICE_TABLE"
                  ? "bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-200"
                  : "text-neutral-600 hover:bg-white/60"
              }`}
            >
              <Store className="h-3.5 w-3.5 text-emerald-600" />
              Table QR ({tableNumber || "04"})
            </button>
            <button
              type="button"
              onClick={() => onSwitchFlow("QUEUE_PRE_ORDER")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
                flow === "QUEUE_PRE_ORDER"
                  ? "bg-white text-amber-700 shadow-xs ring-1 ring-amber-200"
                  : "text-neutral-600 hover:bg-white/60"
              }`}
            >
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              Queue Pro ({queueToken || "#Q-24"})
            </button>
            <button
              type="button"
              onClick={() => onSwitchFlow("RUNNING_ADDON")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
                flow === "RUNNING_ADDON"
                  ? "bg-white text-orange-700 shadow-xs ring-1 ring-orange-200"
                  : "text-neutral-600 hover:bg-white/60"
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-orange-600" />⚡ Running Add-on
            </button>
          </div>
        </div>
      )}

      {/* 1. Self-Service Pro Flow Banner (Sticky Table Reference) */}
      {flow === "SELF_SERVICE_TABLE" && (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-white p-4 sm:p-5 shadow-xs transition-all">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-500/20">
                <Utensils className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                    Table {tableNumber || "04"} | {restaurantName}
                  </h3>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold px-2 py-0.5 text-xs flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    Verified Table QR
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600">
                  Instant prepay online checkout — freshly prepared food will be served directly to
                  your table.
                </p>
              </div>
            </div>
            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-100/70 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              Self-Service Pro
            </div>
          </div>
        </div>
      )}

      {/* 2. Queue Pro Flow Banner (Queue Token & ETA) */}
      {flow === "QUEUE_PRE_ORDER" && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-orange-50/40 to-white p-4 sm:p-5 shadow-xs transition-all">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm shadow-amber-500/20">
                <Clock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                    Queue Token {queueToken || "#Q-24"} • {restaurantName}
                  </h3>
                  <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-semibold px-2 py-0.5 text-xs">
                    Pre-Order for Seating
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600">
                  Pre-payment checkout completed before table seating. Kitchen will schedule and
                  fire orders as soon as your party is called.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-amber-200 bg-white/90 px-3.5 py-2 shadow-xs">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold tracking-wider text-amber-700">
                  Estimated Wait
                </p>
                <p className="text-sm font-extrabold text-neutral-900">
                  ~{estimatedWaitMinutes || 25} mins
                </p>
              </div>
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* 3. Running Add-on Re-order Flow Banner (Priority Delivery) */}
      {flow === "RUNNING_ADDON" && (
        <div className="relative overflow-hidden rounded-2xl border border-orange-300/90 bg-gradient-to-r from-orange-50 via-amber-50/50 to-white p-4 sm:p-5 shadow-xs transition-all">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#ff6b00] to-orange-500 text-white shadow-sm shadow-orange-500/25">
                <Zap className="h-5 w-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-neutral-900 sm:text-lg flex items-center gap-1.5">
                    <span>⚡ Priority Delivery: Dispatched to kitchen immediately</span>
                  </h3>
                  <Badge className="bg-orange-100 text-orange-900 border-orange-300 font-semibold px-2 py-0.5 text-xs">
                    Table {tableNumber || "04"} Add-on
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600">
                  Customer is currently dining at Table {tableNumber || "04"}. These items will be
                  fast-tracked directly to the chef line.
                </p>
              </div>
            </div>
            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-orange-200 bg-white/90 px-3 py-1.5 text-xs font-bold text-orange-700 shadow-xs">
              ⚡ Urgent Kitchen Dispatch
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContextBanner;
