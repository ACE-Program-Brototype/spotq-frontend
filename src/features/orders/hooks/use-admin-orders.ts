/**
 * Platform Admin Orders TanStack Query Hook
 * Fetches paginated orders and system-wide metrics with caching and background updates.
 */

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ADMIN_ORDERS_QUERY_KEYS } from "@/features/orders/constants/admin-orders.constants";
import { adminOrdersService } from "@/features/orders/services/admin-orders.service";
import type { GetAdminOrdersParams } from "@/features/orders/types/admin-orders.types";

export interface UseAdminOrdersOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
  retry?: number | boolean;
}

export function useAdminOrders(params?: GetAdminOrdersParams, options?: UseAdminOrdersOptions) {
  return useQuery({
    queryKey: ADMIN_ORDERS_QUERY_KEYS.LIST(params as Record<string, unknown> | undefined),
    queryFn: ({ signal }) => adminOrdersService.getAdminOrders(params, signal),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    refetchInterval: options?.refetchInterval,
    retry: options?.retry ?? 0,
  });
}
