/**
 * Authentication Response Data Mappers
 * Maps raw backend API models to frontend domain models.
 */

import type { ApiAuthResponse, ApiUser, AuthResult, User } from "../types/auth.types";

export const mapApiUserToUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.id,
    fullName: apiUser.full_name,
    email: apiUser.email,
    role: apiUser.role ?? "CUSTOMER",
    phone: apiUser.phone ?? "",
    status: apiUser.status,
    createdAt: apiUser.created_at ?? new Date().toISOString(),
    updatedAt: apiUser.updated_at ?? new Date().toISOString(),
  };
};

export const mapApiAuthResponseToAuthResult = (response: ApiAuthResponse): AuthResult => {
  return {
    success: response.success,
    statusCode: response.statusCode,
    message: response.message,
    data: {
      user: mapApiUserToUser(response.data.user),
      accessToken: response.data.access_token,
    },
  };
};
