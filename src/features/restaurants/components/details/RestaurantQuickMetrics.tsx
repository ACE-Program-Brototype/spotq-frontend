import { Armchair, Gift, Store, UtensilsCrossed } from "lucide-react";
import type { RestaurantDetails } from "../../types/restaurant.types";

export function RestaurantQuickMetrics({ settings }: { settings?: RestaurantDetails["settings"] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="size-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
            <Armchair className="size-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Capacity
            </p>
            <p className="text-lg font-bold text-slate-900">
              {settings?.seating_capacity ? `${settings.seating_capacity} Seats` : "Not specified"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div
            className={`size-10 flex items-center justify-center rounded-xl border ${
              settings?.is_opened
                ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                : "bg-slate-100 text-slate-600 border-slate-200/60"
            }`}
          >
            <Store className="size-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Store Status
            </p>
            <p className="text-lg font-bold text-slate-900">
              {settings?.is_opened ? "Open Now" : "Closed"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div
            className={`size-10 flex items-center justify-center rounded-xl border ${
              settings?.is_preorder
                ? "bg-blue-50 text-blue-600 border-blue-200/60"
                : "bg-slate-100 text-slate-500 border-slate-200/60"
            }`}
          >
            <UtensilsCrossed className="size-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Pre-Orders
            </p>
            <p className="text-lg font-bold text-slate-900">
              {settings?.is_preorder ? "Enabled" : "Disabled"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div
            className={`size-10 flex items-center justify-center rounded-xl border ${
              settings?.is_loyalty
                ? "bg-purple-50 text-purple-600 border-purple-200/60"
                : "bg-slate-100 text-slate-500 border-slate-200/60"
            }`}
          >
            <Gift className="size-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Loyalty Rewards
            </p>
            <p className="text-lg font-bold text-slate-900">
              {settings?.is_loyalty ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
