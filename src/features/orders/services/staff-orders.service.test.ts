import { apiClient } from "@/lib/api/client";
import {
  STAFF_ORDER_FILTER_STATUS,
  STAFF_ORDERS_DEFAULTS,
  STAFF_ORDERS_ENDPOINTS,
  STAFF_ORDERS_MESSAGES,
} from "../constants/staff-orders.constants";
import { staffOrdersService } from "./staff-orders.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("staffOrdersService", () => {
  const restaurantId = "rest-uuid-1234";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getStaffOrdersList", () => {
    it("throws error when restaurantId is missing or empty", async () => {
      await expect(staffOrdersService.getStaffOrdersList("")).rejects.toThrow(
        STAFF_ORDERS_MESSAGES.RESTAURANT_ID_REQUIRED,
      );
    });

    it("fetches orders list with default parameters", async () => {
      const mockApiResponse = {
        success: true,
        data: {
          orders: [
            {
              id: "ord-1",
              orderNumber: "ORD-001",
              orderType: "QUEUE_PRO" as const,
              status: "PLACED" as const,
              createdAt: "2026-11-08T10:00:00.000Z",
              queueId: "q-1",
              items: [],
            },
          ],
          pagination: {
            page: 1,
            limit: 12,
            total: 1,
            totalPages: 1,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await staffOrdersService.getStaffOrdersList(restaurantId);

      expect(apiClient.get).toHaveBeenCalledWith(STAFF_ORDERS_ENDPOINTS.LIST(restaurantId), {
        searchParams: {
          page: STAFF_ORDERS_DEFAULTS.PAGE,
          limit: STAFF_ORDERS_DEFAULTS.LIMIT,
          sortOrder: STAFF_ORDERS_DEFAULTS.SORT_ORDER,
        },
      });
      expect(result.orders).toHaveLength(1);
      expect(result.orders[0].orderNumber).toBe("ORD-001");
      expect(result.pagination.total).toBe(1);
    });

    it("passes search, status, orderType, and pagination filters correctly", async () => {
      const mockApiResponse = {
        success: true,
        data: {
          orders: [],
          pagination: { page: 2, limit: 10, total: 0, totalPages: 0 },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      await staffOrdersService.getStaffOrdersList(restaurantId, {
        search: "ORD-99",
        status: "PREPARING",
        orderType: "QUEUE_PRO",
        sortOrder: "desc",
        page: 2,
        limit: 10,
      });

      expect(apiClient.get).toHaveBeenCalledWith(STAFF_ORDERS_ENDPOINTS.LIST(restaurantId), {
        searchParams: {
          search: "ORD-99",
          status: "PREPARING",
          orderType: "QUEUE_PRO",
          sortOrder: "desc",
          page: 2,
          limit: 10,
        },
      });
    });

    it("omits status when filter is 'ALL'", async () => {
      const mockApiResponse = {
        success: true,
        data: {
          orders: [],
          pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      await staffOrdersService.getStaffOrdersList(restaurantId, {
        status: STAFF_ORDER_FILTER_STATUS.ALL,
      });

      expect(apiClient.get).toHaveBeenCalledWith(STAFF_ORDERS_ENDPOINTS.LIST(restaurantId), {
        searchParams: {
          page: STAFF_ORDERS_DEFAULTS.PAGE,
          limit: STAFF_ORDERS_DEFAULTS.LIMIT,
          sortOrder: STAFF_ORDERS_DEFAULTS.SORT_ORDER,
        },
      });
    });
  });
});
