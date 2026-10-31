import type { SuccessResponse } from "@/components/common";
import { apiClient } from "@/lib/api/client";
import { TABLE_ENDPOINTS, TABLE_SERVICE_ERRORS } from "../constants/table.constants";
import type {
  AdminTables,
  CreateTablePayload,
  CreateTableResponse,
  GetTableSectionResponse,
  GetTablesResponse,
  RestaurantTableDetails,
  StaffUpdatableStatus,
  TableItem,
  TableSectionAll,
  TableStatus,
  TablesGroupedBySection,
  UpdateTableStatusResponse,
} from "../types/table.types";

export const tableService = {
  async createTable(restaurantId: string, payload: CreateTablePayload): Promise<TableItem> {
    if (!restaurantId) {
      throw new Error(TABLE_SERVICE_ERRORS.CREATE_RESTAURANT_ID_REQUIRED);
    }

    const response = await apiClient
      .post(TABLE_ENDPOINTS.LIST(restaurantId), {
        json: {
          tableCode: payload.tableCode.trim(),
          capacity: payload.capacity,
          sectionId: payload.sectionId.trim(),
          tableType: payload.tableShape,
        },
      })
      .json<CreateTableResponse>();

    if (!response.success) {
      throw new Error(response.message || TABLE_SERVICE_ERRORS.CREATE_FAILED);
    }

    return response.data;
  },

  async getTableDetails(restaurantId: string, tableId: string): Promise<RestaurantTableDetails> {
    if (!restaurantId || !tableId) {
      throw new Error(TABLE_SERVICE_ERRORS.DETAILS_IDS_REQUIRED);
    }

    const response = await apiClient
      .get(TABLE_ENDPOINTS.DETAILS(restaurantId, tableId))
      .json<SuccessResponse<RestaurantTableDetails>>();

    return response.data;
  },

  async getTables(
    restaurantId: string,
    searchParams: { page: number; limit: number; status?: TableStatus },
  ): Promise<AdminTables> {
    if (!restaurantId) {
      throw new Error(TABLE_SERVICE_ERRORS.LIST_RESTAURANT_ID_REQUIRED);
    }

    const response = await apiClient
      .get(TABLE_ENDPOINTS.LIST(restaurantId), { searchParams })
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

    return response.sections || {};
  },

  async getTableSections(restaurantId: string): Promise<TableSectionAll[]> {
    if (!restaurantId) {
      throw new Error(TABLE_SERVICE_ERRORS.SECTIONS_RESTAURANT_ID_REQUIRED);
    }

    const response = await apiClient
      .get(TABLE_ENDPOINTS.TABLE_SECTION(restaurantId))
      .json<SuccessResponse<GetTableSectionResponse>>();

    return response.data.sections || [];
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
      throw new Error(TABLE_SERVICE_ERRORS.UPDATE_IDS_REQUIRED);
    }

    return apiClient
      .patch(TABLE_ENDPOINTS.UPDATE_STATUS(restaurantId, tableId), {
        json: { status },
      })
      .json<UpdateTableStatusResponse>();
  },
};
