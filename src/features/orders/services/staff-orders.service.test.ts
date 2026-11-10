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
    patch: jest.fn(),
  },
}));

describe("staffOrdersService", () => {
  const restaurantId = "rest-uuid-1234";
  const orderId = "ord-uuid-5678";

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

  describe("getStaffOrderDetail", () => {
    it("throws error when restaurantId is missing", async () => {
      await expect(staffOrdersService.getStaffOrderDetail("", orderId)).rejects.toThrow(
        STAFF_ORDERS_MESSAGES.RESTAURANT_ID_REQUIRED,
      );
    });

    it("throws error when orderId is missing", async () => {
      await expect(staffOrdersService.getStaffOrderDetail(restaurantId, "")).rejects.toThrow(
        STAFF_ORDERS_MESSAGES.ORDER_ID_REQUIRED,
      );
    });

    it("fetches and normalizes snake_case order details response", async () => {
      const mockApiResponse = {
        success: true,
        message: "Order details fetched",
        data: {
          order_id: "ord-uuid-5678",
          order_number: "ORD-8899",
          status: "CONFIRMED" as const,
          customer_notes: "Please pack sauce separately",
          created_at: "2026-11-08T12:00:00.000Z",
          items: [
            {
              menu_item_id: "m-1",
              name: "Chicken Supreme Pizza",
              variant_id: "v-1",
              variant_name: "Medium 10 inch",
              quantity: 2,
              special_instructions: "Crispy crust please",
              addons: [
                {
                  addon_id: "add-1",
                  name: "Extra Cheese",
                },
              ],
            },
          ],
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await staffOrdersService.getStaffOrderDetail(restaurantId, orderId);

      expect(apiClient.get).toHaveBeenCalledWith(
        STAFF_ORDERS_ENDPOINTS.DETAILS(restaurantId, orderId),
      );
      expect(result.id).toBe("ord-uuid-5678");
      expect(result.orderNumber).toBe("ORD-8899");
      expect(result.status).toBe("CONFIRMED");
      expect(result.customerNotes).toBe("Please pack sauce separately");
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("Chicken Supreme Pizza");
      expect(result.items[0].variant?.name).toBe("Medium 10 inch");
      expect(result.items[0].addons[0].name).toBe("Extra Cheese");
      expect(result.items[0].specialInstructions).toBe("Crispy crust please");
      expect(result.totalQuantity).toBe(2);
    });

    it("fetches and normalizes camelCase order details response", async () => {
      const mockApiResponse = {
        success: true,
        message: "Order details fetched",
        data: {
          orderId: "ord-uuid-5678",
          orderNumber: "ORD-1234",
          status: "PREPARING" as const,
          orderType: "SELF_PRO" as const,
          customerNotes: null,
          tableNumber: 5,
          createdAt: "2026-11-08T12:30:00.000Z",
          items: [
            {
              menuItemId: "m-2",
              name: "Avocado Toast",
              quantity: 1,
              variant: null,
              addons: [],
              specialInstructions: null,
            },
          ],
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await staffOrdersService.getStaffOrderDetail(restaurantId, orderId);

      expect(result.orderNumber).toBe("ORD-1234");
      expect(result.status).toBe("PREPARING");
      expect(result.tableNumber).toBe(5);
      expect(result.orderType).toBe("SELF_PRO");
      expect(result.totalQuantity).toBe(1);
    });
  });

  describe("updateStaffOrderStatus", () => {
    it("throws error when orderId is missing", async () => {
      await expect(
        staffOrdersService.updateStaffOrderStatus({
          orderId: "",
          status: "PREPARING",
        }),
      ).rejects.toThrow(STAFF_ORDERS_MESSAGES.ORDER_ID_REQUIRED);
    });

    it("sends PATCH request to update order status", async () => {
      const mockResponse = {
        success: true,
        message: "Status updated",
        data: {
          orderId,
          previousStatus: "CONFIRMED" as const,
          status: "PREPARING" as const,
        },
      };

      (apiClient.patch as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await staffOrdersService.updateStaffOrderStatus({
        orderId,
        status: "PREPARING",
        notes: "Started food prep",
      });

      expect(apiClient.patch).toHaveBeenCalledWith(STAFF_ORDERS_ENDPOINTS.UPDATE_STATUS(orderId), {
        json: {
          status: "PREPARING",
          notes: "Started food prep",
        },
      });
      expect(result.status).toBe("PREPARING");
    });
  });
});
