import { ArrowRight, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/currency";
import { CART_UI_MESSAGES } from "../constants/cart.constants";

interface CartSummaryCardProps {
  subtotal: number;
  itemCount: number;
  onCheckout?: () => void;
  disabled?: boolean;
  className?: string;
}

export function CartSummaryCard({
  subtotal,
  itemCount,
  onCheckout,
  disabled = false,
  className = "",
}: CartSummaryCardProps) {
  return (
    <div
      data-testid="cart-summary-card"
      className={`rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4 shadow-2xs space-y-3.5 ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-neutral-200/60 pb-2.5">
        <Receipt className="size-4 text-neutral-500" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
          {CART_UI_MESSAGES.BILL_SUMMARY_HEADING}
        </h4>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-neutral-600">
          <span>
            {CART_UI_MESSAGES.ITEM_TOTAL} ({itemCount}{" "}
            {itemCount === 1
              ? CART_UI_MESSAGES.ITEM_COUNT_SINGLE
              : CART_UI_MESSAGES.ITEM_COUNT_PLURAL}
            )
          </span>
          <span className="font-semibold text-neutral-800">{formatCurrency(subtotal)}</span>
        </div>

        <div className="border-t border-neutral-200/80 pt-2.5 flex justify-between items-center">
          <span className="text-sm font-bold text-neutral-900">{CART_UI_MESSAGES.GRAND_TOTAL}</span>
          <span className="text-base font-extrabold text-[#ff6b00]">
            {formatCurrency(subtotal)}
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="default"
        size="lg"
        disabled={disabled || itemCount === 0}
        onClick={onCheckout}
        className="w-full rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
      >
        <span>{CART_UI_MESSAGES.PROCEED_TO_CHECKOUT}</span>
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}

export default CartSummaryCard;
