import { useQuery } from "@tanstack/react-query";
import { TABLE_QUERY_KEYS, TABLE_STATUS } from "@/features/tables/constants/table.constants";
import { tableService } from "@/features/tables/services/table.service";
import type { TableStatusIncludingAll } from "@/features/tables/types/table.types";

interface RestaurantAdminTablesOptions {
  page: number;
  limit: number;
  status: TableStatusIncludingAll;
}

export function useRestaurantAdminTables(
  restaurantId: string,
  { page, limit, status }: RestaurantAdminTablesOptions,
) {
  const normalizedRestaurantId = restaurantId.trim();

  const query = useQuery({
    queryKey: [...TABLE_QUERY_KEYS.LIST(normalizedRestaurantId), page, limit, status],
    queryFn: () =>
      tableService.getTables(normalizedRestaurantId, {
        page,
        limit,
        ...(status !== TABLE_STATUS.ALL && { status }),
      }),
    enabled: Boolean(normalizedRestaurantId),
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    tables: query.data?.tables ?? [],
    stats: query.data?.stats,
    total: query.data?.total ?? 0,
  };
}
