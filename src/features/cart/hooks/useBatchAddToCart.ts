import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CART_MESSAGES } from "../constants/cart.constants";
import { cartService } from "../services/cart.service";
import type { AddBatchCartItemsPayload, AddBatchCartItemsResponse } from "../types/cart.types";

export interface UseBatchAddToCartOptions {
  onSuccess?: (data: AddBatchCartItemsResponse) => void;
  onError?: (error: Error) => void;
}

export function useBatchAddToCart(options?: UseBatchAddToCartOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation<AddBatchCartItemsResponse, Error, AddBatchCartItemsPayload>({
    mutationFn: (payload: AddBatchCartItemsPayload) => cartService.batchAddToCart(payload),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["checkout", "details"] });
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error(error.message || CART_MESSAGES.SYNC_CART_FAILED);
      options?.onError?.(error);
    },
  });

  return {
    batchAddToCart: mutation.mutate,
    batchAddToCartAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}
