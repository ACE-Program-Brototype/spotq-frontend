import { ArrowLeft, ArrowRight, Loader2, Trash2 } from "lucide-react";
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
  onProceedToCheckout?: () => void;
  isProceeding?: boolean;
}

export function CartSummary({
  restaurantId,
  totalCount,
  totalAmount,
  onClearCart,
  onContinueShopping,
  onProceedToCheckout,
  isProceeding = false,
}: CartSummaryProps) {
  const continueShoppingLink = restaurantId
    ? CUSTOMER_ROUTES.RESTAURANT_DETAIL(restaurantId)
    : CUSTOMER_ROUTES.HOME;

  return (
    <aside
      data-testid="cart-summary"
      className="space-y-4 sm:space-y-6 rounded-2xl sm:rounded-3xl border border-stone-200 bg-white p-4 sm:p-6 shadow-xs"
    >
      <h2 className="text-base sm:text-lg font-bold text-stone-900">{CART_MESSAGES.ORDER_SUMMARY}</h2>

      <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-stone-600">
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

        <div className="border-t border-stone-200 pt-2.5 sm:pt-3">
          <div className="flex justify-between text-sm sm:text-base font-extrabold text-stone-900">
            <span>{CART_MESSAGES.TOTAL}</span>
            <span data-testid="summary-total-amount" className="text-base sm:text-lg text-[#f26500]">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          disabled={isProceeding || totalCount === 0}
          onClick={onProceedToCheckout}
          className="h-11 sm:h-12 w-full rounded-xl bg-[#ff6b00] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#e05e00] disabled:opacity-50 cursor-pointer"
        >
          {isProceeding ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Processing...</span>
            </span>
          ) : (
            <>
              <span>{CART_MESSAGES.PROCEED_TO_CHECKOUT}</span>
              <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>

        <div className="flex items-center justify-between gap-2 pt-1.5 sm:pt-2">
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
            className="h-8 px-2 text-xs text-stone-400 hover:bg-stone-50 hover:text-red-600 cursor-pointer"
          >
            <Trash2 className="mr-1 size-3.5" />
            {CART_MESSAGES.CLEAR_CART}
          </Button>
        </div>
      </div>
    </aside>
  );
}
