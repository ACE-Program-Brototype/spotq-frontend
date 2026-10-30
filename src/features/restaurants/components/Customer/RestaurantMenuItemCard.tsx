import {
  ChevronDown,
  Clock3,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CartRestaurantMismatchDialog } from "@/features/cart/components/CartRestaurantMismatchDialog";
import { CART_MESSAGES, RESTAURANT_TYPES } from "@/features/cart/constants/cart.constants";
import { useCartStore } from "@/features/cart/store/cart.store";
import type { AddCartItemInput } from "@/features/cart/types/cart.types";
import { customerRestaurantService } from "@/features/restaurants/services/customer-restaurant.service";
import type {
  CustomerRestaurantDetails,
  CustomerRestaurantMenuItem,
} from "@/features/restaurants/types/customer-restaurant.types";
import { usePresignedUrl } from "@/hooks/usePresignedUrl";
import { formatCurrency } from "@/lib/utils";

interface RestaurantMenuItemCardProps {
  item: CustomerRestaurantMenuItem;
  restaurant?: CustomerRestaurantDetails;
}

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
    <div className="flex items-start justify-between gap-3 text-sm text-stone-700">
      <div className="flex min-w-0 items-start gap-2">
        <Checkbox
          id={checkboxId}
          checked={selected}
          onCheckedChange={(checked) => onToggle(checked === true)}
          className="mt-0.5"
        />
        <label htmlFor={checkboxId} className="flex min-w-0 cursor-pointer items-start gap-2">
          {addon.imageKey && (
            <span className="size-10 shrink-0 overflow-hidden rounded-md bg-stone-100">
              {imageUrl && <img src={imageUrl} alt="" className="size-full object-cover" />}
            </span>
          )}
          <span className="min-w-0">
            {addon.name}
            {addon.description && (
              <span className="block text-xs text-stone-400">{addon.description}</span>
            )}
          </span>
        </label>
      </div>
      <span className="shrink-0 font-semibold">
        {addon.price > 0 ? `+${formatCurrency(addon.price)}` : "Free"}
      </span>
    </div>
  );
}

export function RestaurantMenuItemCard({ item, restaurant }: RestaurantMenuItemCardProps) {
  const imageKey = item.images
    ?.slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))[0]?.objectKey;
  const { data: imageUrl } = usePresignedUrl(imageKey);

  const availableVariants = useMemo(
    () => item.variants?.filter((variant) => variant.isAvailable) ?? [],
    [item.variants],
  );
  const availableAddons = useMemo(
    () => item.addons?.filter((addon) => addon.isAvailable) ?? [],
    [item.addons],
  );

  const [selectedVariantId, setSelectedVariantId] = useState(
    availableVariants.find((variant) => variant.isDefault)?.id ?? availableVariants[0]?.id ?? "",
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [mismatchDialogOpen, setMismatchDialogOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<AddCartItemInput | null>(null);

  const { addItem, confirmReplaceCartAndAdd } = useCartStore();

  const selectedVariant = availableVariants.find((variant) => variant.id === selectedVariantId);
  const selectedAddons = availableAddons.filter((addon) => selectedAddonIds.includes(addon.id));

  const unitPrice =
    (selectedVariant?.price ?? item.price) +
    selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const totalItemPrice = unitPrice * quantity;

  const toggleAddon = (addonId: string, checked: boolean) => {
    setSelectedAddonIds((current) =>
      checked ? [...current, addonId] : current.filter((id) => id !== addonId),
    );
  };

  const handleAddToCart = async () => {
    if (!item.isAvailable) {
      toast.error(CART_MESSAGES.ITEM_UNAVAILABLE);
      return;
    }

    if (availableVariants.length > 0 && !selectedVariant) {
      toast.error(CART_MESSAGES.VARIANT_REQUIRED);
      return;
    }

    // Acceptance criteria 6: Queue Pro eligibility validation & live revalidation
    const isQueuePro =
      restaurant?.type?.toUpperCase() === RESTAURANT_TYPES.QUEUE_PRO ||
      restaurant?.type === "Queue Pro";

    if (isQueuePro && restaurant?.restaurantId) {
      setIsAdding(true);
      try {
        const freshDetails = await customerRestaurantService.getRestaurantDetails(
          restaurant.restaurantId,
        );
        const queue = freshDetails?.queue;

        if (!queue || queue.isGuestUser || !queue.hasJoinedThisRestaurantQueue) {
          if (queue?.hasJoinedAnyQueue && !queue.hasJoinedThisRestaurantQueue) {
            toast.error(CART_MESSAGES.QUEUE_ALREADY_IN_OTHER);
          } else {
            toast.error(CART_MESSAGES.QUEUE_REQUIRED);
          }
          setIsAdding(false);
          return;
        }
      } catch {
        toast.error(CART_MESSAGES.QUEUE_REQUIRED);
        setIsAdding(false);
        return;
      }
      setIsAdding(false);
    }

    const payload: AddCartItemInput = {
      restaurantId: restaurant?.restaurantId ?? "default-restaurant",
      restaurantName: restaurant?.restaurantName ?? "Restaurant",
      menuItemId: item.id,
      name: item.name,
      imageUrl: imageUrl ?? null,
      isVegetarian: item.isVegetarian,
      basePrice: item.price,
      selectedVariant: selectedVariant
        ? {
            id: selectedVariant.id,
            name: selectedVariant.name,
            price: selectedVariant.price,
          }
        : null,
      selectedAddons: selectedAddons.map((addon) => ({
        id: addon.id,
        name: addon.name,
        price: addon.price,
      })),
      quantity,
    };

    const result = addItem(payload);

    if (result.requiresConfirmation) {
      setPendingPayload(payload);
      setMismatchDialogOpen(true);
      return;
    }

    if (result.success) {
      toast.success(CART_MESSAGES.ITEM_ADDED);
    }
  };

  const handleConfirmMismatch = () => {
    if (pendingPayload) {
      confirmReplaceCartAndAdd(pendingPayload);
      toast.success(CART_MESSAGES.ITEM_ADDED);
    }
    setMismatchDialogOpen(false);
    setPendingPayload(null);
  };

  const handleCancelMismatch = () => {
    setMismatchDialogOpen(false);
    setPendingPayload(null);
  };

  return (
    <>
      <article
        data-testid={`menu-item-card-${item.id}`}
        className="rounded-2xl border border-stone-200 bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex min-w-0 gap-4 p-4 sm:gap-6 sm:p-5">
          <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:size-28">
            {imageUrl ? (
              <img src={imageUrl} alt={item.name} className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center text-stone-300">
                <UtensilsCrossed className="size-8" />
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-4">
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`size-2 shrink-0 rounded-full border ${
                      item.isVegetarian
                        ? "border-green-600 bg-green-600"
                        : "border-red-600 bg-red-600"
                    }`}
                    role="img"
                    aria-label={
                      item.isVegetarian ? CART_MESSAGES.VEGETARIAN : CART_MESSAGES.NON_VEGETARIAN
                    }
                  />
                  <h3 className="truncate font-bold text-stone-900">{item.name}</h3>
                </div>
                {item.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-stone-500">{item.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-500">
                  {item.preparationTime != null && (
                    <span>
                      <Clock3 className="mr-1 inline size-3.5" />
                      {item.preparationTime} min
                    </span>
                  )}
                  {item.isFeatured && (
                    <span className="font-semibold text-[#ff6b00]">Chef’s pick</span>
                  )}
                  {!item.isAvailable && (
                    <span className="rounded-full bg-stone-100 px-2 py-1 font-semibold text-stone-600">
                      Currently unavailable
                    </span>
                  )}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-extrabold text-[#f26500]">{formatCurrency(totalItemPrice)}</p>
              </div>
            </div>
          </div>
        </div>

        {item.isAvailable && (availableVariants.length > 0 || availableAddons.length > 0) && (
          <details className="group/options border-t border-stone-100 px-4 py-3 sm:px-5">
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
                <fieldset className="space-y-2">
                  <legend className="mb-2 text-[11px] font-bold uppercase tracking-wide text-stone-400">
                    Variant
                  </legend>
                  {availableVariants.map((variant) => (
                    <label
                      key={variant.id}
                      htmlFor={`variant-${item.id}-${variant.id}`}
                      className="flex cursor-pointer items-center justify-between gap-3 text-sm text-stone-700"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          id={`variant-${item.id}-${variant.id}`}
                          type="radio"
                          name={`variant-${item.id}`}
                          value={variant.id}
                          checked={selectedVariantId === variant.id}
                          onChange={() => {
                            setSelectedVariantId(variant.id);
                          }}
                          className="accent-[#ff6b00]"
                        />
                        {variant.name}
                        {variant.isDefault && (
                          <span className="text-[10px] text-stone-400">Default</span>
                        )}
                      </span>
                      <span className="font-semibold">{formatCurrency(variant.price)}</span>
                    </label>
                  ))}
                </fieldset>
              )}
              {availableAddons.length > 0 && (
                <fieldset className="space-y-2">
                  <legend className="mb-2 text-[11px] font-bold uppercase tracking-wide text-stone-400">
                    Add-ons
                  </legend>
                  {availableAddons.map((addon) => (
                    <AddonOption
                      key={addon.id}
                      addon={addon}
                      itemId={item.id}
                      selected={selectedAddonIds.includes(addon.id)}
                      onToggle={(checked) => toggleAddon(addon.id, checked)}
                    />
                  ))}
                </fieldset>
              )}
            </div>
          </details>
        )}

        {/* Card Actions: Quantity Selector & Add to Cart */}
        {item.isAvailable && (
          <div className="flex items-center justify-between border-t border-stone-100 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 p-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={quantity <= 1 || isAdding}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label={CART_MESSAGES.DECREASE_QUANTITY}
                className="size-7 rounded-lg text-stone-700 hover:bg-white hover:text-stone-900 disabled:opacity-40"
              >
                <Minus className="size-3.5" />
              </Button>

              <span
                data-testid={`quantity-selector-${item.id}`}
                className="w-7 text-center text-sm font-bold text-stone-900"
              >
                {quantity}
              </span>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isAdding}
                onClick={() => setQuantity((q) => q + 1)}
                aria-label={CART_MESSAGES.INCREASE_QUANTITY}
                className="size-7 rounded-lg text-stone-700 hover:bg-white hover:text-stone-900"
              >
                <Plus className="size-3.5" />
              </Button>
            </div>

            <Button
              type="button"
              disabled={isAdding}
              onClick={handleAddToCart}
              className="rounded-xl bg-[#ff6b00] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#e05e00] transition disabled:opacity-50"
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-1.5 size-3.5" />
                  Add to Cart ({formatCurrency(totalItemPrice)})
                </>
              )}
            </Button>
          </div>
        )}
      </article>

      <CartRestaurantMismatchDialog
        open={mismatchDialogOpen}
        onOpenChange={setMismatchDialogOpen}
        onConfirm={handleConfirmMismatch}
        onCancel={handleCancelMismatch}
      />
    </>
  );
}
