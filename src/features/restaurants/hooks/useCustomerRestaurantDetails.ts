import { useQuery } from "@tanstack/react-query";
import {
  CUSTOMER_RESTAURANT_DEFAULTS,
  CUSTOMER_RESTAURANT_QUERY_KEYS,
} from "../constants/customer-restaurant.constants";
import { customerRestaurantService } from "../services/customer-restaurant.service";
import type { CustomerRestaurantDetails } from "../types/customer-restaurant-details.types";

/**
 * Hook to retrieve and cache customer restaurant details with full menu, variants, and addons.
 * Makes live network requests to spotq-restaurant-service via the configured API client.
 */
export function useCustomerRestaurantDetails(restaurantId?: string) {
  const query = useQuery<CustomerRestaurantDetails, Error>({
    queryKey: CUSTOMER_RESTAURANT_QUERY_KEYS.DETAILS(restaurantId ?? ""),
    queryFn: async ({ signal }) => {
      if (!restaurantId?.trim()) {
        throw new Error("Restaurant ID is required");
      }
      return customerRestaurantService.getRestaurantDetails(restaurantId.trim(), true, signal);
    },
    enabled: Boolean(restaurantId && restaurantId.trim().length > 0),
    staleTime: CUSTOMER_RESTAURANT_DEFAULTS.CACHE_STALE_TIME_MS,
  });

  return {
    ...query,
    restaurant: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
