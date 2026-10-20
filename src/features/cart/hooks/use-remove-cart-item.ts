import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cart.store";
import type { Cart, UpdateCartItemQuantityData } from "../types/cart.types";

export interface UseRemoveCartItemOptions {
  cartId?: string | null;
  onSuccess?: (data: UpdateCartItemQuantityData, cartItemId: string) => void;
  onError?: (error: Error, cartItemId: string, context?: { previousCart?: Cart }) => void;
}

export function useRemoveCartItem(options?: UseRemoveCartItemOptions) {
  const queryClient = useQueryClient();
  const storeCartId = useCartStore((state) => state.cartId);
  const activeCartId = options?.cartId !== undefined ? options.cartId : storeCartId;
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  const mutation = useMutation<UpdateCartItemQuantityData, Error, string, { previousCart?: Cart }>({
    mutationFn: async (cartItemId: string) => {
      if (!activeCartId) {
        throw new Error(CART_UI_MESSAGES.ERROR_LOADING_DESCRIPTION);
      }
      return await cartService.removeItem(activeCartId, cartItemId);
    },
    onMutate: async (cartItemId: string) => {
      setRemovingItemId(cartItemId);
      if (!activeCartId) return {};

      await queryClient.cancelQueries({ queryKey: ["cart", activeCartId] });
      const previousCart = queryClient.getQueryData<Cart>(["cart", activeCartId]);

      if (previousCart) {
        const nextItems = previousCart.items.filter((item) => item.cartItemId !== cartItemId);
        const nextItemCount = nextItems.reduce((sum, item) => sum + item.quantity, 0);
        const nextSubtotal = nextItems.reduce((sum, item) => sum + item.totalPrice, 0);

        queryClient.setQueryData<Cart>(["cart", activeCartId], {
          ...previousCart,
          items: nextItems,
          itemCount: nextItemCount,
          subtotal: nextSubtotal,
        });
      }

      return { previousCart };
    },
    onError: (err, cartItemId, context) => {
      setRemovingItemId(null);
      if (activeCartId && context?.previousCart) {
        queryClient.setQueryData(["cart", activeCartId], context.previousCart);
      }
      toast.error(err.message || CART_UI_MESSAGES.REMOVE_ITEM_ERROR);
      options?.onError?.(err, cartItemId, context);
    },
    onSuccess: (data, cartItemId) => {
      setRemovingItemId(null);
      toast.success(CART_UI_MESSAGES.REMOVE_ITEM_SUCCESS);
      options?.onSuccess?.(data, cartItemId);
    },
    onSettled: async () => {
      setRemovingItemId(null);
      if (activeCartId) {
        await queryClient.invalidateQueries({ queryKey: ["cart", activeCartId] });
      }
    },
  });

  const removeItem = useCallback(
    (cartItemId: string) => {
      mutation.mutate(cartItemId);
    },
    [mutation],
  );

  const isItemRemoving = useCallback(
    (cartItemId: string) =>
      removingItemId === cartItemId || (mutation.isPending && mutation.variables === cartItemId),
    [removingItemId, mutation.isPending, mutation.variables],
  );

  return {
    removeItem,
    removeItemAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isItemRemoving,
    removingItemId,
  };
}
