/**
 * Staff Orders Constants & Configurations
 */

import { CheckCheck, Flame, type LucideIcon, UtensilsCrossed } from "lucide-react";

export const STAFF_ORDER_STATUS = {
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  READY: "READY",
  COMPLETED: "COMPLETED",
} as const;

export const STAFF_ORDER_TYPE = {
  QUEUE_PRO: "QUEUE_PRO",
  SELF_PRO: "SELF_PRO",
} as const;

export const STAFF_ORDER_PRIORITY = {
  NORMAL: "NORMAL",
  HIGH: "HIGH",
  VIP: "VIP",
} as const;

export const STAFF_ORDER_SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
} as const;

export const STAFF_ORDER_FILTER_STATUS = {
  ALL: "ALL",
  ...STAFF_ORDER_STATUS,
} as const;

export const ELAPSED_URGENCY = {
  NORMAL: "normal",
  WARNING: "warning",
  CRITICAL: "critical",
} as const;

export const ELAPSED_TIMER_CONFIG = {
  WARNING_MINUTES: 15,
  CRITICAL_MINUTES: 30,
  TICK_INTERVAL_MS: 1_000,
  SECONDS_PER_MINUTE: 60,
  SECONDS_PER_HOUR: 3_600,
  DEFAULT_FORMATTED: "0m 0s",
} as const;

type StaffOrderStatusValue = (typeof STAFF_ORDER_STATUS)[keyof typeof STAFF_ORDER_STATUS];
type StaffOrderTypeValue = (typeof STAFF_ORDER_TYPE)[keyof typeof STAFF_ORDER_TYPE];
type ElapsedUrgencyValue = (typeof ELAPSED_URGENCY)[keyof typeof ELAPSED_URGENCY];

export const STAFF_ORDERS_ENDPOINTS = {
  LIST: (restaurantId: string) => `orders/staff/restaurants/${restaurantId}/orders`,
  DETAILS: (restaurantId: string, orderId: string) =>
    `orders/staff/restaurants/${restaurantId}/orders/${orderId}`,
  UPDATE_STATUS: (orderId: string) => `orders/staff/${orderId}/status`,
} as const;

export const STAFF_ORDERS_QUERY_KEYS = {
  ROOT: ["staff-orders"] as const,
  LIST: (restaurantId: string, params?: Record<string, unknown>) =>
    ["staff-orders", restaurantId, "list", params] as const,
  DETAIL: (restaurantId: string, orderId: string) =>
    ["staff-orders", restaurantId, "detail", orderId] as const,
} as const;

export const STAFF_ORDERS_DEFAULTS = {
  PAGE: 1,
  LIMIT: 12,
  SORT_ORDER: STAFF_ORDER_SORT_ORDER.ASC, // FIFO ordering (oldest orders first for kitchen/staff)
  SEARCH_DEBOUNCE_MS: 350,
  LIST_STALE_TIME_MS: 10_000,
  DETAIL_STALE_TIME_MS: 5_000,
  DETAIL_RETRY_COUNT: 3,
  RETRY_BASE_DELAY_MS: 1_000,
  RETRY_MAX_DELAY_MS: 3_000,
  POLL_INTERVAL_MS: 15_000, // 15s auto-polling for active order states
  SHORT_ID_LENGTH: 8,
  CONFLICT_STATUS_CODE: 409,
} as const;

export const ELAPSED_URGENCY_STYLES: Record<
  ElapsedUrgencyValue,
  { containerClass: string; iconClass: string }
> = {
  [ELAPSED_URGENCY.NORMAL]: {
    containerClass: "bg-emerald-50/80 text-emerald-800 border-emerald-200",
    iconClass: "text-emerald-600",
  },
  [ELAPSED_URGENCY.WARNING]: {
    containerClass: "bg-amber-50/90 text-amber-900 border-amber-300",
    iconClass: "text-amber-600",
  },
  [ELAPSED_URGENCY.CRITICAL]: {
    containerClass: "bg-rose-50 text-rose-900 border-rose-300 shadow-xs animate-pulse",
    iconClass: "text-rose-600",
  },
};

export const STAFF_ORDER_STATUS_CONFIG: Record<
  StaffOrderStatusValue,
  { label: string; badgeClass: string; dotClass: string }
> = {
  [STAFF_ORDER_STATUS.PLACED]: {
    label: "Placed",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
  },
  [STAFF_ORDER_STATUS.CONFIRMED]: {
    label: "Confirmed",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dotClass: "bg-indigo-500",
  },
  [STAFF_ORDER_STATUS.PREPARING]: {
    label: "Preparing",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500 animate-pulse",
  },
  [STAFF_ORDER_STATUS.READY]: {
    label: "Ready",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  [STAFF_ORDER_STATUS.COMPLETED]: {
    label: "Completed",
    badgeClass: "bg-neutral-100 text-neutral-600 border-neutral-200",
    dotClass: "bg-neutral-400",
  },
};

export const STAFF_ORDER_TYPE_CONFIG: Record<
  StaffOrderTypeValue,
  { label: string; badgeClass: string }
> = {
  [STAFF_ORDER_TYPE.QUEUE_PRO]: {
    label: "Queue Pro",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
  [STAFF_ORDER_TYPE.SELF_PRO]: {
    label: "Self Pro",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
  },
};

export interface StaffStatusActionConfig {
  label: string;
  nextStatus: StaffOrderStatusValue;
  buttonClass: string;
  icon: LucideIcon;
}

/**
 * Status Action Button definitions for the kitchen workflow.
 * Note: If order is PLACED, it is treated as CONFIRMED by the backend,
 * so the staff action transitions directly to PREPARING ("Start Cooking").
 */
export const STAFF_STATUS_ACTIONS: Record<StaffOrderStatusValue, StaffStatusActionConfig | null> = {
  [STAFF_ORDER_STATUS.PLACED]: {
    label: "Start Cooking",
    nextStatus: STAFF_ORDER_STATUS.PREPARING,
    buttonClass: "bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs",
    icon: Flame,
  },
  [STAFF_ORDER_STATUS.CONFIRMED]: {
    label: "Start Cooking",
    nextStatus: STAFF_ORDER_STATUS.PREPARING,
    buttonClass: "bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs",
    icon: Flame,
  },
  [STAFF_ORDER_STATUS.PREPARING]: {
    label: "Food is Ready",
    nextStatus: STAFF_ORDER_STATUS.READY,
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs",
    icon: UtensilsCrossed,
  },
  [STAFF_ORDER_STATUS.READY]: {
    label: "Complete Order",
    nextStatus: STAFF_ORDER_STATUS.COMPLETED,
    buttonClass: "bg-neutral-900 hover:bg-black text-white shadow-xs",
    icon: CheckCheck,
  },
  [STAFF_ORDER_STATUS.COMPLETED]: null,
};

export interface StaffKitchenPipelineStepConfig {
  status: StaffOrderStatusValue;
  label: string;
  activeClass: string;
  activeDotClass: string | null;
  completedStatuses: readonly StaffOrderStatusValue[];
  checkIconClass: string;
}

export const STAFF_KITCHEN_PIPELINE_STEPS: readonly StaffKitchenPipelineStepConfig[] = [
  {
    status: STAFF_ORDER_STATUS.PREPARING,
    label: STAFF_ORDER_STATUS_CONFIG[STAFF_ORDER_STATUS.PREPARING].label,
    activeClass: "bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs",
    activeDotClass: "size-1.5 rounded-full bg-amber-500 animate-pulse shrink-0",
    completedStatuses: [STAFF_ORDER_STATUS.READY, STAFF_ORDER_STATUS.COMPLETED],
    checkIconClass: "size-3 text-emerald-600 shrink-0",
  },
  {
    status: STAFF_ORDER_STATUS.READY,
    label: STAFF_ORDER_STATUS_CONFIG[STAFF_ORDER_STATUS.READY].label,
    activeClass: "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-2xs",
    activeDotClass: "size-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0",
    completedStatuses: [STAFF_ORDER_STATUS.COMPLETED],
    checkIconClass: "size-3 text-emerald-600 shrink-0",
  },
  {
    status: STAFF_ORDER_STATUS.COMPLETED,
    label: STAFF_ORDER_STATUS_CONFIG[STAFF_ORDER_STATUS.COMPLETED].label,
    activeClass: "bg-neutral-100 border-neutral-300 text-neutral-900 font-bold shadow-2xs",
    activeDotClass: null,
    completedStatuses: [STAFF_ORDER_STATUS.COMPLETED],
    checkIconClass: "size-3 text-neutral-700 shrink-0",
  },
] as const;

export const STAFF_PIPELINE_STEP_BASE_CLASSES = {
  PAST: "bg-neutral-50 border-neutral-200 text-neutral-500 font-medium",
  UPCOMING: "bg-neutral-50/50 border-neutral-100 text-neutral-400 font-medium",
} as const;

export const STAFF_ORDERS_MESSAGES = {
  RESTAURANT_ID_REQUIRED: "Restaurant ID is required to fetch staff orders",
  ORDER_ID_REQUIRED: "Order ID is required to fetch staff order details",
  FETCH_FAILED: "Unable to load restaurant orders. Please check your connection and retry.",
  FETCH_ERROR_TITLE: "Failed to load orders",
  EMPTY_ORDERS_TITLE: "No orders found",
  EMPTY_ORDERS_DESC:
    "There are currently no orders matching your selected filters. Try adjusting your status or search query.",
  EMPTY_NO_ORDERS_YET: "No orders have been received yet for this restaurant shift.",
  NO_RESTAURANT_TITLE: "No restaurant assigned",
  NO_RESTAURANT_DESC:
    "Your staff account is not associated with an active restaurant. Please sign in again or contact your administrator.",
} as const;

export const STAFF_ORDER_DETAILS_MESSAGES = {
  ORDER_NOT_FOUND_TITLE: "Order Not Found",
  ORDER_NOT_FOUND_DESC:
    "The requested order could not be found or does not belong to your restaurant.",
  STATUS_UPDATE_SUCCESS: (orderNumber: string, statusLabel: string) =>
    `Order #${orderNumber} updated to ${statusLabel}`,
  STATUS_UPDATE_ERROR: "Failed to update order status. Please try again.",
  CONCURRENT_UPDATE_ERROR: "Order was updated concurrently. Showing latest status.",
  FETCH_ERROR_TITLE: "Failed to load order details",
  FETCH_FAILED: "Unable to load order details. Please check your connection and retry.",
  NO_SPECIAL_INSTRUCTIONS: "No special instructions",
  NO_CUSTOMER_NOTES: "No customer dining notes provided for this order.",
  BACK_TO_ORDERS: "Back to Orders",
  BACK_TO_DASHBOARD: "Back to Dashboard",
  TRY_AGAIN: "Try Again",
  ORDER_ITEMS_HEADING: (count: number) => `Order Items (${count})`,
  TOTAL_ITEMS_COUNT: (count: number) => `${count} total items`,
  GENERAL_INSTRUCTIONS_HEADING: "General Instructions",
  CUSTOMER_DINING_NOTES_HEADING: "Customer Dining Notes",
  PLACED_ON_PREFIX: "Placed on",
  ELAPSED_LABEL: "elapsed",
  PRIORITY_SUFFIX: "Priority",
  QUEUE_TAG: (shortQueueId: string) => `Queue #${shortQueueId}`,
  TABLE_TAG: (tableNumber: number) => `Table ${tableNumber}`,
  VARIANT_LABEL: "Variant:",
  SELECTED_ADDONS_LABEL: "Selected Add-ons",
  KITCHEN_SPECIAL_REQUEST_LABEL: "Kitchen Special Request",
  QUANTITY_MULTIPLIER: "×",
  ITEM_BADGE_TITLE: (itemNumber: number, quantity: number) =>
    `Item #${itemNumber} - Quantity: ${quantity}`,
  ACTION_BAR_HEADING: "Order Status Actions",
  ACTION_BAR_SUBTITLE: "3-Step Preparation",
  ORDER_COMPLETED_TITLE: "Order Completed",
  ORDER_COMPLETED_DESC: "All preparation steps have been finished.",
  UPDATING_STATUS: "Updating Status...",
  NEXT_STATUS_LABEL: "Next status:",
  SUMMARY_HEADING: "Order Overview",
  TOTAL_QUANTITY_LABEL: "Total Quantity",
  QUANTITY_BREAKDOWN: (totalQty: number, uniqueCount: number) =>
    `${totalQty} ${totalQty === 1 ? "item" : "items"} (${uniqueCount} unique)`,
  ITEM_SINGULAR: "item",
  ITEM_PLURAL: "items",
  SERVICE_MODE_LABEL: "Service Mode",
  TABLE_REFERENCE_LABEL: "Table Reference",
  QUEUE_TOKEN_LABEL: "Queue Token",
  KITCHEN_STATUS_LABEL: "Kitchen Status",
  TIME_PLACED_LABEL: "Time Placed",
  NOT_AVAILABLE: "N/A",
} as const;
