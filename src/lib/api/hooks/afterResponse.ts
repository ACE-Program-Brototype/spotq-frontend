import type { AfterResponseHook } from "ky";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { redirectToPortalLogin } from "../portal-redirect";

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

      const isBlocked = code === "USER_BLOCKED" || code === "ACCOUNT_BLOCKED";

      if (isBlocked) {
        useAuthStore.getState().clearAuth();
        redirectToPortalLogin();
      }
    } catch {
      // Non-JSON responses safely ignored
    }
  }

  return response;
};
