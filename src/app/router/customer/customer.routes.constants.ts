/**
 * Customer Route Paths and Navigation Helpers
 * Single source of truth for all customer / root routes.
 */

// Route paths used in React Router route definitions
export const CUSTOMER_ROUTE_PATHS = {
  HOME: "/",
  ABOUT: "/about",
  RESTAURANT_DETAIL: "/restaurants/:id",

  PROFILE: {
    ROOT: "/profile",
    EDIT: "edit",
  },

  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    FORGOT_PASSWORD_VERIFY: "/forgot-password/verify",
    FORGOT_PASSWORD_RESET: "/forgot-password/reset-password",
    VERIFY_OTP: "/verify-otp",
  },

  CART: "/cart",
  NOTIFICATIONS: "/notifications",
  ORDERS: "/orders",
  ORDER_RECEIPT: "/orders/:orderId/receipt",
  QUEUES: "/queues",
  LOYALTIES: "/loyalties",
  PAYMENTS: "/payments",

  LEGAL: {
    TERMS: "/terms",
    PRIVACY: "/privacy",
    COOKIES: "/cookies",
  },
} as const;

// Absolute paths and route builders for navigate() and <Link to="..." />
export const CUSTOMER_ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  RESTAURANTS: "/restaurants",
  RESTAURANT_DETAIL: (id: string | number) => `/restaurants/${id}`,

  PROFILE: {
    ROOT: "/profile",
    EDIT: "/profile/edit",
  },

  CART: "/cart",
  NOTIFICATIONS: "/notifications",
  ORDERS: "/orders",
  ORDER_RECEIPT: (id: string | number) => `/orders/${id}/receipt`,
  QUEUES: "/queues",
  LOYALTIES: "/loyalties",
  PAYMENTS: "/payments",

  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    FORGOT_PASSWORD_VERIFY: "/forgot-password/verify",
    FORGOT_PASSWORD_RESET: "/forgot-password/reset-password",
    VERIFY_OTP: "/verify-otp",
  },

  LEGAL: {
    TERMS: "/terms",
    PRIVACY: "/privacy",
    COOKIES: "/cookies",
  },
} as const;
