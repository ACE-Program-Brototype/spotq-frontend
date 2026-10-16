import { CART_UI_MESSAGES } from "../constants/cart.constants";
import type { CartItem } from "../types/cart.types";
import { CartItemRow } from "./CartItemRow";

interface CartItemListProps {
  items: CartItem[];
  className?: string;
}

export function CartItemList({ items, className = "" }: CartItemListProps) {
  return (
    <div className={`space-y-3 ${className}`} data-testid="cart-item-list">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          {CART_UI_MESSAGES.ITEMS_HEADING} ({items.length})
        </h3>
      </div>

      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <CartItemRow key={item.cartItemId} item={item} />
        ))}
      </div>
    </div>
  );
}

export default CartItemList;
