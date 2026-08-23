import { isHTTPError, isNetworkError, isTimeoutError } from "ky";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";

export interface ApiErrorPayload {
  success?: boolean;
  message?: string;
  code?: string;
  error?: string | { message?: string; code?: string };
  errors?: Array<string | { message?: string }>;
  statusCode?: number;
  [key: string]: unknown;
}

/**
 * Extracts a human-friendly error message from API response data or error payload.
 */
export const extractErrorMessage = (data: unknown): string | null => {
  if (!data || typeof data !== "object") return null;

  const payload = data as ApiErrorPayload;

  // 1. Direct message field from server (e.g. "Invalid email or password.")
  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message.trim();
  }

  // 2. Code or Error string mapping
  const errorCode =
    typeof payload.code === "string"
      ? payload.code.trim()
      : typeof payload.error === "string"
        ? payload.error.trim()
        : null;

  if (errorCode) {
    const upper = errorCode.toUpperCase();
    if (upper === "INVALID_CREDENTIALS") return AUTH_MESSAGES.INVALID_CREDENTIALS;
    if (upper === "ACCOUNT_BLOCKED") return AUTH_MESSAGES.ACCOUNT_BLOCKED;
    if (upper === "ACCOUNT_INACTIVE" || upper === "ACCOUNT_SUSPENDED") {
      return AUTH_MESSAGES.ACCOUNT_SUSPENDED;
    }
    return errorCode;
  }

  // 3. Nested error object (e.g. { error: { message: "..." } })
  if (payload.error && typeof payload.error === "object") {
    if (typeof payload.error.message === "string" && payload.error.message.trim()) {
      return payload.error.message.trim();
    }
  }

  // 4. Validation errors array (e.g. { errors: [{ message: "..." }] } or { errors: ["..."] })
  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    const first = payload.errors[0];
    if (typeof first === "string" && first.trim()) {
      return first.trim();
    }
    if (
      first &&
      typeof first === "object" &&
      typeof (first as { message?: string }).message === "string"
    ) {
      return (first as { message: string }).message.trim();
    }
  }

  return null;
};

/**
 * Global authentication error handler that displays tailored Sonner toast messages.
 * Uses official Ky error data and type guards (isHTTPError, isNetworkError, isTimeoutError).
 */
export const handleAuthError = (err: unknown, type: "login" | "google" = "login") => {
  const defaultErrorMessage =
    type === "google" ? AUTH_MESSAGES.GOOGLE_FAILED : AUTH_MESSAGES.LOGIN_FAILED;

  // 1. Handle Ky HTTPError with pre-parsed error.data
  if (isHTTPError<ApiErrorPayload>(err)) {
    const serverMessage = extractErrorMessage(err.data);
    if (serverMessage) {
      toast.error(serverMessage);
      return;
    }

    // Status code fallback if no message in body
    const status = err.response.status;
    if (status === 401) {
      toast.error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    } else if (status === 403) {
      toast.error(AUTH_MESSAGES.ACCOUNT_SUSPENDED);
    } else if (status === 429) {
      toast.error("Too many requests. Please try again later.");
    } else if (status >= 500) {
      toast.error(AUTH_MESSAGES.GENERIC_ERROR);
    } else {
      toast.error(
        type === "google" ? AUTH_MESSAGES.GOOGLE_TRY_AGAIN : AUTH_MESSAGES.UNEXPECTED_ERROR,
      );
    }
    return;
  }

  // 2. Handle Ky NetworkError
  if (isNetworkError(err)) {
    toast.error(AUTH_MESSAGES.CONNECTION_ERROR);
    return;
  }

  // 3. Handle Ky TimeoutError
  if (isTimeoutError(err)) {
    toast.error("Request timed out. Please check your connection and try again.");
    return;
  }

  // 4. Handle general Errors (Fetch TypeError, custom message, or fallback)
  if (err instanceof Error) {
    const isFetchError =
      err.name === "TypeError" ||
      err.message.toLowerCase().includes("failed to fetch") ||
      err.message.toLowerCase().includes("network");

    if (isFetchError) {
      toast.error(AUTH_MESSAGES.CONNECTION_ERROR);
      return;
    }

    if (
      err.message?.trim() &&
      err.message !== "Error" &&
      !err.message.startsWith("Request failed with status code")
    ) {
      toast.error(err.message);
      return;
    }
  }

  toast.error(defaultErrorMessage);
};
