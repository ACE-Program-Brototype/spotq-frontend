import { Loader2, Minus, Plus, UtensilsCrossed, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { MenuItemDetail } from "@/features/menu/types/menu-item.types";
import { formatCurrency } from "@/lib/utils/currency";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { useAddToCart } from "../hooks/use-add-to-cart";
import { useCartStore } from "../store/cart.store";
import { AddonCheckboxGroup } from "./AddonCheckboxGroup";
import { RestaurantMismatchDialog } from "./RestaurantMismatchDialog";
import { SpecialInstructionsInput } from "./SpecialInstructionsInput";
import { VariantSelector } from "./VariantSelector";

export interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItemDetail | null;
  restaurantId: string;
  cartId?: string | null;
  onSuccess?: () => void;
}

export function AddToCartModal({
  isOpen,
  onClose,
  item,
  restaurantId,
  cartId,
  onSuccess,
}: AddToCartModalProps) {
  const resetCart = useCartStore((state) => state.resetCart);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isMismatchOpen, setIsMismatchOpen] = useState<boolean>(false);
  const [isClearingAndAdding, setIsClearingAndAdding] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && item) {
      const defaultVariant =
        item.variants?.find((v) => v.isDefault && v.isAvailable !== false) ||
        item.variants?.find((v) => v.isAvailable !== false) ||
        null;

      setSelectedVariantId(defaultVariant ? defaultVariant.id : null);
      setSelectedAddonIds([]);
      setSpecialInstructions("");
      setQuantity(1);
      setIsMismatchOpen(false);
      setIsClearingAndAdding(false);
    }
  }, [isOpen, item]);

  const { mutate: addToCart, isPending } = useAddToCart({
    onSuccess: () => {
      setIsClearingAndAdding(false);
      onClose();
      onSuccess?.();
    },
    onConflict: () => {
      setIsMismatchOpen(true);
      setIsClearingAndAdding(false);
    },
  });

  const variants = item?.variants ?? [];
  const addons = item?.addons ?? [];

  const selectedVariant = useMemo(() => {
    return variants.find((v) => v.id === selectedVariantId) ?? null;
  }, [variants, selectedVariantId]);

  const basePrice = selectedVariant ? selectedVariant.price : (item?.price ?? 0);

  const addonsTotal = useMemo(() => {
    return selectedAddonIds.reduce((sum, addonId) => {
      const addon = addons.find((a) => (a.addonId || a.id) === addonId);
      const price = addon ? (addon.priceOverride ?? addon.price ?? 0) : 0;
      return sum + price;
    }, 0);
  }, [addons, selectedAddonIds]);

  const unitPrice = basePrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const hasVariants = variants.length > 0;
  const isVariantSelected = !hasVariants || Boolean(selectedVariantId);
  const isSubmitDisabled = !isVariantSelected || isPending || !item?.isAvailable;

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId],
    );
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.min(20, Math.max(1, prev + delta)));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!item || isSubmitDisabled) return;

    addToCart({
      restaurantId,
      menuItemId: item.id,
      variantId: selectedVariantId,
      addonIds: selectedAddonIds,
      quantity,
      specialInstructions: specialInstructions.trim() || null,
      targetCartId: cartId,
    });
  };

  const handleConfirmClearAndAdd = () => {
    if (!item) return;
    setIsClearingAndAdding(true);
    resetCart();
    addToCart({
      restaurantId,
      menuItemId: item.id,
      variantId: selectedVariantId,
      addonIds: selectedAddonIds,
      quantity,
      specialInstructions: specialInstructions.trim() || null,
    });
  };

  if (!isOpen || !item) return null;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-cart-title"
        data-testid="add-to-cart-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      >
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={() => {
            if (!isPending) {
              onClose();
            }
          }}
          aria-hidden="true"
        />

        <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="relative border-b border-neutral-100 p-5 pr-12">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              aria-label={CART_UI_MESSAGES.CLOSE_MODAL_ARIA}
              data-testid="close-modal-button"
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            >
              <X className="size-4.5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[#e8631b]">
                <UtensilsCrossed className="size-4.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 id="add-to-cart-title" className="text-lg font-bold text-neutral-900">
                    {item.name}
                  </h3>
                  {item.isVegetarian !== undefined && (
                    <span
                      data-testid="dietary-indicator"
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        item.isVegetarian
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                          : "bg-red-50 text-red-700 border border-red-300"
                      }`}
                    >
                      {item.isVegetarian ? "VEG" : "NON-VEG"}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-neutral-500 line-clamp-2">{item.description}</p>
                )}
                <p className="text-sm font-semibold text-[#e8631b]">{formatCurrency(basePrice)}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {hasVariants && (
              <VariantSelector
                variants={variants}
                selectedVariantId={selectedVariantId}
                onSelectVariant={setSelectedVariantId}
                disabled={isPending}
              />
            )}

            {addons.length > 0 && (
              <AddonCheckboxGroup
                addons={addons}
                selectedAddonIds={selectedAddonIds}
                onToggleAddon={handleToggleAddon}
                disabled={isPending}
              />
            )}

            <SpecialInstructionsInput
              value={specialInstructions}
              onChange={setSpecialInstructions}
              disabled={isPending}
            />

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <span className="text-sm font-semibold text-neutral-900">
                {CART_UI_MESSAGES.QUANTITY_LABEL}
              </span>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={quantity <= 1 || isPending}
                  onClick={() => handleQuantityChange(-1)}
                  aria-label={CART_UI_MESSAGES.DECREASE_QUANTITY_ARIA}
                  data-testid="decrease-quantity-button"
                  className="size-8 rounded-full border-neutral-200"
                >
                  <Minus className="size-3.5" />
                </Button>
                <span
                  data-testid="quantity-display"
                  className="w-6 text-center text-sm font-bold text-neutral-900"
                >
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={quantity >= 20 || isPending}
                  onClick={() => handleQuantityChange(1)}
                  aria-label={CART_UI_MESSAGES.INCREASE_QUANTITY_ARIA}
                  data-testid="increase-quantity-button"
                  className="size-8 rounded-full border-neutral-200"
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-100 bg-neutral-50/80 p-4 backdrop-blur-xs flex items-center justify-between gap-4">
            <div>
              <span className="block text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                {CART_UI_MESSAGES.GRAND_TOTAL}
              </span>
              <span data-testid="modal-total-price" className="text-lg font-bold text-neutral-900">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <Button
              type="button"
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
              data-testid="add-to-cart-submit-button"
              className="min-w-44 bg-[#e8631b] hover:bg-[#cf5413] text-white font-medium shadow-sm transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                  {CART_UI_MESSAGES.ADDING_TO_CART}
                </>
              ) : !isVariantSelected ? (
                CART_UI_MESSAGES.SELECT_VARIANT_FIRST
              ) : (
                `${CART_UI_MESSAGES.ADD_TO_CART} - ${formatCurrency(totalPrice)}`
              )}
            </Button>
          </div>
        </div>
      </div>

      <RestaurantMismatchDialog
        isOpen={isMismatchOpen}
        onClose={() => setIsMismatchOpen(false)}
        onConfirmClearAndAdd={handleConfirmClearAndAdd}
        isClearing={isClearingAndAdding}
      />
    </>
  );
}

export default AddToCartModal;
