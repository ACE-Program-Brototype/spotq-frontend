import { apiClient } from "@/lib/api/client";
import { ADMIN_ORDERS_DEFAULTS, ADMIN_ORDERS_ENDPOINTS } from "../constants/admin-orders.constants";
import { adminOrdersService } from "./admin-orders.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("adminOrdersService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAdminOrders", () => {
    it("fetches orders list with default parameters", async () => {
      const mockApiResponse = {
        success: true,
        data: {
          orders: [
            {
              orderId: "ord-uuid-1",
              orderNumber: "ORD-2026-001",
              restaurantId: "rest-uuid-1",
              restaurantName: "Burger Spot",
              customerId: "cust-uuid-1",
              status: "PLACED" as const,
              paymentStatus: "PAID" as const,
              subtotal: 350,
              taxAmount: 17.5,
              totalAmount: 367.5,
              platformFeeAssessed: 15,
              paymentReference: "pay-uuid-1",
              createdAt: "2026-11-11T10:00:00.000Z",
              updatedAt: "2026-11-11T10:05:00.000Z",
            },
          ],
          pagination: {
            currentPage: 1,
            limit: 25,
            totalPages: 1,
            totalOrders: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          metrics: {
            totalOrders: 1,
            ordersByStatus: { PLACED: 1 },
            totalOrderValue: 367.5,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await adminOrdersService.getAdminOrders();

      expect(apiClient.get).toHaveBeenCalledWith(ADMIN_ORDERS_ENDPOINTS.LIST, {
        searchParams: {
          page: ADMIN_ORDERS_DEFAULTS.PAGE,
          limit: ADMIN_ORDERS_DEFAULTS.LIMIT,
          sortBy: ADMIN_ORDERS_DEFAULTS.SORT_BY,
          sortOrder: ADMIN_ORDERS_DEFAULTS.SORT_ORDER,
        },
      });

      expect(result.orders).toHaveLength(1);
      expect(result.orders[0].orderNumber).toBe("ORD-2026-001");
      expect(result.orders[0].paymentReference).toBe("pay-uuid-1");
      expect(result.metrics.totalOrderValue).toBe(367.5);
    });

    it("passes custom search, status, paymentStatus, and date filters correctly", async () => {
      const mockApiResponse = {
        success: true,
        data: {
          orders: [],
          pagination: {
            currentPage: 2,
            limit: 10,
            totalPages: 5,
            totalOrders: 50,
            hasNextPage: true,
            hasPreviousPage: true,
          },
          metrics: {
            totalOrders: 50,
            ordersByStatus: { COMPLETED: 40 },
            totalOrderValue: 25000,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      await adminOrdersService.getAdminOrders({
        search: "Burger",
        status: "COMPLETED",
        paymentStatus: "PAID",
        restaurantId: "rest-1",
        customerId: "cust-1",
        startDate: "2026-11-01T00:00:00.000Z",
        endDate: "2026-11-11T23:59:59.999Z",
        minAmount: 100,
        maxAmount: 1000,
        sortBy: "totalAmount",
        sortOrder: "asc",
        page: 2,
        limit: 10,
      });

      expect(apiClient.get).toHaveBeenCalledWith(ADMIN_ORDERS_ENDPOINTS.LIST, {
        searchParams: {
          search: "Burger",
          status: "COMPLETED",
          paymentStatus: "PAID",
          restaurantId: "rest-1",
          customerId: "cust-1",
          startDate: "2026-11-01T00:00:00.000Z",
          endDate: "2026-11-11T23:59:59.999Z",
          minAmount: 100,
          maxAmount: 1000,
          sortBy: "totalAmount",
          sortOrder: "asc",
          page: 2,
          limit: 10,
        },
      });
    });

    it("handles empty or null response gracefully with default fallbacks", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: true, data: null }),
      });

      const result = await adminOrdersService.getAdminOrders();

      expect(result.orders).toEqual([]);
      expect(result.pagination.totalOrders).toBe(0);
      expect(result.metrics.totalOrders).toBe(0);
    });
  });
});
