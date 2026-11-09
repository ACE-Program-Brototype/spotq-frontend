import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CUSTOMER_RESTAURANT_QUERY_KEYS } from "@/features/restaurants/constants/customer-restaurant.constants";
import { QUEUE_MESSAGES, QUEUE_QUERY_KEYS } from "../constants/queue.constants";
import { queueService } from "../services/queue.service";
import type { LeaveQueueData, LeaveQueueResponse } from "../types/queue.types";
import { clearActiveCustomerTicket } from "../utils/active-queue.utils";

export interface LeaveQueueVariables {
  restaurantId: string;
  queueEntryId: string;
}

export interface UseLeaveQueueOptions {
  onSuccess?: (data: LeaveQueueData) => void;
  onError?: (error: Error) => void;
}

export function useLeaveQueue(options?: UseLeaveQueueOptions) {
  const queryClient = useQueryClient();

  return useMutation<LeaveQueueResponse, Error, LeaveQueueVariables>({
    mutationFn: ({ restaurantId, queueEntryId }: LeaveQueueVariables) => {
      if (!restaurantId) {
        throw new Error(QUEUE_MESSAGES.RESTAURANT_REQUIRED);
      }
      return queueService.leaveQueue(restaurantId, queueEntryId);
    },
    onSuccess: (response, variables) => {
      clearActiveCustomerTicket();
      queryClient.invalidateQueries({
        queryKey: QUEUE_QUERY_KEYS.CUSTOMER_STATUS(variables.restaurantId, variables.queueEntryId),
      });
      queryClient.invalidateQueries({
        queryKey: CUSTOMER_RESTAURANT_QUERY_KEYS.DETAILS(variables.restaurantId),
      });
      toast.success(response.message || QUEUE_MESSAGES.LEAVE_SUCCESS);
      options?.onSuccess?.(response.data);
    },
    onError: (err: Error) => {
      toast.error(err.message || QUEUE_MESSAGES.LEAVE_FAILED);
      options?.onError?.(err);
    },
  });
}
