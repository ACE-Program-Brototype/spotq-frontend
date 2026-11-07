import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/order.service";
import type { OrderReceipt } from "../types/order-receipt.types";

export function useOrderReceipt(orderId?: string | null) {
  return useQuery<OrderReceipt, Error>({
    queryKey: ["order-receipt", orderId],
    queryFn: () => orderService.getOrderReceipt(orderId as string),
    enabled: Boolean(orderId),
    staleTime: 60 * 1000,
  });
}
