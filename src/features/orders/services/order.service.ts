import { CANCEL_ORDER_ENDPOINTS } from "@/features/orders/constants/cancel-order.constants";
import { ORDER_ENDPOINTS } from "@/features/orders/constants/orders.constants";
import type {
  CancelOrderApiResponse,
  CancelOrderRequestDto,
  CancelOrderResponseData,
} from "@/features/orders/types/cancel-order.types";
import type {
  CustomerOrderDetails,
  CustomerOrderDetailsApiResponse,
} from "@/features/orders/types/customer-order-details.types";
import { apiClient } from "@/lib/api/client";

export const orderService = {
  async getCustomerOrderDetails(orderId: string): Promise<CustomerOrderDetails> {
    const response = await apiClient
      .get(ORDER_ENDPOINTS.DETAIL(orderId))
      .json<CustomerOrderDetailsApiResponse | { data: CustomerOrderDetails }>();

    if (response?.data && "order" in response.data) {
      return response.data.order;
    }

    if (response?.data) {
      return response.data as unknown as CustomerOrderDetails;
    }

    throw new Error("Order details not found");
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
