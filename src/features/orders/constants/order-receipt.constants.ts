export const ORDER_RECEIPT_ENDPOINTS = {
  BASE: "orders",
  BY_ID: (orderId: string) => `orders/${orderId}`,
} as const;

export const ORDER_RECEIPT_MESSAGES = {
  PAGE_TITLE: "Digital Receipt",
  PAGE_SUBTITLE: "Itemized tax invoice and bill summary",
  BACK_TO_HOME: "Back to Home",
  BACK_TO_ORDERS: "Back to Orders",
  DOWNLOAD_RECEIPT: "Download Receipt",
  DOWNLOADING: "Downloading...",
  ORDER_NUMBER_PREFIX: "Order #",
  TAX_INVOICE_TITLE: "Tax Invoice & Summary",
  ITEMS_HEADER: "Itemized Order Items",
  BILL_SUMMARY_HEADER: "Bill Details",
  SUBTOTAL_LABEL: "Item Subtotal",
  TAX_LABEL: "Taxes & GST (5%)",
  PLATFORM_FEE_LABEL: "Platform Fee",
  TOTAL_LABEL: "Grand Total Paid",
  VARIANT_LABEL: "Size:",
  ADDONS_LABEL: "Add-ons:",
  SPECIAL_INSTRUCTIONS_LABEL: "Cooking Note:",
  LOADING_RECEIPT: "Loading receipt details...",
  ERROR_TITLE: "Unable to load receipt",
  ERROR_DESCRIPTION: "We could not find or retrieve receipt details for this order.",
  RETRY_BUTTON: "Try Again",
  OFFLINE_COPY_NOTICE: "Official spotQ digital customer receipt",
  ORDER_DATE_LABEL: "Date & Time",
  ORDER_STATUS_LABEL: "Status",
  RESTAURANT_LABEL: "Restaurant",
  ORDER_ID_LABEL: "Order ID",
  DOWNLOAD_SUCCESS: "Receipt downloaded successfully",
  DOWNLOAD_ERROR: "Failed to download receipt",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Completed",
  PREPARING: "Preparing",
  READY: "Ready for Pickup",
  PLACED: "Order Placed",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  SERVED: "Served",
};

export const ORDER_STATUS_VARIANTS: Record<
  string,
  {
    badgeClass: string;
    label: string;
  }
> = {
  COMPLETED: {
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-300",
    label: "Completed",
  },
  READY: {
    badgeClass: "bg-blue-50 text-blue-700 border-blue-300",
    label: "Ready",
  },
  PREPARING: {
    badgeClass: "bg-amber-50 text-amber-700 border-amber-300",
    label: "Preparing",
  },
  CONFIRMED: {
    badgeClass: "bg-sky-50 text-sky-700 border-sky-300",
    label: "Confirmed",
  },
  PLACED: {
    badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-300",
    label: "Placed",
  },
  SERVED: {
    badgeClass: "bg-purple-50 text-purple-700 border-purple-300",
    label: "Served",
  },
  CANCELLED: {
    badgeClass: "bg-rose-50 text-rose-700 border-rose-300",
    label: "Cancelled",
  },
};
