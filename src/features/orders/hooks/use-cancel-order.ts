/**
 * useCancelOrder Hook
 * TanStack Query mutation hook for customer order cancellation.
 * Handles cache invalidation for the order listing and 409 conflict synchronization.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { toast } from "sonner";
import {
  CANCEL_ORDER_MESSAGES,
  CANCEL_ORDER_QUERY_KEYS,
} from "../constants/cancel-order.constants";
import { orderService } from "../services/order.service";
import type { CancelOrderRequestDto, CancelOrderResponseData } from "../types/cancel-order.types";

export interface UseCancelOrderOptions {
  onSuccess?: (data: CancelOrderResponseData) => void;
  onError?: (error: Error) => void;
}

export function useCancelOrder(orderId: string, options?: UseCancelOrderOptions) {
  const queryClient = useQueryClient();

  return useMutation<CancelOrderResponseData, Error, CancelOrderRequestDto>({
    mutationFn: (payload: CancelOrderRequestDto) => orderService.cancelOrder(orderId, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: CANCEL_ORDER_QUERY_KEYS.ORDERS_ROOT,
      });

      toast.success(CANCEL_ORDER_MESSAGES.TOAST_SUCCESS);
      options?.onSuccess?.(data);
    },

    onError: (err: Error) => {
      const status =
        err instanceof HTTPError ? err.response?.status : (err as { status?: number }).status;

      if (status === 409) {
        queryClient.invalidateQueries({
          queryKey: CANCEL_ORDER_QUERY_KEYS.ORDERS_ROOT,
        });
      }

      toast.error(err.message || CANCEL_ORDER_MESSAGES.TOAST_GENERIC_ERROR);
      options?.onError?.(err);
    },
  });
}
