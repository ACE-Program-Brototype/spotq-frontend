import { Loader2, Trash2 } from "lucide-react";
import { CART_UI_MESSAGES } from "../constants/cart.constants";

export interface RemoveItemButtonProps {
  cartItemId: string;
  onRemove: () => void;
  isPending?: boolean;
  disabled?: boolean;
  className?: string;
}

export function RemoveItemButton({
  cartItemId,
  onRemove,
  isPending = false,
  disabled = false,
  className = "",
}: RemoveItemButtonProps) {
  return (
    <button
      type="button"
      data-testid={`remove-item-button-${cartItemId}`}
      aria-label={CART_UI_MESSAGES.REMOVE_ITEM_ARIA}
      title={CART_UI_MESSAGES.REMOVE_ITEM_ARIA}
      disabled={disabled || isPending}
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
      className={`inline-flex items-center justify-center size-7 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 ${className}`}
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin text-red-500" />
      ) : (
        <Trash2 className="size-3.5" />
      )}
    </button>
  );
}

export default RemoveItemButton;
