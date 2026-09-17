import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  APPLICATION_MESSAGES,
  APPLICATION_STATUS,
  RESTAURANT_APPLICATION_QUERY_KEYS,
} from "../constants/restaurant-application.constants";
import { restaurantApplicationService } from "../services/restaurant-application.service";
import type {
  RejectApplicationInput,
  RestaurantApplicationItem,
} from "../types/restaurant-application.types";

export function useApproveApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (restaurantId: string) =>
      restaurantApplicationService.approveRestaurantApplication(restaurantId),
    onSuccess: (res, restaurantId) => {
      toast.success(APPLICATION_MESSAGES.APPROVE_SUCCESS);
      queryClient.setQueryData(
        RESTAURANT_APPLICATION_QUERY_KEYS.DETAILS(restaurantId),
        (old: RestaurantApplicationItem | undefined) => {
          if (!old) return old;
          return {
            ...old,
            status: APPLICATION_STATUS.APPROVED,
            reviewed_at: res.data?.reviewed_at || new Date().toISOString(),
            reviewed_by: res.data?.reviewed_by || old.reviewed_by,
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: RESTAURANT_APPLICATION_QUERY_KEYS.DETAILS(restaurantId),
      });
      queryClient.invalidateQueries({
        queryKey: RESTAURANT_APPLICATION_QUERY_KEYS.LIST,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || APPLICATION_MESSAGES.APPROVE_ERROR);
    },
  });
}

export function useRejectApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ restaurantId, reason }: RejectApplicationInput) =>
      restaurantApplicationService.rejectRestaurantApplication({ restaurantId, reason }),
    onSuccess: (res, { restaurantId, reason }) => {
      toast.success(APPLICATION_MESSAGES.REJECT_SUCCESS);
      queryClient.setQueryData(
        RESTAURANT_APPLICATION_QUERY_KEYS.DETAILS(restaurantId),
        (old: RestaurantApplicationItem | undefined) => {
          if (!old) return old;
          return {
            ...old,
            status: APPLICATION_STATUS.REJECTED,
            rejection_reason: reason,
            reviewed_at: res.data?.reviewed_at || new Date().toISOString(),
            reviewed_by: res.data?.reviewed_by || old.reviewed_by,
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: RESTAURANT_APPLICATION_QUERY_KEYS.DETAILS(restaurantId),
      });
      queryClient.invalidateQueries({
        queryKey: RESTAURANT_APPLICATION_QUERY_KEYS.LIST,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || APPLICATION_MESSAGES.REJECT_ERROR);
    },
  });
}
