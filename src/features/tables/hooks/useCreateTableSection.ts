import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TABLE_SECTION_MESSAGES } from "../constants/table.constants";
import { tableService } from "../services/table.service";
import type { CreateTableSectionPayload } from "../types/table.types";

export function useCreateTableSection(restaurantId: string) {
  const queryClient = useQueryClient();
  const normalizedRestaurantId = (restaurantId ?? "").trim();

  return useMutation({
    mutationFn: (payload: CreateTableSectionPayload) =>
      tableService.createTableSection(normalizedRestaurantId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tables", normalizedRestaurantId, "sections"],
        }),
      ]);
      toast.success(TABLE_SECTION_MESSAGES.CREATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : TABLE_SECTION_MESSAGES.CREATE_FAILED,
      );
    },
  });
}
