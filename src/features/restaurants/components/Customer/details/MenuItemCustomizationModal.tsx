import { Check, ShoppingCart, X } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { usePresignedUrl } from "@/features/restaurants/hooks/usePresignedUrl";
import type {
  CustomerRestaurantAddon,
  CustomerRestaurantMenuItem,
  CustomerRestaurantVariant,
} from "@/features/restaurants/types/customer-restaurant-details.types";

export interface CustomizationResult {
  item: CustomerRestaurantMenuItem;
  selectedVariant: CustomerRestaurantVariant | null;
  selectedAddons: CustomerRestaurantAddon[];
  quantity: number;
  totalPrice: number;
}

export interface MenuItemCustomizationModalProps {
  item: CustomerRestaurantMenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (result: CustomizationResult) => void;
}

export function MenuItemCustomizationModal({
  item,
  isOpen,
  onClose,
  onConfirm,
}: MenuItemCustomizationModalProps) {
  const modalId = useId();

  // Find default variant or fallback to first
  const defaultVariant = useMemo(() => {
    if (!item?.variants || item.variants.length === 0) return null;
    return item.variants.find((v) => v.isDefault) || item.variants[0];
  }, [item]);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    defaultVariant?.id ?? null,
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Reset state when a new item is opened
  useEffect(() => {
    if (item) {
      const def = item.variants?.find((v) => v.isDefault) || item.variants?.[0] || null;
      setSelectedVariantId(def?.id ?? null);
      setSelectedAddonIds([]);
      setQuantity(1);
    }
  }, [item]);

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const firstImageKey = item?.images?.[0]?.objectKey;
  const { data: imageUrl } = usePresignedUrl(firstImageKey);

  if (!isOpen || !item) return null;

  const currentVariant = item.variants?.find((v) => v.id === selectedVariantId) ?? null;
  const currentAddons = item.addons?.filter((a) => selectedAddonIds.includes(a.id)) ?? [];

  const basePrice = currentVariant ? currentVariant.price : item.price;
  const addonsPrice = currentAddons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = (basePrice + addonsPrice) * quantity;

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId],
    );
  };

  const handleConfirm = () => {
    onConfirm({
      item,
      selectedVariant: currentVariant,
      selectedAddons: currentAddons,
      quantity,
      totalPrice,
    });
    onClose();
  };

  const hasVariants = Boolean(item.variants && item.variants.length > 0);
  const hasAddons = Boolean(item.addons && item.addons.length > 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby={modalId}>
      {/* 1. Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-over Sheet / Drawer from Right */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto animate-in slide-in-from-right duration-300">
          {/* Header with Close X */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Item Details
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Dish Hero Image */}
            <div className="w-full aspect-16/10 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-100">
              {imageUrl ? (
                <img src={imageUrl} alt={item.name} className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 text-[#ff6b00] font-bold text-lg p-4 text-center">
                  {item.name}
                </div>
              )}
            </div>

            {/* Title and Description */}
            <div>
              <h2 id={modalId} className="text-xl sm:text-2xl font-bold text-[#ff6b00] mb-1.5">
                {item.name}
              </h2>
              {item.description && (
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
                  {item.description}
                </p>
              )}
            </div>

            <div className="border-t border-neutral-100" />

            {/* Select Size / Variants */}
            {hasVariants && (
              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-3">Select Size</h3>
                <div className="space-y-2.5">
                  {item.variants.map((variant) => {
                    const isSelected = selectedVariantId === variant.id;
                    return (
                      <div
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#ff6b00] bg-orange-50/20 shadow-2xs"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-4.5 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-[#ff6b00]" : "border-neutral-300"
                            }`}
                          >
                            {isSelected && <div className="size-2.5 rounded-full bg-[#ff6b00]" />}
                          </div>
                          <span className="text-sm font-semibold text-neutral-800">
                            {variant.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-neutral-900">
                          ₹{variant.price.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Optional Add-ons */}
            {hasAddons && (
              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-3">Select Add-ons</h3>
                <div className="space-y-2.5">
                  {item.addons.map((addon) => {
                    const isChecked = selectedAddonIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? "border-[#ff6b00] bg-orange-50/20 shadow-2xs"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-4.5 rounded-md border flex items-center justify-center ${
                              isChecked
                                ? "border-[#ff6b00] bg-[#ff6b00] text-white"
                                : "border-neutral-300"
                            }`}
                          >
                            {isChecked && <Check className="size-3 stroke-[3]" />}
                          </div>
                          <span className="text-sm font-medium text-neutral-800">
                            {addon.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-neutral-900">
                          +₹{addon.price.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Add to Cart Action */}
          <div className="p-4 border-t border-neutral-100 bg-white shadow-lg">
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full h-12 bg-[#ff6b00] hover:bg-[#e05e00] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <ShoppingCart className="size-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
