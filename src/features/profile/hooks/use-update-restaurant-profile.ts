import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PROFILE_MESSAGES, PROFILE_QUERY_KEYS } from "@/features/profile/constants/profile.constants";
import { updateRestaurantProfile } from "@/features/profile/services/profile.service";
import type {
  RestaurantProfileData,
  UpdateRestaurantProfilePayload,
} from "@/features/profile/types/restaurant-profile.types";

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
