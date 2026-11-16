import { Clock3, UtensilsCrossed } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CartRestaurantMismatchDialog } from "@/features/cart/components/CartRestaurantMismatchDialog";
import {
  CART_MESSAGES,
  CART_QUANTITY_LIMITS,
} from "@/features/cart/constants/cart.constants";
import { useCartStore } from "@/features/cart/store/cart.store";
import type { AddCartItemInput } from "@/features/cart/types/cart.types";
import { MenuItemCardActions } from "@/features/restaurants/components/Customer/MenuItemCardActions";
import { MenuItemCustomizer } from "@/features/restaurants/components/Customer/MenuItemCustomizer";
import { RESTAURANT_PLAN_TYPES } from "@/features/restaurants/constants/customer-restaurant.constants";
import type {
  CustomerRestaurantDetails,
  CustomerRestaurantMenuItem,
} from "@/features/restaurants/types/customer-restaurant.types";
import { usePresignedUrl } from "@/hooks/usePresignedUrl";
import { formatCurrency } from "@/lib/utils";

interface RestaurantMenuItemCardProps {
  item: CustomerRestaurantMenuItem;
  restaurant: CustomerRestaurantDetails;
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

  const handleAddToCart = () => {
    if (!item.isAvailable) {
      toast.error(CART_MESSAGES.ITEM_UNAVAILABLE);
      return;
    }

    if (availableVariants.length > 0 && !selectedVariant) {
      toast.error(CART_MESSAGES.VARIANT_REQUIRED);
      return;
    }

    // Queue Pro eligibility validation
    const planType = restaurant.type ?? restaurant.subscriptionType;
    const isQueuePro =
      planType?.toUpperCase() === RESTAURANT_PLAN_TYPES.QUEUE_PRO ||
      planType === RESTAURANT_PLAN_TYPES.QUEUE_PRO_DISPLAY;

    if (isQueuePro) {
      const queue = restaurant.queue;

      if (!queue || queue.isGuestUser || !queue.hasJoinedThisRestaurantQueue) {
        if (queue?.hasJoinedAnyQueue && !queue.hasJoinedThisRestaurantQueue) {
          toast.error(CART_MESSAGES.QUEUE_ALREADY_IN_OTHER);
        } else {
          toast.error(CART_MESSAGES.QUEUE_REQUIRED);
        }
        return;
      }
    }

    const payload: AddCartItemInput = {
      restaurantId: restaurant.restaurantId,
      restaurantName: restaurant.restaurantName,
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

    if (result.maxQuantityExceeded) {
      toast.error(
        result.availableToAdd != null && result.availableToAdd > 0
          ? `You can only add ${result.availableToAdd} more of this item (max limit is ${CART_QUANTITY_LIMITS.MAX_ITEM_QUANTITY}).`
          : CART_MESSAGES.MAX_QUANTITY_REACHED,
      );
      return;
    }

    if (result.success) {
      toast.success(CART_MESSAGES.ITEM_ADDED);
    }
  };

  const handleDecreaseQuantity = () => {
    setQuantity((q) => Math.max(CART_QUANTITY_LIMITS.MIN_ITEM_QUANTITY, q - 1));
  };

  const handleIncreaseQuantity = () => {
    if (quantity >= CART_QUANTITY_LIMITS.MAX_ITEM_QUANTITY) {
      toast.error(CART_MESSAGES.MAX_QUANTITY_REACHED);
      return;
    }
    setQuantity((q) => Math.min(CART_QUANTITY_LIMITS.MAX_ITEM_QUANTITY, q + 1));
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
        className="rounded-2xl border border-stone-200 bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-md min-w-0 max-w-full overflow-hidden"
      >
        <div className="flex min-w-0 gap-3 sm:gap-6 p-3.5 sm:p-5">
          <div className="size-20 sm:size-28 shrink-0 overflow-hidden rounded-xl bg-stone-100">
            {imageUrl ? (
              <img src={imageUrl} alt={item.name} className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center text-stone-300">
                <UtensilsCrossed className="size-6 sm:size-8" />
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 sm:gap-4">
            <div className="flex min-w-0 items-start justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
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
                  <h3
                    className="truncate font-bold text-stone-900 text-sm sm:text-base"
                    title={item.name}
                  >
                    {item.name}
                  </h3>
                </div>
                {item.description && (
                  <p
                    className="mt-1 line-clamp-2 text-xs sm:text-sm text-stone-500 break-words [overflow-wrap:anywhere]"
                    title={item.description}
                  >
                    {item.description}
                  </p>
                )}
                <div className="mt-2 sm:mt-3 flex flex-wrap gap-2 sm:gap-3 text-xs text-stone-500">
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
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 sm:py-1 text-[11px] font-semibold text-stone-600">
                      Currently unavailable
                    </span>
                  )}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-extrabold text-[#f26500] text-sm sm:text-base whitespace-nowrap">
                  {formatCurrency(totalItemPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {item.isAvailable && (
          <MenuItemCustomizer
            itemId={item.id}
            availableVariants={availableVariants}
            availableAddons={availableAddons}
            selectedVariantId={selectedVariantId}
            onSelectVariant={setSelectedVariantId}
            selectedAddonIds={selectedAddonIds}
            onToggleAddon={toggleAddon}
          />
        )}

        {/* Card Actions: Quantity Selector & Add to Cart */}
        {item.isAvailable && (
          <MenuItemCardActions
            itemId={item.id}
            quantity={quantity}
            totalItemPrice={totalItemPrice}
            onDecreaseQuantity={handleDecreaseQuantity}
            onIncreaseQuantity={handleIncreaseQuantity}
            onAddToCart={handleAddToCart}
          />
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
