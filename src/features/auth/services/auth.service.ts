import { ADMIN_AUTH_ENDPOINTS } from "@/features/auth/constants/auth.endpoints";
import type { LoginFormValues } from "@/features/auth/schemas/login.schema";
import type { User } from "@/features/auth/types/auth.types";
import { apiClient } from "@/lib/api/client";

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    user: User;
  };
};

export type ApiErrorBody = {
  success: boolean;
  message?: string;
};

export async function loginAdmin(data: LoginFormValues): Promise<LoginResponse["data"]> {
  const res = await apiClient
    .post(ADMIN_AUTH_ENDPOINTS.LOGIN, { json: data })
    .json<LoginResponse>();

  return res.data;
}

export async function logoutAdmin(): Promise<void> {
  await apiClient.post(ADMIN_AUTH_ENDPOINTS.LOGOUT).json();
}
