import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PROFILE_MESSAGES, PROFILE_QUERY_KEYS } from "../constants/profile.constants";
import { updateRestaurantProfile } from "../services/profile.service";
import type {
  RestaurantProfileData,
  UpdateRestaurantProfilePayload,
} from "../types/restaurant-profile.types";

export function useUpdateRestaurantProfile() {
  const queryClient = useQueryClient();

  return useMutation<RestaurantProfileData, Error, UpdateRestaurantProfilePayload>({
    mutationFn: updateRestaurantProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.RESTAURANT_PROFILE, data);
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.RESTAURANT_PROFILE });
      toast.success(PROFILE_MESSAGES.RESTAURANT_UPDATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(error.message || PROFILE_MESSAGES.RESTAURANT_UPDATE_FAILED);
    },
  });
}
