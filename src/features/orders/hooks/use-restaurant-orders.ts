import { useQuery } from "@tanstack/react-query";
import { RESTAURANT_ORDERS_QUERY_KEYS } from "@/features/orders/constants/restaurant-orders.constants";
import { restaurantOrdersService } from "@/features/orders/services/restaurant-orders.service";
import type { GetRestaurantOrdersParams } from "@/features/orders/types/restaurant-orders.types";

export function useRestaurantOrders(restaurantId: string, params?: GetRestaurantOrdersParams) {
  const normalizedId = (restaurantId ?? "").trim();

  return useQuery({
    queryKey: RESTAURANT_ORDERS_QUERY_KEYS.LIST(
      normalizedId,
      params as Record<string, unknown> | undefined,
    ),
    queryFn: () => restaurantOrdersService.getOrdersList(normalizedId, params),
    enabled: Boolean(normalizedId),
    staleTime: 15_000,
  });
}
