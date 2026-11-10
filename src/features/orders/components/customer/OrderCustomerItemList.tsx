import { Sparkles, UtensilsCrossed } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import type { CustomerOrderItem } from "../../types/customer-order-details.types";

export interface OrderCustomerItemListProps {
  items: CustomerOrderItem[];
  className?: string;
}

export function OrderCustomerItemList({ items, className = "" }: OrderCustomerItemListProps) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      data-testid="order-customer-items-card"
      className={`rounded-2xl border border-neutral-200/80 bg-white shadow-2xs overflow-hidden ${className}`}
    >
      <div className="p-4 sm:p-5 border-b border-neutral-100 bg-[#fffcf9] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="size-4 text-[#e8631b]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Itemized Order Items ({items.length})
          </h2>
        </div>
        <span className="text-xs font-semibold text-neutral-500">
          {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="divide-y divide-neutral-100 p-4 sm:p-5">
        {items.map((item) => (
          <div
            key={`${item.menu_item_id}-${item.variant?.variant_id ?? item.name}`}
            data-testid="order-item-row"
            className="py-3.5 first:pt-1 last:pb-1 flex items-start justify-between gap-4"
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex size-6 items-center justify-center rounded-lg bg-[#fef3ec] text-[#e8631b] text-xs font-bold shrink-0">
                  {item.quantity}×
                </span>
                <span className="text-sm font-bold text-neutral-900 truncate">{item.name}</span>
              </div>

              {item.variant?.name && (
                <p className="ml-8 text-xs font-medium text-neutral-500">
                  Size: <span className="text-neutral-800 font-semibold">{item.variant.name}</span>
                </p>
              )}

              {item.addons && item.addons.length > 0 && (
                <div className="ml-8 pt-0.5 space-y-1">
                  <div className="flex flex-wrap gap-1.5">
                    {item.addons.map((addon) => (
                      <span
                        key={addon.addon_id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-[11px] font-medium text-neutral-700"
                      >
                        <Sparkles className="size-3 text-[#e8631b]" />
                        <span>{addon.name}</span>
                        <span className="text-neutral-400 font-normal">
                          (+{formatCurrency(addon.price)})
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-right shrink-0">
              <p
                data-testid="order-item-total"
                className="text-sm font-bold text-neutral-900 font-mono"
              >
                {formatCurrency(item.line_total)}
              </p>
              <p className="text-[11px] text-neutral-400 font-medium">
                {formatCurrency(item.unit_price)} each
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
