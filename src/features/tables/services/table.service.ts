import type { SuccessResponse } from "@/components/common";
import { apiClient } from "@/lib/api/client";
import { TABLE_ENDPOINTS, TABLE_SERVICE_ERRORS } from "../constants/table.constants";
import type {
  AdminTables,
  CreateTablePayload,
  CreateTableSectionPayload,
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

  async deleteTableSection(
    restaurantId: string,
    sectionId: string,
  ): Promise<DeleteTableSectionResponse> {
    if (!restaurantId || !sectionId) {
      throw new Error("Restaurant ID and Section ID are required to delete a section");
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
