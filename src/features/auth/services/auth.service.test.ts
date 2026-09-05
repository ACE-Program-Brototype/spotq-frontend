import {
  ADMIN_AUTH_ENDPOINTS,
  AUTH_ENDPOINTS,
  RESTAURANT_AUTH_ENDPOINTS,
  STAFF_AUTH_ENDPOINTS,
} from "@/features/auth/constants/auth.constants";
import { apiClient } from "@/lib/api/client";
import {
  adminForgotPassword,
  adminResendOtp,
  adminResetPassword,
  adminVerifyOtp,
  forgotPassword,
  loginAdmin,
  logoutAdmin,
  resendOtp,
  resetPassword,
  staffForgotPassword,
  staffResendOtp,
  staffResetPassword,
  staffVerifyOtp,
  verifyRestaurantEmailOtp,
  verifyOtp,
} from "./auth.service";

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

  describe("customer forgot password flow", () => {
    it("forgotPassword calls correct endpoint and payload", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({ success: true, message: "OTP sent" }),
      });

      const res = await forgotPassword({ email: "user@example.com" });
      expect(mockPost).toHaveBeenCalledWith(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
        json: { email: "user@example.com" },
      });
      expect(res).toEqual({ success: true, message: "OTP sent" });
    });

    it("verifyOtp calls correct endpoint and payload", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({ success: true, message: "Verified" }),
      });

      const res = await verifyOtp({ email: "user@example.com", otp: "123456" });
      expect(mockPost).toHaveBeenCalledWith(AUTH_ENDPOINTS.FORGOT_PASSWORD_VERIFY, {
        json: { email: "user@example.com", otp: "123456" },
      });
      expect(res).toEqual({ success: true, message: "Verified" });
    });

    it("resendOtp calls correct endpoint and payload", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({ success: true, message: "Resent" }),
      });

      const res = await resendOtp({ email: "user@example.com" });
      expect(mockPost).toHaveBeenCalledWith(AUTH_ENDPOINTS.FORGOT_PASSWORD_RESEND_OTP, {
        json: { email: "user@example.com" },
      });
      expect(res).toEqual({ success: true, message: "Resent" });
    });

    it("resetPassword calls correct endpoint and payload", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({ success: true, message: "Password reset" }),
      });

      const res = await resetPassword({ password: "NewPassword123!" });
      expect(mockPost).toHaveBeenCalledWith(AUTH_ENDPOINTS.RESET_PASSWORD, {
        json: { password: "NewPassword123!" },
      });
      expect(res).toEqual({ success: true, message: "Password reset" });
    });
  });

  describe("admin forgot password flow", () => {
    it("adminForgotPassword calls correct endpoint and payload", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({ success: true }),
      });
      await adminForgotPassword({ email: "admin@spotq.com" });
      expect(mockPost).toHaveBeenCalledWith(ADMIN_AUTH_ENDPOINTS.FORGOT_PASSWORD, {
        json: { email: "admin@spotq.com" },
      });
    });

    it("adminVerifyOtp calls correct endpoint and payload", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({ success: true }),
      });
      await adminVerifyOtp({ email: "admin@spotq.com", otp: "654321" });
      expect(mockPost).toHaveBeenCalledWith(ADMIN_AUTH_ENDPOINTS.VERIFY_OTP, {
        json: { email: "admin@spotq.com", otp: "654321" },
      });
    });

    it("adminResendOtp calls correct endpoint and payload", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({ success: true }),
      });
      await adminResendOtp({ email: "admin@spotq.com" });
      expect(mockPost).toHaveBeenCalledWith(ADMIN_AUTH_ENDPOINTS.RESEND_OTP, {
        json: { email: "admin@spotq.com" },
      });
    });

    it("adminResetPassword calls correct endpoint and payload", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({ success: true }),
      });
      await adminResetPassword({ password: "AdminPassword123!" });
      expect(mockPost).toHaveBeenCalledWith(ADMIN_AUTH_ENDPOINTS.RESET_PASSWORD, {
        json: { password: "AdminPassword123!" },
      });
    });
  });

  describe("restaurant staff forgot password flow", () => {
    it("staffForgotPassword calls correct endpoint and payload", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({ success: true, message: "OTP sent" }),
      });
      const res = await staffForgotPassword({ email: "staff@spotq.com" });
      expect(mockPost).toHaveBeenCalledWith(STAFF_AUTH_ENDPOINTS.FORGOT_PASSWORD, {
        json: { email: "staff@spotq.com" },
      });
      expect(res).toEqual({ success: true, message: "OTP sent" });
    });

    it("staffVerifyOtp calls correct endpoint and payload", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({ success: true, message: "Verified" }),
      });
      const res = await staffVerifyOtp({ email: "staff@spotq.com", otp: "123456" });
      expect(mockPost).toHaveBeenCalledWith(STAFF_AUTH_ENDPOINTS.VERIFY_OTP, {
        json: { email: "staff@spotq.com", otp: "123456" },
      });
      expect(res).toEqual({ success: true, message: "Verified" });
    });

    it("staffResendOtp calls correct endpoint and payload", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({ success: true, message: "OTP resent" }),
      });
      const res = await staffResendOtp({ email: "staff@spotq.com" });
      expect(mockPost).toHaveBeenCalledWith(STAFF_AUTH_ENDPOINTS.RESEND_OTP, {
        json: { email: "staff@spotq.com" },
      });
      expect(res).toEqual({ success: true, message: "OTP resent" });
    });

    it("staffResetPassword calls correct endpoint and payload", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({ success: true, message: "Password reset" }),
      });
      const res = await staffResetPassword({ password: "StaffPassword123!" });
      expect(mockPost).toHaveBeenCalledWith(STAFF_AUTH_ENDPOINTS.RESET_PASSWORD, {
        json: { password: "StaffPassword123!" },
      });
      expect(res).toEqual({ success: true, message: "Password reset" });
    });
  });

  describe("restaurant registration flow", () => {
    it("verifyRestaurantEmailOtp preserves the dashboard access token", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          message: "Email verified",
          data: {
            nextStep: "DASHBOARD",
            accessToken: "restaurant-jwt-token",
          },
        }),
      });

      const res = await verifyRestaurantEmailOtp({
        email: "restaurant@spotq.com",
        otp: "123456",
      });

      expect(mockPost).toHaveBeenCalledWith(RESTAURANT_AUTH_ENDPOINTS.VERIFY_OTP, {
        json: { email: "restaurant@spotq.com", otp: "123456" },
      });
      expect(res.data).toEqual({
        nextStep: "DASHBOARD",
        accessToken: "restaurant-jwt-token",
      });
    });
  });
});
