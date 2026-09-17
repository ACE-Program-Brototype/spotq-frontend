import { useQuery } from "@tanstack/react-query";
import { RESTAURANT_DEFAULTS, RESTAURANT_QUERY_KEYS } from "../constants/restaurant.constants";
import { restaurantService } from "../services/restaurant.service";
import type { RestaurantDetails } from "../types/restaurant.types";

export function useAdminRestaurantDetails(restaurantId?: string) {
  const query = useQuery<RestaurantDetails, Error>({
    queryKey: RESTAURANT_QUERY_KEYS.ADMIN_DETAILS(restaurantId),
    queryFn: () => {
      if (!restaurantId?.trim()) {
        throw new Error("Restaurant ID is required");
      }
      return restaurantService.getAdminRestaurantById(restaurantId.trim());
    },
    enabled: Boolean(restaurantId && restaurantId.trim().length > 0),
    staleTime: RESTAURANT_DEFAULTS.DETAILS_STALE_TIME_MS,
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
