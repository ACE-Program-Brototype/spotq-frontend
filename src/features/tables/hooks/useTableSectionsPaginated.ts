import { useQuery } from "@tanstack/react-query";
import { TABLE_QUERY_KEYS } from "../constants/table.constants";
import { tableService } from "../services/table.service";

export function useTableSectionsPaginated(restaurantId: string, page = 1, limit = 8) {
  const normalizedRestaurantId = (restaurantId ?? "").trim();

  return useQuery({
    queryKey: TABLE_QUERY_KEYS.SECTIONS_PAGINATED(normalizedRestaurantId, page, limit),
    queryFn: () => tableService.getPaginatedTableSections(normalizedRestaurantId, { page, limit }),
    enabled: Boolean(normalizedRestaurantId),
    placeholderData: (previousData) => previousData,
  });
}
