import type { CustomerOrderDetails } from "@/features/orders/types/customer-order-details.types";
import type { OrderReceipt } from "@/features/orders/types/order-receipt.types";
import { apiClient } from "@/lib/api/client";
import { orderService } from "./order.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockOrderReceipt: OrderReceipt = {
  order_id: "ord_992817203",
  order_number: "SQ-101",
  restaurant: {
    restaurant_id: "rest_65f2a1b9e12345",
    name: "Spice Garden Cafe",
  },
  status: "COMPLETED",
  items: [
    {
      menu_item_id: "item_pizza_01",
      name: "Margherita Pizza",
      variant_id: "var_large_12",
      variant_name: "Large (12 inch)",
      addons: [],
      quantity: 2,
      unit_price: 350.0,
      line_total: 820.0,
      special_instructions: null,
    },
  ],
  sub_total: 820.0,
  tax_amount: 41.0,
  platform_fee: 2.0,
  total_amount: 863.0,
  created_at: "2026-10-06T13:50:00.000Z",
};

const mockCustomerOrder: CustomerOrderDetails = {
  order_id: "220e777c-69b4-4c56-a0fe-b9e276678322",
  order_number: "ORD-MWAOYWC4-D83312",
  restaurant: {
    restaurant_id: "3dc35af0-3ff5-4ee9-a60a-fbb47124731b",
    name: "Al-Reem",
  },
  order_type: "QUEUE_ORDER",
  status: "CONFIRMED",
  created_at: "2026-11-10T12:54:05.621Z",
  updated_at: "2026-11-10T12:54:34.497Z",
  table_number: null,
  queue_entry_id: "1f662c4a-d484-4e35-ad79-da6c3642df71",
  special_instructions: "Extra crispy please",
  items: [
    {
      menu_item_id: "2f04e02b-7194-47cb-91f0-fa336cb3498e",
      name: "Chicken Biriyani",
      quantity: 2,
      unit_price: 180,
      variant: {
        variant_id: "deaf7aa6-fa00-43ac-afff-e277c7a8c19c",
        name: "Regular (1 Person)",
      },
      addons: [
        {
          addon_id: "addon-1",
          name: "Extra Raita",
          price: 20,
        },
      ],
      line_total: 400,
    },
  ],
  pricing: {
    subtotal: 360,
    discounts: 0,
    taxes: 18,
    platform_fee: 0,
    grand_total: 378,
    currency: "INR",
  },
  payment: {
    status: "PAID",
    method: "ONLINE",
    payment_id: "pay_982319238",
    amount_paid: 378,
  },
  status_history: [
    {
      previous_status: null,
      current_status: "PLACED",
      notes: "Order placed by customer",
      created_at: "2026-11-10T12:54:05.620Z",
    },
    {
      previous_status: "PLACED",
      current_status: "CONFIRMED",
      notes: "Payment captured via gateway",
      created_at: "2026-11-10T12:54:34.545Z",
    },
  ],
};

describe("orderService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCustomerOrderDetails", () => {
    it("returns customer order details when API succeeds with nested order data", async () => {
      const mockApiResponse = {
        success: true,
        statusCode: 200,
        message: "Order details retrieved successfully",
        data: {
          order: mockCustomerOrder,
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await orderService.getCustomerOrderDetails(
        "220e777c-69b4-4c56-a0fe-b9e276678322",
      );

      expect(apiClient.get).toHaveBeenCalledWith("orders/220e777c-69b4-4c56-a0fe-b9e276678322");
      expect(result.order_id).toBe("220e777c-69b4-4c56-a0fe-b9e276678322");
      expect(result.order_number).toBe("ORD-MWAOYWC4-D83312");
      expect(result.pricing.grand_total).toBe(378);
      expect(result.payment.status).toBe("PAID");
      expect(result.status_history.length).toBe(2);
    });

    it("throws error when API fails", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockRejectedValue(new Error("404 Not Found")),
      });

      await expect(orderService.getCustomerOrderDetails("invalid-id")).rejects.toThrow(
        "404 Not Found",
      );
    });
  });

  describe("getOrderReceipt", () => {
    it("returns adapted receipt when API returns nested customer order data", async () => {
      const mockApiResponse = {
        success: true,
        data: {
          order: mockCustomerOrder,
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await orderService.getOrderReceipt("220e777c-69b4-4c56-a0fe-b9e276678322");

      expect(result.order_id).toBe("220e777c-69b4-4c56-a0fe-b9e276678322");
      expect(result.restaurant.name).toBe("Al-Reem");
      expect(result.total_amount).toBe(378);
    });

    it("returns live order receipt data when API succeeds with flat data", async () => {
      const mockApiResponse = {
        success: true,
        data: {
          ...mockOrderReceipt,
          order_id: "ord_live_123",
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await orderService.getOrderReceipt("ord_live_123");

      expect(apiClient.get).toHaveBeenCalledWith("orders/ord_live_123");
      expect(result.order_id).toBe("ord_live_123");
      expect(result.restaurant.name).toBe("Spice Garden Cafe");
    });

    it("throws error when API fails", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockRejectedValue(new Error("404 Not Found")),
      });

      await expect(orderService.getOrderReceipt("ord_123")).rejects.toThrow("404 Not Found");
    });

    it("throws error when response data is missing", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: false, data: null }),
      });

      await expect(orderService.getOrderReceipt("ord_123")).rejects.toThrow(
        "Order receipt not found",
      );
    });
  });

  describe("cancelOrder", () => {
    it("successfully sends cancel order request and returns cancelled data", async () => {
      const mockResponse = {
        success: true,
        statusCode: 200,
        message: "Order cancelled successfully",
        data: {
          order_id: "ord_cancel_123",
          order_number: "ORD-MVJQTNFL-54089E",
          status: "CANCELLED",
          cancellation_reason: "Changed my mind",
          cancelled_at: "2026-10-22T21:02:15.290Z",
        },
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await orderService.cancelOrder("ord_cancel_123", {
        cancellation_reason: "Changed my mind",
      });

      expect(apiClient.post).toHaveBeenCalledWith("orders/ord_cancel_123/cancel", {
        json: { cancellation_reason: "Changed my mind" },
      });
      expect(result.status).toBe("CANCELLED");
      expect(result.order_id).toBe("ord_cancel_123");
      expect(result.cancellation_reason).toBe("Changed my mind");
    });

    it("throws error when API call fails", async () => {
      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockRejectedValue(new Error("409 Conflict")),
      });

      await expect(
        orderService.cancelOrder("ord_cancel_123", {
          cancellation_reason: "Changed my mind",
        }),
      ).rejects.toThrow("409 Conflict");
    });
  });
});
