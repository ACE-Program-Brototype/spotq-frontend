import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TABLE_MESSAGES, TABLE_QUERY_KEYS } from "../constants/table.constants";
import { tableService } from "../services/table.service";
import type { DeleteTableResponse } from "../types/table.types";

export function useDeleteTable(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation<DeleteTableResponse, Error, string>({
    mutationFn: (tableId: string) => tableService.deleteTable(restaurantId, tableId),
    onSuccess: async () => {
      // Invalidate tables lists to immediately update the floor layout
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: TABLE_QUERY_KEYS.LIST(restaurantId) }),
        queryClient.invalidateQueries({ queryKey: TABLE_QUERY_KEYS.ALL }),
      ]);
      toast.success(TABLE_MESSAGES.DELETE_SUCCESS);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : TABLE_MESSAGES.DELETE_FAILED);
    },
  });
}
