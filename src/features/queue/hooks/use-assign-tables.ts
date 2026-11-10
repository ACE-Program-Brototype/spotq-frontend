import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TABLE_QUERY_KEYS } from "@/features/tables/constants/table.constants";
import { QUEUE_MESSAGES, QUEUE_QUERY_KEYS } from "../constants/queue.constants";
import { queueService } from "../services/queue.service";
import type { AssignTablesInput, AssignTablesResponse } from "../types/queue.types";

interface UseAssignTablesOptions {
  onSuccess?: (response: AssignTablesResponse) => void;
  onError?: (error: Error) => void;
}

export interface AssignTablesVariables {
  queueEntryId: string;
  input: AssignTablesInput;
}

export function useAssignTables(restaurantId: string, options?: UseAssignTablesOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation<AssignTablesResponse, Error, AssignTablesVariables>({
    mutationFn: ({ queueEntryId, input }: AssignTablesVariables) =>
      queueService.assignTables(queueEntryId, input),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [QUEUE_QUERY_KEYS.QUEUE, restaurantId],
      });
      queryClient.invalidateQueries({
        queryKey: TABLE_QUERY_KEYS.LIST(restaurantId),
      });
      toast.success(response.message || QUEUE_MESSAGES.ASSIGN_TABLE_SUCCESS);
      options?.onSuccess?.(response);
    },
    onError: (error: Error) => {
      queryClient.invalidateQueries({
        queryKey: TABLE_QUERY_KEYS.LIST(restaurantId),
      });
      const message = error.message || QUEUE_MESSAGES.ASSIGN_TABLE_FAILED;
      toast.error(message);
      options?.onError?.(error);
    },
  });

  return {
    assignTables: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
}
