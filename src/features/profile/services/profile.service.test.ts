import { apiClient } from "@/lib/api/client";
import { PROFILE_ENDPOINTS, PROFILE_MESSAGES } from "../constants/profile.constants";
import { profileService } from "./profile.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
  },
}));

describe("profileService", () => {
  const mockGet = apiClient.get as jest.Mock;
  const mockPatch = apiClient.patch as jest.Mock;
  const mockPost = apiClient.post as jest.Mock;

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

  it("updates and normalizes staff profile successfully", async () => {
    const mockApiResponse = {
      success: true,
      statusCode: 200,
      message: "Staff profile updated successfully",
      data: {
        id: "staff-123",
        restaurant_id: "rest-456",
        fullname: "Ravi Kumar",
        email: "j.montgomery@dineline.com",
        phone: "+919876543210",
        avatar_url: "https://example.com/avatar.png",
        role: "MANAGER",
        status: "ACTIVE",
        created_at: "2024-10-24T08:42:00.000Z",
      },
    };

    mockPatch.mockReturnValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    });

    const payload = {
      name: "Ravi Kumar",
      phone: "+919876543210",
    };

    const result = await profileService.updateStaffProfile("rest-456", "staff-123", payload);

    expect(mockPatch).toHaveBeenCalledWith("restaurants/rest-456/staff/staff-123", {
      json: payload,
    });
    expect(result.fullName).toBe("Ravi Kumar");
    expect(result.phone).toBe("+919876543210");
  });

  it("uploads staff avatar via presigned URL", async () => {
    const presignedMockResponse = {
      success: true,
      data: {
        uploadUrl: "https://s3.amazonaws.com/upload-target",
        s3ObjectKey: "restaurants/rest-456/profile/photo.jpg",
      },
    };

    mockPost.mockReturnValue({
      json: jest.fn().mockResolvedValue(presignedMockResponse),
    });

    const mockFetch = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

    const dummyFile = new File(["bytes"], "photo.jpg", { type: "image/jpeg" });
    const resultKey = await profileService.uploadStaffAvatar(
      "123e4567-e89b-12d3-a456-426614174000",
      dummyFile,
    );

    expect(mockPost).toHaveBeenCalledWith(
      PROFILE_ENDPOINTS.STORAGE_PRESIGNED_URL,
      expect.objectContaining({
        json: expect.objectContaining({
          file_name: "photo.jpg",
          content_type: "image/jpeg",
        }),
      }),
    );
    expect(mockFetch).toHaveBeenCalledWith(
      "https://s3.amazonaws.com/upload-target",
      expect.objectContaining({
        method: "PUT",
        body: dummyFile,
      }),
    );
    expect(resultKey).toBe("restaurants/rest-456/profile/photo.jpg");
  });

  it("throws error when restaurantId is missing or not a valid UUID", async () => {
    const dummyFile = new File(["bytes"], "photo.jpg", { type: "image/jpeg" });

    await expect(profileService.uploadStaffAvatar("", dummyFile)).rejects.toThrow(
      PROFILE_MESSAGES.INVALID_RESTAURANT_ID,
    );

    await expect(profileService.uploadStaffAvatar("invalid-uuid-123", dummyFile)).rejects.toThrow(
      PROFILE_MESSAGES.INVALID_RESTAURANT_ID,
    );
  });

  it("throws error when presigned response data is missing uploadUrl or s3ObjectKey", async () => {
    mockPost.mockReturnValue({
      json: jest.fn().mockResolvedValue({ success: true, data: {} }),
    });

    const dummyFile = new File(["bytes"], "photo.jpg", { type: "image/jpeg" });
    await expect(
      profileService.uploadStaffAvatar("123e4567-e89b-12d3-a456-426614174000", dummyFile),
    ).rejects.toThrow(PROFILE_MESSAGES.AVATAR_UPLOAD_AUTH_FAILED);
  });

  it("throws error when S3 PUT upload fails", async () => {
    const presignedMockResponse = {
      success: true,
      data: {
        uploadUrl: "https://s3.amazonaws.com/upload-target",
        s3ObjectKey: "restaurants/rest-456/profile/photo.jpg",
      },
    };

    mockPost.mockReturnValue({
      json: jest.fn().mockResolvedValue(presignedMockResponse),
    });

    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    const dummyFile = new File(["bytes"], "photo.jpg", { type: "image/jpeg" });
    await expect(
      profileService.uploadStaffAvatar("123e4567-e89b-12d3-a456-426614174000", dummyFile),
    ).rejects.toThrow(PROFILE_MESSAGES.AVATAR_UPLOAD_FAILED);
  });
});
