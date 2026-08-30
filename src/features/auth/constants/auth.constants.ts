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

  REGISTER_SUCCESS: "Registration successful",
  OTP_RESEND_SUCCESS: "OTP resend successful",

  // Forgot Password / OTP / Reset Password
  OTP_SENT_SUCCESS: "OTP sent successfully to your email.",
  OTP_RESENT_SUCCESS: "A new OTP has been sent to your email.",
  OTP_VERIFIED_SUCCESS: "Identity verified successfully.",
  PASSWORD_RESET_SUCCESS: "Password reset successful! Please sign in with your new password.",
} as const;

export const AUTH_ENDPOINTS = {
  // Customer Auth Endpoints
  LOGIN: "users/login",
  GOOGLE_LOGIN: "users/oauth/google",
  LOGOUT: "users/logout",
  REFRESH_TOKEN: "users/refresh-token",
  REGISTER: "users/register",
  VERIFY_OTP: "users/verify-email",
  RESEND_EMAIL_OTP: "users/resend-email-otp",
  FORGOT_PASSWORD: "users/forgot-password",
  FORGOT_PASSWORD_VERIFY: "users/forgot-password/verify",
  FORGOT_PASSWORD_RESEND_OTP: "users/forgot-password/resend-otp",
  RESET_PASSWORD: "users/reset-password",

  // Admin Auth Endpoints
  ADMIN_LOGIN: "admin/auth/login",
  ADMIN_LOGOUT: "admin/auth/logout",
  ADMIN_FORGOT_PASSWORD: "admin/auth/forgot-password",
  ADMIN_VERIFY_OTP: "admin/auth/forgot-password/verify",
  ADMIN_RESEND_OTP: "admin/auth/forgot-password/resend-otp",
  ADMIN_RESET_PASSWORD: "admin/auth/reset-password",

  STAFF_LOGIN: "restaurants/staff/login",
  STAFF_REFRESH_TOKEN: "restaurants/staff/refresh-token",
  STAFF_LOGOUT: "restaurants/staff/logout",
} as const;

export const ADMIN_AUTH_ENDPOINTS = {
  LOGIN: AUTH_ENDPOINTS.ADMIN_LOGIN,
  LOGOUT: AUTH_ENDPOINTS.ADMIN_LOGOUT,
  FORGOT_PASSWORD: AUTH_ENDPOINTS.ADMIN_FORGOT_PASSWORD,
  VERIFY_OTP: AUTH_ENDPOINTS.ADMIN_VERIFY_OTP,
  RESEND_OTP: AUTH_ENDPOINTS.ADMIN_RESEND_OTP,
  RESET_PASSWORD: AUTH_ENDPOINTS.ADMIN_RESET_PASSWORD,
} as const;

export const PUBLIC_AUTH_ENDPOINTS = [
  AUTH_ENDPOINTS.LOGIN,
  AUTH_ENDPOINTS.GOOGLE_LOGIN,
  AUTH_ENDPOINTS.REFRESH_TOKEN,
  AUTH_ENDPOINTS.REGISTER,
  AUTH_ENDPOINTS.VERIFY_OTP,
  AUTH_ENDPOINTS.RESEND_EMAIL_OTP,
  AUTH_ENDPOINTS.FORGOT_PASSWORD,
  AUTH_ENDPOINTS.FORGOT_PASSWORD_VERIFY,
  AUTH_ENDPOINTS.FORGOT_PASSWORD_RESEND_OTP,
  AUTH_ENDPOINTS.RESET_PASSWORD,
  AUTH_ENDPOINTS.ADMIN_LOGIN,
  AUTH_ENDPOINTS.ADMIN_FORGOT_PASSWORD,
  AUTH_ENDPOINTS.ADMIN_VERIFY_OTP,
  AUTH_ENDPOINTS.ADMIN_RESEND_OTP,
  AUTH_ENDPOINTS.ADMIN_RESET_PASSWORD,
  AUTH_ENDPOINTS.STAFF_LOGIN,
  AUTH_ENDPOINTS.STAFF_REFRESH_TOKEN,
  AUTH_ENDPOINTS.STAFF_LOGOUT,
] as const;
