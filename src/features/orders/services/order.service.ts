import { CANCEL_ORDER_ENDPOINTS } from "@/features/orders/constants/cancel-order.constants";
import { ORDER_RECEIPT_ENDPOINTS } from "@/features/orders/constants/order-receipt.constants";
import type {
  CancelOrderApiResponse,
  CancelOrderRequestDto,
  CancelOrderResponseData,
} from "@/features/orders/types/cancel-order.types";
import type {
  CustomerOrderDetails,
  CustomerOrderDetailsApiResponse,
} from "@/features/orders/types/customer-order-details.types";
import type {
  OrderReceipt,
  OrderReceiptApiResponse,
} from "@/features/orders/types/order-receipt.types";
import { apiClient } from "@/lib/api/client";

export function mapCustomerOrderToReceipt(order: CustomerOrderDetails): OrderReceipt {
  return {
    order_id: order.order_id,
    order_number: order.order_number,
    restaurant: {
      restaurant_id: order.restaurant.restaurant_id,
      name: order.restaurant.name ?? "Restaurant",
    },
    status: order.status,
    items: order.items.map((item) => ({
      menu_item_id: item.menu_item_id,
      name: item.name,
      variant_id: item.variant?.variant_id ?? null,
      variant_name: item.variant?.name ?? null,
      addons: item.addons ?? [],
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.line_total,
      special_instructions: null,
    })),
    sub_total: order.pricing.subtotal,
    tax_amount: order.pricing.taxes,
    platform_fee: order.pricing.platform_fee,
    total_amount: order.pricing.grand_total,
    created_at: order.created_at,
  };
}

export const orderService = {
  async getCustomerOrderDetails(orderId: string): Promise<CustomerOrderDetails> {
    const response = await apiClient
      .get(ORDER_RECEIPT_ENDPOINTS.BY_ID(orderId))
      .json<CustomerOrderDetailsApiResponse | { data: CustomerOrderDetails }>();

    if (response?.data && "order" in response.data) {
      return response.data.order;
    }

    if (response?.data) {
      return response.data as unknown as CustomerOrderDetails;
    }

    throw new Error("Order details not found");
  },

  async getOrderReceipt(orderId: string): Promise<OrderReceipt> {
    const response = await apiClient
      .get(ORDER_RECEIPT_ENDPOINTS.BY_ID(orderId))
      .json<OrderReceiptApiResponse | CustomerOrderDetailsApiResponse>();

    if (response?.data && "order" in response.data) {
      return mapCustomerOrderToReceipt(response.data.order);
    }

    if (response?.data) {
      return response.data as OrderReceipt;
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
