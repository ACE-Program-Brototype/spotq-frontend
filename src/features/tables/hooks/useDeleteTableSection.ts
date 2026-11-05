import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TABLE_SECTION_MESSAGES } from "../constants/table.constants";
import { tableService } from "../services/table.service";

export function useDeleteTableSection(restaurantId: string) {
  const queryClient = useQueryClient();
  const normalizedRestaurantId = (restaurantId ?? "").trim();

  return useMutation({
    mutationFn: (sectionId: string) =>
      tableService.deleteTableSection(normalizedRestaurantId, sectionId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tables", normalizedRestaurantId, "sections"],
        }),
      ]);
      toast.success(TABLE_SECTION_MESSAGES.DELETE_SUCCESS);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : TABLE_SECTION_MESSAGES.DELETE_FAILED,
      );
    },
  });
}
