import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { CART_MESSAGES } from "../constants/cart.constants";

interface CartEmptyStateProps {
  onContinueShopping?: () => void;
}

export function CartEmptyState({ onContinueShopping }: CartEmptyStateProps) {
  return (
    <div
      data-testid="cart-empty-state"
      className="flex flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-xs"
    >
      <div className="flex size-20 items-center justify-center rounded-full bg-orange-50 text-[#ff6b00]">
        <ShoppingBag className="size-10 stroke-[1.75]" />
      </div>
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-stone-900">
        {CART_MESSAGES.EMPTY_TITLE}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-stone-500">{CART_MESSAGES.EMPTY_DESCRIPTION}</p>
      <div className="mt-8">
        <Link to={CUSTOMER_ROUTES.HOME}>
          <Button
            onClick={onContinueShopping}
            className="rounded-xl bg-[#ff6b00] px-6 py-2.5 font-semibold text-white shadow-xs hover:bg-[#e05e00]"
          >
            {CART_MESSAGES.EXPLORE_RESTAURANTS}
          </Button>
        </Link>
      </div>
    </div>
  );
}
