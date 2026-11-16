import type { QueryClientConfig } from "@tanstack/react-query";

export const shouldRetryQuery = (failureCount: number, error: unknown): boolean => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    (error as { response?: { status?: number } }).response
  ) {
    const status = (error as { response: { status: number } }).response.status;
    if (status === 401 || status === 403 || status === 404 || status === 422) {
      return false;
    }
  }
  return failureCount < 2;
};

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,
    },
  },
};
