import { apiClient } from "@/lib/api/client";
import { CHECKOUT_ENDPOINTS } from "../constants/checkout.constants";
import type {
  CartApiResponse,
  CartData,
  OrderPlacementResponse,
  PlaceOrderPayload,
} from "../types/checkout.types";

export const checkoutService = {
  /**
   * Fetches real cart details by cartId from GET /api/v1/orders/carts/{cartId}
   */
  async getCart(cartId: string): Promise<CartData> {
    const response = await apiClient
      .get(CHECKOUT_ENDPOINTS.GET_CART(cartId))
      .json<CartApiResponse>();

    return response.data;
  },

  /**
   * Places the order via POST /api/v1/orders
   */
  async placeOrder(payload: PlaceOrderPayload): Promise<OrderPlacementResponse> {
    return apiClient
      .post(CHECKOUT_ENDPOINTS.PLACE_ORDER, {
        json: payload,
      })
      .json<OrderPlacementResponse>();
  },
};
