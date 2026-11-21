import { useQuery } from "@tanstack/react-query";
import { TABLE_QUERY_KEYS } from "@/features/tables/constants/table.constants";
import { tableService } from "@/features/tables/services/table.service";

export function useTableSections(restaurantId: string) {
  const normalizedRestaurantId = (restaurantId ?? "").trim();

  const query = useQuery({
    queryKey: TABLE_QUERY_KEYS.SECTIONS(normalizedRestaurantId),
    queryFn: () => tableService.getTableSections(normalizedRestaurantId),
    enabled: Boolean(normalizedRestaurantId),
  });

  const sections = query.data ?? [];

  return { ...query, sections };
}
