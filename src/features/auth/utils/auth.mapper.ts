import type { ApiAuthResponse, ApiUser, AuthResult, User } from "../types/auth.types";

/**
 * Maps raw backend ApiUser (which may have snake_case fields like full_name, created_at)
 * to our clean frontend User domain model (camelCase).
 */
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

/**
 * Maps raw API authentication response to normalized frontend AuthResult.
 */
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
