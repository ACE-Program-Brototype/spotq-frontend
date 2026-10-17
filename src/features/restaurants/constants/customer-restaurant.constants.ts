import type { CustomerSortConfig } from "../types/customer-restaurant.types";

export const CUSTOMER_RESTAURANT_ENDPOINTS = {
  LIST: "restaurants/customers",
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

