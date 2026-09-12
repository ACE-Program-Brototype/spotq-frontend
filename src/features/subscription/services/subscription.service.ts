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

export const subscriptionService = {
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
      fullName?: string;
      name?: string;
      email?: string;
      phone?: string;
    } | null;

    const restaurantId = user?.restaurantId || user?.id;
    if (!restaurantId) {
      throw new Error("Restaurant identification is required to create a subscription order.");
    }

    const response = await apiClient
      .post(SUBSCRIPTION_ENDPOINTS.CREATE_ORDER, {
        json: {
          planId,
          restaurantId,
          restaurantName: user?.fullName || user?.name,
          restaurantEmail: user?.email,
          restaurantPhone: user?.phone,
        },
      })
      .json<ApiResponse<CreateSubscriptionOrderResponse>>();
    return response.data;
  },

  async verifyPayment(data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    const user = useAuthStore.getState().user as { id?: string; restaurantId?: string } | null;
    const restaurantId = data.restaurantId || user?.restaurantId || user?.id;

    if (!restaurantId) {
      throw new Error("Restaurant identification is required to verify payment.");
    }

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
      fullName?: string;
      name?: string;
      email?: string;
      status?: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "INACTIVE";
    } | null;
    const restaurantId = restaurantIdOverride || user?.restaurantId || user?.id;

    if (!restaurantId) {
      throw new Error("No authenticated restaurant found.");
    }

    const response = await apiClient.get(`${SUBSCRIPTION_ENDPOINTS.STATUS}/${restaurantId}`).json<{
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
      restaurantName: user?.fullName || user?.name || "Restaurant",
      verificationStatus: user?.status || "PENDING",
      isSubscriptionActive: isSubActive,
      subscriptionPlanCode: sub?.planCode || null,
      subscriptionEndsAt: sub?.currentPeriodEnd || null,
      navigationTarget: isSubActive ? "/restaurant/dashboard" : "/restaurant/subscription",
    };
  },
};

export const subscriptionApi = subscriptionService;
