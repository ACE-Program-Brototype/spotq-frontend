import { CANCEL_ORDER_ENDPOINTS } from "@/features/orders/constants/cancel-order.constants";
import { ORDER_RECEIPT_ENDPOINTS } from "@/features/orders/constants/order-receipt.constants";
import type {
  CancelOrderApiResponse,
  CancelOrderRequestDto,
  CancelOrderResponseData,
} from "@/features/orders/types/cancel-order.types";
import type {
  OrderReceipt,
  OrderReceiptApiResponse,
} from "@/features/orders/types/order-receipt.types";
import { apiClient } from "@/lib/api/client";

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
