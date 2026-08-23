export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  LOGOUT_SUCCESS: "Successfully logged out!",
  INVALID_CREDENTIALS: "Invalid email or password.",
  ACCOUNT_BLOCKED: "Your account has been blocked.",
  ACCOUNT_INACTIVE: "Your account is inactive.",
  ACCOUNT_SUSPENDED: "Your account is suspended/inactive.",
  CONNECTION_ERROR: "Unable to connect. Please check your connection and try again.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
  UNEXPECTED_ERROR: "An unexpected error occurred. Please try again.",
  LOGIN_FAILED: "Login failed. Please try again.",

  GOOGLE_SUCCESS: "Google Authentication successful!",
  GOOGLE_FAILED: "Google authentication failed.",
  GOOGLE_TRY_AGAIN: "Google authentication failed. Please try again.",

  REGISTER_SUCCESS: "Registration successful",
} as const;

export const AUTH_ENDPOINTS = {
  LOGIN: "api/v1/users/login",
  GOOGLE_LOGIN: "api/v1/users/oauth/google",
  LOGOUT: "api/v1/users/logout",
  REFRESH_TOKEN: "api/v1/users/refresh-token",
  REGISTER: "api/v1/users/register",
} as const;
