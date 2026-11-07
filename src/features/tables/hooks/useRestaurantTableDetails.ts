import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { TABLE_QUERY_KEYS } from "../constants/table.constants";
import { tableService } from "../services/table.service";
import type { RestaurantTableDetails } from "../types/table.types";

export function useRestaurantTableDetails(restaurantId?: string, tableId?: string) {
  const navigate = useNavigate();
  const query = useQuery<RestaurantTableDetails, Error>({
    queryKey: TABLE_QUERY_KEYS.DETAILS(restaurantId ?? "", tableId ?? ""),
    queryFn: () => {
      if (!restaurantId?.trim() || !tableId?.trim()) {
        throw new Error("Restaurant ID and table ID are required to fetch table details");
      }

      return tableService.getTableDetails(restaurantId.trim(), tableId.trim());
    },
    enabled: Boolean(restaurantId?.trim() && tableId?.trim()),
  });

  useEffect(() => {
    if (!query.isError) return;

    toast.error(query.error?.message || "Failed to load table details.");
    navigate(RESTAURANT_ROUTES.TABLE.ROOT, { replace: true });
  }, [navigate, query.error, query.isError]);

  return {
    ...query,
    table: query.data,
  };
}
