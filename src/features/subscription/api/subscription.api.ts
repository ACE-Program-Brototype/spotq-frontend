import { useAuthStore } from "@/features/auth/store/auth.store";
import { SUBSCRIPTION_ENDPOINTS } from "@/features/subscription/constants/subscription.constants";
import type {
  CreateSubscriptionOrderResponse,
  RestaurantStatusData,
  SubscriptionPlan,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "@/features/subscription/types/subscription.types";
import { apiClient } from "@/lib/api/client";

interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
}

export const subscriptionApi = {
  async fetchPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient
      .get(SUBSCRIPTION_ENDPOINTS.PLANS)
      .json<ApiResponse<SubscriptionPlan[]>>();
    return response.data;
  },

  async createOrder(planId: string): Promise<CreateSubscriptionOrderResponse> {
    const user = useAuthStore.getState().user as { id?: string; restaurantId?: string } | null;
    const restaurantId = user?.restaurantId || user?.id;

    const response = await apiClient
      .post(SUBSCRIPTION_ENDPOINTS.CREATE_ORDER, {
        json: { planId, restaurantId },
      })
      .json<ApiResponse<CreateSubscriptionOrderResponse>>();
    return response.data;
  },

  async verifyPayment(data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    const user = useAuthStore.getState().user as { id?: string; restaurantId?: string } | null;
    const restaurantId = data.restaurantId || user?.restaurantId || user?.id;

    const response = await apiClient
      .post(SUBSCRIPTION_ENDPOINTS.VERIFY_PAYMENT, {
        json: { ...data, restaurantId },
      })
      .json<ApiResponse<VerifyPaymentResponse>>();
    return response.data;
  },

  async fetchRestaurantStatus(): Promise<RestaurantStatusData> {
    const user = useAuthStore.getState().user as { id?: string; restaurantId?: string } | null;
    const restaurantId = user?.restaurantId || user?.id;

    const request = restaurantId
      ? apiClient.get(SUBSCRIPTION_ENDPOINTS.RESTAURANT_STATUS, {
          searchParams: { restaurantId },
          headers: { "x-restaurant-id": restaurantId },
        })
      : apiClient.get(SUBSCRIPTION_ENDPOINTS.RESTAURANT_STATUS);

    const response = await request.json<ApiResponse<RestaurantStatusData>>();
    return response.data;
  },
};
