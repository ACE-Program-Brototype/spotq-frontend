import { apiClient } from "@/lib/api/client";
import { CART_ENDPOINTS } from "../constants/cart.constants";
import type { AddToCartPayload, AddToCartResponse } from "../types/cart.types";

export const cartService = {
  /**
   * Adds an item with customizations, quantity, addons, and special instructions to the customer cart.
   * Sends POST request to /api/v1/carts/items.
   */
  async addToCart(payload: AddToCartPayload): Promise<AddToCartResponse> {
    const response = await apiClient
      .post(CART_ENDPOINTS.ADD_ITEM, {
        json: payload,
      })
      .json<AddToCartResponse>();

    return response;
  },
};
