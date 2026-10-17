export const STAFF_ROUTE_PATHS = {
  AUTH: {
    LOGIN: "login",
    FORGOT_PASSWORD: "forgot-password",
    FORGOT_PASSWORD_VERIFY: "forgot-password/verify",
    FORGOT_PASSWORD_RESET: "forgot-password/reset-password",
  },
  DASHBOARD: "dashboard",
  PROFILE: {
    ROOT: "profile",
    EDIT: "profile/edit",
  },
  MENU: {
    ROOT: "menu",
    ITEMS: "menu/items",
  },
  QUEUE: "queue",
} as const;

export const STAFF_ROUTES = {
  ROOT: "/staff",
  LOGIN: "/staff/login",
  FORGOT_PASSWORD: "/staff/forgot-password",
  FORGOT_PASSWORD_VERIFY: "/staff/forgot-password/verify",
  FORGOT_PASSWORD_RESET: "/staff/forgot-password/reset-password",

  DASHBOARD: "/staff/dashboard",
  PROFILE: {
    ROOT: "/staff/profile",
    EDIT: "/staff/profile/edit",
  },
  MENU: {
    ROOT: "/staff/menu",
    ITEMS: "/staff/menu/items",
  },
  QUEUE: "/staff/queue",
} as const;
