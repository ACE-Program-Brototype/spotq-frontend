import { ChefHat, Plus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STAFF_ORDER_DETAILS_MESSAGES } from "@/features/orders/constants/staff-orders.constants";
import type { StaffOrderDetailItem } from "@/features/orders/types/staff-orders.types";

interface StaffOrderItemCardProps {
  item: StaffOrderDetailItem;
  itemNumber: number;
}

export function StaffOrderItemCard({ item, itemNumber }: StaffOrderItemCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Quantity & Item Info */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Quantity Badge */}
          <div
            className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-2xl bg-[#fef3ec] text-[#e8631b] border border-[#fae2d3] font-black text-base sm:text-lg shadow-2xs"
            title={STAFF_ORDER_DETAILS_MESSAGES.ITEM_BADGE_TITLE(itemNumber, item.quantity)}
          >
            {item.quantity}
            {STAFF_ORDER_DETAILS_MESSAGES.QUANTITY_MULTIPLIER}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Item Name */}
            <h3 className="text-base sm:text-lg font-black tracking-tight text-neutral-900 leading-snug break-words">
              {item.name}
            </h3>

            {/* Variant / Size Tag */}
            {item.variant?.name && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-neutral-500">
                  {STAFF_ORDER_DETAILS_MESSAGES.VARIANT_LABEL}
                </span>
                <Badge
                  variant="outline"
                  className="rounded-lg bg-neutral-50 px-2 py-0.5 text-xs font-bold text-neutral-800 border-neutral-200"
                >
                  {item.variant.name}
                </Badge>
              </div>
            )}

            {/* Add-ons & Modifiers List */}
            {item.addons && item.addons.length > 0 && (
              <div className="pt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1">
                  <Sparkles className="size-3 text-[#e8631b]" />
                  <span>{STAFF_ORDER_DETAILS_MESSAGES.SELECTED_ADDONS_LABEL}</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.addons.map((addon) => (
                    <span
                      key={addon.id || addon.name}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-50/80 px-2.5 py-1 text-xs font-semibold text-amber-900 border border-amber-200/70"
                    >
                      <Plus className="size-3 text-amber-700" />
                      <span>{addon.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Item-Specific Special Cooking Instructions */}
            {item.specialInstructions && (
              <div className="mt-3 rounded-xl bg-amber-50/90 border-2 border-amber-300 p-3 sm:p-3.5 shadow-2xs text-amber-950">
                <div className="flex items-start gap-2.5">
                  <div className="size-6 rounded-lg bg-amber-200/60 flex items-center justify-center shrink-0 mt-0.5 text-amber-800">
                    <ChefHat className="size-3.5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                      {STAFF_ORDER_DETAILS_MESSAGES.KITCHEN_SPECIAL_REQUEST_LABEL}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold leading-relaxed text-amber-950 break-words">
                      &ldquo;{item.specialInstructions}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
