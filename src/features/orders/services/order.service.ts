import { apiClient } from "@/lib/api/client";
import { ORDER_RECEIPT_ENDPOINTS } from "../constants/order-receipt.constants";
import { MOCK_ORDER_RECEIPT } from "../mocks/order-receipt.mock";
import type { OrderReceipt, OrderReceiptApiResponse } from "../types/order-receipt.types";

export const orderService = {
  async getOrderReceipt(orderId: string): Promise<OrderReceipt> {
    try {
      const response = await apiClient
        .get(ORDER_RECEIPT_ENDPOINTS.BY_ID(orderId))
        .json<OrderReceiptApiResponse>();

      if (response?.data) {
        return response.data;
      }
      return {
        ...MOCK_ORDER_RECEIPT,
        order_id: orderId,
      };
    } catch {
      return {
        ...MOCK_ORDER_RECEIPT,
        order_id: orderId,
      };
    }
  },
};
