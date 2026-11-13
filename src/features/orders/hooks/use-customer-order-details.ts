import { useQuery } from "@tanstack/react-query";
import { CUSTOMER_PAYMENT_STATUS } from "../constants/customer-order-details.constants";
import { ORDER_QUERY_KEYS } from "../constants/orders.constants";
import { orderService } from "../services/order.service";
import type {
  CustomerOrderDetails,
  CustomerOrderRefundStatus,
} from "../types/customer-order-details.types";

export function useCustomerOrderDetails(orderId?: string | null) {
  return useQuery<CustomerOrderDetails, Error>({
    queryKey: ORDER_QUERY_KEYS.DETAIL(orderId),
    queryFn: () => orderService.getCustomerOrderDetails(orderId as string),
    enabled: Boolean(orderId),
    staleTime: 15 * 1000,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      const activeStatuses = ["PLACED", "CONFIRMED", "PREPARING", "READY"];
      return activeStatuses.includes(data.status?.toUpperCase()) ? 10_000 : false;
    },
  });
}

export function useCustomerOrderRefundStatus(orderId?: string | null, enabled = false) {
  return useQuery<CustomerOrderRefundStatus, Error>({
    queryKey: ORDER_QUERY_KEYS.REFUND_STATUS(orderId),
    queryFn: () => orderService.getCustomerOrderRefundStatus(orderId as string),
    enabled: Boolean(orderId) && enabled,
    staleTime: 10 * 1000,
    refetchInterval: (query) => {
      const status = query.state.data?.status?.toUpperCase();
      return status === CUSTOMER_PAYMENT_STATUS.REFUND_PENDING ||
        status === CUSTOMER_PAYMENT_STATUS.REFUND_PROCESSING
        ? 10_000
        : false;
    },
  });
}
