import { AlertCircle, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/customer/customer.routes.constants";
import { Button, buttonVariants } from "@/components/ui/button";
import type { MenuItemDetail } from "@/features/menu/types/menu-item.types";
import { cn } from "@/lib/utils/cn";
import { CartEmptyState } from "../components/CartEmptyState";
import { CartItemList } from "../components/CartItemList";
import { CartSkeleton } from "../components/CartSkeleton";
import { CartSummaryCard } from "../components/CartSummaryCard";
import { MenuItemCard } from "../components/MenuItemCard";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { useCart } from "../hooks/use-cart";

const POPULAR_MENU_ITEMS: MenuItemDetail[] = [
  {
    id: "56271820-f0b8-4c5c-8b9d-61a3da550a80",
    restaurantId: "e2f4104e-97af-4ed2-88ad-92beef8f159d",
    categoryId: "cat-1",
    name: "Chicken briyano",
    description: "Fragrant spiced basmati rice slow-cooked with tender chicken and aromatic herbs.",
    isVegetarian: false,
    price: 180,
    isAvailable: true,
    variants: [
      {
        id: "535a7210-96bb-4358-9f20-96605177c91f",
        name: "Regular (1 Person)",
        portion: "Serves 1",
        price: 180,
        isDefault: true,
        isAvailable: true,
      },
      {
        id: "var-biryani-family",
        name: "Family Pack",
        portion: "Serves 3-4",
        price: 490,
        isDefault: false,
        isAvailable: true,
      },
    ],
    addons: [
      {
        id: "addon-rel-1",
        addonId: "5ca738ce-0791-46f4-a6c5-55e0b29dca25",
        name: "Extra Raitha",
        description: "Cooling spiced curd with cucumber and onions",
        price: 8,
        isAvailable: true,
      },
      {
        id: "addon-rel-2",
        addonId: "ce561fb8-b37f-4dbd-be85-8b80d7acef11",
        name: "Crispy Papadam",
        description: "Traditional roasted crunchy lentil wafer",
        price: 2,
        isAvailable: true,
      },
    ],
  },
  {
    id: "2978ae89-a612-4d2e-bf6d-5bc2ca2cfea8",
    restaurantId: "e2f4104e-97af-4ed2-88ad-92beef8f159d",
    categoryId: "cat-1",
    name: "Classic Garlic Naan",
    description: "Tandoor baked artisan flatbread brushed with garlic butter and fresh coriander.",
    isVegetarian: true,
    price: 60,
    isAvailable: true,
    variants: [],
    addons: [],
  },
];

export function CartPage() {
  const { cart, items, itemCount, subtotal, isLoading, isError, refetch, isEmpty } = useCart();

  return (
    <div data-testid="customer-cart-page" className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between border-b border-neutral-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#fdf5f2] text-[#ff6b00]">
            <ShoppingBag className="size-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                {CART_UI_MESSAGES.DRAWER_TITLE}
              </h1>
              {itemCount > 0 && (
                <span className="flex items-center justify-center rounded-full bg-[#ff6b00] px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                  {itemCount}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{CART_UI_MESSAGES.DRAWER_SUBTITLE}</p>
          </div>
        </div>

        {!isEmpty && (
          <Link
            to={CUSTOMER_ROUTES.HOME}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-xs font-semibold text-neutral-600 hover:text-neutral-900",
            )}
          >
            {CART_UI_MESSAGES.BROWSE_MENU}
          </Link>
        )}
      </div>

      {isLoading && <CartSkeleton />}

      {isError && !isLoading && (
        <div
          data-testid="cart-error-banner"
          className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-red-200 bg-red-50/50 space-y-3"
        >
          <AlertCircle className="size-9 text-red-500" />
          <div>
            <h3 className="text-base font-bold text-red-900">
              {CART_UI_MESSAGES.ERROR_LOADING_TITLE}
            </h3>
            <p className="text-xs sm:text-sm text-red-600 mt-1 max-w-md">
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

      {!isLoading && !isError && isEmpty && <CartEmptyState />}

      {!isLoading && !isError && !isEmpty && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7">
            <CartItemList items={items} />
          </div>

          <div className="lg:col-span-5 sticky top-20">
            <CartSummaryCard subtotal={subtotal} itemCount={itemCount} onCheckout={() => {}} />
          </div>
        </div>
      )}

      {/* Add More to Your Order Section */}
      <div className="mt-10 pt-8 border-t border-neutral-200/80">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
            Add More to Your Order
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Popular dishes with customizations and 1-click quick add
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {POPULAR_MENU_ITEMS.map((dish) => (
            <MenuItemCard
              key={dish.id}
              item={dish}
              restaurantId={dish.restaurantId}
              cartId={cart?.cartId}
              onItemAdded={() => refetch()}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CartPage;
