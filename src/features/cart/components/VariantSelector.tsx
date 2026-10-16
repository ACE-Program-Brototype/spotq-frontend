import { Badge } from "@/components/ui/badge";
import type { MenuItemDetailVariant } from "@/features/menu/types/menu-item.types";
import { formatCurrency } from "@/lib/utils/currency";
import { CART_UI_MESSAGES } from "../constants/cart.constants";

export interface VariantSelectorProps {
  variants: MenuItemDetailVariant[];
  selectedVariantId: string | null;
  onSelectVariant: (variantId: string) => void;
  disabled?: boolean;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelectVariant,
  disabled = false,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3" data-testid="variant-selector">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-neutral-900">
          {CART_UI_MESSAGES.VARIANTS_HEADING}
        </h4>
        <Badge
          variant="outline"
          className="border-orange-200 bg-orange-50 text-[11px] font-medium text-[#e8631b]"
        >
          {CART_UI_MESSAGES.VARIANTS_REQUIRED_BADGE}
        </Badge>
      </div>
      <p className="text-xs text-neutral-500">{CART_UI_MESSAGES.VARIANTS_REQUIRED_HELPER}</p>

      <div role="radiogroup" aria-label={CART_UI_MESSAGES.VARIANTS_HEADING} className="space-y-2">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const isVariantAvailable = variant.isAvailable !== false;
          const isOptionDisabled = disabled || !isVariantAvailable;

          return (
            <label
              key={variant.id}
              data-testid={`variant-option-${variant.id}`}
              className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? "border-[#e8631b] bg-orange-50/50 shadow-xs"
                  : "border-neutral-200 hover:border-neutral-300 bg-white"
              } ${isOptionDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="menu-item-variant"
                  value={variant.id}
                  checked={isSelected}
                  disabled={isOptionDisabled}
                  onChange={() => {
                    if (!isOptionDisabled) {
                      onSelectVariant(variant.id);
                    }
                  }}
                  className="sr-only"
                />
                <span
                  className={`size-4.5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? "border-[#e8631b] bg-[#e8631b]" : "border-neutral-300 bg-white"
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && <span className="size-2 rounded-full bg-white" />}
                </span>
                <div>
                  <span className="text-sm font-medium text-neutral-900">{variant.name}</span>
                  {variant.portion && (
                    <span className="block text-xs text-neutral-500">{variant.portion}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isVariantAvailable && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-neutral-100 text-neutral-500"
                  >
                    {CART_UI_MESSAGES.ITEM_OUT_OF_STOCK}
                  </Badge>
                )}
                <span className="text-sm font-semibold text-neutral-900">
                  {formatCurrency(variant.price)}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default VariantSelector;
