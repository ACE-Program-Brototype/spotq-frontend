import { apiClient } from "@/lib/api/client";
import { PROFILE_ENDPOINTS } from "../constants/profile.constants";
import { profileService } from "./profile.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("profileService", () => {
  const mockGet = apiClient.get as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and normalizes staff profile successfully", async () => {
    const mockApiResponse = {
      success: true,
      statusCode: 200,
      message: "Staff profile fetched successfully",
      data: {
        id: "staff-123",
        restaurant_id: "rest-456",
        fullname: "Julian Montgomery",
        email: "j.montgomery@dineline.com",
        phone: "+1 (555) 234-8901",
        avatar_url: "https://example.com/avatar.png",
        role: "MANAGER",
        status: "ACTIVE",
        created_at: "2024-10-24T08:42:00.000Z",
      },
    };

    mockGet.mockReturnValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    });

    const result = await profileService.getStaffProfile();

    expect(mockGet).toHaveBeenCalledWith(PROFILE_ENDPOINTS.GET_STAFF_PROFILE);
    expect(result).toEqual({
      id: "staff-123",
      restaurantId: "rest-456",
      fullName: "Julian Montgomery",
      email: "j.montgomery@dineline.com",
      phone: "+1 (555) 234-8901",
      avatarUrl: "https://example.com/avatar.png",
      role: "Manager",
      status: "Active",
      createdAt: "2024-10-24T08:42:00.000Z",
    });
  });
});
