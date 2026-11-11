import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CUSTOMER_RESTAURANT_QUERY_KEYS } from "@/features/restaurants/constants/customer-restaurant.constants";
import { QUEUE_MESSAGES, QUEUE_QUERY_KEYS } from "../constants/queue.constants";
import { queueService } from "../services/queue.service";
import type { JoinQueueInput, JoinQueueResponse, QueueEntry } from "../types/queue.types";

export interface UseJoinQueueOptions {
  onSuccess?: (entry: QueueEntry) => void;
  onError?: (error: Error) => void;
}

/**
 * Mutation hook for a customer joining a restaurant's queue.
 */
export function useJoinQueue(restaurantId: string | undefined, options?: UseJoinQueueOptions) {
  const queryClient = useQueryClient();

  return useMutation<JoinQueueResponse, Error, JoinQueueInput>({
    mutationFn: (input: JoinQueueInput) => {
      if (!restaurantId) {
        throw new Error(QUEUE_MESSAGES.RESTAURANT_REQUIRED);
      }
      return queueService.joinQueue(restaurantId, input);
    },
    onSuccess: (response) => {
      if (restaurantId) {
        queryClient.invalidateQueries({
          queryKey: CUSTOMER_RESTAURANT_QUERY_KEYS.DETAILS(restaurantId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: QUEUE_QUERY_KEYS.CUSTOMER_ACTIVE(),
      });
      toast.success(response.message || QUEUE_MESSAGES.JOIN_SUCCESS);
      options?.onSuccess?.(response.data);
    },
    onError: (err: Error) => {
      toast.error(err.message || QUEUE_MESSAGES.JOIN_FAILED);
      options?.onError?.(err);
    },
  });
}
