import { apiClient } from "@/lib/api/client";
import { TABLE_ENDPOINTS } from "../constants/table.constants";
import { tableService } from "./table.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("tableService", () => {
  const restaurantId = "23193584-340b-40bf-963e-ac67cbbebd08";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTablesBySection", () => {
    it("fetches tables grouped by section", async () => {
      const mockResponse = {
        success: true,
        message: "Table Fetched Successfully",
        statusCode: 200,
        data: {
          sections: {
            Dining: [
              {
                id: "6eefd8a8-fa42-4564-b993-a7d3914ef1d1",
                tableCode: "T1",
                capacity: 2,
                status: "AVAILABLE",
                sectionId: "5b2d0e5e-7152-4e7d-8447-00b67bff25e5",
                tableShape: "SQUARE",
                currentOccupancy: 0,
                isActive: true,
              },
            ],
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await tableService.getTablesBySection(restaurantId);

      expect(apiClient.get).toHaveBeenCalledWith(TABLE_ENDPOINTS.LIST(restaurantId));
      expect(result).toEqual(mockResponse.data.sections);
    });

    it("throws error if restaurantId is missing", async () => {
      await expect(tableService.getTablesBySection("")).rejects.toThrow(
        "Restaurant ID is required to fetch tables",
      );
    });
  });

  describe("updateTable", () => {
    it("sends PATCH request with update payload", async () => {
      const tableId = "table-123";
      const payload = {
        tableCode: "T-05",
        capacity: 4,
        sectionId: "section-uuid",
        type: "CIRCLE" as const,
      };
      const mockResponse = {
        success: true,
        message: "Table updated successfully",
        data: {
          id: tableId,
          tableCode: "T-05",
          capacity: 4,
          sectionId: "section-uuid",
          tableShape: "CIRCLE",
          status: "AVAILABLE",
          currentOccupancy: 0,
          isActive: true,
        },
      };

      (apiClient.patch as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await tableService.updateTable(restaurantId, tableId, payload);

      expect(apiClient.patch).toHaveBeenCalledWith(TABLE_ENDPOINTS.UPDATE(restaurantId, tableId), {
        json: {
          tableCode: "T-05",
          capacity: 4,
          sectionId: "section-uuid",
          type: "CIRCLE",
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("throws error if restaurantId or tableId is missing", async () => {
      await expect(tableService.updateTable("", "table-123", {})).rejects.toThrow(
        "Restaurant ID and table ID are required to fetch table details",
      );
    });

    it("throws error when API returns success: false", async () => {
      (apiClient.patch as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: false, message: "Duplicate table code" }),
      });

      await expect(
        tableService.updateTable(restaurantId, "table-123", { tableCode: "T-dup" }),
      ).rejects.toThrow("Duplicate table code");
    });
  });

  describe("deleteTable", () => {
    it("sends DELETE request for soft delete", async () => {
      const tableId = "table-123";
      const mockResponse = {
        success: true,
        message: "Table deleted successfully",
      };

      (apiClient.delete as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await tableService.deleteTable(restaurantId, tableId);

      expect(apiClient.delete).toHaveBeenCalledWith(TABLE_ENDPOINTS.DELETE(restaurantId, tableId));
      expect(result).toEqual({ success: true, message: "Table deleted successfully" });
    });

    it("throws error if restaurantId or tableId is missing", async () => {
      await expect(tableService.deleteTable("", "table-123")).rejects.toThrow(
        "Restaurant ID and table ID are required to fetch table details",
      );
    });

    it("throws error when API returns success: false", async () => {
      (apiClient.delete as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: false,
          message: "Cannot delete table while it is occupied",
        }),
      });

      await expect(tableService.deleteTable(restaurantId, "table-123")).rejects.toThrow(
        "Cannot delete table while it is occupied",
      );
    });
  });

  describe("getTableSections", () => {
    it("fetches table sections successfully", async () => {
      const mockResponse = {
        success: true,
        message: "Table Section fetched successfully",
        statusCode: 200,
        data: {
          mode: "ALL",
          sections: [
            { id: "sec-1", name: "Patio" },
            { id: "sec-2", name: "Rooftop" },
          ],
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await tableService.getTableSections(restaurantId);

      expect(apiClient.get).toHaveBeenCalledWith(TABLE_ENDPOINTS.TABLE_SECTION(restaurantId));
      expect(result).toEqual(mockResponse.data.sections);
    });

    it("throws error if restaurantId is missing", async () => {
      await expect(tableService.getTableSections("")).rejects.toThrow(
        "Restaurant ID is required to fetch table sections",
      );
    });
  });

  describe("createTableSection", () => {
    it("sends POST request to create a section", async () => {
      const payload = { name: "Rooftop" };
      const response = {
        success: true,
        data: { id: "sec-1", name: "Rooftop" },
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(response),
      });

      const result = await tableService.createTableSection(restaurantId, payload);

      expect(apiClient.post).toHaveBeenCalledWith(TABLE_ENDPOINTS.TABLE_SECTION(restaurantId), {
        json: { name: "Rooftop" },
      });
      expect(result).toEqual(response.data);
    });
  });

  describe("unlistTableSection", () => {
    it("sends DELETE request to unlist section", async () => {
      const sectionId = "sec-1";
      const response = {
        success: true,
        data: { tableSectionId: sectionId, name: "Rooftop" },
      };

      (apiClient.delete as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(response),
      });

      const result = await tableService.unlistTableSection(restaurantId, sectionId);

      expect(apiClient.delete).toHaveBeenCalledWith(
        TABLE_ENDPOINTS.TABLE_SECTION_DELETE(restaurantId, sectionId),
      );
      expect(result).toEqual(response.data);
    });
  });

  describe("updateTableStatus", () => {
    it("sends PATCH request with status payload", async () => {
      const tableId = "table-123";
      const mockResponse = {
        success: true,
        message: "Table status updated successfully",
        statusCode: 200,
      };

      (apiClient.patch as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await tableService.updateTableStatus(restaurantId, tableId, "MAINTENANCE");

      expect(apiClient.patch).toHaveBeenCalledWith(
        TABLE_ENDPOINTS.UPDATE_STATUS(restaurantId, tableId),
        { json: { status: "MAINTENANCE" } },
      );
      expect(result).toEqual(mockResponse);
    });

    it("throws error if restaurantId or tableId is missing", async () => {
      await expect(tableService.updateTableStatus("", "table-123", "AVAILABLE")).rejects.toThrow(
        "Restaurant ID and Table ID are required to update status",
      );
    });
  });
});
