import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CART_MESSAGES, CART_QUANTITY_LIMITS } from "@/features/cart/constants/cart.constants";
import { formatCurrency } from "@/lib/utils";

interface MenuItemCardActionsProps {
  itemId: string;
  quantity: number;
  totalItemPrice: number;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
  onAddToCart: () => void;
}

export function MenuItemCardActions({
  itemId,
  quantity,
  totalItemPrice,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onAddToCart,
}: MenuItemCardActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-stone-100 px-3.5 py-2.5 sm:px-5 sm:py-3">
      <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-stone-200 bg-stone-50 p-1 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={quantity <= CART_QUANTITY_LIMITS.MIN_ITEM_QUANTITY}
          onClick={onDecreaseQuantity}
          aria-label={CART_MESSAGES.DECREASE_QUANTITY}
          className="size-7 rounded-lg text-stone-700 hover:bg-white hover:text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Minus className="size-3.5" />
        </Button>

        <span
          data-testid={`quantity-selector-${itemId}`}
          className="w-7 text-center text-sm font-bold text-stone-900"
        >
          {quantity}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={quantity >= CART_QUANTITY_LIMITS.MAX_ITEM_QUANTITY}
          onClick={onIncreaseQuantity}
          aria-label={CART_MESSAGES.INCREASE_QUANTITY}
          className="size-7 rounded-lg text-stone-700 hover:bg-white hover:text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      <Button
        type="button"
        onClick={onAddToCart}
        className="rounded-xl bg-[#ff6b00] px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#e05e00] transition cursor-pointer shrink-0"
      >
        <ShoppingCart className="mr-1.5 size-3.5 shrink-0" />
        <span>Add to Cart ({formatCurrency(totalItemPrice)})</span>
      </Button>
    </div>
  );
}
