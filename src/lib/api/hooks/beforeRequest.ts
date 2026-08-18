import type { BeforeRequestHook } from "ky";
import { useAuthStore } from "@/features/auth/store/auth.store";

export const beforeRequest: BeforeRequestHook = ({ request }) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }

  return request;
};
