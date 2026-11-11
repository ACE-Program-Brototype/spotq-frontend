export const ORDER_TRACKER_STEPS = [
  { key: "PLACED", label: "Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PREPARING", label: "Preparing" },
  { key: "READY", label: "Ready" },
  { key: "COMPLETED", label: "Completed" },
] as const;

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
