import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TABLE_MESSAGES, TABLE_QUERY_KEYS } from "../constants/table.constants";
import { tableService } from "../services/table.service";
import type { TableItem, UpdateTablePayload } from "../types/table.types";

export interface UpdateTableMutationVariables {
  tableId: string;
  payload: UpdateTablePayload;
}

export function useUpdateTable(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation<TableItem, Error, UpdateTableMutationVariables>({
    mutationFn: ({ tableId, payload }) => tableService.updateTable(restaurantId, tableId, payload),
    onSuccess: (_, variables) => {
      // Invalidate both paginated list and specific table detail queries
      queryClient.invalidateQueries({ queryKey: TABLE_QUERY_KEYS.LIST(restaurantId) });
      queryClient.invalidateQueries({
        queryKey: TABLE_QUERY_KEYS.DETAILS(restaurantId, variables.tableId),
      });
      toast.success(TABLE_MESSAGES.UPDATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : TABLE_MESSAGES.UPDATE_FAILED);
    },
  });
}
