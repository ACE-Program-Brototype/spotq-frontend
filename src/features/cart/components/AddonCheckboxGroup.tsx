import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MenuItemDetailAddon } from "@/features/menu/types/menu-item.types";
import { formatCurrency } from "@/lib/utils/currency";
import { CART_UI_MESSAGES } from "../constants/cart.constants";

export interface AddonCheckboxGroupProps {
  addons: MenuItemDetailAddon[];
  selectedAddonIds: string[];
  onToggleAddon: (addonId: string) => void;
  disabled?: boolean;
}

export function AddonCheckboxGroup({
  addons,
  selectedAddonIds,
  onToggleAddon,
  disabled = false,
}: AddonCheckboxGroupProps) {
  if (!addons || addons.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3" data-testid="addon-checkbox-group">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-neutral-900">
          {CART_UI_MESSAGES.ADDONS_HEADING}
        </h4>
        <Badge
          variant="secondary"
          className="bg-neutral-100 text-[11px] font-medium text-neutral-600"
        >
          {CART_UI_MESSAGES.ADDONS_OPTIONAL_BADGE}
        </Badge>
      </div>
      <p className="text-xs text-neutral-500">{CART_UI_MESSAGES.ADDONS_OPTIONAL_HELPER}</p>

      <div className="space-y-2">
        {addons.map((addon) => {
          const addonId = addon.addonId || addon.id;
          const isSelected = selectedAddonIds.includes(addonId);
          const isAvailable = addon.isAvailable !== false;
          const isOptionDisabled = disabled || !isAvailable;
          const price = addon.priceOverride ?? addon.price ?? 0;

          return (
            <label
              key={addonId}
              data-testid={`addon-option-${addonId}`}
              className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? "border-[#e8631b] bg-orange-50/40 shadow-xs"
                  : "border-neutral-200 hover:border-neutral-300 bg-white"
              } ${isOptionDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  value={addonId}
                  checked={isSelected}
                  disabled={isOptionDisabled}
                  onChange={() => {
                    if (!isOptionDisabled) {
                      onToggleAddon(addonId);
                    }
                  }}
                  className="sr-only"
                />
                <span
                  className={`size-4.5 rounded-md border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-[#e8631b] bg-[#e8631b] text-white"
                      : "border-neutral-300 bg-white"
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && <Check className="size-3 stroke-[3]" />}
                </span>
                <div>
                  <span className="text-sm font-medium text-neutral-900">{addon.name}</span>
                  {addon.description && (
                    <span className="block text-xs text-neutral-500">{addon.description}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isAvailable && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-neutral-100 text-neutral-500"
                  >
                    {CART_UI_MESSAGES.ITEM_OUT_OF_STOCK}
                  </Badge>
                )}
                <span className="text-sm font-semibold text-neutral-900">
                  {price > 0 ? `+${formatCurrency(price)}` : CART_UI_MESSAGES.FREE_CHARGES}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default AddonCheckboxGroup;
