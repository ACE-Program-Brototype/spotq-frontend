import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/currency";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { useUpdateCartQuantity } from "../hooks/use-update-cart-quantity";
import type { CartItem } from "../types/cart.types";
import { ItemPriceDisplay } from "./ItemPriceDisplay";
import { QuantityStepper } from "./QuantityStepper";

export interface CartItemRowProps {
  item: CartItem;
  cartId?: string | null;
  onUpdateQuantity?: (cartItemId: string, newQuantity: number) => void;
  onIncrement?: (cartItemId: string) => void;
  onDecrement?: (cartItemId: string) => void;
  onRemove?: (cartItemId: string) => void;
  isPending?: boolean;
}

export function CartItemRow({
  item,
  cartId,
  onUpdateQuantity,
  onIncrement,
  onDecrement,
  onRemove,
  isPending,
}: CartItemRowProps) {
  const hook = useUpdateCartQuantity({ cartId });

  const effectiveIsPending =
    isPending !== undefined ? isPending : hook.isItemPending(item.cartItemId);

  const handleIncrement = () => {
    if (onIncrement) {
      onIncrement(item.cartItemId);
    } else if (onUpdateQuantity) {
      onUpdateQuantity(item.cartItemId, item.quantity + 1);
    } else {
      hook.increment(item.cartItemId);
    }
  };

  const handleDecrement = () => {
    if (onDecrement) {
      onDecrement(item.cartItemId);
    } else if (onUpdateQuantity) {
      onUpdateQuantity(item.cartItemId, item.quantity - 1);
    } else {
      hook.decrement(item.cartItemId);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.cartItemId);
    } else if (onUpdateQuantity) {
      onUpdateQuantity(item.cartItemId, 0);
    } else {
      hook.removeItem(item.cartItemId);
    }
  };

  return (
    <div
      data-testid={`cart-item-row-${item.cartItemId}`}
      className="group relative flex items-start justify-between gap-3 p-3.5 rounded-xl border border-neutral-200/70 bg-white hover:border-neutral-300 hover:shadow-xs transition-all duration-200"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-semibold text-neutral-900 tracking-tight truncate">
            {item.menuItemName}
          </h4>

          {item.variantName && (
            <Badge
              variant="secondary"
              className="rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-700 px-2 py-0 border border-neutral-200"
            >
              {item.variantName}
            </Badge>
          )}
        </div>

        {item.addons && item.addons.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              {CART_UI_MESSAGES.ADDONS_LABEL}:
            </span>
            {item.addons.map((addon) => (
              <span
                key={addon.addonId}
                className="inline-flex items-center gap-1 rounded-md bg-[#fdf5f2] border border-[#f5dfd6] px-1.5 py-0.5 text-[11px] text-[#ff6b00] font-medium"
              >
                <span>{addon.addonName}</span>
                <span className="text-[10px] text-neutral-500 font-normal">
                  (+{formatCurrency(addon.price)})
                </span>
              </span>
            ))}
          </div>
        )}

        {item.specialInstructions && (
          <p className="mt-1 text-xs text-neutral-500 italic truncate flex items-center gap-1">
            <span className="font-semibold not-italic text-neutral-600">
              {CART_UI_MESSAGES.SPECIAL_INSTRUCTIONS_LABEL}:
            </span>
            <span>"{item.specialInstructions}"</span>
          </p>
        )}

        <div className="mt-2.5 flex items-center gap-2 text-xs text-neutral-500">
          <span className="font-medium text-neutral-700">{formatCurrency(item.unitPrice)}</span>
          <span className="text-neutral-400">&times;</span>
          <span className="text-neutral-400 text-[11px]">ea</span>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-3 shrink-0 self-stretch">
        <ItemPriceDisplay
          totalPrice={item.totalPrice}
          unitPrice={item.unitPrice}
          quantity={item.quantity}
        />

        <QuantityStepper
          quantity={item.quantity}
          isPending={effectiveIsPending}
          confirmRemove={true}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
}

export default CartItemRow;
