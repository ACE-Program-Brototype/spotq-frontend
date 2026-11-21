import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  QUEUE_CANCEL_REASON,
  QUEUE_MESSAGES,
  QUEUE_QUERY_KEYS,
} from "@/features/queue/constants/queue.constants";
import { queueService } from "@/features/queue/services/queue.service";
import type {
  CancelQueueEntryInput,
  CancelQueueEntryResponse,
  RingCustomerResponse,
  SkipPartyInput,
  SkipPartyResponse,
} from "@/features/queue/types/queue.types";

interface UseQueueActionsOptions {
  onRingSuccess?: (response: RingCustomerResponse) => void;
  onSkipSuccess?: (response: SkipPartyResponse) => void;
  onCancelSuccess?: (response: CancelQueueEntryResponse) => void;
}

export function useQueueActions(restaurantId: string, options?: UseQueueActionsOptions) {
  const queryClient = useQueryClient();
  const [activeRingingId, setActiveRingingId] = useState<string | null>(null);

  const invalidateLiveQueue = () => {
    queryClient.invalidateQueries({
      queryKey: QUEUE_QUERY_KEYS.STAFF_LIVE_QUEUE(restaurantId),
    });
    queryClient.invalidateQueries({
      queryKey: [QUEUE_QUERY_KEYS.QUEUE, restaurantId],
    });
  };

  // Ring party mutation
  const ringMutation = useMutation<RingCustomerResponse, Error, string>({
    mutationFn: (queueEntryId: string) => queueService.ringCustomer(queueEntryId),
    onMutate: (queueEntryId) => {
      setActiveRingingId(queueEntryId);
    },
    onSuccess: (response) => {
      invalidateLiveQueue();
      toast.success(response.message || QUEUE_MESSAGES.RING_SUCCESS);
      options?.onRingSuccess?.(response);
    },
    onError: (error: Error) => {
      toast.error(error.message || QUEUE_MESSAGES.RING_FAILED);
    },
    onSettled: () => {
      setActiveRingingId(null);
    },
  });

  // Skip party mutation
  const skipMutation = useMutation<
    SkipPartyResponse,
    Error,
    { queueEntryId: string; input: SkipPartyInput }
  >({
    mutationFn: ({ queueEntryId, input }) =>
      queueService.skipParty(restaurantId, queueEntryId, input),
    onSuccess: (response) => {
      invalidateLiveQueue();
      toast.success(response.message || QUEUE_MESSAGES.SKIP_SUCCESS);
      options?.onSkipSuccess?.(response);
    },
    onError: (error: Error) => {
      toast.error(error.message || QUEUE_MESSAGES.SKIP_FAILED);
    },
  });

  // Cancel / No-show mutation
  const cancelMutation = useMutation<
    CancelQueueEntryResponse,
    Error,
    { queueEntryId: string; input: CancelQueueEntryInput }
  >({
    mutationFn: ({ queueEntryId, input }) =>
      queueService.cancelQueueEntry(restaurantId, queueEntryId, input),
    onSuccess: (response, variables) => {
      invalidateLiveQueue();
      const successMessage =
        variables.input.reason === QUEUE_CANCEL_REASON.NO_SHOW
          ? QUEUE_MESSAGES.NO_SHOW_SUCCESS
          : QUEUE_MESSAGES.CANCEL_SUCCESS;
      toast.success(response.message || successMessage);
      options?.onCancelSuccess?.(response);
    },
    onError: (error: Error) => {
      toast.error(error.message || QUEUE_MESSAGES.CANCEL_FAILED);
    },
  });

  return {
    ringCustomer: ringMutation.mutateAsync,
    isRinging: ringMutation.isPending,
    activeRingingId,
    skipParty: skipMutation.mutateAsync,
    isSkipping: skipMutation.isPending,
    cancelQueueEntry: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
  };
}
