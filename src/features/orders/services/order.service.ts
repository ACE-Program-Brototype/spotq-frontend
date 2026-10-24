import { apiClient } from "@/lib/api/client";
import { ORDER_RECEIPT_ENDPOINTS } from "../constants/order-receipt.constants";
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
};
