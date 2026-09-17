import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RESTAURANT_MESSAGES, RESTAURANT_QUERY_KEYS } from "../constants/restaurant.constants";
import { restaurantService } from "../services/restaurant.service";
import type { BlockRestaurantInput, UnblockRestaurantInput } from "../types/restaurant.types";

/**
 * Mutation hook for blocking a restaurant with a reason
 */
export function useBlockRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BlockRestaurantInput) => restaurantService.blockRestaurant(input),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: RESTAURANT_QUERY_KEYS.ADMIN_DETAILS(variables.restaurantId),
      });
      queryClient.invalidateQueries({
        queryKey: RESTAURANT_QUERY_KEYS.ADMIN_LIST,
      });
      toast.success(response?.message || RESTAURANT_MESSAGES.BLOCK_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(error.message || RESTAURANT_MESSAGES.BLOCK_ERROR);
    },
  });
}

/**
 * Mutation hook for unblocking a restaurant
 */
export function useUnblockRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UnblockRestaurantInput) => restaurantService.unblockRestaurant(input),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: RESTAURANT_QUERY_KEYS.ADMIN_DETAILS(variables.restaurantId),
      });
      queryClient.invalidateQueries({
        queryKey: RESTAURANT_QUERY_KEYS.ADMIN_LIST,
      });
      toast.success(response?.message || RESTAURANT_MESSAGES.UNBLOCK_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(error.message || RESTAURANT_MESSAGES.UNBLOCK_ERROR);
    },
  });
}
