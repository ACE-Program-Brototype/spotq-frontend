import type { ApiUser } from "../types/auth.types";
import { mapApiAuthResponseToAuthResult, mapApiUserToUser } from "./auth.mapper";

describe("auth.mapper", () => {
  describe("mapApiUserToUser", () => {
    test("should correctly map snake_case API user fields to camelCase User domain model", () => {
      const apiUser: ApiUser = {
        id: "user-123",
        full_name: "Jane Doe",
        email: "jane@example.com",
        phone: "+1234567890",
        status: "ACTIVE",
        role: "CUSTOMER",
        created_at: "2026-08-20T10:00:00.000Z",
        updated_at: "2026-08-20T11:00:00.000Z",
      };

      const user = mapApiUserToUser(apiUser);

      expect(user).toEqual({
        id: "user-123",
        fullName: "Jane Doe",
        email: "jane@example.com",
        role: "CUSTOMER",
        phone: "+1234567890",
        status: "ACTIVE",
        createdAt: "2026-08-20T10:00:00.000Z",
        updatedAt: "2026-08-20T11:00:00.000Z",
      });
    });

    test("should handle missing optional fields with defaults", () => {
      const apiUser: ApiUser = {
        id: "user-456",
        full_name: "John Smith",
        email: "john@example.com",
        status: "ACTIVE",
      };

      const user = mapApiUserToUser(apiUser);

      expect(user.fullName).toBe("John Smith");
      expect(user.role).toBe("CUSTOMER");
      expect(user.phone).toBe("");
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });
  });

  describe("mapApiAuthResponseToAuthResult", () => {
    test("should normalize response data with accessToken and mapped user", () => {
      const rawApiResponse = {
        success: true,
        statusCode: 200,
        message: "Success",
        data: {
          user: {
            id: "user-789",
            full_name: "Alex Lee",
            email: "alex@example.com",
            status: "ACTIVE",
          },
          access_token: "jwt-token-123",
        },
      };

      const result = mapApiAuthResponseToAuthResult(rawApiResponse);

      expect(result).toEqual({
        success: true,
        statusCode: 200,
        message: "Success",
        data: {
          user: {
            id: "user-789",
            fullName: "Alex Lee",
            email: "alex@example.com",
            role: "CUSTOMER",
            phone: "",
            status: "ACTIVE",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          accessToken: "jwt-token-123",
        },
      });
    });
  });
});
