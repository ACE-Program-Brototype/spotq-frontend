import type { CustomerSortConfig } from "../types/customer-restaurant.types";

export const CUSTOMER_RESTAURANT_ENDPOINTS = {
  LIST: "restaurants/customers",
  DETAILS: (id: string) => `restaurants/customers/${encodeURIComponent(id)}`,
} as const;

export const CUSTOMER_RESTAURANT_QUERY_KEYS = {
  ALL: ["customer", "restaurants"] as const,
  LIST: (params: unknown) => ["customer", "restaurants", params] as const,
  DETAILS: (id: string) => ["customer", "restaurant", id] as const,
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

export const RESTAURANT_DETAIL_SKELETON_CATEGORIES = [
  "category-one",
  "category-two",
  "category-three",
  "category-four",
  "category-five",
  "category-six",
] as const;

export const RESTAURANT_DETAIL_SKELETON_MENU_ITEMS = [
  "menu-item-one",
  "menu-item-two",
  "menu-item-three",
  "menu-item-four",
] as const;

export const CUSTOMER_RESTAURANT_SECTIONS = {
  OVERVIEW: "overview",
} as const;

export const DOM_EVENTS = {
  STORAGE: "storage",
} as const;

export const FALLBACK_RESTAURANT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=1800&q=85";

export const DEFAULT_CUISINE_FALLBACK = "Local favorites";

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
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

export const RESTAURANT_PLAN_TYPES = {
  QUEUE_PRO: "QUEUE_PRO",
  SELF_PRO: "SELF_PRO",
  QUEUE_PRO_DISPLAY: "Queue Pro",
  SELF_PRO_DISPLAY: "Self Pro",
} as const;

export const RESTAURANT_STATUS_LABELS = {
  OPEN_TODAY: "Open today",
  CLOSED: "Closed",
  HOURS_VARY: "Hours vary",
} as const;

export const CUSTOMER_NAVIGATION_LABELS = {
  EXPLORE_MENU: "Explore menu",
  OVERVIEW_AND_HOURS: "Overview & hours",
  CATEGORY_SINGULAR: "category",
  CATEGORIES_PLURAL: "categories",
} as const;

export const CUSTOMER_QUEUE_BUTTON_LABELS = {
  JOIN_QUEUE: "Join Queue",
  JOINED_THIS_QUEUE: "Joined this queue",
  CANT_JOIN_QUEUE: "Can't join queue",
  RESTAURANT_CLOSED: "Restaurant Closed",
} as const;

export const CUSTOMER_OVERVIEW_LABELS = {
  ABOUT_TITLE: "About the restaurant",
  DEFAULT_DESCRIPTION: "Discover the menu and plan your visit.",
  HOURS_TITLE: "Operating hours",
  HOURS_NOT_LISTED: "Hours not listed",
  CLOSED: "Closed",
  LOCATION_TITLE: "Location & contact",
  ADDRESS_HEADING: "Address",
  ADDRESS_NOT_AVAILABLE: "Address not available",
  OPEN_MAPS: "Open in Google Maps",
  PHONE_HEADING: "Phone number",
  PHONE_NOT_AVAILABLE: "Not available",
  EMAIL_HEADING: "Email",
  PRE_ORDERS_BADGE: "Pre-orders",
  QR_ORDERS_BADGE: "QR orders",
} as const;
