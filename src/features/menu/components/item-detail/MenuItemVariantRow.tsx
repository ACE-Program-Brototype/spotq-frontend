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
    <tr className="hover:bg-[#fef9f6] transition-colors">
      {/* Variant Name & Default Badge */}
      <td className="py-3.5 px-4">
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

      {/* Portion */}
      <td className="py-3.5 px-4 text-neutral-600">{variant.portion || "Standard Portion"}</td>

      {/* SKU */}
      <td className="py-3.5 px-4 font-mono text-neutral-500">
        {variant.sku ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
            <Tag className="size-2.5 text-neutral-400" />
            {variant.sku}
          </span>
        ) : (
          "—"
        )}
      </td>

      {/* Price & Delta */}
      <td className="py-3.5 px-4">
        <div className="flex items-baseline gap-1.5">
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

      {/* Availability Status Badge */}
      <td className="py-3.5 px-4">
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
              "size-1.5 rounded-full ",
              variant.isAvailable ? "bg-emerald-500" : "bg-neutral-400",
            )}
          />
          {variant.isAvailable ? "In Stock" : "Out of Stock"}
        </span>
      </td>

      {/* Availability Toggle Switch */}
      {onToggleVariant && (
        <td className="py-3.5 px-4 text-right whitespace-nowrap">
          <div className="inline-flex items-center justify-end gap-2">
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
