import { type BeforeErrorHook, isHTTPError } from "ky";

export interface NormalizedApiErrorData {
  success?: boolean;
  message?: string;
  code?: string;
  error?: string | { message?: string; code?: string };
  errors?: Array<string | { message?: string }>;
  statusCode?: number;
  [key: string]: unknown;
}

export const beforeError: BeforeErrorHook = ({ error }) => {
  if (isHTTPError<NormalizedApiErrorData>(error)) {
    const data = error.data;

    if (typeof data === "object" && data !== null) {
      const serverMessage =
        data.message ||
        (typeof data.error === "string" ? data.error : data.error?.message) ||
        (Array.isArray(data.errors) && data.errors.length > 0
          ? typeof data.errors[0] === "string"
            ? data.errors[0]
            : data.errors[0]?.message
          : undefined);

      if (serverMessage && typeof serverMessage === "string") {
        error.message = serverMessage;
      }
    } else if (typeof data === "string" && data.trim()) {
      error.message = data.trim();
    }
  }

  if (
    !isHTTPError(error) &&
    (error instanceof TypeError ||
      error.name === "TypeError" ||
      /failed to fetch|network error|fetch failed/i.test(error.message || ""))
  ) {
    error.message = "Unable to connect to the server. Please try again in a moment.";
  }

  return error;
};
