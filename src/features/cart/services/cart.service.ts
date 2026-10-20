import { apiClient } from "@/lib/api/client";
import { CART_ENDPOINTS } from "../constants/cart.constants";
import type {
  AddCartItemData,
  AddCartItemInput,
  ApiResponse,
  Cart,
  UpdateCartItemQuantityData,
} from "../types/cart.types";

export const cartService = {
  async getCart(cartId: string): Promise<Cart> {
    const response = await apiClient.get(CART_ENDPOINTS.BY_ID(cartId)).json<ApiResponse<Cart>>();
    return response.data;
  },

  async addItem(
    cartId: string | null | undefined,
    payload: AddCartItemInput,
  ): Promise<AddCartItemData> {
    const response = await apiClient
      .post(CART_ENDPOINTS.ADD_ITEM(cartId), { json: payload })
      .json<ApiResponse<AddCartItemData>>();
    return response.data;
  },

  async updateQuantity(
    cartId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<UpdateCartItemQuantityData> {
    const response = await apiClient
      .patch(CART_ENDPOINTS.UPDATE_ITEM_QUANTITY(cartId, cartItemId), {
        json: { quantity },
      })
      .json<ApiResponse<UpdateCartItemQuantityData>>();
    return response.data;
  },

  async removeItem(cartId: string, cartItemId: string): Promise<UpdateCartItemQuantityData> {
    const response = await apiClient
      .delete(CART_ENDPOINTS.REMOVE_ITEM(cartId, cartItemId))
      .json<ApiResponse<UpdateCartItemQuantityData>>();
    return response.data;
  },
};
