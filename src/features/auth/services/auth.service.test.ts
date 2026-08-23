import { ADMIN_AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { apiClient } from "@/lib/api/client";
import { loginAdmin, logoutAdmin } from "./auth.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe("auth.service", () => {
  const mockPost = apiClient.post as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loginAdmin", () => {
    it("calls apiClient.post with the correct endpoint, payload, and returns data", async () => {
      const mockCredentials = {
        email: "admin@spotq.com",
        password: "securepassword123",
      };

      const mockResponseData = {
        access_token: "mock-jwt-token",
        user: {
          _id: "admin-1",
          name: "Admin User",
          email: "admin@spotq.com",
          created_at: "2026-08-18T21:59:52.665Z",
        },
      };

      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          message: "Login successful",
          data: mockResponseData,
        }),
      });

      const result = await loginAdmin(mockCredentials);

      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledWith(ADMIN_AUTH_ENDPOINTS.LOGIN, {
        json: mockCredentials,
      });
      expect(result).toEqual(mockResponseData);
    });

    it("propagates error when apiClient.post rejects", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockRejectedValueOnce(new Error("Network error")),
      });

      await expect(
        loginAdmin({ email: "admin@spotq.com", password: "password123" }),
      ).rejects.toThrow("Network error");
    });
  });

  describe("logoutAdmin", () => {
    it("calls apiClient.post with ADMIN_AUTH_ENDPOINTS.LOGOUT", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({ success: true }),
      });

      await logoutAdmin();

      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledWith(ADMIN_AUTH_ENDPOINTS.LOGOUT);
    });

    it("propagates error when logout API fails", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockRejectedValueOnce(new Error("Logout failed on server")),
      });

      await expect(logoutAdmin()).rejects.toThrow("Logout failed on server");
    });
  });
});
