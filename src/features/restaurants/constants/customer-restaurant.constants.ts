import type { CustomerSortConfig } from "../types/customer-restaurant.types";

export const CUSTOMER_RESTAURANT_ENDPOINTS = {
  LIST: "restaurants",
} as const;

export const CUSTOMER_RESTAURANT_QUERY_KEYS = {
  ALL: ["customer", "restaurants"] as const,
  LIST: (params: unknown) => ["customer", "restaurants", params] as const,
} as const;

export const CUSTOMER_RESTAURANT_DEFAULTS = {
  PAGE: 1,
  LIMIT: 8,
  SEARCH_DEBOUNCE_MS: 350,
  SORT_BY: "createdAt" as const,
  SORT_ORDER: "desc" as const,
  DEFAULT_CATEGORY: "All" as const,
  DEFAULT_SORT: "newest" as const,
  CACHE_STALE_TIME_MS: 60_000,
} as const;

export const RESTAURANT_SKELETON_KEYS = [
  "restaurant-sk-1",
  "restaurant-sk-2",
  "restaurant-sk-3",
  "restaurant-sk-4",
  "restaurant-sk-5",
  "restaurant-sk-6",
  "restaurant-sk-7",
  "restaurant-sk-8",
] as const;

export const CUSTOMER_CUISINE_CATEGORIES = [
  "All",
  "Mandi",
  "Chinese",
  "Multi-Cuisine",
  "Pure Veg",
  "South Indian",
  "North Indian",
  "Biryani",
] as const;

export const CUSTOMER_SORT_OPTIONS: CustomerSortConfig[] = [
  { value: "newest", label: "Newest First", sortBy: "createdAt", sortOrder: "desc" },
  { value: "name_asc", label: "Name (A to Z)", sortBy: "restaurantName", sortOrder: "asc" },
  { value: "price_asc", label: "Cost: Low to High", sortBy: "price", sortOrder: "asc" },
  { value: "price_desc", label: "Cost: High to Low", sortBy: "price", sortOrder: "desc" },
];

export const FALLBACK_CUISINE_IMAGES: Record<string, string> = {
  mandi:
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
  chinese:
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80",
  "multi-cuisine":
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
  "pure veg":
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
  "south indian":
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
  "north indian":
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80",
  biryani:
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
  default:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
};
