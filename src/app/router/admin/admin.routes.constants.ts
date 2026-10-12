/**
 * Admin Route Paths and Navigation Helpers
 * Single source of truth for all /admin/* routes.
 */

// Relative route paths used in React Router route definitions
export const ADMIN_ROUTE_PATHS = {
  AUTH: {
    LOGIN: "login",
    FORGOT_PASSWORD: "forgot-password",
    FORGOT_PASSWORD_VERIFY: "forgot-password/verify",
    FORGOT_PASSWORD_RESET: "forgot-password/reset-password",
  },
  DASHBOARD: "dashboard",
  RESTAURANTS: "restaurants",
  RESTAURANTS_MANAGEMENT: "restaurants/management",
  RESTAURANTS_ONBOARDING: "restaurants/onboarding",
  RESTAURANTS_ONBOARDING_DETAIL: "restaurants/onboarding/:id",
  RESTAURANT_DETAIL: "restaurants/:id",
  CUSTOMERS: "customers",
  CUSTOMER_DETAIL: "customers/:id",
  SUBSCRIPTION: "subscription",
  PAYMENTS: {
    ORDERS: "payments/orders",
    SUBSCRIPTIONS: "payments/subscriptions",
  },
  CAMPAIGNS: "campaigns",
  COUPONS: "coupons",
} as const;

// Absolute paths and route builders for navigate() and <Link to="..." />
export const ADMIN_ROUTES = {
  ROOT: "/admin",
  LOGIN: "/admin/login",
  FORGOT_PASSWORD: "/admin/forgot-password",
  FORGOT_PASSWORD_VERIFY: "/admin/forgot-password/verify",
  FORGOT_PASSWORD_RESET: "/admin/forgot-password/reset-password",

  DASHBOARD: "/admin/dashboard",
  RESTAURANTS: "/admin/restaurants",
  RESTAURANTS_MANAGEMENT: "/admin/restaurants/management",
  RESTAURANTS_ONBOARDING: "/admin/restaurants/onboarding",
  RESTAURANTS_ONBOARDING_DETAIL_PATTERN: "/admin/restaurants/onboarding/:id",
  RESTAURANTS_ONBOARDING_DETAIL: (id: string) => `/admin/restaurants/onboarding/${id}`,
  RESTAURANT_DETAIL_PATTERN: "/admin/restaurants/:id",
  RESTAURANT_DETAIL: (id: string) => `/admin/restaurants/${id}`,
  CUSTOMERS: "/admin/customers",
  CUSTOMER_DETAIL_PATTERN: "/admin/customers/:id",
  CUSTOMER_DETAIL: (id: string) => `/admin/customers/${id}`,
  SUBSCRIPTION: "/admin/subscription",
  PAYMENTS: {
    ORDERS: "/admin/payments/orders",
    SUBSCRIPTIONS: "/admin/payments/subscriptions",
  },
  CAMPAIGNS: "/admin/campaigns",
  COUPONS: "/admin/coupons",
} as const;
