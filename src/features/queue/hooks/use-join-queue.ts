import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CUSTOMER_RESTAURANT_QUERY_KEYS } from "@/features/restaurants/constants/customer-restaurant.constants";
import { getStoredFid } from "@/lib/firebase/firebase";
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
    mutationFn: async (input: JoinQueueInput) => {
      if (!restaurantId) {
        throw new Error(QUEUE_MESSAGES.RESTAURANT_REQUIRED);
      }
      const fid = input.fid !== undefined ? input.fid : await getStoredFid();
      return queueService.joinQueue(restaurantId, {
        ...input,
        ...(fid ? { fid } : {}),
      });
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
