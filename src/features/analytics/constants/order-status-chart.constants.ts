/**
 * Order Status Chart & Styling Constants
 * Configuration for SVG pie/donut chart geometry, colors, labels, and class names.
 */

export interface OrderStatusDisplayConfig {
  label: string;
  color: string;
  border: string;
  bg: string;
}

export const ORDER_STATUS_CHART_MODES = {
  PIE: "pie",
  DONUT: "donut",
} as const;

export type OrderStatusChartMode =
  (typeof ORDER_STATUS_CHART_MODES)[keyof typeof ORDER_STATUS_CHART_MODES];

export const ORDER_STATUS_CHART_CONFIG = {
  SIZE: 220,
  OUTER_RADIUS: 88,
  DONUT_INNER_RADIUS: 52,
  PIE_INNER_RADIUS: 0,
  PULL_DISTANCE: 6,
  STROKE_WIDTH: 2,
  STROKE_COLOR: "#ffffff",
  DONUT_CENTER_RADIUS: 50,
} as const;

export const ORDER_STATUS_CONFIG: Record<string, OrderStatusDisplayConfig> = {
  COMPLETED: {
    label: "Completed Orders",
    color: "#10b981", // Emerald 500
    border: "#059669",
    bg: "#ecfdf5",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "#3b82f6", // Blue 500
    border: "#2563eb",
    bg: "#eff6ff",
  },
  PREPARING: {
    label: "Preparing",
    color: "#f59e0b", // Amber 500
    border: "#d97706",
    bg: "#fffbeb",
  },
  PLACED: {
    label: "Placed",
    color: "#8b5cf6", // Violet 500
    border: "#7c3aed",
    bg: "#f5f3ff",
  },
  SERVED: {
    label: "Served",
    color: "#14b8a6", // Teal 500
    border: "#0d9488",
    bg: "#f0fdfa",
  },
  READY: {
    label: "Ready for Pickup",
    color: "#06b6d4", // Cyan 500
    border: "#0891b2",
    bg: "#ecfeff",
  },
  CANCELLED: {
    label: "Cancelled Orders",
    color: "#f43f5e", // Rose 500
    border: "#e11d48",
    bg: "#fff1f2",
  },
};

export const ORDER_STATUS_FALLBACK_PALETTE = [
  "#e8631b", // SpotQ Terracotta
  "#9a3412", // Dark Terracotta
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#84cc16", // Lime
  "#a855f7", // Violet
  "#64748b", // Slate
] as const;

export function getOrderStatusDisplayInfo(
  status: string,
  index: number = 0,
): OrderStatusDisplayConfig {
  const normalized = status.toUpperCase().trim();
  if (ORDER_STATUS_CONFIG[normalized]) {
    return ORDER_STATUS_CONFIG[normalized];
  }
  const color = ORDER_STATUS_FALLBACK_PALETTE[index % ORDER_STATUS_FALLBACK_PALETTE.length];
  const formatted = status
    .toLowerCase()
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
  return {
    label: formatted,
    color,
    border: color,
    bg: "#faf7f5",
  };
}

export const ORDER_STATUS_CHART_STYLES = {
  CARD_CONTAINER:
    "rounded-2xl border border-[#eddcd4] bg-white p-5 sm:p-6 shadow-2xs flex flex-col justify-between",
  HEADER_TITLE: "text-base font-bold text-neutral-900",
  HEADER_SUBTITLE: "text-xs text-neutral-500 mt-0.5",
  TOGGLE_CONTAINER:
    "flex items-center rounded-lg border border-[#eddcd4] bg-[#faf7f5] p-0.5 text-xs",
  TOGGLE_BUTTON_BASE:
    "flex items-center gap-1 rounded-md px-2 py-1 font-semibold transition-colors",
  TOGGLE_BUTTON_ACTIVE: "bg-white text-[#9a3412] shadow-2xs",
  TOGGLE_BUTTON_INACTIVE: "text-neutral-500 hover:text-neutral-900",
  TRACKED_BADGE:
    "text-xs font-semibold px-2.5 py-1 rounded-full bg-[#faf7f5] border border-[#eddcd4] text-neutral-700 shrink-0",
  EMPTY_CONTAINER:
    "flex size-full flex-col items-center justify-center rounded-full border-2 border-dashed border-neutral-300 bg-[#faf7f5] p-4 text-center",
  LEGEND_CONTAINER: "md:col-span-7 flex flex-col gap-2 max-h-[290px] overflow-y-auto pr-1",
  LEGEND_ROW_BASE:
    "flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 cursor-pointer",
  LEGEND_ROW_ACTIVE: "border-[#9a3412] bg-[#fef3ec]/50 shadow-xs",
  LEGEND_ROW_INACTIVE: "border-[#eddcd4]/70 bg-[#faf7f5]/70 hover:bg-[#faf7f5]",
  LEGEND_AMOUNT_COMPLETED: "text-xs font-bold text-emerald-700",
  LEGEND_AMOUNT_CANCELLED: "text-xs font-bold text-rose-700",
  LEGEND_AMOUNT_NEUTRAL: "text-xs font-bold text-neutral-700",
} as const;
