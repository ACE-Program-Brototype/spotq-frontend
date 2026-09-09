import { useAuthStore } from "@/features/auth/store/auth.store";
import { SUBSCRIPTION_ENDPOINTS } from "@/features/subscription/constants/subscription.constants";
import type {
  ApiResponse,
  CreateSubscriptionOrderResponse,
  RestaurantStatusData,
  SubscriptionPlan,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "@/features/subscription/types/subscription.types";
import { apiClient } from "@/lib/api/client";

export const subscriptionApi = {
  async fetchPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient
      .get(SUBSCRIPTION_ENDPOINTS.PLANS)
      .json<ApiResponse<SubscriptionPlan[]>>();
    return response.data;
  },

  async createOrder(planId: string): Promise<CreateSubscriptionOrderResponse> {
    const user = useAuthStore.getState().user as {
      id?: string;
      restaurantId?: string;
      name?: string;
      email?: string;
      phone?: string;
    } | null;
    const restaurantId = user?.restaurantId || user?.id || "a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

    const response = await apiClient
      .post(SUBSCRIPTION_ENDPOINTS.CREATE_ORDER, {
        json: {
          planId,
          restaurantId,
          restaurantName: user?.name || "SpotQ Partner Restaurant",
          restaurantEmail: user?.email || "partner@spotq.com",
          restaurantPhone: user?.phone || "+919876543210",
        },
      })
      .json<ApiResponse<CreateSubscriptionOrderResponse>>();
    return response.data;
  },

  async verifyPayment(data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    const user = useAuthStore.getState().user as { id?: string; restaurantId?: string } | null;
    const restaurantId =
      data.restaurantId || user?.restaurantId || user?.id || "a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

    const response = await apiClient
      .post(SUBSCRIPTION_ENDPOINTS.VERIFY_PAYMENT, {
        json: { ...data, restaurantId },
      })
      .json<ApiResponse<VerifyPaymentResponse>>();
    return response.data;
  },

  async fetchRestaurantStatus(restaurantIdOverride?: string): Promise<RestaurantStatusData> {
    const user = useAuthStore.getState().user as {
      id?: string;
      restaurantId?: string;
      name?: string;
      email?: string;
    } | null;
    const restaurantId = restaurantIdOverride || user?.restaurantId || user?.id;

    if (!restaurantId) {
      return {
        restaurantId: "guest",
        restaurantName: "SpotQ Partner Restaurant",
        verificationStatus: "APPROVED",
        isSubscriptionActive: false,
        subscriptionPlanCode: null,
        subscriptionEndsAt: null,
        navigationTarget: "/restaurant/subscription",
      };
    }

    try {
      const response = await apiClient.get(`payments/subscriptions/status/${restaurantId}`).json<{
        success: boolean;
        data: {
          isSubscriptionActive: boolean;
          subscription?: {
            id: string;
            status: string;
            planCode: string;
            planName: string;
            currentPeriodStart: string;
            currentPeriodEnd: string;
          } | null;
        };
      }>();

      const isSubActive = Boolean(response.data?.isSubscriptionActive);
      const sub = response.data?.subscription;

      return {
        restaurantId,
        restaurantName: user?.name || "SpotQ Partner Restaurant",
        verificationStatus: "APPROVED",
        isSubscriptionActive: isSubActive,
        subscriptionPlanCode: sub?.planCode || null,
        subscriptionEndsAt: sub?.currentPeriodEnd || null,
        navigationTarget: isSubActive ? "/restaurant/dashboard" : "/restaurant/subscription",
      };
    } catch {
      return {
        restaurantId,
        restaurantName: user?.name || "SpotQ Partner Restaurant",
        verificationStatus: "APPROVED",
        isSubscriptionActive: false,
        subscriptionPlanCode: null,
        subscriptionEndsAt: null,
        navigationTarget: "/restaurant/subscription",
      };
    }
  },
};
