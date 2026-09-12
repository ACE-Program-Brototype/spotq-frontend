import { useAuthStore } from "@/features/auth/store/auth.store";
import { SUBSCRIPTION_ENDPOINTS } from "@/features/subscription/constants/subscription.constants";
import { apiClient } from "@/lib/api/client";
import { subscriptionService } from "./subscription.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("subscriptionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  describe("fetchPlans", () => {
    it("should fetch subscription plans", async () => {
      const mockPlans = [
        {
          id: "plan-1",
          code: "QUEUE_PRO",
          name: "Queue Pro",
          priceMonthly: 1999,
          priceYearly: 19990,
          currency: "INR",
          features: ["Real-time queues"],
          isPopular: true,
        },
      ];

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: true, data: mockPlans }),
      });

      const plans = await subscriptionService.fetchPlans();
      expect(apiClient.get).toHaveBeenCalledWith(SUBSCRIPTION_ENDPOINTS.PLANS);
      expect(plans).toEqual(mockPlans);
    });
  });

  describe("createOrder", () => {
    it("should create a Razorpay subscription order using authenticated restaurant", async () => {
      useAuthStore.getState().setAuth(
        {
          id: "rest-123",
          restaurantId: "rest-123",
          email: "owner@restaurant.com",
          fullName: "The Great Grill",
          role: "RESTAURANT_ADMIN",
        },
        "test-token",
      );

      const mockOrderResponse = {
        orderId: "order_123",
        amount: 199900,
        currency: "INR",
        keyId: "rzp_test_key",
        plan: { id: "plan-1", name: "Queue Pro", code: "QUEUE_PRO" },
        restaurant: { id: "rest-123", name: "The Great Grill", email: "owner@restaurant.com" },
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: true, data: mockOrderResponse }),
      });

      const result = await subscriptionService.createOrder("plan-1");

      expect(apiClient.post).toHaveBeenCalledWith(SUBSCRIPTION_ENDPOINTS.CREATE_ORDER, {
        json: {
          planId: "plan-1",
          restaurantId: "rest-123",
          restaurantName: "The Great Grill",
          restaurantEmail: "owner@restaurant.com",
          restaurantPhone: undefined,
        },
      });
      expect(result).toEqual(mockOrderResponse);
    });

    it("should throw an error if no authenticated restaurant exists", async () => {
      await expect(subscriptionService.createOrder("plan-1")).rejects.toThrow(
        "Restaurant identification is required to create a subscription order.",
      );
    });
  });

  describe("verifyPayment", () => {
    it("should verify payment with razorpay details", async () => {
      useAuthStore.getState().setAuth(
        {
          id: "rest-123",
          restaurantId: "rest-123",
          email: "owner@restaurant.com",
          fullName: "The Great Grill",
          role: "RESTAURANT_ADMIN",
        },
        "test-token",
      );

      const mockVerifyResponse = {
        subscriptionId: "sub-123",
        restaurantId: "rest-123",
        planCode: "QUEUE_PRO",
        status: "ACTIVE",
        currentPeriodStart: "2026-09-01T00:00:00Z",
        currentPeriodEnd: "2026-10-01T00:00:00Z",
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: true, data: mockVerifyResponse }),
      });

      const result = await subscriptionService.verifyPayment({
        razorpayOrderId: "order_123",
        razorpayPaymentId: "pay_123",
        razorpaySignature: "sig_123",
      });

      expect(apiClient.post).toHaveBeenCalledWith(SUBSCRIPTION_ENDPOINTS.VERIFY_PAYMENT, {
        json: {
          razorpayOrderId: "order_123",
          razorpayPaymentId: "pay_123",
          razorpaySignature: "sig_123",
          restaurantId: "rest-123",
        },
      });
      expect(result).toEqual(mockVerifyResponse);
    });
  });

  describe("fetchRestaurantStatus", () => {
    it("should fetch real-time restaurant status via centralized endpoint", async () => {
      useAuthStore.getState().setAuth(
        {
          id: "rest-123",
          restaurantId: "rest-123",
          email: "owner@restaurant.com",
          fullName: "The Great Grill",
          role: "RESTAURANT_ADMIN",
        },
        "test-token",
      );

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: {
            isSubscriptionActive: true,
            subscription: {
              id: "sub-123",
              status: "ACTIVE",
              planCode: "QUEUE_PRO",
              planName: "Queue Pro",
              currentPeriodStart: "2026-09-01T00:00:00Z",
              currentPeriodEnd: "2026-10-01T00:00:00Z",
            },
          },
        }),
      });

      const status = await subscriptionService.fetchRestaurantStatus();

      expect(apiClient.get).toHaveBeenCalledWith(`${SUBSCRIPTION_ENDPOINTS.STATUS}/rest-123`);
      expect(status.isSubscriptionActive).toBe(true);
      expect(status.navigationTarget).toBe("/restaurant/dashboard");
    });

    it("should throw error when unauthenticated without falling back to dummy guest", async () => {
      await expect(subscriptionService.fetchRestaurantStatus()).rejects.toThrow(
        "No authenticated restaurant found.",
      );
    });
  });
});
