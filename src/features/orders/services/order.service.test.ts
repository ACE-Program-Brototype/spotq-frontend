import { MOCK_ORDER_RECEIPT } from "@/features/orders/mocks/order-receipt.mock";
import { apiClient } from "@/lib/api/client";
import { orderService } from "./order.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("orderService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOrderReceipt", () => {
    it("returns live order receipt data when API succeeds", async () => {
      const mockApiResponse = {
        success: true,
        data: {
          ...MOCK_ORDER_RECEIPT,
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
