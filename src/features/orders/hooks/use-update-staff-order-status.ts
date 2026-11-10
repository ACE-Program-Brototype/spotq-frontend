/**
 * Hook for updating order status throughout food preparation.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  STAFF_ORDER_DETAILS_MESSAGES,
  STAFF_ORDER_STATUS_CONFIG,
  STAFF_ORDERS_QUERY_KEYS,
} from "../constants/staff-orders.constants";
import { staffOrdersService } from "../services/staff-orders.service";
import type { StaffOrderStatus, UpdateStaffOrderStatusPayload } from "../types/staff-orders.types";

interface UseUpdateStaffOrderStatusParams {
  restaurantId: string;
  orderNumber?: string;
  onSuccess?: (nextStatus: StaffOrderStatus) => void;
}

export function useUpdateStaffOrderStatus({
  restaurantId,
  orderNumber,
  onSuccess,
}: UseUpdateStaffOrderStatusParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStaffOrderStatusPayload) =>
      staffOrdersService.updateStaffOrderStatus(payload),

    onSuccess: (_data, variables) => {
      // Invalidate the detail query and root list query so feeds update immediately
      queryClient.invalidateQueries({
        queryKey: STAFF_ORDERS_QUERY_KEYS.DETAIL(restaurantId, variables.orderId),
      });
      queryClient.invalidateQueries({
        queryKey: STAFF_ORDERS_QUERY_KEYS.ROOT,
      });

      const statusLabel = STAFF_ORDER_STATUS_CONFIG[variables.status]?.label ?? variables.status;
      toast.success(
        STAFF_ORDER_DETAILS_MESSAGES.STATUS_UPDATE_SUCCESS(
          orderNumber ?? variables.orderId.slice(0, 8),
          statusLabel,
        ),
      );

      onSuccess?.(variables.status);
    },

    onError: async (error: unknown, variables) => {
      // Invalidate to ensure the client displays the latest state (e.g. concurrent conflict)
      queryClient.invalidateQueries({
        queryKey: STAFF_ORDERS_QUERY_KEYS.DETAIL(restaurantId, variables.orderId),
      });
      queryClient.invalidateQueries({
        queryKey: STAFF_ORDERS_QUERY_KEYS.ROOT,
      });

      // Check if HTTP 409 Conflict
      const isConflict =
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as { response?: { status?: number } }).response?.status === 409;

      if (isConflict) {
        toast.error(STAFF_ORDER_DETAILS_MESSAGES.CONCURRENT_UPDATE_ERROR);
      } else {
        const message =
          error instanceof Error ? error.message : STAFF_ORDER_DETAILS_MESSAGES.STATUS_UPDATE_ERROR;
        toast.error(message);
      }
    },
  });
}
