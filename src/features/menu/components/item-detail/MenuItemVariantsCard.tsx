/**
 * Menu Item Variants Card Component
 * Displays the portion sizes and variants table with SKU, price, default badge, and availability status.
 * Supports operational variant availability toggling for both Admin and Staff.
 */

import { Layers } from "lucide-react";
import type { MenuItemDetailVariant } from "@/features/menu/types/menu-item.types";
import { MenuItemVariantRow } from "./MenuItemVariantRow";

export interface MenuItemVariantsCardProps {
  variants: MenuItemDetailVariant[];
  basePrice: number;
  onToggleVariant?: (variantId: string) => void;
  togglingVariantIds?: Set<string>;
}

export function MenuItemVariantsCard({
  variants,
  basePrice,
  onToggleVariant,
  togglingVariantIds,
}: MenuItemVariantsCardProps) {
  return (
    <div className="rounded-3xl border border-[#eddcd4] bg-white p-4 sm:p-6 md:p-8 shadow-xs space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-[#f3e6de]">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#fef3ec] text-[#e8631b] border border-[#fae2d3]">
            <Layers className="size-4.5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
              Portion Sizes & Pricing
            </h3>
            <p className="text-xs text-neutral-500">
              Configured portion sizes, pricing variants, and stock availability toggles for this
              dish.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-[#faf7f5] px-3 py-1 text-xs font-bold text-neutral-600 border border-[#eddcd4]">
          {variants.length} {variants.length === 1 ? "Variant" : "Variants"}
        </span>
      </div>

      {variants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#eddcd4] p-8 text-center bg-[#faf7f5]">
          <p className="text-xs text-neutral-500 font-medium">No portion variants configured.</p>
        </div>
      ) : (
        <div className="overflow-x-auto md:rounded-2xl md:border md:border-[#eddcd4]">
          <table className="w-full text-left text-xs border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-[#faf7f5] border-b border-[#eddcd4] text-neutral-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Variant Name</th>
                <th className="py-3.5 px-4">Portion / Description</th>
                <th className="py-3.5 px-4">SKU / Code</th>
                <th className="py-3.5 px-4">Price (INR)</th>
                <th className="py-3.5 px-4">Status</th>
                {onToggleVariant && (
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Availability</th>
                )}
              </tr>
            </thead>
            <tbody className="grid grid-cols-1 sm:grid-cols-2 md:table-row-group gap-3 md:gap-0 md:divide-y md:divide-[#f3e6de]">
              {variants.map((variant) => (
                <MenuItemVariantRow
                  key={variant.id}
                  variant={variant}
                  basePrice={basePrice}
                  onToggleVariant={onToggleVariant}
                  isToggling={togglingVariantIds?.has(variant.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MenuItemVariantsCard;
