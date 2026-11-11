/**
 * Hook for fetching and managing a single staff order detail using TanStack Query.
 */

import { useQuery } from "@tanstack/react-query";
import {
  STAFF_ORDER_STATUS,
  STAFF_ORDERS_DEFAULTS,
  STAFF_ORDERS_QUERY_KEYS,
} from "@/features/orders/constants/staff-orders.constants";
import { staffOrdersService } from "@/features/orders/services/staff-orders.service";

export interface UseStaffOrderDetailOptions {
  refetchInterval?: number | false;
}

export function useStaffOrderDetail(
  restaurantId: string,
  orderId: string,
  options?: UseStaffOrderDetailOptions,
) {
  const normalizedRestaurantId = (restaurantId ?? "").trim();
  const normalizedOrderId = (orderId ?? "").trim();

  return useQuery({
    queryKey: STAFF_ORDERS_QUERY_KEYS.DETAIL(normalizedRestaurantId, normalizedOrderId),
    queryFn: () =>
      staffOrdersService.getStaffOrderDetail(normalizedRestaurantId, normalizedOrderId),
    enabled: Boolean(normalizedRestaurantId && normalizedOrderId),
    staleTime: STAFF_ORDERS_DEFAULTS.DETAIL_STALE_TIME_MS,
    retry: STAFF_ORDERS_DEFAULTS.DETAIL_RETRY_COUNT,
    retryDelay: (attemptIndex) =>
      Math.min(
        STAFF_ORDERS_DEFAULTS.RETRY_BASE_DELAY_MS * 2 ** attemptIndex,
        STAFF_ORDERS_DEFAULTS.RETRY_MAX_DELAY_MS,
      ),
    refetchInterval: (query) => {
      if (options?.refetchInterval !== undefined) {
        return options.refetchInterval;
      }
      // Stop auto-polling if the order is completed
      if (query.state.data?.status === STAFF_ORDER_STATUS.COMPLETED) {
        return false;
      }
      return STAFF_ORDERS_DEFAULTS.POLL_INTERVAL_MS;
    },
  });
}
