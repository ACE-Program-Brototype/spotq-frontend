import { apiClient } from "@/lib/api/client";
import { subscriptionApi } from "./subscription.api";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("subscriptionApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchPlans", () => {
    it("fetches subscription plans successfully", async () => {
      const mockPlans = [
        {
          id: "plan-1",
          code: "QUEUE_PRO",
          name: "Queue Pro",
          pricePaise: 149900,
          priceInRupees: 1499,
          currency: "INR",
          billingCycle: "MONTHLY",
          features: ["Feature 1"],
        },
      ];

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockPlans,
        }),
      });

      const result = await subscriptionApi.fetchPlans();

      expect(apiClient.get).toHaveBeenCalledWith("payments/plans");
      expect(result).toEqual(mockPlans);
    });
  });

  describe("createOrder", () => {
    it("creates a subscription order successfully", async () => {
      const mockOrder = {
        orderId: "order_123",
        amount: 149900,
        currency: "INR",
        keyId: "rzp_test_key",
        plan: { id: "plan-1", name: "Queue Pro", code: "QUEUE_PRO" },
        restaurant: { name: "Tasty Bite", email: "res@bite.com" },
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockOrder,
        }),
      });

      const result = await subscriptionApi.createOrder("plan-1");

      expect(apiClient.post).toHaveBeenCalledWith("payments/subscriptions/order", {
        json: { planId: "plan-1" },
      });
      expect(result).toEqual(mockOrder);
    });
  });

  describe("verifyPayment", () => {
    it("verifies payment successfully", async () => {
      const mockVerification = {
        subscriptionId: "sub-123",
        restaurantId: "res-123",
        planCode: "QUEUE_PRO",
        status: "ACTIVE",
        currentPeriodStart: "2026-09-01T00:00:00Z",
        currentPeriodEnd: "2026-10-01T00:00:00Z",
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockVerification,
        }),
      });

      const payload = {
        razorpayOrderId: "order_123",
        razorpayPaymentId: "pay_123",
        razorpaySignature: "sig_123",
      };

      const result = await subscriptionApi.verifyPayment(payload);

      expect(apiClient.post).toHaveBeenCalledWith("payments/subscriptions/verify", {
        json: payload,
      });
      expect(result).toEqual(mockVerification);
    });
  });

  describe("fetchRestaurantStatus", () => {
    it("fetches restaurant status data successfully", async () => {
      const mockStatus = {
        restaurantId: "res-1",
        restaurantName: "Spicy Treats",
        verificationStatus: "APPROVED",
        isSubscriptionActive: false,
        subscriptionPlanCode: null,
        subscriptionEndsAt: null,
        navigationTarget: "/restaurant/subscription",
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockStatus,
        }),
      });

      const result = await subscriptionApi.fetchRestaurantStatus();

      expect(apiClient.get).toHaveBeenCalledWith("restaurants/me/status");
      expect(result).toEqual(mockStatus);
    });
  });
});
