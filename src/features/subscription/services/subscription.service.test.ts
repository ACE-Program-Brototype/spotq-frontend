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

  describe("getSubscriptionHistory", () => {
    it("should throw error if restaurantId is missing", async () => {
      await expect(subscriptionService.getSubscriptionHistory("")).rejects.toThrow(
        "Restaurant identification is required to retrieve billing history.",
      );
    });

    it("should fetch subscription billing history with pagination and status filters", async () => {
      const mockHistoryData = {
        transactions: [
          {
            id: "tx-1",
            planCode: "QUEUE_PRO",
            planName: "Queue Pro",
            billingCycle: "MONTHLY" as const,
            amountPaise: 199900,
            amountRupees: 1999,
            currency: "INR",
            status: "SUCCESS" as const,
            razorpayPaymentId: "pay_123",
            invoiceNumber: "INV-2026-0001",
            invoiceUrl: "https://s3.amazonaws.com/test-invoice.pdf",
            createdAt: "2026-11-08T10:00:00Z",
          },
        ],
        pagination: {
          currentPage: 2,
          pageSize: 10,
          totalRecords: 15,
          totalPages: 2,
          hasNextPage: false,
          hasPrevPage: true,
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockHistoryData,
        }),
      });

      const result = await subscriptionService.getSubscriptionHistory("rest-123", {
        page: 2,
        limit: 10,
        status: "SUCCESS",
      });

      expect(apiClient.get).toHaveBeenCalledWith(
        SUBSCRIPTION_ENDPOINTS.HISTORY("rest-123"),
        expect.objectContaining({
          searchParams: expect.any(URLSearchParams),
        }),
      );

      const calledSearchParams = (apiClient.get as jest.Mock).mock.calls[0][1]
        .searchParams as URLSearchParams;
      expect(calledSearchParams.get("page")).toBe("2");
      expect(calledSearchParams.get("limit")).toBe("10");
      expect(calledSearchParams.get("status")).toBe("SUCCESS");
      expect(result).toEqual(mockHistoryData);
    });

    it("should omit status query param when status is ALL", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: {
            transactions: [],
            pagination: {
              currentPage: 1,
              pageSize: 10,
              totalRecords: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPrevPage: false,
            },
          },
        }),
      });

      await subscriptionService.getSubscriptionHistory("rest-123", {
        page: 1,
        limit: 10,
        status: "ALL",
      });

      const calledSearchParams = (apiClient.get as jest.Mock).mock.calls[0][1]
        .searchParams as URLSearchParams;
      expect(calledSearchParams.get("page")).toBe("1");
      expect(calledSearchParams.get("limit")).toBe("10");
      expect(calledSearchParams.has("status")).toBe(false);
    });
  });
});
