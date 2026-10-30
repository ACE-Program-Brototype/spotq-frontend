import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { CART_STORAGE_KEY } from "../constants/cart.constants";
import type { AddCartItemInput, CartItem, CartState, CartStore } from "../types/cart.types";

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

function calculateUnitPrice(input: AddCartItemInput): number {
  const baseOrVariantPrice = input.selectedVariant?.price ?? input.basePrice;
  const addonsPrice = input.selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  return baseOrVariantPrice + addonsPrice;
}

const initialCartState: CartState = {
  restaurantId: null,
  restaurantName: null,
  items: [],
  totalCount: 0,
  totalAmount: 0,
  savedAt: null,
};

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialCartState,

        addItem: (input: AddCartItemInput) => {
          const state = get();
          const quantityToAdd = Math.max(1, input.quantity ?? 1);

          // Acceptance criteria 2: Single-restaurant cart validation
          if (
            state.items.length > 0 &&
            state.restaurantId &&
            state.restaurantId !== input.restaurantId
          ) {
            return {
              success: false,
              requiresConfirmation: true,
              currentRestaurantName: state.restaurantName ?? undefined,
            };
          }

          const unitPrice = calculateUnitPrice(input);
          const addonIds = input.selectedAddons.map((a) => a.id);
          const cartItemId = generateCartItemId(
            input.menuItemId,
            input.selectedVariant?.id,
            addonIds,
          );

          const existingIndex = state.items.findIndex((item) => item.id === cartItemId);
          let newItems: CartItem[];

          if (existingIndex >= 0) {
            newItems = state.items.map((item, index) => {
              if (index !== existingIndex) return item;
              const nextQuantity = item.quantity + quantityToAdd;
              return {
                ...item,
                quantity: nextQuantity,
                subtotal: item.unitPrice * nextQuantity,
              };
            });
          } else {
            const newItem: CartItem = {
              id: cartItemId,
              menuItemId: input.menuItemId,
              name: input.name,
              imageUrl: input.imageUrl ?? null,
              isVegetarian: input.isVegetarian,
              selectedVariant: input.selectedVariant,
              selectedAddons: input.selectedAddons,
              unitPrice,
              quantity: quantityToAdd,
              subtotal: unitPrice * quantityToAdd,
            };
            newItems = [...state.items, newItem];
          }

          const { totalCount, totalAmount } = calculateCartTotals(newItems);

          set(
            {
              restaurantId: input.restaurantId,
              restaurantName: input.restaurantName,
              items: newItems,
              totalCount,
              totalAmount,
              savedAt: Date.now(),
            },
            false,
            "cart/addItem",
          );

          return { success: true };
        },

        confirmReplaceCartAndAdd: (input: AddCartItemInput) => {
          const quantityToAdd = Math.max(1, input.quantity ?? 1);
          const unitPrice = calculateUnitPrice(input);
          const addonIds = input.selectedAddons.map((a) => a.id);
          const cartItemId = generateCartItemId(
            input.menuItemId,
            input.selectedVariant?.id,
            addonIds,
          );

          const newItem: CartItem = {
            id: cartItemId,
            menuItemId: input.menuItemId,
            name: input.name,
            imageUrl: input.imageUrl ?? null,
            isVegetarian: input.isVegetarian,
            selectedVariant: input.selectedVariant,
            selectedAddons: input.selectedAddons,
            unitPrice,
            quantity: quantityToAdd,
            subtotal: unitPrice * quantityToAdd,
          };

          const newItems = [newItem];
          const { totalCount, totalAmount } = calculateCartTotals(newItems);

          set(
            {
              restaurantId: input.restaurantId,
              restaurantName: input.restaurantName,
              items: newItems,
              totalCount,
              totalAmount,
              savedAt: Date.now(),
            },
            false,
            "cart/confirmReplaceCartAndAdd",
          );
        },

        updateQuantity: (cartItemId: string, delta: number) => {
          const state = get();
          const targetItem = state.items.find((item) => item.id === cartItemId);
          if (!targetItem) return;

          const nextQuantity = targetItem.quantity + delta;

          if (nextQuantity <= 0) {
            const remainingItems = state.items.filter((item) => item.id !== cartItemId);
            if (remainingItems.length === 0) {
              set(
                {
                  ...initialCartState,
                  savedAt: Date.now(),
                },
                false,
                "cart/updateQuantity/empty",
              );
              return;
            }

            const { totalCount, totalAmount } = calculateCartTotals(remainingItems);
            set(
              {
                items: remainingItems,
                totalCount,
                totalAmount,
                savedAt: Date.now(),
              },
              false,
              "cart/updateQuantity/remove",
            );
            return;
          }

          const updatedItems = state.items.map((item) => {
            if (item.id !== cartItemId) return item;
            return {
              ...item,
              quantity: nextQuantity,
              subtotal: item.unitPrice * nextQuantity,
            };
          });

          const { totalCount, totalAmount } = calculateCartTotals(updatedItems);
          set(
            {
              items: updatedItems,
              totalCount,
              totalAmount,
              savedAt: Date.now(),
            },
            false,
            "cart/updateQuantity",
          );
        },

        removeItem: (cartItemId: string) => {
          const state = get();
          const remainingItems = state.items.filter((item) => item.id !== cartItemId);

          if (remainingItems.length === 0) {
            set(
              {
                ...initialCartState,
                savedAt: Date.now(),
              },
              false,
              "cart/removeItem/empty",
            );
            return;
          }

          const { totalCount, totalAmount } = calculateCartTotals(remainingItems);
          set(
            {
              items: remainingItems,
              totalCount,
              totalAmount,
              savedAt: Date.now(),
            },
            false,
            "cart/removeItem",
          );
        },

        clearCart: () => {
          set(
            {
              ...initialCartState,
              savedAt: Date.now(),
            },
            false,
            "cart/clearCart",
          );
        },
      }),
      {
        name: CART_STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          if (!state) return;

          // Safe recovery for corrupted or malformed data in localStorage
          if (!Array.isArray(state.items)) {
            state.items = [];
            state.restaurantId = null;
            state.restaurantName = null;
            state.totalCount = 0;
            state.totalAmount = 0;
            return;
          }

          const validItems = state.items.filter((item) => {
            return (
              typeof item.id === "string" &&
              typeof item.menuItemId === "string" &&
              typeof item.name === "string" &&
              typeof item.unitPrice === "number" &&
              !Number.isNaN(item.unitPrice) &&
              typeof item.quantity === "number" &&
              item.quantity > 0 &&
              !Number.isNaN(item.quantity)
            );
          });

          if (validItems.length === 0) {
            state.items = [];
            state.restaurantId = null;
            state.restaurantName = null;
            state.totalCount = 0;
            state.totalAmount = 0;
          } else {
            state.items = validItems.map((item) => ({
              ...item,
              subtotal: item.unitPrice * item.quantity,
            }));
            const { totalCount, totalAmount } = calculateCartTotals(state.items);
            state.totalCount = totalCount;
            state.totalAmount = totalAmount;
          }
        },
        partialize: (state) => ({
          restaurantId: state.restaurantId,
          restaurantName: state.restaurantName,
          items: state.items,
          totalCount: state.totalCount,
          totalAmount: state.totalAmount,
          savedAt: state.savedAt,
        }),
      },
    ),
    {
      name: "CartStore",
      enabled:
        typeof globalThis !== "undefined" &&
        (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !==
          "production",
    },
  ),
);
