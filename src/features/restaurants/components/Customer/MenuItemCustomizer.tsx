import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { CustomerRestaurantMenuItem } from "@/features/restaurants/types/customer-restaurant.types";
import { usePresignedUrl } from "@/hooks/usePresignedUrl";
import { formatCurrency } from "@/lib/utils";

function AddonOption({
  addon,
  itemId,
  selected,
  onToggle,
}: {
  addon: NonNullable<CustomerRestaurantMenuItem["addons"]>[number];
  itemId: string;
  selected: boolean;
  onToggle: (checked: boolean) => void;
}) {
  const { data: imageUrl } = usePresignedUrl(addon.imageKey);
  const checkboxId = `addon-${itemId}-${addon.id}`;

  return (
    <div className="flex items-start justify-between gap-3 text-sm text-stone-700 min-w-0">
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <Checkbox
          id={checkboxId}
          checked={selected}
          onCheckedChange={(checked) => onToggle(checked === true)}
          className="mt-0.5 shrink-0"
        />
        <label htmlFor={checkboxId} className="flex min-w-0 flex-1 cursor-pointer items-start gap-2">
          {addon.imageKey && (
            <span className="size-10 shrink-0 overflow-hidden rounded-md bg-stone-100">
              {imageUrl && <img src={imageUrl} alt="" className="size-full object-cover" />}
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium text-stone-900" title={addon.name}>
              {addon.name}
            </span>
            {addon.description && (
              <span className="block text-xs text-stone-400 line-clamp-1 break-words [overflow-wrap:anywhere]" title={addon.description}>
                {addon.description}
              </span>
            )}
          </span>
        </label>
      </div>
      <span className="shrink-0 font-semibold whitespace-nowrap">
        {addon.price > 0 ? `+${formatCurrency(addon.price)}` : "Free"}
      </span>
    </div>
  );
}

interface MenuItemCustomizerProps {
  itemId: string;
  availableVariants: NonNullable<CustomerRestaurantMenuItem["variants"]>;
  availableAddons: NonNullable<CustomerRestaurantMenuItem["addons"]>;
  selectedVariantId: string;
  onSelectVariant: (variantId: string) => void;
  selectedAddonIds: string[];
  onToggleAddon: (addonId: string, checked: boolean) => void;
}

export function MenuItemCustomizer({
  itemId,
  availableVariants,
  availableAddons,
  selectedVariantId,
  onSelectVariant,
  selectedAddonIds,
  onToggleAddon,
}: MenuItemCustomizerProps) {
  if (availableVariants.length === 0 && availableAddons.length === 0) {
    return null;
  }

  return (
    <details className="group/options border-t border-stone-100 px-3.5 py-2.5 sm:px-5 sm:py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold text-stone-600 [&::-webkit-details-marker]:hidden">
        <span>
          {availableVariants.length > 0 && availableAddons.length > 0
            ? "Customize this item"
            : availableVariants.length > 0
              ? "Choose a size"
              : "Add extras"}
        </span>
        <ChevronDown className="size-4 transition-transform group-open/options:rotate-180" />
      </summary>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {availableVariants.length > 0 && (
          <fieldset className="space-y-2 min-w-0">
            <legend className="mb-2 text-[11px] font-bold uppercase tracking-wide text-stone-400">
              Variant
            </legend>
            {availableVariants.map((variant) => (
              <label
                key={variant.id}
                htmlFor={`variant-${itemId}-${variant.id}`}
                className="flex cursor-pointer items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm text-stone-700 min-w-0"
              >
                <span className="flex items-center gap-2 min-w-0 flex-1">
                  <input
                    id={`variant-${itemId}-${variant.id}`}
                    type="radio"
                    name={`variant-${itemId}`}
                    value={variant.id}
                    checked={selectedVariantId === variant.id}
                    onChange={() => onSelectVariant(variant.id)}
                    className="accent-[#ff6b00] shrink-0"
                  />
                  <span className="truncate" title={variant.name}>
                    {variant.name}
                  </span>
                  {variant.isDefault && (
                    <span className="text-[10px] text-stone-400 shrink-0">Default</span>
                  )}
                </span>
                <span className="font-semibold shrink-0 whitespace-nowrap">
                  {formatCurrency(variant.price)}
                </span>
              </label>
            ))}
          </fieldset>
        )}
        {availableAddons.length > 0 && (
          <fieldset className="space-y-2 min-w-0">
            <legend className="mb-2 text-[11px] font-bold uppercase tracking-wide text-stone-400">
              Add-ons
            </legend>
            {availableAddons.map((addon) => (
              <AddonOption
                key={addon.id}
                addon={addon}
                itemId={itemId}
                selected={selectedAddonIds.includes(addon.id)}
                onToggle={(checked) => onToggleAddon(addon.id, checked)}
              />
            ))}
          </fieldset>
        )}
      </div>
    </details>
  );
}
