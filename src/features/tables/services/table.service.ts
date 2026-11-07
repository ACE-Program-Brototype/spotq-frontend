import type { SuccessResponse } from "@/components/common";
import { apiClient } from "@/lib/api/client";
import { TABLE_ENDPOINTS, TABLE_SERVICE_ERRORS } from "../constants/table.constants";
import type {
  AdminTables,
  CreateTablePayload,
  CreateTableSectionPayload,
  DeleteTableResponse,
  DeleteTableSectionResponse,
  GetTableSectionResponse,
  GetTablesResponse,
  PaginatedTableSectionsData,
  RestaurantTableDetails,
  StaffUpdatableStatus,
  TableItem,
  TableSectionAll,
  TableStatus,
  TablesGroupedBySection,
  UpdateTablePayload,
  UpdateTableStatusResponse,
} from "../types/table.types";

export const tableService = {
  async createTable(restaurantId: string, payload: CreateTablePayload): Promise<TableItem> {
    if (!restaurantId) {
      throw new Error(TABLE_SERVICE_ERRORS.CREATE_RESTAURANT_ID_REQUIRED);
    }

    const response = await apiClient
      .post(TABLE_ENDPOINTS.CREATE(restaurantId), {
        json: {
          tableCode: payload.tableCode.trim(),
          capacity: payload.capacity,
          sectionId: payload.sectionId.trim(),
          tableType: payload.tableShape,
        },
      })
      .json<SuccessResponse<TableItem>>();

    if (!response.success) {
      throw new Error(response.message || TABLE_SERVICE_ERRORS.CREATE_FAILED);
    }

    return response.data;
  },

  /**
   * Updates table metadata (code, capacity, section, shape).
   * Endpoint: PATCH /api/v1/restaurants/{restaurantId}/table/{tableId}
   */
  async updateTable(
    restaurantId: string,
    tableId: string,
    payload: UpdateTablePayload,
  ): Promise<TableItem> {
    if (!restaurantId || !tableId) {
      throw new Error(TABLE_SERVICE_ERRORS.DETAILS_IDS_REQUIRED);
    }

    const response = await apiClient
      .patch(TABLE_ENDPOINTS.UPDATE(restaurantId, tableId), {
        json: {
          ...(payload.tableCode ? { tableCode: payload.tableCode.trim() } : {}),
          ...(payload.capacity !== undefined ? { capacity: payload.capacity } : {}),
          ...(payload.sectionId ? { sectionId: payload.sectionId.trim() } : {}),
          ...(payload.type ? { type: payload.type } : {}),
        },
      })
      .json<SuccessResponse<TableItem>>();

    if (!response.success) {
      throw new Error(response.message || TABLE_SERVICE_ERRORS.UPDATE_FAILED);
    }

    return response.data;
  },

  /**
   * Soft deletes a table by removing it from active floor rotation.
   * Endpoint: DELETE /api/v1/restaurants/{restaurantId}/table/{tableId}
   */
  async deleteTable(restaurantId: string, tableId: string): Promise<DeleteTableResponse> {
    if (!restaurantId || !tableId) {
      throw new Error(TABLE_SERVICE_ERRORS.DETAILS_IDS_REQUIRED);
    }

    const response = await apiClient
      .delete(TABLE_ENDPOINTS.DELETE(restaurantId, tableId))
      .json<SuccessResponse<DeleteTableResponse>>();

    if (!response.success) {
      throw new Error(response.message || TABLE_SERVICE_ERRORS.DELETE_FAILED);
    }

    return response.data || { success: true, message: response.message };
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
      throw new Error(TABLE_SERVICE_ERRORS.LIST_RESTAURANT_ID_REQUIRED);
    }

    const response = await apiClient
      .get(TABLE_ENDPOINTS.LIST(restaurantId))
      .json<SuccessResponse<GetTablesResponse>>();

    return response.data.sections || {};
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

  async getPaginatedTableSections(
    restaurantId: string,
    params: { page: number; limit: number },
  ): Promise<PaginatedTableSectionsData> {
    if (!restaurantId) {
      throw new Error(TABLE_SERVICE_ERRORS.SECTIONS_RESTAURANT_ID_REQUIRED);
    }

    const response = await apiClient
      .get(TABLE_ENDPOINTS.TABLE_SECTION(restaurantId), {
        searchParams: { mode: "PAGINATED", page: params.page, limit: params.limit },
      })
      .json<SuccessResponse<PaginatedTableSectionsData>>();

    return response.data;
  },

  async createTableSection(
    restaurantId: string,
    payload: CreateTableSectionPayload,
  ): Promise<TableSectionAll> {
    if (!restaurantId) {
      throw new Error(TABLE_SERVICE_ERRORS.SECTIONS_RESTAURANT_ID_REQUIRED);
    }

    const response = await apiClient
      .post(TABLE_ENDPOINTS.TABLE_SECTION(restaurantId), {
        json: { name: payload.name.trim() },
      })
      .json<SuccessResponse<TableSectionAll>>();

    return response.data;
  },

  async unlistTableSection(
    restaurantId: string,
    sectionId: string,
  ): Promise<DeleteTableSectionResponse> {
    if (!restaurantId || !sectionId) {
      throw new Error(TABLE_SERVICE_ERRORS.DELETE_SECTION_IDS_REQUIRED);
    }

    const response = await apiClient
      .delete(TABLE_ENDPOINTS.TABLE_SECTION_DELETE(restaurantId, sectionId))
      .json<SuccessResponse<DeleteTableSectionResponse>>();

    return response.data;
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
