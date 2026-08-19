import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";

export const handleAuthError = async (err: unknown, type: "login" | "google" = "login") => {
  const error = err as Error & { response?: Response };
  const defaultErrorMessage =
    type === "google" ? AUTH_MESSAGES.GOOGLE_FAILED : AUTH_MESSAGES.LOGIN_FAILED;

  if (error.response) {
    try {
      const apiErr = (await error.response.json()) as {
        error?: string;
        message?: string;
      };
      const errCode = apiErr.error;

      if (errCode === "INVALID_CREDENTIALS") {
        toast.error(AUTH_MESSAGES.INVALID_CREDENTIALS);
      } else if (errCode === "ACCOUNT_BLOCKED") {
        toast.error(AUTH_MESSAGES.ACCOUNT_BLOCKED);
      } else if (errCode === "ACCOUNT_INACTIVE") {
        toast.error(AUTH_MESSAGES.ACCOUNT_INACTIVE);
      } else {
        toast.error(apiErr.message || defaultErrorMessage);
      }
    } catch {
      const status = error.response.status;
      if (status === 401) {
        toast.error(AUTH_MESSAGES.INVALID_CREDENTIALS);
      } else if (status === 403) {
        toast.error(AUTH_MESSAGES.ACCOUNT_SUSPENDED);
      } else if (status === 503) {
        toast.error(AUTH_MESSAGES.GENERIC_ERROR);
      } else {
        toast.error(
          type === "google" ? AUTH_MESSAGES.GOOGLE_TRY_AGAIN : AUTH_MESSAGES.UNEXPECTED_ERROR,
        );
      }
    }
  } else if (error.message?.includes("Failed to fetch")) {
    toast.error(AUTH_MESSAGES.CONNECTION_ERROR);
  } else {
    toast.error(AUTH_MESSAGES.GENERIC_ERROR);
  }
};
