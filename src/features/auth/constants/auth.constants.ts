export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  ADMIN_LOGIN_SUCCESS: "Welcome back! Redirecting to dashboard…",
  LOGOUT_SUCCESS: "Successfully logged out!",
  ADMIN_LOGOUT_SUCCESS: "Logged out successfully.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  ACCOUNT_BLOCKED: "Your account has been blocked.",
  ACCOUNT_INACTIVE: "Your account is inactive.",
  ACCOUNT_SUSPENDED: "Your account is suspended/inactive.",
  CONNECTION_ERROR:
    "Unable to connect. Please check your connection and try again.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
  UNEXPECTED_ERROR: "An unexpected error occurred. Please try again.",
  LOGIN_FAILED: "Login failed. Please try again.",
  LOGOUT_FAILED: "Logout encountered an issue.",

  GOOGLE_SUCCESS: "Google Authentication successful!",
  GOOGLE_FAILED: "Google authentication failed.",
  GOOGLE_TRY_AGAIN: "Google authentication failed. Please try again.",

  REGISTER_SUCCESS: "Registration successful",
  OTP_RESEND_SUCCESS: "OTP resend successful",

  OTP_SENT_SUCCESS: "OTP sent successfully to your email.",
  OTP_RESENT_SUCCESS: "A new OTP has been sent to your email.",
  OTP_VERIFIED_SUCCESS: "Identity verified successfully.",
  PASSWORD_RESET_SUCCESS:
    "Password reset successful! Please sign in with your new password.",
} as const;

export const AUTH_ENDPOINTS = {
  LOGIN: "auth/users/login",

  GOOGLE_LOGIN: "auth/users/oauth/google",

  LOGOUT: "auth/users/logout",

  REFRESH_TOKEN: "auth/users/refresh-token",

  REGISTER: "auth/users/register",

  VERIFY_OTP: "auth/users/verify-otp",

  RESEND_EMAIL_OTP: "auth/users/resend-email-otp",

  FORGOT_PASSWORD: "auth/users/forgot-password",

  FORGOT_PASSWORD_VERIFY: "auth/users/forgot-password/verify",

  FORGOT_PASSWORD_RESEND_OTP: "auth/users/forgot-password/resend-otp",

  RESET_PASSWORD: "auth/users/reset-password",

  ADMIN_LOGIN: "admin/auth/login",
  ADMIN_LOGOUT: "admin/auth/logout",
  ADMIN_FORGOT_PASSWORD: "admin/auth/forgot-password",
  ADMIN_VERIFY_OTP: "admin/auth/forgot-password/verify",
  ADMIN_RESEND_OTP: "admin/auth/forgot-password/resend-otp",
  ADMIN_RESET_PASSWORD: "admin/auth/reset-password",

  RESTAURANT_SEND_OTP: "restaurants/registration/email-otp",
  RESTAURANT_RESEND_OTP: "restaurants/registration/resend-email-otp",
  RESTAURANT_VERIFY_OTP: "restaurants/registration/email-otp/verify",
  RESTAURANT_ONBOARD: "restaurants/onboard",

  STAFF_LOGIN: "restaurants/staff/login",
  STAFF_REFRESH_TOKEN: "restaurants/staff/refresh-token",
  STAFF_LOGOUT: "restaurants/staff/logout",
  STAFF_FORGOT_PASSWORD: "restaurants/staff/forgot-password",
  STAFF_VERIFY_OTP: "restaurants/staff/forgot-password/verify",
  STAFF_RESEND_OTP: "restaurants/staff/forgot-password/resend-otp",
  STAFF_RESET_PASSWORD: "restaurants/staff/reset-password",
} as const;

export const ADMIN_AUTH_ENDPOINTS = {
  LOGIN: AUTH_ENDPOINTS.ADMIN_LOGIN,
  LOGOUT: AUTH_ENDPOINTS.ADMIN_LOGOUT,
  FORGOT_PASSWORD: AUTH_ENDPOINTS.ADMIN_FORGOT_PASSWORD,
  VERIFY_OTP: AUTH_ENDPOINTS.ADMIN_VERIFY_OTP,
  RESEND_OTP: AUTH_ENDPOINTS.ADMIN_RESEND_OTP,
  RESET_PASSWORD: AUTH_ENDPOINTS.ADMIN_RESET_PASSWORD,
} as const;

export const STAFF_AUTH_ENDPOINTS = {
  LOGIN: AUTH_ENDPOINTS.STAFF_LOGIN,
  REFRESH_TOKEN: AUTH_ENDPOINTS.STAFF_REFRESH_TOKEN,
  LOGOUT: AUTH_ENDPOINTS.STAFF_LOGOUT,
  FORGOT_PASSWORD: AUTH_ENDPOINTS.STAFF_FORGOT_PASSWORD,
  VERIFY_OTP: AUTH_ENDPOINTS.STAFF_VERIFY_OTP,
  RESEND_OTP: AUTH_ENDPOINTS.STAFF_RESEND_OTP,
  RESET_PASSWORD: AUTH_ENDPOINTS.STAFF_RESET_PASSWORD,
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
  AUTH_ENDPOINTS.RESTAURANT_SEND_OTP,
  AUTH_ENDPOINTS.RESTAURANT_RESEND_OTP,
  AUTH_ENDPOINTS.RESTAURANT_VERIFY_OTP,
  AUTH_ENDPOINTS.RESTAURANT_ONBOARD,
  AUTH_ENDPOINTS.STAFF_LOGIN,
  AUTH_ENDPOINTS.STAFF_REFRESH_TOKEN,
  AUTH_ENDPOINTS.STAFF_LOGOUT,
  AUTH_ENDPOINTS.STAFF_FORGOT_PASSWORD,
  AUTH_ENDPOINTS.STAFF_VERIFY_OTP,
  AUTH_ENDPOINTS.STAFF_RESEND_OTP,
  AUTH_ENDPOINTS.STAFF_RESET_PASSWORD,
] as const;

export const RESTAURANT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const RESTAURANT_OTP_LENGTH = 6;
export const RESTAURANT_RESEND_COOLDOWN_SECONDS = 60;
export const RESTAURANT_MAX_ATTEMPTS_ERROR_CODE = "MAX_ATTEMPTS_EXCEEDED";
