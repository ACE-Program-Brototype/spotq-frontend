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

  describe("createTable", () => {
    it("posts a trimmed table payload", async () => {
      const response = { success: true, data: { id: "table-1" } };
      const json = jest.fn().mockResolvedValue(response);
      (apiClient.post as jest.Mock).mockReturnValue({ json });

      await expect(
        tableService.createTable(restaurantId, {
          tableCode: " T1 ",
          sectionId: " section-1 ",
          capacity: 4,
          tableShape: "CIRCLE",
        }),
      ).resolves.toEqual(response.data);

      expect(apiClient.post).toHaveBeenCalledWith(TABLE_ENDPOINTS.CREATE(restaurantId), {
        json: { tableCode: "T1", sectionId: "section-1", capacity: 4, tableType: "CIRCLE" },
      });
    });
  });

  describe("getTableSections", () => {
    it("returns the restaurant sections", async () => {
      const response = { success: true, data: { sections: [{ id: "s1", name: "Main" }] } };
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(response),
      });

      await expect(tableService.getTableSections(restaurantId)).resolves.toEqual(
        response.data.sections,
      );
      expect(apiClient.get).toHaveBeenCalledWith(TABLE_ENDPOINTS.TABLE_SECTION(restaurantId));
    });
  });

  describe("getPaginatedTableSections", () => {
    it("fetches paginated table sections", async () => {
      const response = {
        success: true,
        data: {
          mode: "PAGINATED",
          sections: [{ id: "s1", name: "Main" }],
          total: 1,
        },
      };
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(response),
      });

      const result = await tableService.getPaginatedTableSections(restaurantId, {
        page: 1,
        limit: 8,
      });

      expect(apiClient.get).toHaveBeenCalledWith(TABLE_ENDPOINTS.TABLE_SECTION(restaurantId), {
        searchParams: { mode: "PAGINATED", page: 1, limit: 8 },
      });
      expect(result).toEqual(response.data);
    });
  });

  describe("createTableSection", () => {
    it("posts new table section", async () => {
      const payload = { name: "Outdoor Patio" };
      const response = {
        success: true,
        data: { id: "s2", name: "Outdoor Patio" },
      };
      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(response),
      });

      const result = await tableService.createTableSection(restaurantId, payload);

      expect(apiClient.post).toHaveBeenCalledWith(TABLE_ENDPOINTS.TABLE_SECTION(restaurantId), {
        json: { name: "Outdoor Patio" },
      });
      expect(result).toEqual(response.data);
    });
  });

  describe("unlistTableSection", () => {
    it("deletes table section by id", async () => {
      const sectionId = "s2";
      const response = {
        success: true,
        data: { tableSectionId: "s2", name: "Outdoor Patio" },
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

  describe("releaseTables", () => {
    it("sends PATCH request with tables release payload and returns data", async () => {
      const payload = {
        tables: [{ tableId: "table-123", occupancyToRelease: 2 }],
      };
      const releasedData = {
        releasedTables: [
          {
            tableId: "table-123",
            tableCode: "Table 1",
            status: "PARTIAL_OCCUPIED",
            currentOccupancy: 6,
            capacity: 8,
          },
        ],
      };

      (apiClient.patch as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          message: "Table Released Successfully",
          data: releasedData,
          statusCode: 200,
        }),
      });

      const result = await tableService.releaseTables(restaurantId, payload);

      expect(apiClient.patch).toHaveBeenCalledWith(TABLE_ENDPOINTS.RELEASE(restaurantId), {
        json: payload,
      });
      expect(result).toEqual(releasedData);
    });

    it("throws error if restaurantId or tables payload is missing", async () => {
      await expect(
        tableService.releaseTables("", {
          tables: [{ tableId: "table-123", occupancyToRelease: 2 }],
        }),
      ).rejects.toThrow(
        "Restaurant ID and at least one table entry are required to release tables",
      );

      await expect(tableService.releaseTables(restaurantId, { tables: [] })).rejects.toThrow(
        "Restaurant ID and at least one table entry are required to release tables",
      );
    });

    it("throws error when API response indicates failure", async () => {
      (apiClient.patch as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: false,
          message: "Release failed on server",
          statusCode: 400,
        }),
      });

      await expect(
        tableService.releaseTables(restaurantId, {
          tables: [{ tableId: "table-123", occupancyToRelease: 2 }],
        }),
      ).rejects.toThrow("Release failed on server");
    });
  });
});
