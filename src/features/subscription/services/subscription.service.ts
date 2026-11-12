import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  SUBSCRIPTION_ENDPOINTS,
  SUBSCRIPTION_HEADERS,
} from "@/features/subscription/constants/subscription.constants";
import type {
  ApiResponse,
  CreateSubscriptionOrderResponse,
  RenewSubscriptionOrderResponse,
  RestaurantStatusData,
  SubscriptionPlan,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "@/features/subscription/types/subscription.types";
import type {
  GetSubscriptionHistoryParams,
  SubscriptionBillingHistoryData,
} from "@/features/subscription/types/subscription-history.types";
import { apiClient } from "@/lib/api/client";

export const subscriptionService = {
  async fetchPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient
      .get(SUBSCRIPTION_ENDPOINTS.PLANS)
      .json<ApiResponse<SubscriptionPlan[]>>();
    return response.data;
  },

  async createOrder(
    planId: string,
    restaurantContext?: {
      restaurantId?: string;
      restaurantName?: string;
      restaurantEmail?: string;
      restaurantPhone?: string;
    },
  ): Promise<CreateSubscriptionOrderResponse> {
    const user = useAuthStore.getState().user as {
      restaurantId?: string;
      email?: string;
    } | null;

    const restaurantId = restaurantContext?.restaurantId || user?.restaurantId;
    if (!restaurantId) {
      throw new Error("Restaurant identification is required to create a subscription order.");
    }

    const email = restaurantContext?.restaurantEmail || user?.email;

    const response = await apiClient
      .post(SUBSCRIPTION_ENDPOINTS.CREATE_ORDER, {
        json: {
          planId,
          restaurantId,
          ...(restaurantContext?.restaurantName
            ? { restaurantName: restaurantContext.restaurantName }
            : {}),
          ...(email ? { restaurantEmail: email } : {}),
          ...(restaurantContext?.restaurantPhone
            ? { restaurantPhone: restaurantContext.restaurantPhone }
            : {}),
        },
      })
      .json<ApiResponse<CreateSubscriptionOrderResponse>>();
    return response.data;
  },

  async renewSubscription(
    subscriptionId: string,
    planId?: string,
    idempotencyKey?: string,
  ): Promise<RenewSubscriptionOrderResponse> {
    const trimmedSubscriptionId = subscriptionId?.trim();
    if (!trimmedSubscriptionId) {
      throw new Error("Subscription identifier is required to initiate renewal.");
    }

    const resolvedKey =
      idempotencyKey?.trim() ||
      (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `renew-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);

    const payload = planId ? { planId } : {};
    const response = await apiClient
      .post(SUBSCRIPTION_ENDPOINTS.RENEW(trimmedSubscriptionId), {
        headers: {
          [SUBSCRIPTION_HEADERS.IDEMPOTENCY_KEY]: resolvedKey,
        },
        json: payload,
      })
      .json<ApiResponse<RenewSubscriptionOrderResponse>>();

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
          planCode?: string;
          planName?: string;
          currentPeriodStart?: string;
          currentPeriodEnd?: string;
          renewalWindowDays?: number;
          isEligibleForRenewal?: boolean;
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
      navigationTarget: isSubActive ? RESTAURANT_ROUTES.DASHBOARD : RESTAURANT_ROUTES.SUBSCRIPTION,
      subscription: sub
        ? {
            id: sub.id,
            status: sub.status,
            planCode: sub.planCode ?? null,
            planName: sub.planName ?? null,
            currentPeriodStart: sub.currentPeriodStart ?? null,
            currentPeriodEnd: sub.currentPeriodEnd ?? null,
            renewalWindowDays: sub.renewalWindowDays,
            isEligibleForRenewal: sub.isEligibleForRenewal,
          }
        : null,
    };
  },

  async getSubscriptionHistory(
    restaurantId: string,
    params: GetSubscriptionHistoryParams = {},
  ): Promise<SubscriptionBillingHistoryData> {
    if (!restaurantId) {
      throw new Error("Restaurant identification is required to retrieve billing history.");
    }

    const searchParams = new URLSearchParams();
    if (params.page && params.page > 0) {
      searchParams.set("page", String(params.page));
    }
    if (params.limit && params.limit > 0) {
      searchParams.set("limit", String(params.limit));
    }
    if (params.status && params.status !== "ALL") {
      searchParams.set("status", params.status);
    }

    const response = await apiClient
      .get(SUBSCRIPTION_ENDPOINTS.HISTORY(restaurantId), {
        searchParams,
      })
      .json<ApiResponse<SubscriptionBillingHistoryData>>();

    return response.data;
  },
};

export const subscriptionApi = subscriptionService;
