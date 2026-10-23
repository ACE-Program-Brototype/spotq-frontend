import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { useClearCart } from "../hooks/use-clear-cart";
import { ClearCartConfirmDialog } from "./ClearCartConfirmDialog";

export interface ClearCartButtonProps {
  disabled?: boolean;
  className?: string;
  size?: "default" | "sm" | "xs" | "icon-sm";
  onSuccess?: () => void;
}

export function ClearCartButton({
  disabled = false,
  className = "",
  size = "sm",
  onSuccess,
}: ClearCartButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { clearCart, isPending } = useClearCart({
    onSuccess: () => {
      setIsDialogOpen(false);
      onSuccess?.();
    },
  });

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size={size}
        disabled={disabled || isPending}
        onClick={() => setIsDialogOpen(true)}
        aria-label={CART_UI_MESSAGES.CLEAR_CART_ARIA}
        data-testid="clear-cart-button"
        className={cn(
          "text-xs font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50/60 transition-colors gap-1.5",
          className,
        )}
      >
        <Trash2 className="size-3.5" />
        <span>{CART_UI_MESSAGES.CLEAR_CART_BUTTON_LABEL}</span>
      </Button>

      <ClearCartConfirmDialog
        isOpen={isDialogOpen}
        isLoading={isPending}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={clearCart}
      />
    </>
  );
}

export default ClearCartButton;
