import { apiClient } from "@/lib/api/client";
import { CART_ENDPOINTS } from "@/features/cart/constants/cart.constants";
import type { AddBatchCartItemsPayload, AddBatchCartItemsResponse } from "@/features/cart/types/cart.types";

export const cartService = {
  /**
   * Syncs multiple items to the server cart in a single batch request
   * POST /api/v1/carts/items/batch
   */
  async batchAddToCart(payload: AddBatchCartItemsPayload): Promise<AddBatchCartItemsResponse> {
    return apiClient
      .post(CART_ENDPOINTS.BATCH_ITEMS, {
        json: payload,
      })
      .json<AddBatchCartItemsResponse>();
  },
};
