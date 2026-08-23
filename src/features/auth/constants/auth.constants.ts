export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  ADMIN_LOGIN_SUCCESS: "Welcome back! Redirecting to dashboard…",
  LOGOUT_SUCCESS: "Successfully logged out!",
  ADMIN_LOGOUT_SUCCESS: "Logged out successfully.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  ACCOUNT_BLOCKED: "Your account has been blocked.",
  ACCOUNT_INACTIVE: "Your account is inactive.",
  ACCOUNT_SUSPENDED: "Your account is suspended/inactive.",
  CONNECTION_ERROR: "Unable to connect. Please check your connection and try again.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
  UNEXPECTED_ERROR: "An unexpected error occurred. Please try again.",
  LOGIN_FAILED: "Login failed. Please try again.",
  LOGOUT_FAILED: "Logout encountered an issue.",

  GOOGLE_SUCCESS: "Google Authentication successful!",
  GOOGLE_FAILED: "Google authentication failed.",
  GOOGLE_TRY_AGAIN: "Google authentication failed. Please try again.",
} as const;

export const AUTH_ENDPOINTS = {
  // Customer Auth Endpoints
  LOGIN: "/users/login",
  GOOGLE_LOGIN: "/users/oauth/google",
  LOGOUT: "/users/logout",
  REFRESH_TOKEN: "/users/refresh-token",

  // Admin Auth Endpoints
  ADMIN_LOGIN: "/admin/auth/login",
  ADMIN_LOGOUT: "/admin/auth/logout",
} as const;

export const ADMIN_AUTH_ENDPOINTS = {
  LOGIN: AUTH_ENDPOINTS.ADMIN_LOGIN,
  LOGOUT: AUTH_ENDPOINTS.ADMIN_LOGOUT,
} as const;

export const PUBLIC_AUTH_ENDPOINTS = [
  AUTH_ENDPOINTS.LOGIN,
  AUTH_ENDPOINTS.GOOGLE_LOGIN,
  AUTH_ENDPOINTS.REFRESH_TOKEN,
  AUTH_ENDPOINTS.ADMIN_LOGIN,
] as const;
