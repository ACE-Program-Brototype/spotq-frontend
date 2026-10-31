/**
 * Restaurant Route Paths and Navigation Helpers
 * Single source of truth for all /restaurant/* routes.
 */

// Relative route paths used in React Router route definitions
export const RESTAURANT_ROUTE_PATHS = {
  TERMS: "terms",
  PRIVACY: "privacy",

  AUTH: {
    LOGIN: "login",
    VERIFY: "verify",
  },

  SUBSCRIPTION: {
    INDEX: "subscription",
    SUCCESS: "subscription/success",
    FAILURE: "subscription/failure",
  },

  ONBOARDING: {
    ROOT: "onboarding",
    STATUS: "status",
    BUSINESS_INFORMATION: "business-information",
    DOCUMENTS: "documents",
    LOCATION: "location",
    REVIEW: "review",
  },

  DASHBOARD: "dashboard",
  PROFILE: "profile",
  SETTINGS_ACCOUNT: "settings/account",

  STAFF: {
    ROOT: "staff",
    INVITATIONS: "invitations",
    DETAIL: ":staffId",
    EDIT: ":staffId/edit",
  },

  MENU: {
    ROOT: "menu",
    CATEGORIES: "categories",
    MODIFIERS: "modifiers",
    ITEMS: "items",
    CREATE: "items/create",
    DETAIL: "items/:itemId",
    EDIT: "items/:itemId/edit",
  },

  TABLE: {
    ROOT: "tables",
    CREATE: "tables/create",
    VIEW: "tables/:tableId",
  },
} as const;

// Absolute paths and route builders for navigate() and <Link to="..." />
export const RESTAURANT_ROUTES = {
  ROOT: "/restaurant",

  TERMS: "/restaurant/terms",
  PRIVACY: "/restaurant/privacy",

  // Auth
  LOGIN: "/restaurant/login",
  VERIFY: "/restaurant/verify",

  // Subscription
  SUBSCRIPTION: "/restaurant/subscription",
  SUBSCRIPTION_SUCCESS: "/restaurant/subscription/success",
  SUBSCRIPTION_FAILURE: "/restaurant/subscription/failure",

  // Onboarding
  ONBOARDING: {
    ROOT: "/restaurant/onboarding",
    STATUS: "/restaurant/onboarding/status",
    BUSINESS_INFORMATION: "/restaurant/onboarding/business-information",
    DOCUMENTS: "/restaurant/onboarding/documents",
    LOCATION: "/restaurant/onboarding/location",
    REVIEW: "/restaurant/onboarding/review",
  },

  // Admin Dashboard & Settings
  DASHBOARD: "/restaurant/dashboard",
  PROFILE: "/restaurant/profile",
  SETTINGS_ACCOUNT: "/restaurant/settings/account",

  // Staff Management
  STAFF: {
    ROOT: "/restaurant/staff",
    INVITATIONS: "/restaurant/staff/invitations",
    DETAIL_PATTERN: "/restaurant/staff/:staffId",
    DETAIL: (staffId: string) => `/restaurant/staff/${staffId}`,
    EDIT: (staffId: string) => `/restaurant/staff/${staffId}/edit`,
  },

  // Menu Management
  MENU: {
    ROOT: "/restaurant/menu",
    CATEGORIES: "/restaurant/menu/categories",
    MODIFIERS: "/restaurant/menu/modifiers",
    ITEMS: "/restaurant/menu/items",
    CREATE: "/restaurant/menu/items/create",
    DETAIL_PATTERN: "/restaurant/menu/items/:itemId",
    DETAIL: (itemId: string) => `/restaurant/menu/items/${itemId}`,
    EDIT: (itemId: string) => `/restaurant/menu/items/${itemId}/edit`,
  },

  TABLE: {
    ROOT: "/restaurant/tables",
    CREATE: "/restaurant/tables/create",
    VIEW: (tableId: string) => `/restaurant/tables/${tableId}`,
  },
} as const;
