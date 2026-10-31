import { apiClient } from "@/lib/api/client";
import { TABLE_ENDPOINTS } from "../constants/table.constants";
import { tableService } from "./table.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
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
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await tableService.getTablesBySection(restaurantId);

      expect(apiClient.get).toHaveBeenCalledWith(TABLE_ENDPOINTS.LIST(restaurantId));
      expect(result).toEqual(mockResponse.sections);
    });

    it("throws error if restaurantId is missing", async () => {
      await expect(tableService.getTablesBySection("")).rejects.toThrow(
        "Restaurant ID is required to fetch tables",
      );
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
