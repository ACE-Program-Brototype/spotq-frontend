import { apiClient } from "@/lib/api/client";
import { CHECKOUT_ENDPOINTS } from "../constants/checkout.constants";
import type {
  CheckoutDetailsData,
  CheckoutDetailsResponse,
  GetCheckoutDetailsParams,
  OrderPlacementResponse,
  PlaceOrderPayload,
  VerifyOrderPaymentPayload,
  VerifyOrderPaymentResponse,
} from "../types/checkout.types";

export const checkoutService = {
  /**
   * Fetches validated checkout details, items, live pricing and payment contract
   * GET /api/v1/orders/checkout?restaurantId={restaurantId}&cartId={cartId}
   */
  async getCheckoutDetails(params: GetCheckoutDetailsParams = {}): Promise<CheckoutDetailsData> {
    const searchParams = new URLSearchParams();
    if (params.restaurantId) {
      searchParams.set("restaurantId", params.restaurantId);
    }
    if (params.cartId) {
      searchParams.set("cartId", params.cartId);
    }

    const response = await apiClient
      .get(CHECKOUT_ENDPOINTS.GET_CHECKOUT, {
        searchParams: searchParams.toString() ? searchParams : undefined,
      })
      .json<CheckoutDetailsResponse>();

    return response.data;
  },

  /**
   * Places the order and creates synchronous payment draft
   * POST /api/v1/orders
   */
  async placeOrder(payload: PlaceOrderPayload): Promise<OrderPlacementResponse> {
    return apiClient
      .post(CHECKOUT_ENDPOINTS.PLACE_ORDER, {
        json: payload,
      })
      .json<OrderPlacementResponse>();
  },

  /**
   * Verifies Razorpay signature and captures order payment
   * POST /api/v1/payments/orders/verify
   */
  async verifyOrderPayment(
    payload: VerifyOrderPaymentPayload,
  ): Promise<VerifyOrderPaymentResponse> {
    return apiClient
      .post(CHECKOUT_ENDPOINTS.VERIFY_PAYMENT, {
        json: payload,
      })
      .json<VerifyOrderPaymentResponse>();
  },
};
