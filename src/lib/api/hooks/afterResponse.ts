import type { AfterResponseHook } from "ky";
import { useAuthStore } from "@/features/auth/store/auth.store";

export const afterResponse: AfterResponseHook = async ({ response }) => {
  if (response.status === 403 || response.status === 401) {
    try {
      const cloned = response.clone();
      const data = (await cloned.json()) as
        | {
            code?: string;
            message?: string;
            error?: string | { code?: string; message?: string };
          }
        | undefined;

      const code = data?.code || (typeof data?.error === "object" ? data?.error?.code : undefined);
      const message =
        data?.message || (typeof data?.error === "string" ? data?.error : data?.error?.message);

      const isBlocked =
        code === "USER_BLOCKED" ||
        code === "ACCOUNT_BLOCKED" ||
        (typeof message === "string" && /blocked|suspended/i.test(message));

      if (isBlocked) {
        useAuthStore.getState().clearAuth();

        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    } catch {
      // Non-JSON responses safely ignored
    }
  }

  return response;
};
