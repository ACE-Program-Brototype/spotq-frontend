import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { CART_MESSAGES } from "@/features/cart/constants/cart.constants";
import { formatCurrency } from "@/lib/utils";

interface CartSummaryProps {
  restaurantId: string | null;
  totalCount: number;
  totalAmount: number;
  onClearCart: () => void;
  onContinueShopping?: () => void;
}

export function CartSummary({
  restaurantId,
  totalCount,
  totalAmount,
  onClearCart,
  onContinueShopping,
}: CartSummaryProps) {
  const continueShoppingLink = restaurantId
    ? CUSTOMER_ROUTES.RESTAURANT_DETAIL(restaurantId)
    : CUSTOMER_ROUTES.HOME;

  return (
    <aside
      data-testid="cart-summary"
      className="space-y-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-xs"
    >
      <h2 className="text-lg font-bold text-stone-900">{CART_MESSAGES.ORDER_SUMMARY}</h2>

      <div className="space-y-3 text-sm text-stone-600">
        <div className="flex justify-between">
          <span>{CART_MESSAGES.ITEMS}</span>
          <span data-testid="summary-total-count" className="font-semibold text-stone-900">
            {totalCount}{" "}
            {totalCount === 1 ? CART_MESSAGES.ITEM_COUNT_SINGULAR : CART_MESSAGES.ITEM_COUNT_PLURAL}
          </span>
        </div>

        <div className="flex justify-between">
          <span>{CART_MESSAGES.SUBTOTAL}</span>
          <span data-testid="summary-subtotal" className="font-semibold text-stone-900">
            {formatCurrency(totalAmount)}
          </span>
        </div>

        <div className="border-t border-stone-200 pt-3">
          <div className="flex justify-between text-base font-extrabold text-stone-900">
            <span>{CART_MESSAGES.TOTAL}</span>
            <span data-testid="summary-total-amount" className="text-lg text-[#f26500]">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          className="w-full rounded-xl bg-[#ff6b00] py-3 text-sm font-bold text-white shadow-xs hover:bg-[#e05e00]"
        >
          <span>{CART_MESSAGES.PROCEED_TO_CHECKOUT}</span>
          <ArrowRight className="ml-2 size-4" />
        </Button>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-between">
          <Link
            to={continueShoppingLink}
            onClick={onContinueShopping}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#f26500] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            {CART_MESSAGES.CONTINUE_SHOPPING}
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            className="text-xs text-stone-400 hover:bg-stone-50 hover:text-red-600"
          >
            <Trash2 className="mr-1 size-3.5" />
            {CART_MESSAGES.CLEAR_CART}
          </Button>
        </div>
      </div>
    </aside>
  );
}
