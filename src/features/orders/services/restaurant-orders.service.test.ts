import { apiClient } from "@/lib/api/client";
import {
  RESTAURANT_ORDERS_DEFAULTS,
  RESTAURANT_ORDERS_ENDPOINTS,
  RESTAURANT_ORDERS_SERVICE_ERRORS,
} from "../constants/restaurant-orders.constants";
import { restaurantOrdersService } from "./restaurant-orders.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("restaurantOrdersService", () => {
  const restaurantId = "rest-uuid-1234";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOrdersOverview", () => {
    it("throws error when restaurantId is missing", async () => {
      await expect(restaurantOrdersService.getOrdersOverview("")).rejects.toThrow(
        RESTAURANT_ORDERS_SERVICE_ERRORS.OVERVIEW_RESTAURANT_ID_REQUIRED,
      );
    });

    it("fetches orders overview successfully and computes rates", async () => {
      const mockApiResponse = {
        success: true,
        data: {
          summary: {
            total_orders: 100,
            gross_revenue: 25000,
            completed_orders: 85,
            cancelled_orders: 5,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await restaurantOrdersService.getOrdersOverview(restaurantId, {
        from: "2026-11-01T00:00:00.000Z",
        to: "2026-11-04T23:59:59.999Z",
      });

      expect(apiClient.get).toHaveBeenCalledWith(
        RESTAURANT_ORDERS_ENDPOINTS.OVERVIEW(restaurantId),
        {
          searchParams: {
            from: "2026-11-01T00:00:00.000Z",
            to: "2026-11-04T23:59:59.999Z",
          },
        },
      );
      expect(result.totalOrders).toBe(100);
      expect(result.grossRevenue).toBe(25000);
      expect(result.completedOrders).toBe(85);
      expect(result.completedOrdersRate).toBe("85% completion rate");
      expect(result.cancelledOrders).toBe(5);
      expect(result.cancelledOrdersRate).toBe("5.0% cancellation rate");
    });

    it("handles zero total orders with default rate fallbacks", async () => {
      const mockApiResponse = {
        success: true,
        data: {
          summary: {
            total_orders: 0,
            gross_revenue: 0,
            completed_orders: 0,
            cancelled_orders: 0,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await restaurantOrdersService.getOrdersOverview(restaurantId);

      expect(result.completedOrdersRate).toBe(RESTAURANT_ORDERS_DEFAULTS.DEFAULT_COMPLETION_RATE);
      expect(result.cancelledOrdersRate).toBe(RESTAURANT_ORDERS_DEFAULTS.DEFAULT_CANCELLATION_RATE);
    });
  });

  describe("getOrdersList", () => {
    it("throws error when restaurantId is missing", async () => {
      await expect(restaurantOrdersService.getOrdersList("")).rejects.toThrow(
        RESTAURANT_ORDERS_SERVICE_ERRORS.LIST_RESTAURANT_ID_REQUIRED,
      );
    });

    it("fetches orders list with custom params", async () => {
      const mockApiResponse = {
        success: true,
        data: {
          orders: [
            {
              orderId: "ord-1",
              orderNumber: "ORD-001",
              orderStatus: "PLACED",
              orderType: "DINE_IN",
              tableNumber: 2,
              customerName: "Alex",
              customerPhone: "1234567890",
              itemsCount: 1,
              itemsSummary: "Pizza x1",
              grandTotal: 500,
              createdAt: "2026-11-04T10:00:00.000Z",
            },
          ],
          totalOrders: 1,
          totalPages: 1,
          currentPage: 1,
          hasNext: false,
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await restaurantOrdersService.getOrdersList(restaurantId, {
        page: 2,
        limit: 20,
        search: "ORD-001",
        status: "PLACED",
        sortBy: "grandTotal",
        sortOrder: "asc",
      });

      expect(apiClient.get).toHaveBeenCalledWith(RESTAURANT_ORDERS_ENDPOINTS.LIST(restaurantId), {
        searchParams: {
          page: 2,
          limit: 20,
          search: "ORD-001",
          status: "PLACED",
          sortBy: "grandTotal",
          sortOrder: "asc",
        },
      });
      expect(result.orders).toHaveLength(1);
      expect(result.totalOrders).toBe(1);
    });
  });

  describe("getOrderDetail", () => {
    it("throws error when restaurantId or orderId is missing", async () => {
      await expect(restaurantOrdersService.getOrderDetail("", "ord-1")).rejects.toThrow(
        RESTAURANT_ORDERS_SERVICE_ERRORS.DETAIL_IDS_REQUIRED,
      );
      await expect(restaurantOrdersService.getOrderDetail("rest-1", "")).rejects.toThrow(
        RESTAURANT_ORDERS_SERVICE_ERRORS.DETAIL_IDS_REQUIRED,
      );
    });

    it("fetches order details successfully", async () => {
      const mockOrderDetail = {
        orderId: "ord-1",
        orderNumber: "ORD-001",
        orderStatus: "CONFIRMED",
        items: [],
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: true, data: mockOrderDetail }),
      });

      const result = await restaurantOrdersService.getOrderDetail(restaurantId, "ord-1");

      expect(apiClient.get).toHaveBeenCalledWith(
        RESTAURANT_ORDERS_ENDPOINTS.DETAIL(restaurantId, "ord-1"),
      );
      expect(result.orderNumber).toBe("ORD-001");
    });
  });
});

