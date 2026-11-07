import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TABLE_QUERY_KEYS, TABLE_SECTION_MESSAGES } from "../constants/table.constants";
import { tableService } from "../services/table.service";

export function useDeleteTableSection(restaurantId: string) {
  const queryClient = useQueryClient();
  const normalizedRestaurantId = (restaurantId ?? "").trim();

  return useMutation({
    mutationFn: (sectionId: string) =>
      tableService.unlistTableSection(normalizedRestaurantId, sectionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: TABLE_QUERY_KEYS.SECTIONS(normalizedRestaurantId),
      });
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

export const useUnlistTableSection = useDeleteTableSection;
