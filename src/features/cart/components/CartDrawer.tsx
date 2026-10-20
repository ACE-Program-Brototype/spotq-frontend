import { AlertCircle, ShoppingBag, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { useCart } from "../hooks/use-cart";
import { useCartStore } from "../store/cart.store";
import { CartEmptyState } from "./CartEmptyState";
import { CartItemList } from "./CartItemList";
import { CartSkeleton } from "./CartSkeleton";
import { CartSummaryCard } from "./CartSummaryCard";
import { ClearCartButton } from "./ClearCartButton";

export function CartDrawer() {
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
  const closeDrawer = useCartStore((state) => state.closeDrawer);

  const { items, itemCount, subtotal, isLoading, isError, refetch, isEmpty } = useCart({
    enabled: isDrawerOpen,
  });

  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div
      data-testid="cart-drawer-container"
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <button
        type="button"
        data-testid="cart-drawer-backdrop"
        onClick={closeDrawer}
        aria-label="Close cart backdrop"
        tabIndex={-1}
        className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-default w-full h-full border-none p-0"
      />

      <div
        data-testid="cart-drawer-panel"
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out animate-in slide-in-from-right"
      >
        <div className="flex items-center justify-between border-b border-neutral-200/80 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#fdf5f2] text-[#ff6b00]">
              <ShoppingBag className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="cart-drawer-title"
                  className="text-base font-bold text-neutral-900 tracking-tight"
                >
                  {CART_UI_MESSAGES.DRAWER_TITLE}
                </h2>
                {itemCount > 0 && (
                  <span className="flex items-center justify-center rounded-full bg-[#ff6b00] px-2 py-0.5 text-[11px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500">{CART_UI_MESSAGES.DRAWER_SUBTITLE}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEmpty && <ClearCartButton />}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={CART_UI_MESSAGES.CLOSE_DRAWER_ARIA}
              onClick={closeDrawer}
              className="rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading && <CartSkeleton />}

          {isError && !isLoading && (
            <div
              data-testid="cart-error-banner"
              className="flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-red-200 bg-red-50/50 space-y-3"
            >
              <AlertCircle className="size-8 text-red-500" />
              <div>
                <h4 className="text-sm font-bold text-red-900">
                  {CART_UI_MESSAGES.ERROR_LOADING_TITLE}
                </h4>
                <p className="text-xs text-red-600 mt-1">
                  {CART_UI_MESSAGES.ERROR_LOADING_DESCRIPTION}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="rounded-full text-xs font-semibold border-red-300 text-red-700 hover:bg-red-100"
              >
                {CART_UI_MESSAGES.RETRY_BUTTON}
              </Button>
            </div>
          )}

          {!isLoading && !isError && isEmpty && <CartEmptyState onBrowseMenu={closeDrawer} />}

          {!isLoading && !isError && !isEmpty && <CartItemList items={items} />}
        </div>

        {!isLoading && !isError && !isEmpty && (
          <div className="border-t border-neutral-200/80 p-5 bg-white">
            <CartSummaryCard
              subtotal={subtotal}
              itemCount={itemCount}
              onCheckout={() => {
                closeDrawer();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
