import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cart.store";
import type { AddCartItemData, AddCartItemInput } from "../types/cart.types";

export interface AddToCartVariables extends AddCartItemInput {
  targetCartId?: string | null;
}

export interface UseAddToCartOptions {
  onConflict?: (error: Error, variables: AddToCartVariables) => void;
  onSuccess?: (data: AddCartItemData, variables: AddToCartVariables) => void;
  onError?: (error: Error, variables: AddToCartVariables) => void;
}

export function useAddToCart(options?: UseAddToCartOptions) {
  const queryClient = useQueryClient();
  const currentCartId = useCartStore((state) => state.cartId);
  const setCartId = useCartStore((state) => state.setCartId);
  const triggerBadgePulse = useCartStore((state) => state.triggerBadgePulse);

  return useMutation<AddCartItemData, Error, AddToCartVariables>({
    mutationFn: async (variables) => {
      const activeCartId = variables.targetCartId || currentCartId;
      if (!activeCartId) {
        throw new Error("No active cart found");
      }

      return await cartService.addItem(activeCartId, {
        restaurantId: variables.restaurantId,
        menuItemId: variables.menuItemId,
        variantId: variables.variantId ?? null,
        addonIds: variables.addonIds ?? [],
        quantity: variables.quantity || 1,
        specialInstructions: variables.specialInstructions ?? null,
      });
    },
    onSuccess: (data, variables) => {
      if (data.cartId) {
        setCartId(data.cartId);
      }
      queryClient.invalidateQueries({ queryKey: ["cart", data.cartId] });
      triggerBadgePulse();
      toast.success(CART_UI_MESSAGES.ITEM_ADDED_SUCCESS);
      options?.onSuccess?.(data, variables);
    },
    onError: (err, variables) => {
      let isDifferentRestaurantConflict = false;
      let isItemUnavailable = false;

      if (err && typeof err === "object" && "response" in err) {
        const resp = (err as { response?: { status?: number } }).response;
        if (resp?.status === 409) {
          const errMsg = err.message || "";
          if (
            errMsg.includes("DIFFERENT_RESTAURANT_CART") ||
            errMsg.toLowerCase().includes("different restaurant")
          ) {
            isDifferentRestaurantConflict = true;
          } else if (
            errMsg.includes("ITEM_UNAVAILABLE") ||
            errMsg.toLowerCase().includes("unavailable")
          ) {
            isItemUnavailable = true;
          } else {
            isDifferentRestaurantConflict = true;
          }
        }
      } else if (
        err.message?.includes("DIFFERENT_RESTAURANT_CART") ||
        err.message?.toLowerCase().includes("different restaurant")
      ) {
        isDifferentRestaurantConflict = true;
      }

      if (isDifferentRestaurantConflict) {
        if (options?.onConflict) {
          options.onConflict(err, variables);
          return;
        }
      }

      if (isItemUnavailable) {
        toast.error(CART_UI_MESSAGES.ITEM_UNAVAILABLE_MESSAGE);
      } else if (!isDifferentRestaurantConflict) {
        toast.error(err.message || CART_UI_MESSAGES.ERROR_LOADING_DESCRIPTION);
      }

      options?.onError?.(err, variables);
    },
  });
}
