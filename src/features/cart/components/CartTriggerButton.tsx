import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "../store/cart.store";

interface CartTriggerButtonProps {
  itemCount?: number;
  className?: string;
  onClick?: () => void;
}

export function CartTriggerButton({
  itemCount = 0,
  className = "",
  onClick,
}: CartTriggerButtonProps) {
  const openDrawer = useCartStore((state) => state.openDrawer);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      openDrawer();
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Shopping Cart"
      onClick={handleClick}
      data-testid="cart-trigger-button"
      className={`relative flex size-9 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors ${className}`}
    >
      <ShoppingCart className="size-5" />
      {itemCount > 0 && (
        <span
          data-testid="cart-badge-count"
          className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-[#ff6b00] text-[10px] font-bold text-white shadow-xs"
        >
          {itemCount}
        </span>
      )}
    </Button>
  );
}

export default CartTriggerButton;
