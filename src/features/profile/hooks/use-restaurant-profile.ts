import { useQuery } from "@tanstack/react-query";
import { PROFILE_QUERY_KEYS, profileHooks } from "../constants/profile.constants";
import { profileService } from "../services/profile.service";
import type { RestaurantProfileData } from "../types/restaurant-profile.types";

export function useRestaurantProfile() {
  return useQuery<RestaurantProfileData, Error>({
    queryKey: PROFILE_QUERY_KEYS.RESTAURANT_PROFILE,
    queryFn: () => profileService.getRestaurantProfile(),
    staleTime: profileHooks.RESTAURANT_PROFILE_STALE_TIME,
  });
}
