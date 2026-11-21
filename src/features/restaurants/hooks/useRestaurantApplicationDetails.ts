import { useQuery } from "@tanstack/react-query";
import {
  APPLICATION_DEFAULTS,
  RESTAURANT_APPLICATION_QUERY_KEYS,
} from "@/features/restaurants/constants/restaurant-application.constants";
import { restaurantApplicationService } from "@/features/restaurants/services/restaurant-application.service";

export function useRestaurantApplicationDetails(id?: string) {
  const query = useQuery({
    queryKey: RESTAURANT_APPLICATION_QUERY_KEYS.DETAILS(id),
    queryFn: () => {
      if (!id) throw new Error("Application ID is required");
      return restaurantApplicationService.getRestaurantApplicationById(id);
    },
    enabled: Boolean(id),
    staleTime: APPLICATION_DEFAULTS.DETAILS_STALE_TIME_MS,
  });

  return {
    ...query,
    application: query.data,
  };
}
