import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CART_QUERY_KEYS } from "../constants/cart.constants";
import { cartService } from "../services/cart.service";
import type { AddToCartPayload, AddToCartResponse } from "../types/cart.types";

export interface UseAddToCartOptions {
  onSuccess?: (data: AddToCartResponse, variables: AddToCartPayload) => void;
  onError?: (error: Error, variables: AddToCartPayload) => void;
}

export function useAddToCart(options?: UseAddToCartOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => cartService.addToCart(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.ALL });
      options?.onSuccess?.(data, variables);
    },
    onError: (error: Error, variables) => {
      options?.onError?.(error, variables);
    },
  });
}
