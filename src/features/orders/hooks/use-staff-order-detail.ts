/**
 * Hook for fetching and managing a single staff order detail using TanStack Query.
 */

import { useQuery } from "@tanstack/react-query";
import {
  STAFF_ORDERS_DEFAULTS,
  STAFF_ORDERS_QUERY_KEYS,
} from "../constants/staff-orders.constants";
import { staffOrdersService } from "../services/staff-orders.service";

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
    staleTime: 5_000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    refetchInterval: (query) => {
      if (options?.refetchInterval !== undefined) {
        return options.refetchInterval;
      }
      // Stop auto-polling if the order is completed
      if (query.state.data?.status === "COMPLETED") {
        return false;
      }
      return STAFF_ORDERS_DEFAULTS.POLL_INTERVAL_MS;
    },
  });
}
