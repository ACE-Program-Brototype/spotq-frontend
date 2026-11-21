import { apiClient } from "@/lib/api/client";
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

  describe("getCheckoutDetails", () => {
    it("fetches checkout details without query params when decoded from JWT", async () => {
      const mockCheckoutData = {
        cartId: "test-cart-id",
        restaurantId: "test-restaurant-id",
        restaurantName: "Spice Garden Cafe",
        payment: { mode: "ONLINE" as const, paymentRequired: true },
        itemCount: 1,
        subtotal: 200,
        taxAmount: 10,
        grandTotal: 210,
        items: [],
      };

      const mockResponse = {
        success: true,
        data: mockCheckoutData,
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await checkoutService.getCheckoutDetails();

      expect(apiClient.get).toHaveBeenCalledWith("orders/checkout", {
        searchParams: undefined,
      });
      expect(result).toEqual(mockCheckoutData);
    });

    it("fetches checkout details with query params if provided", async () => {
      const mockCheckoutData = {
        cartId: "test-cart-id",
        restaurantId: "test-restaurant-id",
        restaurantName: "Spice Garden Cafe",
        payment: { mode: "ONLINE" as const, paymentRequired: true },
        itemCount: 1,
        subtotal: 200,
        taxAmount: 10,
        grandTotal: 210,
        items: [],
      };

      const mockResponse = {
        success: true,
        data: mockCheckoutData,
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await checkoutService.getCheckoutDetails({
        cartId: "test-cart-id",
        restaurantId: "test-restaurant-id",
      });

      expect(apiClient.get).toHaveBeenCalledWith(
        "orders/checkout",
        expect.objectContaining({
          searchParams: expect.any(URLSearchParams),
        }),
      );
      expect(result).toEqual(mockCheckoutData);
    });

    it("throws error when checkout details fail to load", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockRejectedValue(new Error("Cart not found")),
      });

      await expect(
        checkoutService.getCheckoutDetails({ cartId: "invalid-cart-id" }),
      ).rejects.toThrow("Cart not found");
    });
  });

  describe("placeOrder", () => {
    it("posts payload and returns order placement response with paymentDraft", async () => {
      const payload = {
        restaurantId: "test-restaurant-id",
        cartId: "test-cart-id",
        paymentMode: "ONLINE" as const,
        userName: "Alex Morgan",
        userPhone: "+91 9876543210",
      };

      const mockResponse = {
        success: true,
        data: {
          id: "ord-999",
          orderId: "ord-999",
          orderNumber: "#ORD-9999",
          restaurantId: payload.restaurantId,
          restaurantName: "Spice Garden Cafe",
          grandTotal: 1913,
          paymentMode: "ONLINE" as const,
          paymentStatus: "PENDING" as const,
          orderStatus: "PLACED" as const,
          orderingMode: "SELF_ORDER" as const,
          paymentDraft: {
            paymentId: "pay-123",
            orderId: "ord-999",
            razorpayOrderId: "order_rzp_999",
            amountPaise: 191300,
            currency: "INR",
            keyId: "rzp_test_123",
          },
          items: [],
          createdAt: new Date().toISOString(),
        },
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await checkoutService.placeOrder(payload);

      expect(apiClient.post).toHaveBeenCalledWith("orders", {
        json: payload,
        headers: {
          "x-idempotency-key": expect.any(String),
        },
      });
      expect(result.success).toBe(true);
      expect(result.data.orderNumber).toBe("#ORD-9999");
      expect(result.data.paymentDraft?.razorpayOrderId).toBe("order_rzp_999");
    });

    it("throws error when order placement fails on backend", async () => {
      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockRejectedValue(new Error("Payment failed")),
      });

      const payload = {
        restaurantId: "test-restaurant-id",
        cartId: "test-cart-id",
        paymentMode: "ONLINE" as const,
      };

      await expect(checkoutService.placeOrder(payload)).rejects.toThrow("Payment failed");
    });
  });

  describe("verifyOrderPayment", () => {
    it("posts payment verification payload to payments/orders/verify", async () => {
      const payload = {
        orderId: "ord-999",
        razorpayOrderId: "order_rzp_999",
        razorpayPaymentId: "pay_rzp_123",
        razorpaySignature: "sig_abc",
      };

      const mockResponse = {
        success: true,
        data: {
          paymentId: "pay-123",
          orderId: "ord-999",
          gatewayPaymentId: "pay_rzp_123",
          status: "CAPTURED",
          verifiedAt: new Date().toISOString(),
        },
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await checkoutService.verifyOrderPayment(payload);

      expect(apiClient.post).toHaveBeenCalledWith("payments/orders/verify", { json: payload });
      expect(result.success).toBe(true);
      expect(result.data.status).toBe("CAPTURED");
    });
  });
});
