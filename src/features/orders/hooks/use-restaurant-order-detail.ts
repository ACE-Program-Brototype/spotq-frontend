import { useQuery } from "@tanstack/react-query";
import { RESTAURANT_ORDERS_QUERY_KEYS } from "../constants/restaurant-orders.constants";
import { restaurantOrdersService } from "../services/restaurant-orders.service";

export function useRestaurantOrderDetail(restaurantId: string, orderId: string) {
  const normalizedRestaurantId = (restaurantId ?? "").trim();
  const normalizedOrderId = (orderId ?? "").trim();

  return useQuery({
    queryKey: RESTAURANT_ORDERS_QUERY_KEYS.DETAIL(normalizedRestaurantId, normalizedOrderId),
    queryFn: () => restaurantOrdersService.getOrderDetail(normalizedRestaurantId, normalizedOrderId),
    enabled: Boolean(normalizedRestaurantId && normalizedOrderId),
  });
}

