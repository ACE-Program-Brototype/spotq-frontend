import { ArrowLeft, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { CartEmptyState } from "../components/CartEmptyState";
import { CartItemCard } from "../components/CartItemCard";
import { CartSummary } from "../components/CartSummary";
import { CART_MESSAGES } from "../constants/cart.constants";
import { useCartStore } from "../store/cart.store";

export function CartPage() {
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
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <div className="flex flex-col gap-2 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to={restaurantLink}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#f26500] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            {CART_MESSAGES.CONTINUE_SHOPPING}
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <Store className="size-5 text-[#ff6b00]" />
            <h1 className="text-2xl font-black tracking-tight text-stone-900">{restaurantName}</h1>
          </div>
          <p className="text-xs text-stone-500">
            {CART_MESSAGES.RESTAURANT_LABEL}:{" "}
            <span className="font-semibold text-stone-700">{restaurantName}</span>
          </p>
        </div>

        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#f26500]">
          {totalCount}{" "}
          {totalCount === 1 ? CART_MESSAGES.ITEM_COUNT_SINGULAR : CART_MESSAGES.ITEM_COUNT_PLURAL}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section aria-label="Cart Items" className="space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          ))}
        </section>

        <div>
          <CartSummary
            restaurantId={restaurantId}
            totalCount={totalCount}
            totalAmount={totalAmount}
            onClearCart={handleClearCart}
          />
        </div>
      </div>
    </div>
  );
}

export default CartPage;
