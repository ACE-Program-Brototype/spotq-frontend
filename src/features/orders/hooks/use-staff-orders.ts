/**
 * Hook for fetching and managing restaurant staff orders using TanStack Query.
 */

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  STAFF_ORDERS_DEFAULTS,
  STAFF_ORDERS_QUERY_KEYS,
} from "@/features/orders/constants/staff-orders.constants";
import { staffOrdersService } from "@/features/orders/services/staff-orders.service";
import type { GetStaffOrdersParams } from "@/features/orders/types/staff-orders.types";

export interface UseStaffOrdersOptions {
  refetchInterval?: number | false;
}

export function useStaffOrders(
  restaurantId: string,
  params?: GetStaffOrdersParams,
  options?: UseStaffOrdersOptions,
) {
  const normalizedId = (restaurantId ?? "").trim();

  return useQuery({
    queryKey: STAFF_ORDERS_QUERY_KEYS.LIST(
      normalizedId,
      params as Record<string, unknown> | undefined,
    ),
    queryFn: () => staffOrdersService.getStaffOrdersList(normalizedId, params),
    enabled: Boolean(normalizedId),
    staleTime: STAFF_ORDERS_DEFAULTS.LIST_STALE_TIME_MS,
    refetchInterval: options?.refetchInterval ?? STAFF_ORDERS_DEFAULTS.POLL_INTERVAL_MS,
    placeholderData: keepPreviousData,
  });
}
