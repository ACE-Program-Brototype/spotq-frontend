import { CANCEL_ORDER_MESSAGES } from "@/features/orders/constants/cancel-order.constants";
import { ORDER_STATUS } from "@/features/orders/constants/orders.constants";
import type { OrderStatus } from "@/features/orders/types/orders.types";

export function isOrderCancellable(status?: OrderStatus | string): boolean {
  if (!status) return false;
  const normalized = status.toUpperCase();
  return normalized === ORDER_STATUS.PLACED || normalized === ORDER_STATUS.CONFIRMED;
}

export function getDisabledTooltip(status?: OrderStatus | string): string {
  if (!status) return "";
  const normalized = status.toUpperCase();

  switch (normalized) {
    case ORDER_STATUS.PREPARING:
    case ORDER_STATUS.READY:
    case ORDER_STATUS.SERVED:
      return CANCEL_ORDER_MESSAGES.TRIGGER_TOOLTIP_PREPARING;
    case ORDER_STATUS.COMPLETED:
      return CANCEL_ORDER_MESSAGES.TRIGGER_TOOLTIP_COMPLETED;
    case ORDER_STATUS.CANCELLED:
      return CANCEL_ORDER_MESSAGES.TRIGGER_TOOLTIP_CANCELLED;
    default:
      return "";
  }
}
