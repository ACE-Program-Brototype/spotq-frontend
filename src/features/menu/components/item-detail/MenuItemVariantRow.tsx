/**
 * Menu Item Variant Row Component
 * Renders an individual variant table row with pricing, delta, status badge, and availability toggle.
 */

import { CheckCircle2, Loader2, Tag } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { MenuItemDetailVariant } from "@/features/menu/types/menu-item.types";
import { cn } from "@/lib/utils/cn";

export interface MenuItemVariantRowProps {
  variant: MenuItemDetailVariant;
  basePrice: number;
  onToggleVariant?: (variantId: string) => void;
  isToggling?: boolean;
}

export function MenuItemVariantRow({
  variant,
  basePrice,
  onToggleVariant,
  isToggling = false,
}: MenuItemVariantRowProps) {
  const variantPrice = Number(variant.price) || 0;
  const parsedBasePrice = Number(basePrice) || 0;
  const priceDelta = variantPrice - parsedBasePrice;

  return (
    <tr className="grid grid-cols-2 items-center gap-y-2.5 gap-x-2 p-4 rounded-2xl border border-[#eddcd4] bg-white shadow-2xs hover:border-[#e8631b]/40 md:table-row md:border-0 md:p-0 md:shadow-none md:bg-transparent md:hover:bg-[#fef9f6] transition-all">
      {/* 1. Variant Name & Default Badge (Mobile: Top-Left, Desktop: Col 1) */}
      <td className="order-1 col-span-1 md:order-none py-0 md:py-3.5 px-0 md:px-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-neutral-900 text-sm">{variant.name}</span>
          {variant.isDefault && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3ec] px-2 py-0.5 text-[10px] font-bold text-[#9a3412] border border-[#fae2d3]">
              <CheckCircle2 className="size-2.5 text-[#e8631b]" />
              Default
            </span>
          )}
        </div>
      </td>

      {/* 2. Portion / Description (Mobile: Middle-Left, Desktop: Col 2) */}
      <td className="order-3 col-span-1 md:order-none py-0 md:py-3.5 px-0 md:px-4 text-neutral-600">
        <div className="text-xs text-neutral-600 flex items-center gap-1.5 flex-wrap">
          <span className="md:hidden font-medium text-neutral-400 text-[11px]">Portion:</span>
          <span className="font-medium text-neutral-700 md:font-normal md:text-neutral-600">
            {variant.portion || "Standard Portion"}
          </span>
        </div>
      </td>

      {/* 3. SKU / Code (Mobile: Middle-Right, Desktop: Col 3) */}
      <td className="order-4 col-span-1 md:order-none py-0 md:py-3.5 px-0 md:px-4 font-mono text-neutral-500">
        <div className="flex items-center justify-end md:justify-start gap-1.5">
          <span className="md:hidden font-sans font-medium text-neutral-400 text-[11px]">SKU:</span>
          {variant.sku ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
              <Tag className="size-2.5 text-neutral-400" />
              {variant.sku}
            </span>
          ) : (
            <span>—</span>
          )}
        </div>
      </td>

      {/* 4. Price & Delta (Mobile: Bottom-Left, Desktop: Col 4) */}
      <td
        className={cn(
          onToggleVariant ? "col-span-1" : "col-span-2",
          "order-5 md:order-none py-0 md:py-3.5 px-0 md:px-4 pt-2.5 md:pt-3.5 border-t border-[#f3e6de] md:border-0",
        )}
      >
        <div className="flex items-baseline gap-1.5">
          <span className="md:hidden text-[11px] font-medium text-neutral-400 mr-0.5">Price:</span>
          <span className="font-extrabold text-neutral-900 text-sm">
            ₹{variantPrice.toFixed(2)}
          </span>
          {!variant.isDefault && priceDelta !== 0 && (
            <span
              className={cn(
                "text-[10px] font-bold text-nowrap",
                priceDelta > 0 ? "text-emerald-600" : "text-neutral-400",
              )}
            >
              (
              {priceDelta > 0
                ? `+₹${priceDelta.toFixed(2)}`
                : `-₹${Math.abs(priceDelta).toFixed(2)}`}
              )
            </span>
          )}
        </div>
      </td>

      {/* 5. Status Badge (Mobile: Top-Right, Desktop: Col 5) */}
      <td className="order-2 col-span-1 md:order-none py-0 md:py-3.5 px-0 md:px-4">
        <div className="flex justify-end md:justify-start">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border text-nowrap",
              variant.isAvailable
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-neutral-100 text-neutral-600 border-neutral-200",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                variant.isAvailable ? "bg-emerald-500" : "bg-neutral-400",
              )}
            />
            {variant.isAvailable ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </td>

      {/* 6. Availability Toggle Switch (Mobile: Bottom-Right, Desktop: Col 6) */}
      {onToggleVariant && (
        <td className="order-6 col-span-1 md:order-none py-0 md:py-3.5 px-0 md:px-4 pt-2.5 md:pt-3.5 border-t border-[#f3e6de] md:border-0 text-right whitespace-nowrap">
          <div className="inline-flex items-center justify-end gap-2 w-full">
            <span className="md:hidden text-[11px] font-medium text-neutral-400">Available:</span>
            {isToggling && <Loader2 className="size-3.5 animate-spin text-[#e8631b]" />}
            <Switch
              checked={variant.isAvailable}
              disabled={isToggling}
              onChange={() => onToggleVariant(variant.id)}
              aria-label={`Toggle availability for ${variant.name}`}
            />
          </div>
        </td>
      )}
    </tr>
  );
}

export default MenuItemVariantRow;
