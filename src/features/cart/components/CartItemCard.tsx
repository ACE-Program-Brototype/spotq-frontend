import { Minus, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CART_MESSAGES } from "@/features/cart/constants/cart.constants";
import type { CartItem } from "@/features/cart/types/cart.types";
import { formatCurrency } from "@/lib/utils";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemoveItem }: CartItemCardProps) {
  return (
    <article
      data-testid={`cart-item-${item.id}`}
      className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs transition sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="size-16 shrink-0 rounded-xl object-cover sm:size-20"
          />
        ) : (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-300 sm:size-20">
            <UtensilsCrossed className="size-6" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`size-2 shrink-0 rounded-full border ${
                item.isVegetarian ? "border-green-600 bg-green-600" : "border-red-600 bg-red-600"
              }`}
              role="img"
              aria-label={
                item.isVegetarian ? CART_MESSAGES.VEGETARIAN : CART_MESSAGES.NON_VEGETARIAN
              }
            />
            <h3 className="truncate text-base font-bold text-stone-900">{item.name}</h3>
          </div>

          {item.selectedVariant && (
            <p className="mt-1 text-xs text-stone-500">
              <span className="font-semibold text-stone-700">Variant: </span>
              {item.selectedVariant.name} ({formatCurrency(item.selectedVariant.price)})
            </p>
          )}

          {item.selectedAddons && item.selectedAddons.length > 0 && (
            <p className="mt-0.5 text-xs text-stone-500">
              <span className="font-semibold text-stone-700">Add-ons: </span>
              {item.selectedAddons
                .map(
                  (addon) =>
                    `${addon.name}${addon.price > 0 ? ` (+${formatCurrency(addon.price)})` : ""}`,
                )
                .join(", ")}
            </p>
          )}

          <p className="mt-2 text-xs font-semibold text-stone-500">
            Unit Price: {formatCurrency(item.unitPrice)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-stone-100 pt-3 sm:border-0 sm:pt-0 sm:justify-end sm:gap-6">
        <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 p-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, -1)}
            aria-label={CART_MESSAGES.DECREASE_QUANTITY}
            className="size-7 rounded-lg text-stone-700 hover:bg-white hover:text-stone-900"
          >
            <Minus className="size-3.5" />
          </Button>

          <span
            data-testid={`quantity-${item.id}`}
            className="w-7 text-center text-sm font-bold text-stone-900"
          >
            {item.quantity}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, 1)}
            aria-label={CART_MESSAGES.INCREASE_QUANTITY}
            className="size-7 rounded-lg text-stone-700 hover:bg-white hover:text-stone-900"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span
            data-testid={`subtotal-${item.id}`}
            className="text-base font-extrabold text-[#f26500]"
          >
            {formatCurrency(item.subtotal)}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemoveItem(item.id)}
            aria-label={CART_MESSAGES.DELETE_ITEM}
            className="size-8 text-stone-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
