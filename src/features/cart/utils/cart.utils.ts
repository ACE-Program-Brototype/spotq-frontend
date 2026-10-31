import type { AddCartItemInput, CartItem } from "../types/cart.types";

export function generateCartItemId(
  menuItemId: string,
  variantId?: string | null,
  addonIds: string[] = [],
): string {
  const sortedAddonIds = [...addonIds].sort().join(",");
  return `${menuItemId}_v:${variantId || "none"}_a:${sortedAddonIds}`;
}

export function calculateCartTotals(items: CartItem[]): {
  totalCount: number;
  totalAmount: number;
} {
  return items.reduce(
    (acc, item) => {
      acc.totalCount += item.quantity;
      acc.totalAmount += item.subtotal;
      return acc;
    },
    { totalCount: 0, totalAmount: 0 },
  );
}

export function calculateUnitPrice(input: AddCartItemInput): number {
  const baseOrVariantPrice = input.selectedVariant?.price ?? input.basePrice;
  const addonsPrice = input.selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  return baseOrVariantPrice + addonsPrice;
}
