import { Loader2, Plus, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { MenuItemDetail } from "@/features/menu/types/menu-item.types";
import { formatCurrency } from "@/lib/utils/currency";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { useAddToCart } from "../hooks/use-add-to-cart";
import { useCartStore } from "../store/cart.store";
import { AddToCartModal } from "./AddToCartModal";
import { RestaurantMismatchDialog } from "./RestaurantMismatchDialog";

export interface MenuItemCardProps {
  item: MenuItemDetail;
  restaurantId: string;
  cartId?: string | null;
  className?: string;
  onItemAdded?: () => void;
}

export function MenuItemCard({
  item,
  restaurantId,
  cartId,
  className = "",
  onItemAdded,
}: MenuItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMismatchOpen, setIsMismatchOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const resetCart = useCartStore((state) => state.resetCart);

  const hasVariants = Boolean(item.variants && item.variants.length > 0);
  const hasAddons = Boolean(item.addons && item.addons.length > 0);
  const hasCustomizations = hasVariants || hasAddons;

  const { mutate: quickAddToCart, isPending: isQuickAdding } = useAddToCart({
    onSuccess: () => {
      setIsClearing(false);
      onItemAdded?.();
    },
    onConflict: () => {
      setIsClearing(false);
      setIsMismatchOpen(true);
    },
    onError: () => {
      setIsClearing(false);
    },
  });

  const handleAddClick = () => {
    if (!item.isAvailable) return;

    if (hasCustomizations) {
      setIsModalOpen(true);
    } else {
      quickAddToCart({
        restaurantId,
        menuItemId: item.id,
        quantity: 1,
        targetCartId: cartId,
      });
    }
  };

  const handleConfirmClearAndAdd = () => {
    setIsClearing(true);
    resetCart();
    quickAddToCart({
      restaurantId,
      menuItemId: item.id,
      quantity: 1,
    });
  };

  const imageSrc = item.imageUrl || item.image || item.images?.[0]?.url;

  return (
    <>
      <div
        data-testid={`menu-item-card-${item.id}`}
        className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-neutral-300 hover:shadow-sm transition-all sm:flex-row sm:items-center sm:gap-4 ${className}`}
      >
        <div className="flex-1 space-y-1.5 pr-2">
          <div className="flex items-center gap-2">
            {item.isVegetarian !== undefined && (
              <span
                data-testid="dietary-badge"
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  item.isVegetarian
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                    : "bg-red-50 text-red-700 border border-red-300"
                }`}
              >
                {item.isVegetarian ? "VEG" : "NON-VEG"}
              </span>
            )}
            {item.isFeatured && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                Featured
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold text-neutral-900 leading-snug">{item.name}</h3>

          <p className="text-sm font-bold text-[#e8631b]">{formatCurrency(item.price)}</p>

          {item.description && (
            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {hasCustomizations && item.isAvailable && (
            <p className="text-[11px] font-medium text-neutral-400">Customisable</p>
          )}
        </div>

        <div className="relative mt-3 flex shrink-0 flex-col items-center sm:mt-0 sm:w-28">
          <div className="relative size-24 sm:size-24 rounded-lg overflow-hidden bg-neutral-100 flex items-center justify-center">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={item.name}
                className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <UtensilsCrossed className="size-8 text-neutral-300" />
            )}

            {!item.isAvailable && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-center p-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                  {CART_UI_MESSAGES.ITEM_OUT_OF_STOCK}
                </span>
              </div>
            )}
          </div>

          <div className="relative -mt-3.5 z-10">
            <Button
              type="button"
              size="sm"
              disabled={!item.isAvailable || isQuickAdding}
              onClick={handleAddClick}
              data-testid={`add-item-button-${item.id}`}
              className={`h-8 px-4 rounded-lg font-semibold text-xs shadow-sm transition-all ${
                item.isAvailable
                  ? "bg-white text-[#e8631b] border border-[#e8631b] hover:bg-orange-50 hover:text-[#cf5413]"
                  : "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
              }`}
            >
              {isQuickAdding ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1" />
                  {CART_UI_MESSAGES.ADDING_TO_CART}
                </>
              ) : !item.isAvailable ? (
                CART_UI_MESSAGES.ITEM_OUT_OF_STOCK
              ) : hasCustomizations ? (
                <>
                  {CART_UI_MESSAGES.ADD_BUTTON_LABEL}
                  <Plus className="size-3 ml-0.5" />
                </>
              ) : (
                CART_UI_MESSAGES.ADD_BUTTON_LABEL
              )}
            </Button>
          </div>
        </div>
      </div>

      {hasCustomizations && (
        <AddToCartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={item}
          restaurantId={restaurantId}
          cartId={cartId}
          onSuccess={onItemAdded}
        />
      )}

      {!hasCustomizations && (
        <RestaurantMismatchDialog
          isOpen={isMismatchOpen}
          onClose={() => setIsMismatchOpen(false)}
          onConfirmClearAndAdd={handleConfirmClearAndAdd}
          isClearing={isClearing}
        />
      )}
    </>
  );
}

export default MenuItemCard;
