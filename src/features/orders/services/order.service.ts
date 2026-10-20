import env from "@/config/env";
import { apiClient } from "@/lib/api/client";
import { ORDER_RECEIPT_ENDPOINTS } from "../constants/order-receipt.constants";
import { MOCK_ORDER_RECEIPT } from "../mocks/order-receipt.mock";
import type { OrderReceipt, OrderReceiptApiResponse } from "../types/order-receipt.types";

const MOCK_ORDER_IDS = new Set(["ord_992817203", "SQ-101", "demo"]);

export const orderService = {
  async getOrderReceipt(orderId: string): Promise<OrderReceipt> {
    try {
      const response = await apiClient
        .get(ORDER_RECEIPT_ENDPOINTS.BY_ID(orderId))
        .json<OrderReceiptApiResponse>();

      if (response?.data) {
        return response.data;
      }
    } catch (error) {
      if (env.isDev && MOCK_ORDER_IDS.has(orderId)) {
        return {
          ...MOCK_ORDER_RECEIPT,
          order_id: orderId,
        };
      }
      throw error instanceof Error ? error : new Error("Order receipt not found");
    }

    if (env.isDev && MOCK_ORDER_IDS.has(orderId)) {
      return {
        ...MOCK_ORDER_RECEIPT,
        order_id: orderId,
      };
    }

    throw new Error("Order receipt not found");
  },
};
