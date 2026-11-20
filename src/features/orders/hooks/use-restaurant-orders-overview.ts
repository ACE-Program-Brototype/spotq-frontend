import { useQuery } from "@tanstack/react-query";
import { RESTAURANT_ORDERS_QUERY_KEYS } from "@/features/orders/constants/restaurant-orders.constants";
import { restaurantOrdersService } from "@/features/orders/services/restaurant-orders.service";

export function useRestaurantOrdersOverview(
  restaurantId: string,
  filters?: { from?: string; to?: string },
) {
  const normalizedId = (restaurantId ?? "").trim();

  return useQuery({
    queryKey: RESTAURANT_ORDERS_QUERY_KEYS.OVERVIEW(normalizedId, filters),
    queryFn: () => restaurantOrdersService.getOrdersOverview(normalizedId, filters),
    enabled: Boolean(normalizedId),
    staleTime: 30_000,
  });
}
