import { MessageSquare, UtensilsCrossed } from "lucide-react";
import type { RestaurantOrderDetail } from "@/features/orders/types/restaurant-orders.types";
import { formatCurrency } from "@/lib/utils/currency";

interface RestaurantOrderItemsCardProps {
  items: RestaurantOrderDetail["items"];
}

export function RestaurantOrderItemsCard({ items = [] }: RestaurantOrderItemsCardProps) {
  const totalQuantity = (items ?? []).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="rounded-2xl border border-[#eddcd4] bg-white shadow-2xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-[#f3e6de] bg-[#fffcf9] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="size-4 text-[#e8631b]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
            Ordered Items ({items?.length ?? 0})
          </h2>
        </div>
        <span className="text-xs font-semibold text-neutral-500">
          {totalQuantity} total quantity
        </span>
      </div>

      <div className="divide-y divide-[#f3e6de] p-4 sm:p-5">
        {(items ?? []).map((item) => (
          <div key={item.itemId} className="py-4 first:pt-1 last:pb-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-7 items-center justify-center rounded-xl bg-[#fef3ec] text-[#9a3412] text-xs font-bold border border-[#fae2d3]">
                    {item.quantity}×
                  </span>
                  <span className="text-sm sm:text-base font-bold text-neutral-900">
                    {item.itemName}
                  </span>
                </div>

                {item.variantName && (
                  <p className="mt-1 ml-9 text-xs font-medium text-neutral-500">
                    Variant:{" "}
                    <span className="text-neutral-800 font-semibold">{item.variantName}</span>
                  </p>
                )}

                {/* Addons List */}
                {item.addons && item.addons.length > 0 && (
                  <div className="mt-2 ml-9 space-y-1">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Add-ons:
                    </p>
                    {item.addons.map((addon) => (
                      <div
                        key={addon.addonId}
                        className="text-xs text-neutral-600 flex items-center gap-2"
                      >
                        <span className="text-[#e8631b] font-bold">+</span>
                        <span>{addon.addonName}</span>
                        <span className="text-neutral-400 font-medium">
                          ({formatCurrency(addon.price)})
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Item-specific special instructions */}
                {item.specialInstructions && (
                  <div className="mt-2.5 ml-9 flex items-start gap-2 rounded-xl bg-amber-50/80 border border-amber-200/70 p-2.5 text-xs text-amber-900">
                    <MessageSquare className="size-3.5 shrink-0 text-amber-600 mt-0.5" />
                    <span>
                      <strong className="font-semibold">Special Request:</strong>{" "}
                      {item.specialInstructions}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-right shrink-0">
                <p className="text-base font-bold text-neutral-900 font-mono">
                  {formatCurrency(item.totalPrice)}
                </p>
                <p className="text-xs text-neutral-400">
                  {formatCurrency(item.unitPrice)} ea
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
