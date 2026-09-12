import { STAFF_ENDPOINTS } from "@/features/staff/constants/staff.constants";
import { apiClient } from "@/lib/api/client";
import { normalizeStaffDetail, staffDetailService } from "./staff-detail.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("staffDetailService", () => {
  const mockGet = apiClient.get as jest.Mock;

  const mockRawData = {
    id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
    fullname: "John Owner",
    restaurantId: "rest_id",
    avatar_url: "key",
    email: "owner@spotq.com",
    phone: "+1234567890",
    role: "STAFF",
    status: "ACTIVE",
    createdAt: "2026-09-09T18:58:55.316Z",
    updatedAt: "2026-09-09T18:58:55.316Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("normalizeStaffDetail", () => {
    it("correctly normalizes API data with snake_case and camelCase fallbacks", () => {
      const normalized = normalizeStaffDetail(mockRawData, "fallback_rest");
      expect(normalized).toEqual({
        id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
        restaurantId: "rest_id",
        fullName: "John Owner",
        email: "owner@spotq.com",
        phone: "+1234567890",
        avatarUrl: "key",
        role: "STAFF",
        status: "ACTIVE",
        createdAt: "2026-09-09T18:58:55.316Z",
        updatedAt: "2026-09-09T18:58:55.316Z",
      });
    });

    it("handles missing optional values gracefully", () => {
      const normalized = normalizeStaffDetail(
        {
          id: "stf-123",
          email: "test@example.com",
          role: "WAITER",
          status: "inactive",
        },
        "default_res",
      );

      expect(normalized.fullName).toBe("Staff Member");
      expect(normalized.restaurantId).toBe("default_res");
      expect(normalized.status).toBe("INACTIVE");
      expect(normalized.phone).toBeNull();
      expect(normalized.avatarUrl).toBeNull();
    });
  });

  describe("getStaffDetail", () => {
    it("calls apiClient.get with correct endpoint and returns normalized staff detail", async () => {
      mockGet.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          message: "Staff member details retrieved successfully",
          data: mockRawData,
          statusCode: 200,
        }),
      });

      const res = await staffDetailService.getStaffDetail("rest_id", "stf_01");

      expect(mockGet).toHaveBeenCalledWith(
        STAFF_ENDPOINTS.STAFF_DETAIL_BY_RESTAURANT("rest_id", "stf_01"),
      );
      expect(res.fullName).toBe("John Owner");
      expect(res.email).toBe("owner@spotq.com");
      expect(res.status).toBe("ACTIVE");
    });
  });
});
