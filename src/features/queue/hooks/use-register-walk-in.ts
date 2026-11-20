import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUEUE_MESSAGES, QUEUE_QUERY_KEYS } from "@/features/queue/constants/queue.constants";
import { queueService } from "@/features/queue/services/queue.service";
import type { RegisterWalkInInput, RegisterWalkInResponse } from "@/features/queue/types/queue.types";

interface UseRegisterWalkInOptions {
  onSuccess?: (response: RegisterWalkInResponse) => void;
  onError?: (error: Error) => void;
}

export function useRegisterWalkIn(restaurantId: string, options?: UseRegisterWalkInOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation<RegisterWalkInResponse, Error, RegisterWalkInInput>({
    mutationFn: (data: RegisterWalkInInput) => queueService.registerWalkIn(restaurantId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [QUEUE_QUERY_KEYS.QUEUE, restaurantId],
      });
      toast.success(
        response.message ||
          `Added ${response.data.guestName} to queue (Position #${response.data.position})`,
      );
      options?.onSuccess?.(response);
    },
    onError: (error: Error) => {
      const message = error.message || QUEUE_MESSAGES.REGISTER_FAILED;
      toast.error(message);
      options?.onError?.(error);
    },
  });

  return {
    registerWalkIn: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
}
