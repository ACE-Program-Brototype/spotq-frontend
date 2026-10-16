import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/customer/customer.routes.constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { CART_UI_MESSAGES } from "../constants/cart.constants";

interface CartEmptyStateProps {
  onBrowseMenu?: () => void;
  className?: string;
}

export function CartEmptyState({ onBrowseMenu, className = "" }: CartEmptyStateProps) {
  return (
    <div
      data-testid="cart-empty-state"
      className={cn("flex flex-col items-center justify-center text-center px-6 py-12", className)}
    >
      <div className="flex size-20 items-center justify-center rounded-3xl bg-neutral-100 text-neutral-400 mb-5 shadow-xs border border-neutral-200/60">
        <ShoppingBag className="size-10 stroke-[1.5]" />
      </div>

      <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
        {CART_UI_MESSAGES.EMPTY_TITLE}
      </h3>

      <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-xs leading-relaxed">
        {CART_UI_MESSAGES.EMPTY_DESCRIPTION}
      </p>

      <div className="mt-6">
        <Link
          to={CUSTOMER_ROUTES.HOME}
          onClick={onBrowseMenu}
          className={cn(
            buttonVariants({ variant: "default", size: "default" }),
            "rounded-full bg-[#ff6b00] hover:bg-[#e05e00] text-white px-6 font-semibold shadow-xs",
          )}
        >
          {CART_UI_MESSAGES.BROWSE_MENU}
        </Link>
      </div>
    </div>
  );
}

export default CartEmptyState;
