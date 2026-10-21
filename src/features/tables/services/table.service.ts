import type { SuccessResponse } from "@/components/common";
import { apiClient } from "@/lib/api/client";
import { TABLE_ENDPOINTS } from "../constants/table.constants";
import type {
  AdminTables,
  GetTablesResponse,
  StaffUpdatableStatus,
  TablesGroupedBySection,
  UpdateTableStatusResponse,
} from "../types/table.types";

export const tableService = {
  async getTables(restaurantId: string): Promise<AdminTables> {
    if (!restaurantId) {
      throw new Error("Restaurant Id is requried to fetch tables");
    }

    const response = await apiClient
      .get(TABLE_ENDPOINTS.LIST(restaurantId))
      .json<SuccessResponse<AdminTables>>();

    return response.data;
  },

  /**
   * Fetches tables for a restaurant grouped by sections.
   * Endpoint: GET /api/v1/restaurants/{restaurantId}/table
   */
  async getTablesBySection(restaurantId: string): Promise<TablesGroupedBySection> {
    if (!restaurantId) {
      throw new Error("Restaurant ID is required to fetch tables");
    }

    const response = await apiClient
      .get(TABLE_ENDPOINTS.LIST(restaurantId))
      .json<GetTablesResponse>();

    return response?.data?.sections || {};
  },

  /**
   * Updates status of a specific table.
   * Endpoint: PATCH /api/v1/restaurants/{restaurantId}/table/{tableId}/status
   * Body: { status: "AVAILABLE" | "MAINTENANCE" }
   */
  async updateTableStatus(
    restaurantId: string,
    tableId: string,
    status: StaffUpdatableStatus,
  ): Promise<UpdateTableStatusResponse> {
    if (!restaurantId || !tableId) {
      throw new Error("Restaurant ID and Table ID are required to update status");
    }

    return apiClient
      .patch(TABLE_ENDPOINTS.UPDATE_STATUS(restaurantId, tableId), {
        json: { status },
      })
      .json<UpdateTableStatusResponse>();
  },
};
