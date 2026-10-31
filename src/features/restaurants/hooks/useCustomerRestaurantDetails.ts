import { useQuery } from "@tanstack/react-query";
import {
  CUSTOMER_RESTAURANT_DEFAULTS,
  CUSTOMER_RESTAURANT_QUERY_KEYS,
} from "../constants/customer-restaurant.constants";
import { customerRestaurantService } from "../services/customer-restaurant.service";

export function useCustomerRestaurantDetails(id: string) {
  return useQuery({
    queryKey: CUSTOMER_RESTAURANT_QUERY_KEYS.DETAILS(id),
    queryFn: () => customerRestaurantService.getRestaurantDetails(id),
    enabled: Boolean(id),
    staleTime: CUSTOMER_RESTAURANT_DEFAULTS.CACHE_STALE_TIME_MS,
  });
}
