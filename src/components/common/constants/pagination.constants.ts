/**
 * Shared Pagination Constants
 * Theme active styles, focus ring tokens, and default pagination messages.
 */

export const PAGINATION_ACTIVE_STYLES = {
  admin: "bg-[#0052cc] text-white hover:bg-[#0052cc]/90 shadow-sm",
  restaurant: "bg-[#ff6b00] text-white hover:bg-[#e05e00] shadow-sm",
  customer: "bg-[#ff6b00] text-white hover:bg-[#e05e00] shadow-sm",
  brand: "bg-[#ff6b00] text-white hover:bg-[#e05e00] shadow-sm",
  dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
} as const;

export const PAGINATION_SELECT_FOCUS_RINGS = {
  admin: "focus:ring-[#0052cc]",
  restaurant: "focus:ring-[#ff6b00]",
  customer: "focus:ring-[#ff6b00]",
  brand: "focus:ring-[#ff6b00]",
  dark: "focus:ring-slate-700",
} as const;

export const PAGINATION_MESSAGES = {
  ROWS_PER_PAGE: "Rows per page:",
  PAGE: "Page",
  OF: "of",
  GO_TO_FIRST: "Go to first page",
  GO_TO_PREVIOUS: "Previous page",
  GO_TO_NEXT: "Next page",
  GO_TO_LAST: "Go to last page",
} as const;

export const PAGINATION_DEFAULT_MESSAGES = PAGINATION_MESSAGES;

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  SIBLING_COUNT: 1,
  THEME: "admin",
} as const;
