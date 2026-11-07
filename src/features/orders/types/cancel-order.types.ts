/**
 * Cancel Order Types
 * Interfaces matching the Cancel Order API payload and response.
 */

import type { CANCEL_ORDER_REASONS } from "@/features/orders/constants/cancel-order.constants";
import type { ORDER_STATUS } from "@/features/orders/constants/orders.constants";

export type CancelOrderReasonKey = (typeof CANCEL_ORDER_REASONS)[keyof typeof CANCEL_ORDER_REASONS];

export interface CancelOrderRequestDto {
  cancellation_reason: string;
}

export interface CancelOrderResponseData {
  order_id: string;
  order_number: string;
  status: typeof ORDER_STATUS.CANCELLED;
  cancellation_reason: string;
  cancelled_at: string;
  refundStatus?: string;
}

export interface CancelOrderApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CancelOrderResponseData;
}
