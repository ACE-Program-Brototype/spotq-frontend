import { apiClient } from "@/lib/api/client";
import { ORDER_DEFAULTS, ORDER_ENDPOINTS } from "../constants/orders.constants";
import { ordersService } from "./orders.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("ordersService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOrderHistory", () => {
    it("calls apiClient.get with default pagination params and returns response data", async () => {
      const mockApiResponse = {
        success: true,
        message: "Order history retrieved successfully",
        data: {
          orders: [
            {
              order_id: "9a123bc4-56de-78fa-9012-3456789abcde",
              order_number: "ORD-20261021-0001",
              restaurant_id: "3dc35af0-3ff5-4ee9-a60a-fbb47124731b",
              restaurant_name: "Spice Garden",
              status: "COMPLETED",
              items_count: 2,
              total_amount: 540.0,
              created_at: "2026-10-21T18:30:00.000Z",
            },
          ],
          pagination: {
            current_page: 1,
            total_pages: 1,
            total_orders: 1,
            has_next: false,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await ordersService.getOrderHistory();

      expect(apiClient.get).toHaveBeenCalledWith(ORDER_ENDPOINTS.HISTORY, {
        searchParams: {
          page: ORDER_DEFAULTS.PAGE,
          limit: ORDER_DEFAULTS.LIMIT,
        },
      });
      expect(result.orders).toHaveLength(1);
      expect(result.orders[0].order_number).toBe("ORD-20261021-0001");
      expect(result.orders[0].restaurant_id).toBe("3dc35af0-3ff5-4ee9-a60a-fbb47124731b");
      expect(result.orders[0].restaurant_name).toBe("Spice Garden");
      expect(result.orders[0].total_amount).toBe(540.0);
      expect(result.pagination.total_pages).toBe(1);
      expect(result.pagination.has_next).toBe(false);
    });

    it("applies status filter parameter when not ALL", async () => {
      const mockApiResponse = {
        success: true,
        message: "Order history retrieved successfully",
        data: {
          orders: [],
          pagination: {
            current_page: 2,
            total_pages: 5,
            total_orders: 45,
            has_next: true,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      await ordersService.getOrderHistory({
        page: 2,
        limit: 10,
        status: "COMPLETED",
      });

      expect(apiClient.get).toHaveBeenCalledWith(ORDER_ENDPOINTS.HISTORY, {
        searchParams: {
          page: 2,
          limit: 10,
          status: "COMPLETED",
        },
      });
    });

    it("omits status param when filter is ALL", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          message: "Order history retrieved successfully",
          data: {
            orders: [],
            pagination: {
              current_page: 1,
              total_pages: 1,
              total_orders: 0,
              has_next: false,
            },
          },
        }),
      });

      await ordersService.getOrderHistory({
        page: 1,
        limit: 10,
        status: "ALL",
      });

      expect(apiClient.get).toHaveBeenCalledWith(ORDER_ENDPOINTS.HISTORY, {
        searchParams: {
          page: 1,
          limit: 10,
        },
      });
    });
  });
});
