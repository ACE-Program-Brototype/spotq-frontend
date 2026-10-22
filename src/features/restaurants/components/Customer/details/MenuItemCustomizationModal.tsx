import { Check, Minus, Plus, ShoppingCart, X } from "lucide-react";
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
    return (
      item.variants.find((v) => v.isDefault && v.isAvailable) ??
      item.variants.find((v) => v.isAvailable) ??
      null
    );
  }, [item]);


  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    defaultVariant?.id ?? null,
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Reset state when a new item is opened
  useEffect(() => {
    if (item) {
      const def = item.variants?.find((v) => v.isDefault && v.isAvailable) ??
      item.variants?.find((v)=> v.isAvailable)?? null;
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
  
  const isDirect = Boolean(firstImageKey?.startsWith("http"));
  const { data: presignedImageUrl } = usePresignedUrl(!isDirect ? firstImageKey : null);
  const imageUrl = isDirect ? firstImageKey : presignedImageUrl;

  if (!isOpen || !item) return null;

  const currentVariant = item.variants?.find((v) => v.id === selectedVariantId) ?? null;
  const currentAddons = item.addons?.filter((a) => selectedAddonIds.includes(a.id)) ?? [];

  const basePrice = currentVariant ? currentVariant.price : item.price;
  const addonsPrice = currentAddons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = (basePrice + addonsPrice) * quantity;

  const toggleAddon = (addon: CustomerRestaurantAddon) => {
    if(!addon.isAvailable) return;
    setSelectedAddonIds((prev) =>
      prev.includes(addon.id) ? prev.filter((id) => id !== addon.id) : [...prev, addon.id],
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
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalId}
    >
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
              Item Customization
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
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
                <div className="space-y-2.5" role="radiogroup" aria-label="Select Size">
                  {item.variants.map((variant) => {
                    const isSelected = selectedVariantId === variant.id;
                    const isAvailable = variant.isAvailable;

                    return (
                      <div
                        key={variant.id}
                        role="radio"
                        aria-checked={isSelected}
                        aria-disabled={!isAvailable}
                        tabIndex={isAvailable ? 0 : -1}
                        onClick={() => {
                          if (!isAvailable) return;
                          setSelectedVariantId(variant.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            if (!isAvailable) return;
                            setSelectedVariantId(variant.id);
                          }
                        }}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                          !isAvailable
                            ? "opacity-50 bg-neutral-50/70 border-neutral-200 cursor-not-allowed select-none"
                            : isSelected
                              ? "border-[#ff6b00] bg-orange-50/20 shadow-2xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff6b00]"
                              : "border-neutral-200 hover:border-neutral-300 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff6b00]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-4.5 rounded-full border flex items-center justify-center ${
                              !isAvailable
                                ? "border-neutral-300 bg-neutral-100"
                                : isSelected
                                  ? "border-[#ff6b00]"
                                  : "border-neutral-300"
                            }`}
                          >
                            {isSelected && isAvailable && (
                              <div className="size-2.5 rounded-full bg-[#ff6b00]" />
                            )}
                          </div>
                          <span
                            className={`text-sm font-semibold ${
                              !isAvailable ? "text-neutral-400 line-through" : "text-neutral-800"
                            }`}
                          >
                            {variant.name}
                          </span>
                          {!isAvailable && (
                            <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 uppercase tracking-wider">
                              Sold Out
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            !isAvailable ? "text-neutral-400" : "text-neutral-900"
                          }`}
                        >
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
                    const isAvailable = addon.isAvailable;

                    return (
                      <div
                        key={addon.id}
                        role="checkbox"
                        aria-checked={isChecked}
                        aria-disabled={!isAvailable}
                        tabIndex={isAvailable ? 0 : -1}
                        onClick={() => {
                          if (!isAvailable) return;
                          toggleAddon(addon);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            if (!isAvailable) return;
                            toggleAddon(addon);
                          }
                        }}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                          !isAvailable
                            ? "opacity-50 bg-neutral-50/70 border-neutral-200 cursor-not-allowed select-none"
                            : isChecked
                              ? "border-[#ff6b00] bg-orange-50/20 shadow-2xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff6b00]"
                              : "border-neutral-200 hover:border-neutral-300 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff6b00]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-4.5 rounded-md border flex items-center justify-center ${
                              !isAvailable
                                ? "border-neutral-300 bg-neutral-100"
                                : isChecked
                                  ? "border-[#ff6b00] bg-[#ff6b00] text-white"
                                  : "border-neutral-300"
                            }`}
                          >
                            {isChecked && isAvailable && <Check className="size-3 stroke-[3]" />}
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              !isAvailable ? "text-neutral-400 line-through" : "text-neutral-800"
                            }`}
                          >
                            {addon.name}
                          </span>
                          {!isAvailable && (
                            <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 uppercase tracking-wider">
                              Sold Out
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            !isAvailable ? "text-neutral-400" : "text-neutral-900"
                          }`}
                        >
                          +₹{addon.price.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Add to Cart & Stepper Action */}
          <div className="p-4 border-t border-neutral-100 bg-white shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">Quantity</span>
              <div className="flex items-center gap-2 border border-neutral-200 rounded-xl p-1 bg-neutral-50">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="size-7 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-white hover:shadow-xs disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="text-xs font-bold w-6 text-center text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  disabled={quantity >= 20}
                  className="size-7 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-white hover:shadow-xs disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={hasVariants && (!currentVariant || !currentVariant.isAvailable)}
              className="w-full h-12 bg-[#ff6b00] hover:bg-[#e05e00] text-white rounded-xl font-bold text-sm flex items-center justify-between px-5 shadow-sm transition-all active:scale-[0.99] cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="size-4" />
                <span>Add to Cart</span>
              </div>
              <span className="font-extrabold text-base tracking-tight">
                ₹{totalPrice.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
