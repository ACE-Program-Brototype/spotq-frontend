import { useQuery } from "@tanstack/react-query";
import type { SuccessResponse } from "@/components/common";
import { apiClient } from "@/lib/api/client";
import { TABLE_ENDPOINTS, TABLE_QUERY_KEYS } from "../constants/table.constants";
import type { TableItem, TableStatus } from "../types/table.types";

type AdminTablesQueryOptions = {
  page: number;
  limit: number;
  status: "ALL" | TableStatus;
};

type TableListResponse = {
  tables?: TableItem[];

  total?: number;
  stats?: TableStats;
};

type TableStats = {
  totalTables?: number;
  occupied?: number;
  available?: number;
  maintenance?: number;
};

export const useRestaurantAdminTables = (
  restaurantId: string,
  { page, limit, status }: AdminTablesQueryOptions,
) => {
  const query = useQuery({
    queryKey: [...TABLE_QUERY_KEYS.LIST(restaurantId), page, limit, status],
    queryFn: async () => {
      const searchParams: Record<string, string | number> = { page, limit };
      if (status !== "ALL") searchParams.status = status;

      return apiClient
        .get(TABLE_ENDPOINTS.LIST(restaurantId), { searchParams })
        .json<SuccessResponse<TableListResponse>>();
    },
    enabled: Boolean(restaurantId),
    placeholderData: (previousData) => previousData,
  });

  const payload = query.data?.data;
  const tables = payload?.tables ?? [];

  return {
    ...query,
    tables,
    stats: payload?.stats,
    total: payload?.total ?? 0,
  };
};
