import { useQuery } from "@tanstack/react-query";
import { TABLE_QUERY_KEYS } from "../constants/table.constants";
import { tableService } from "../services/table.service";

export function useTableSections(restaurantId: string) {
  const normalizedRestaurantId = restaurantId.trim();

  const query = useQuery({
    queryKey: [...TABLE_QUERY_KEYS.LIST(normalizedRestaurantId), "sections"],
    queryFn: () => tableService.getTableSections(normalizedRestaurantId),
    enabled: Boolean(normalizedRestaurantId),
  });

  const sections = query.data ?? [];

  return { ...query, sections };
}
