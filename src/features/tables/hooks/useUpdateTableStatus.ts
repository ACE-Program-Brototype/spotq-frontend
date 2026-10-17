import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TABLE_MESSAGES, TABLE_QUERY_KEYS } from "../constants/table.constants";
import { tableService } from "../services/table.service";
import type { StaffUpdatableStatus } from "../types/table.types";

interface UpdateStatusParams {
  tableId: string;
  tableCode: string;
  status: StaffUpdatableStatus;
}

/**
 * Hook to update a table's status (AVAILABLE <-> MAINTENANCE).
 * Automatically refreshes table data upon success.
 */
export function useUpdateTableStatus(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tableId, status }: UpdateStatusParams) =>
      tableService.updateTableStatus(restaurantId, tableId, status),
    onSuccess: (_, { tableCode, status }) => {
      queryClient.invalidateQueries({
        queryKey: TABLE_QUERY_KEYS.LIST(restaurantId),
      });
      toast.success(TABLE_MESSAGES.STATUS_UPDATE_SUCCESS(tableCode, status));
    },
    onError: (err: Error) => {
      toast.error(err.message || TABLE_MESSAGES.STATUS_UPDATE_FAILED);
    },
  });
}
