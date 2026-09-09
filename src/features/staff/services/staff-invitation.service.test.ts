import { STAFF_ENDPOINTS } from "@/features/staff/constants/staff.constants";
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

      expect(mockPost).toHaveBeenCalledWith(STAFF_ENDPOINTS.INVITATIONS, {
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

      expect(mockPost).toHaveBeenCalledWith(STAFF_ENDPOINTS.INVITATIONS_RESEND, {
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

      expect(mockPost).toHaveBeenCalledWith(STAFF_ENDPOINTS.INVITATIONS_REVOKE, {
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

      expect(mockGet).toHaveBeenCalledWith(STAFF_ENDPOINTS.INVITATIONS, {
        searchParams: { status: "PENDING", search: "test" },
      });
      expect(res.success).toBe(true);
      expect(res.data?.invitations).toEqual(mockInvitations);
    });

    it("propagates error when apiClient.get fails", async () => {
      mockGet.mockReturnValueOnce({
        json: jest.fn().mockRejectedValueOnce(new Error("Network Error")),
      });

      await expect(staffInvitationService.getInvitations()).rejects.toThrow("Network Error");
    });
  });
});
