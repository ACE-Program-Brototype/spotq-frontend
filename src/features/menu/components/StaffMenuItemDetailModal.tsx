/**
 * Staff Menu Item Detail Modal Component
 * Displays dish details, pricing, and portion sizes for restaurant staff in read-only inspection mode.
 * Operational stock availability toggling is managed directly on the primary menu listing page.
 */

import { Sparkles, Tag, Utensils, X } from "lucide-react";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MenuItemVariantsCard } from "@/features/menu/components/item-detail/MenuItemVariantsCard";
import type { MenuItemDetailVariant } from "@/features/menu/types/menu-item.types";
import type { StaffMenuItem } from "@/features/menu/types/staff-menu-item.types";

export interface StaffMenuItemDetailModalProps {
  isOpen: boolean;
  item: StaffMenuItem | null;
  onClose: () => void;
}

export function StaffMenuItemDetailModal({
  isOpen,
  item,
  onClose,
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
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-1 rounded-lg bg-[#fef3ec] px-2 py-0.5 text-xs font-semibold text-[#9a3412] border border-[#fae2d3] max-w-[150px] sm:max-w-xs truncate"
                  title={item.categoryName || "Unassigned"}
                >
                  <Tag className="size-3 text-[#e8631b] shrink-0" />
                  <span className="truncate">{item.categoryName || "Unassigned"}</span>
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
                    Out of Stock
                  </Badge>
                )}
              </div>

              <h2
                id="staff-item-modal-title"
                className="text-xl sm:text-2xl font-extrabold text-neutral-900 leading-tight truncate"
              >
                {item.name}
              </h2>

              <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
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
            className="rounded-xl p-2 text-neutral-400 hover:text-neutral-700 hover:bg-[#faf7f5] transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Variants Section (Read-only for Staff Details Modal) */}
        {adaptedVariants.length > 0 ? (
          <MenuItemVariantsCard
            variants={adaptedVariants}
            basePrice={item.basePrice}
            hideSku={true}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[#eddcd4] bg-[#faf7f5] p-8 text-center space-y-2">
            <Sparkles className="size-6 text-[#e8631b] mx-auto" />
            <p className="text-xs font-semibold text-neutral-700">Single Portion Dish</p>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
              This dish does not have custom portions configured.
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
            className="rounded-xl border-[#eddcd4] text-xs font-semibold px-4 cursor-pointer hover:bg-neutral-100"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StaffMenuItemDetailModal;
