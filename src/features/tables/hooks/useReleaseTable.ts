import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TABLE_MESSAGES, TABLE_QUERY_KEYS } from "../constants/table.constants";
import { tableService } from "../services/table.service";
import type { ReleaseTablesPayload } from "../types/table.types";

interface ReleaseTableParams {
  tableId: string;
  tableCode: string;
  occupancyToRelease: number;
}

/**
 * Hook to release partial or full occupancy from a table.
 * Automatically refreshes floor table data and summary counts upon success.
 */
export function useReleaseTable(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tableId, occupancyToRelease }: ReleaseTableParams) => {
      const payload: ReleaseTablesPayload = {
        tables: [{ tableId, occupancyToRelease }],
      };
      return tableService.releaseTables(restaurantId, payload);
    },
    onSuccess: (_, { tableCode, occupancyToRelease }) => {
      queryClient.invalidateQueries({
        queryKey: TABLE_QUERY_KEYS.LIST(restaurantId),
      });
      toast.success(TABLE_MESSAGES.RELEASE_SUCCESS(tableCode, occupancyToRelease));
    },
    onError: (err: Error) => {
      toast.error(err.message || TABLE_MESSAGES.RELEASE_FAILED);
    },
  });
}
