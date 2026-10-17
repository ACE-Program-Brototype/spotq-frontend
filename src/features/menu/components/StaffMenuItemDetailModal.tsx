/**
 * Staff Menu Item Detail Modal Component
 * Displays dish details and an interactive portion sizes/variants availability table for staff.
 * Allows instant 86'ing and restoring of individual variants without extra page navigation or backend changes.
 */

import { Loader2, Power, PowerOff, Sparkles, Tag, Utensils, X } from "lucide-react";
import { useCallback, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MenuItemVariantsCard } from "@/features/menu/components/item-detail/MenuItemVariantsCard";
import type { MenuItemDetailVariant } from "@/features/menu/types/menu-item.types";
import type { StaffMenuItem } from "@/features/menu/types/staff-menu-item.types";
import { cn } from "@/lib/utils/cn";

export interface StaffMenuItemDetailModalProps {
  isOpen: boolean;
  item: StaffMenuItem | null;
  onClose: () => void;
  onToggleVariant: (itemId: string, variantId: string) => void;
  pendingVariantIds?: Set<string>;
  onToggleItemAvailability?: (item: StaffMenuItem) => void;
  isItemToggling?: boolean;
}

export function StaffMenuItemDetailModal({
  isOpen,
  item,
  onClose,
  onToggleVariant,
  pendingVariantIds,
  onToggleItemAvailability,
  isItemToggling = false,
}: StaffMenuItemDetailModalProps) {
  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleToggleVariantInternal = useCallback(
    (variantId: string) => {
      if (!item) return;
      onToggleVariant(item.id, variantId);
    },
    [item, onToggleVariant],
  );

  if (!isOpen || !item) return null;

  // MenuItemVariantsCard uses this shape MenuItemDetailVariant
  const adaptedVariants: MenuItemDetailVariant[] = (item.variants || []).map((v) => ({
    id: v.id,
    name: v.name,
    sku: v.sku,
    price: v.price,
    isDefault: v.isDefault,
    isAvailable: v.isAvailable,
  }));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="staff-item-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop overlay */}
      <button
        type="button"
        aria-label="Close modal backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity animate-in fade-in cursor-default"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-[#eddcd4] shadow-2xl z-10 space-y-6 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4 border-b border-[#f3e6de] pb-5">
          <div className="flex items-start gap-3.5">
            <div className="size-14 shrink-0 rounded-2xl bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center text-[#9a3412]">
              <Utensils className="size-6" />
            </div>

            {/* Item Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-lg bg-[#fef3ec] px-2 py-0.5 text-xs font-semibold text-[#9a3412] border border-[#fae2d3]">
                  <Tag className="size-3 text-[#e8631b]" />
                  {item.categoryName || "Unassigned"}
                </span>

                {item.isAvailable ? (
                  <Badge
                    variant="outline"
                    className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border-emerald-200"
                  >
                    In Stock
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border-rose-200"
                  >
                    86'd / Out of Stock
                  </Badge>
                )}
              </div>

              <h2
                id="staff-item-modal-title"
                className="text-xl sm:text-2xl font-extrabold text-neutral-900 leading-tight"
              >
                {item.name}
              </h2>

              <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                {item.sku && <span>SKU: {item.sku}</span>}
                {item.sku && <span>•</span>}
                <span>
                  Base: ₹
                  {typeof item.basePrice === "number" ? item.basePrice.toFixed(2) : item.basePrice}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 hover:text-neutral-700 hover:bg-[#faf7f5] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Global Dish Stock Toggle */}
        {onToggleItemAvailability && (
          <div className="flex items-center justify-between rounded-2xl bg-[#faf7f5] p-4 border border-[#eddcd4]">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-neutral-800">Overall Dish Availability</p>
              <p className="text-[11px] text-neutral-500">
                86'ing the main dish will mark it unavailable regardless of variant stock.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isItemToggling || item.isActive === false}
              onClick={() => onToggleItemAvailability(item)}
              className={cn(
                "h-8 px-3 rounded-xl text-xs font-semibold border gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95",
                item.isAvailable
                  ? "border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100"
                  : "border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100",
                (isItemToggling || item.isActive === false) && "opacity-60 cursor-not-allowed",
              )}
            >
              {isItemToggling ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : item.isAvailable ? (
                <PowerOff className="size-3.5 text-rose-600" />
              ) : (
                <Power className="size-3.5 text-emerald-600" />
              )}
              <span>{item.isAvailable ? "86 Entire Dish" : "Restore Dish"}</span>
            </Button>
          </div>
        )}

        {/* Variants Section */}
        {adaptedVariants.length > 0 ? (
          <MenuItemVariantsCard
            variants={adaptedVariants}
            basePrice={item.basePrice}
            onToggleVariant={handleToggleVariantInternal}
            togglingVariantIds={pendingVariantIds}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[#eddcd4] bg-[#faf7f5] p-8 text-center space-y-2">
            <Sparkles className="size-6 text-[#e8631b] mx-auto" />
            <p className="text-xs font-semibold text-neutral-700">Single Portion Dish</p>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
              This dish does not have custom portions configured. Use the button above to toggle
              dish availability.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-[#f3e6de]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl border-[#eddcd4] text-xs font-semibold px-4 cursor-pointer"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StaffMenuItemDetailModal;
