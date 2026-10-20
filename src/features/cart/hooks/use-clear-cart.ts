import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cart.store";
import type { Cart, UpdateCartItemQuantityData } from "../types/cart.types";

export interface UseClearCartOptions {
  cartId?: string | null;
  onSuccess?: (data: UpdateCartItemQuantityData) => void;
  onError?: (error: Error, context?: { previousCart?: Cart }) => void;
}

export function useClearCart(options?: UseClearCartOptions) {
  const queryClient = useQueryClient();
  const storeCartId = useCartStore((state) => state.cartId);
  const activeCartId = options?.cartId !== undefined ? options.cartId : storeCartId;

  const mutation = useMutation<UpdateCartItemQuantityData, Error, void, { previousCart?: Cart }>({
    mutationFn: async () => {
      if (!activeCartId) {
        throw new Error(CART_UI_MESSAGES.ERROR_LOADING_DESCRIPTION);
      }
      return await cartService.clearCart(activeCartId);
    },
    onMutate: async () => {
      if (!activeCartId) return {};

      await queryClient.cancelQueries({ queryKey: ["cart", activeCartId] });
      const previousCart = queryClient.getQueryData<Cart>(["cart", activeCartId]);

      if (previousCart) {
        queryClient.setQueryData<Cart>(["cart", activeCartId], {
          ...previousCart,
          items: [],
          itemCount: 0,
          subtotal: 0,
        });
      }

      return { previousCart };
    },
    onError: (err, _variables, context) => {
      if (activeCartId && context?.previousCart) {
        queryClient.setQueryData(["cart", activeCartId], context.previousCart);
      }
      toast.error(err.message || CART_UI_MESSAGES.CLEAR_CART_ERROR);
      options?.onError?.(err, context);
    },
    onSuccess: (data) => {
      if (activeCartId) {
        const previousCart = queryClient.getQueryData<Cart>(["cart", activeCartId]);
        if (previousCart) {
          queryClient.setQueryData<Cart>(["cart", activeCartId], {
            ...previousCart,
            items: [],
            itemCount: data.itemCount ?? 0,
            subtotal: data.subtotal ?? 0,
          });
        }
      }
      toast.success(CART_UI_MESSAGES.CLEAR_CART_SUCCESS);
      options?.onSuccess?.(data);
    },
    onSettled: async () => {
      if (activeCartId) {
        await queryClient.invalidateQueries({ queryKey: ["cart", activeCartId] });
      }
    },
  });

  const clearCart = useCallback(() => {
    mutation.mutate();
  }, [mutation]);

  return {
    clearCart,
    clearCartAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}

export default useClearCart;
