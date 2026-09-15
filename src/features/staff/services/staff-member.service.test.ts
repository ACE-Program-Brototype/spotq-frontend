import { STAFF_ENDPOINTS } from "@/features/staff/constants/staff.constants";
import { apiClient } from "@/lib/api/client";
import { staffMemberService } from "./staff-member.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("staffMemberService", () => {
  const mockGet = apiClient.get as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getStaffMembers", () => {
    const mockRestaurantId = "rest-123";

    it("returns error result if restaurantId is missing", async () => {
      const res = await staffMemberService.getStaffMembers("");

      expect(res.success).toBe(false);
      expect(res.message).toBe("Restaurant ID is required");
      expect(res.data).toEqual([]);
      expect(mockGet).not.toHaveBeenCalled();
    });

    it("calls apiClient.get with correct endpoint, searchParams, and headers", async () => {
      const mockBackendStaff = [
        {
          id: "staff-1",
          fullname: "Jane Doe",
          email: "jane@example.com",
          status: "ACTIVE",
          phone: "1234567890",
          role: "Manager",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ];

      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      mockGet.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          message: "Staff members retrieved successfully",
          data: mockBackendStaff,
          pagination: mockPagination,
        }),
      });

      const res = await staffMemberService.getStaffMembers(mockRestaurantId, {
        page: 1,
        limit: 10,
        status: "ACTIVE",
        search: "Jane",
        sortBy: "createdAt",
        sortOrder: "DESC",
      });

      expect(mockGet).toHaveBeenCalledWith(
        STAFF_ENDPOINTS.STAFF_LIST_BY_RESTAURANT(mockRestaurantId),
        {
          searchParams: {
            page: 1,
            limit: 10,
            status: "ACTIVE",
            search: "Jane",
            sortBy: "createdAt",
            sortOrder: "DESC",
          },
          headers: {
            "x-restaurant-id": mockRestaurantId,
          },
        },
      );

      expect(res.success).toBe(true);
      expect(res.data).toHaveLength(1);
      expect(res.data[0]).toEqual({
        id: "staff-1",
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "1234567890",
        designation: "Manager",
        status: "ACTIVE",
        joinedDate: "2026-01-01T00:00:00.000Z",
        lastLogin: "2026-01-01T00:00:00.000Z",
        employeeCode: "EMP-TAFF-1",
      });
      expect(res.pagination).toEqual(mockPagination);
    });

    it("handles empty array or missing pagination gracefully", async () => {
      mockGet.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          data: [],
        }),
      });

      const res = await staffMemberService.getStaffMembers(mockRestaurantId);

      expect(res.success).toBe(true);
      expect(res.data).toEqual([]);
      expect(res.pagination.total).toBe(0);
    });
  });
});
