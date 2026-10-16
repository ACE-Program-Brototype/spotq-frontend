import { apiClient } from "@/lib/api/client";
import { CART_ENDPOINTS } from "../constants/cart.constants";
import type { ApiResponse, Cart } from "../types/cart.types";

export const cartService = {
  async getCart(cartId: string): Promise<Cart> {
    const response = await apiClient.get(CART_ENDPOINTS.BY_ID(cartId)).json<ApiResponse<Cart>>();
    return response.data;
  },
};
