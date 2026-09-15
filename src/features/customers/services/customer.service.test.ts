import { apiClient } from "@/lib/api/client";
import { customerService } from "./customer.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

describe("customerService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCustomers", () => {
    it("should fetch customers with default params", async () => {
      const mockResponse = {
        success: true,
        message: "Customers retrieved successfully.",
        data: {
          users: [
            {
              id: "user-1",
              fullName: "Rahul Sharma",
              email: "rahul@example.com",
              phone: "+919876543210",
              status: "ACTIVE",
              isEmailVerified: true,
              avatarUrl: null,
              createdAt: "2023-01-15T10:00:00.000Z",
              updatedAt: "2023-01-15T10:00:00.000Z",
            },
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
        statusCode: 200,
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await customerService.getCustomers();

      expect(apiClient.get).toHaveBeenCalledWith(
        "users",
        expect.objectContaining({
          searchParams: {
            page: 1,
            limit: 20,
            sortBy: "createdAt",
            sortOrder: "DESC",
          },
        }),
      );
      expect(result.users).toHaveLength(1);
      expect(result.users[0].fullName).toBe("Rahul Sharma");
    });

    it("should handle response when data is directly an array of customers", async () => {
      const mockResponse = {
        success: true,
        message: "Customers retrieved successfully.",
        data: [
          {
            id: "user-2",
            fullname: "Al Ameen",
            email: "alameen@example.com",
            phone: "+919876543211",
            status: "ACTIVE",
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
        statusCode: 200,
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await customerService.getCustomers();

      expect(result.users).toHaveLength(1);
      expect(result.users[0].id).toBe("user-2");
      expect(result.users[0].fullName).toBe("Al Ameen");
      expect(result.pagination.total).toBe(1);
    });

    it("should handle response when data contains items array", async () => {
      const mockResponse = {
        success: true,
        message: "Customers retrieved successfully.",
        data: {
          items: [
            {
              id: "user-3",
              fullname: "Jane Doe",
              email: "jane@example.com",
              phone: null,
              status: "BLOCKED",
            },
          ],
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
        statusCode: 200,
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await customerService.getCustomers();

      expect(result.users).toHaveLength(1);
      expect(result.users[0].id).toBe("user-3");
      expect(result.users[0].status).toBe("BLOCKED");
      expect(result.pagination.total).toBe(1);
    });

    it("should append search and status filter when provided", async () => {
      const mockResponse = {
        success: true,
        message: "Customers retrieved",
        data: {
          users: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
        statusCode: 200,
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      await customerService.getCustomers({
        page: 2,
        limit: 10,
        search: "priya",
        status: "ACTIVE",
        sortBy: "createdAt",
        sortOrder: "ASC",
      });

      expect(apiClient.get).toHaveBeenCalledWith(
        "users",
        expect.objectContaining({
          searchParams: {
            page: 2,
            limit: 10,
            search: "priya",
            status: "ACTIVE",
            sortBy: "createdAt",
            sortOrder: "ASC",
          },
        }),
      );
    });
  });

  describe("updateCustomerStatus", () => {
    it("should send PATCH request to update status", async () => {
      const mockResponse = {
        success: true,
        message: "Customer blocked successfully.",
        data: {
          id: "user-123",
          status: "BLOCKED",
          updatedAt: "2026-09-10T12:00:00.000Z",
        },
        statusCode: 200,
      };

      (apiClient.patch as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await customerService.updateCustomerStatus({
        userId: "user-123",
        status: "BLOCKED",
      });

      expect(apiClient.patch).toHaveBeenCalledWith("users/user-123/status", {
        json: { status: "BLOCKED" },
      });
      expect(result.status).toBe("BLOCKED");
    });
  });
});
