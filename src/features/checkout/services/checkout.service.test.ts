import { apiClient } from "@/lib/api/client";
import { CHECKOUT_DEFAULTS, MOCK_CART_DATA } from "../constants/checkout.constants";
import { checkoutService } from "./checkout.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
  },
}));

describe("checkoutService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCart", () => {
    it("returns cart data when API call succeeds", async () => {
      const mockResponse = {
        success: true,
        data: MOCK_CART_DATA,
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await checkoutService.getCart(CHECKOUT_DEFAULTS.CART_ID);

      expect(apiClient.get).toHaveBeenCalledWith(`orders/carts/${CHECKOUT_DEFAULTS.CART_ID}`);
      expect(result).toEqual(MOCK_CART_DATA);
    });

    it("throws error when network or backend fails", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockRejectedValue(new Error("Cart not found")),
      });

      await expect(checkoutService.getCart("invalid-cart-id")).rejects.toThrow("Cart not found");
    });
  });

  describe("placeOrder", () => {
    it("posts payload and returns order placement response", async () => {
      const payload = {
        restaurantId: CHECKOUT_DEFAULTS.RESTAURANT_ID,
        cartId: CHECKOUT_DEFAULTS.CART_ID,
        paymentMode: "ONLINE" as const,
        userName: "Alex Morgan",
        userPhone: "9876543210",
        order_type: "SELF_SERVICE_TABLE" as const,
        orderType: "SELF_SERVICE_TABLE" as const,
        tableNumber: 4,
      };

      const mockResponse = {
        success: true,
        data: {
          orderId: "ord-999",
          orderNumber: "#ORD-9999",
          restaurantId: payload.restaurantId,
          restaurantName: "Spice Garden Cafe",
          totalAmount: 1913,
          paymentMode: "ONLINE" as const,
          orderType: "SELF_SERVICE_TABLE" as const,
          createdAt: new Date().toISOString(),
        },
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await checkoutService.placeOrder(payload);

      expect(apiClient.post).toHaveBeenCalledWith("orders", { json: payload });
      expect(result.success).toBe(true);
      expect(result.data.orderNumber).toBe("#ORD-9999");
    });

    it("throws error when order placement fails on backend", async () => {
      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockRejectedValue(new Error("Payment failed")),
      });

      const payload = {
        restaurantId: CHECKOUT_DEFAULTS.RESTAURANT_ID,
        cartId: CHECKOUT_DEFAULTS.CART_ID,
        paymentMode: "ONLINE" as const,
        order_type: "SELF_SERVICE_TABLE" as const,
        orderType: "SELF_SERVICE_TABLE" as const,
      };

      await expect(checkoutService.placeOrder(payload)).rejects.toThrow("Payment failed");
    });
  });
});
