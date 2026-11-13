import { ArrowLeft, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CartEmptyState } from "@/features/cart/components/CartEmptyState";
import { CartItemCard } from "@/features/cart/components/CartItemCard";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { CART_MESSAGES } from "@/features/cart/constants/cart.constants";
import { useBatchAddToCart } from "@/features/cart/hooks/useBatchAddToCart";
import { useCartStore } from "@/features/cart/store/cart.store";

export function CartPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    items,
    restaurantId,
    restaurantName,
    totalCount,
    totalAmount,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  const { batchAddToCart, isPending: isSyncingCart } = useBatchAddToCart({
    onSuccess: () => {
      clearCart();
      navigate(CUSTOMER_ROUTES.CHECKOUT);
    },
  });

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast.error(CART_MESSAGES.LOGIN_REQUIRED_CHECKOUT);
      navigate(CUSTOMER_ROUTES.AUTH.LOGIN);
      return;
    }

    if (!restaurantId || items.length === 0) {
      return;
    }

    batchAddToCart({
      restaurantId,
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        variantId: item.selectedVariant?.id ?? null,
        addonIds: item.selectedAddons.map((addon) => addon.id),
      })),
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast.success(CART_MESSAGES.CART_CLEARED);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.success(CART_MESSAGES.ITEM_REMOVED);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl py-6 sm:py-10">
        <CartEmptyState />
      </div>
    );
  }

  const restaurantLink = restaurantId
    ? CUSTOMER_ROUTES.RESTAURANT_DETAIL(restaurantId)
    : CUSTOMER_ROUTES.HOME;

  return (
    <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6 pb-24 sm:pb-16">
      <div className="flex flex-col gap-2.5 border-b border-stone-200 pb-4 sm:pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to={restaurantLink}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#f26500] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            {CART_MESSAGES.CONTINUE_SHOPPING}
          </Link>
          <div className="mt-1.5 sm:mt-2 flex items-center gap-2">
            <Store className="size-4.5 sm:size-5 text-[#ff6b00] shrink-0" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 truncate">
              {restaurantName}
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-stone-500 truncate">
            {CART_MESSAGES.RESTAURANT_LABEL}:{" "}
            <span className="font-semibold text-stone-700">{restaurantName}</span>
          </p>
        </div>

        <span className="w-fit self-start sm:self-auto rounded-full bg-orange-50 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-[#f26500]">
          {totalCount}{" "}
          {totalCount === 1 ? CART_MESSAGES.ITEM_COUNT_SINGULAR : CART_MESSAGES.ITEM_COUNT_PLURAL}
        </span>
      </div>

      <div className="grid gap-5 sm:gap-6 lg:gap-8 lg:grid-cols-[1fr_360px]">
        <section aria-label="Cart Items" className="space-y-3 sm:space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          ))}
        </section>

        <div className="lg:sticky lg:top-20 h-fit">
          <CartSummary
            restaurantId={restaurantId}
            totalCount={totalCount}
            totalAmount={totalAmount}
            onClearCart={handleClearCart}
            onProceedToCheckout={handleProceedToCheckout}
            isProceeding={isSyncingCart}
          />
        </div>
      </div>
    </div>
  );
}

export default CartPage;
