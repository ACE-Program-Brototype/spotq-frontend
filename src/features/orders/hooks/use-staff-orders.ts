/**
 * Hook for fetching and managing restaurant staff orders using TanStack Query.
 */

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { STAFF_ORDERS_QUERY_KEYS } from "../constants/staff-orders.constants";
import { staffOrdersService } from "../services/staff-orders.service";
import type { GetStaffOrdersParams } from "../types/staff-orders.types";

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
    staleTime: 10_000,
    refetchInterval: options?.refetchInterval ?? 15_000,
    placeholderData: keepPreviousData,
  });
}
