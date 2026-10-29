import { apiClient } from "@/lib/api/client";
import { CANCEL_ORDER_ENDPOINTS } from "../constants/cancel-order.constants";
import { ORDER_RECEIPT_ENDPOINTS } from "../constants/order-receipt.constants";
import type {
  CancelOrderApiResponse,
  CancelOrderRequestDto,
  CancelOrderResponseData,
} from "../types/cancel-order.types";
import type { OrderReceipt, OrderReceiptApiResponse } from "../types/order-receipt.types";

export const orderService = {
  async getOrderReceipt(orderId: string): Promise<OrderReceipt> {
    const response = await apiClient
      .get(ORDER_RECEIPT_ENDPOINTS.BY_ID(orderId))
      .json<OrderReceiptApiResponse>();

    if (response?.data) {
      return response.data;
    }

    throw new Error("Order receipt not found");
  },

  async cancelOrder(
    orderId: string,
    payload: CancelOrderRequestDto,
  ): Promise<CancelOrderResponseData> {
    const response = await apiClient
      .post(CANCEL_ORDER_ENDPOINTS.CANCEL(orderId), {
        json: payload,
      })
      .json<CancelOrderApiResponse>();

    return response.data;
  },
};
