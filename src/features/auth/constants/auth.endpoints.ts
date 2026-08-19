export const AUTH_ENDPOINTS = {
  ADMIN_LOGIN: "admin/auth/login",
  ADMIN_LOGOUT: "admin/auth/logout",
} as const;

export const ADMIN_AUTH_ENDPOINTS = {
  LOGIN: AUTH_ENDPOINTS.ADMIN_LOGIN,
  LOGOUT: AUTH_ENDPOINTS.ADMIN_LOGOUT,
} as const;
