import { STAFF_AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { apiClient } from "@/lib/api/client";
import { staffInvitationService } from "./staff-invitation.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("staffInvitationService", () => {
  const mockPost = apiClient.post as jest.Mock;
  const mockGet = apiClient.get as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sendInvitation", () => {
    it("calls apiClient.post with the correct endpoint and payload", async () => {
      const mockData = {
        id: "inv-123",
        email: "staff@spotq.com",
        restaurantId: "rest-001",
        status: "PENDING" as const,
        expiresAt: "2026-09-10T00:00:00.000Z",
        createdAt: "2026-09-08T00:00:00.000Z",
      };

      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          message: "Staff invitation sent successfully",
          data: mockData,
        }),
      });

      const res = await staffInvitationService.sendInvitation({ email: "staff@spotq.com" });

      expect(mockPost).toHaveBeenCalledWith(STAFF_AUTH_ENDPOINTS.INVITATIONS, {
        json: { email: "staff@spotq.com" },
      });
      expect(res.data).toEqual(mockData);
    });
  });

  describe("resendInvitation", () => {
    it("calls apiClient.post with the correct endpoint and payload", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          message: "Invitation resent",
        }),
      });

      const res = await staffInvitationService.resendInvitation({ email: "staff@spotq.com" });

      expect(mockPost).toHaveBeenCalledWith(STAFF_AUTH_ENDPOINTS.INVITATIONS_RESEND, {
        json: { email: "staff@spotq.com" },
      });
      expect(res.success).toBe(true);
    });
  });

  describe("revokeInvitation", () => {
    it("calls apiClient.post with the correct endpoint and payload", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          message: "Invitation revoked",
        }),
      });

      const res = await staffInvitationService.revokeInvitation({
        invitationId: "inv-123",
        email: "staff@spotq.com",
      });

      expect(mockPost).toHaveBeenCalledWith(STAFF_AUTH_ENDPOINTS.INVITATIONS_REVOKE, {
        json: { invitationId: "inv-123", email: "staff@spotq.com" },
      });
      expect(res.success).toBe(true);
    });
  });

  describe("getInvitations", () => {
    it("calls apiClient.get with the correct endpoint and query params", async () => {
      const mockInvitations = [
        {
          id: "inv-1",
          email: "test@spotq.com",
          restaurantId: "rest-1",
          status: "PENDING" as const,
          expiresAt: "2026-09-10T00:00:00.000Z",
          createdAt: "2026-09-08T00:00:00.000Z",
        },
      ];

      mockGet.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          data: {
            invitations: mockInvitations,
            pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
          },
        }),
      });

      const res = await staffInvitationService.getInvitations({
        status: "PENDING",
        search: "test",
      });

      expect(mockGet).toHaveBeenCalledWith(STAFF_AUTH_ENDPOINTS.INVITATIONS, {
        searchParams: { status: "PENDING", search: "test" },
      });
      expect(res.success).toBe(true);
      expect(res.data?.invitations).toEqual(mockInvitations);
    });
  });

  describe("validateInvitation", () => {
    it("returns valid true and restaurant name on success", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          valid: true,
          email: "invited@spotq.com",
          restaurantName: "Basil Mandi",
        }),
      });

      const res = await staffInvitationService.validateInvitation("token-123");

      expect(mockPost).toHaveBeenCalledWith(STAFF_AUTH_ENDPOINTS.INVITATION_VALIDATE, {
        json: { token: "token-123" },
      });
      expect(res.valid).toBe(true);
      expect(res.email).toBe("invited@spotq.com");
      expect(res.restaurantName).toBe("Basil Mandi");
    });

    it("returns valid false on error", async () => {
      mockPost.mockReturnValueOnce({
        json: jest.fn().mockRejectedValueOnce(new Error("Expired token")),
      });

      const res = await staffInvitationService.validateInvitation("bad-token");
      expect(res.valid).toBe(false);
    });
  });

  describe("acceptInvitation", () => {
    it("calls apiClient.post with the correct payload and returns auth data", async () => {
      const mockStaff = {
        _id: "staff-1",
        name: "Chef Ramsey",
        email: "chef@spotq.com",
        role: "RESTAURANT_STAFF" as const,
      };

      mockPost.mockReturnValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          message: "Account activated",
          staff: mockStaff,
          accessToken: "jwt-token-xyz",
        }),
      });

      const res = await staffInvitationService.acceptInvitation({
        token: "token-123",
        fullname: "Chef Ramsey",
        phone: "+919876543210",
        password: "Password@123",
      });

      expect(mockPost).toHaveBeenCalledWith(STAFF_AUTH_ENDPOINTS.INVITATION_ACCEPT, {
        json: {
          token: "token-123",
          fullname: "Chef Ramsey",
          phone: "+919876543210",
          password: "Password@123",
        },
      });
      expect(res.success).toBe(true);
      expect(res.data?.staff).toEqual(mockStaff);
      expect(res.data?.accessToken).toBe("jwt-token-xyz");
    });
  });
});
