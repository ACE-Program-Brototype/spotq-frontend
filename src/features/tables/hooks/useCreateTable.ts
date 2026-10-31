import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TABLE_QUERY_KEYS } from "../constants/table.constants";
import { tableService } from "../services/table.service";
import type { CreateTablePayload } from "../types/table.types";

export function useCreateTable(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTablePayload) => tableService.createTable(restaurantId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TABLE_QUERY_KEYS.LIST(restaurantId) });
      toast.success("Table created successfully.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to create table.");
    },
  });
}
