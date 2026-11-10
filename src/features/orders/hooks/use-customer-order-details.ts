import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/order.service";
import type { CustomerOrderDetails } from "../types/customer-order-details.types";

export function useCustomerOrderDetails(orderId?: string | null) {
  return useQuery<CustomerOrderDetails, Error>({
    queryKey: ["customer-order-details", orderId],
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
