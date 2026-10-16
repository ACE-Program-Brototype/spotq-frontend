import { apiClient } from "@/lib/api/client";
import { CART_ENDPOINTS } from "../constants/cart.constants";
import type { AddCartItemData, AddCartItemInput, ApiResponse, Cart } from "../types/cart.types";

export const cartService = {
  async getCart(cartId: string): Promise<Cart> {
    const response = await apiClient.get(CART_ENDPOINTS.BY_ID(cartId)).json<ApiResponse<Cart>>();
    return response.data;
  },

  async addItem(cartId: string, payload: AddCartItemInput): Promise<AddCartItemData> {
    const response = await apiClient
      .post(CART_ENDPOINTS.ADD_ITEM(cartId), { json: payload })
      .json<ApiResponse<AddCartItemData>>();
    return response.data;
  },
};
