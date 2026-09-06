/**
 * Authentication Response Data Mappers
 * Maps raw backend API models to frontend domain models.
 */

import type { ApiAuthResponse, ApiUser, AuthResult, User } from "../types/auth.types";

export const mapApiUserToUser = (apiUser?: ApiUser | null): User => {
  if (!apiUser) {
    return {
      email: "",
      role: "CUSTOMER",
    };
  }

  return {
    id: apiUser.id || apiUser._id,
    fullName: apiUser.full_name || apiUser.name,
    email: apiUser.email,
    role: apiUser.role ?? "CUSTOMER",
    phone: apiUser.phone ?? "",
    status: apiUser.status,
    createdAt: apiUser.created_at ?? new Date().toISOString(),
    updatedAt: apiUser.updated_at ?? new Date().toISOString(),
  };
};

export const mapApiAuthResponseToAuthResult = (response: ApiAuthResponse): AuthResult => {
  const data = response?.data;

  return {
    success: response.success,
    statusCode: response.statusCode,
    message: response.message,
    data: data
      ? {
          user: mapApiUserToUser(data.user),
          accessToken: data.access_token || "",
        }
      : (undefined as unknown as AuthResult["data"]),
  };
};
