import type { BeforeRetryHook } from "ky";

export const beforeRetry: BeforeRetryHook = ({ request }) => {
  // TODO: Handle retry-specific logic.

  return request;
};
