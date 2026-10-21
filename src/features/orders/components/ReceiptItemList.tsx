import { MessageSquareQuote, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { ORDER_RECEIPT_MESSAGES } from "../constants/order-receipt.constants";
import type { ReceiptItem } from "../types/order-receipt.types";

export interface ReceiptItemListProps {
  items: ReceiptItem[];
}

export function ReceiptItemList({ items }: ReceiptItemListProps) {
  return (
    <div data-testid="receipt-items-container" className="p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          {ORDER_RECEIPT_MESSAGES.ITEMS_HEADER}
        </h3>
        <span className="text-xs text-neutral-400">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="divide-y divide-neutral-100">
        {items.map((item, index) => (
          <div
            key={item.id ?? `${item.menu_item_id}-${item.variant_id ?? "default"}-${index}`}
            data-testid="receipt-item-row"
            className="py-3.5 first:pt-1 last:pb-1 flex items-start justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-neutral-900 text-sm">{item.quantity}x</span>
                <span className="font-semibold text-neutral-900 text-sm truncate">{item.name}</span>
              </div>

              {item.variant_name && (
                <div
                  data-testid="receipt-item-variant"
                  className="flex items-center gap-1.5 text-xs text-neutral-600 pl-6"
                >
                  <span className="text-neutral-400 font-medium">
                    {ORDER_RECEIPT_MESSAGES.VARIANT_LABEL}
                  </span>
                  <span>{item.variant_name}</span>
                </div>
              )}

              {item.addons && item.addons.length > 0 && (
                <div
                  data-testid="receipt-item-addons"
                  className="space-y-0.5 text-xs text-neutral-600 pl-6"
                >
                  <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-400">
                    <Sparkles className="size-3 text-[#e8631b]" />
                    <span>{ORDER_RECEIPT_MESSAGES.ADDONS_LABEL}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {item.addons.map((addon) => (
                      <span
                        key={addon.addon_id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-[11px] text-neutral-700 font-medium"
                      >
                        {addon.name}
                        <span className="text-neutral-400">+{formatCurrency(addon.price)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.special_instructions && (
                <div
                  data-testid="receipt-item-instructions"
                  className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50/70 border border-amber-200/60 rounded-md p-1.5 ml-6 mt-1"
                >
                  <MessageSquareQuote className="size-3.5 shrink-0 mt-0.5 text-amber-600" />
                  <div className="min-w-0">
                    <span className="font-medium mr-1">
                      {ORDER_RECEIPT_MESSAGES.SPECIAL_INSTRUCTIONS_LABEL}
                    </span>
                    <span className="italic">{item.special_instructions}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-right shrink-0">
              <div
                data-testid="receipt-item-line-total"
                className="font-bold text-sm text-neutral-900"
              >
                {formatCurrency(item.line_total)}
              </div>
              <div className="text-[11px] text-neutral-400">
                {formatCurrency(item.unit_price)} each
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
