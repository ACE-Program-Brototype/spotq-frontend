import { apiClient } from "@/lib/api/client";
import { QUEUE_ENDPOINTS } from "../constants/queue.constants";
import { queueService } from "./queue.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe("queueService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits registerWalkIn request with normalized phone and formatted body", async () => {
    const restaurantId = "rest-test-123";
    const mockResponse = {
      success: true,
      message: "Walk-in guest successfully registered to queue",
      data: {
        queueEntryId: "queue-1",
        restaurantId,
        userId: null,
        guestName: "David Miller",
        guestPhone: "+919876543210",
        partySize: 3,
        specialNotes: "Prefers booth",
        registrationType: "WALK_IN",
        position: 1,
        estimatedWaitMinutes: 10,
        status: "WAITING",
        joinedAt: "2026-10-16T12:00:00.000Z",
      },
    };

    (apiClient.post as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await queueService.registerWalkIn(restaurantId, {
      guestName: "David Miller",
      guestPhone: "+919876543210",
      partySize: 3,
      specialNotes: "Prefers booth",
    });

    expect(apiClient.post).toHaveBeenCalledWith(QUEUE_ENDPOINTS.REGISTER_WALK_IN(restaurantId), {
      json: {
        guestName: "David Miller",
        guestPhone: "+919876543210",
        partySize: 3,
        specialNotes: "Prefers booth",
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it("normalizes a 10-digit number to +91 country code", async () => {
    const restaurantId = "rest-test-123";
    (apiClient.post as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({ success: true, data: {} }),
    });

    await queueService.registerWalkIn(restaurantId, {
      guestName: "Anita Roy",
      guestPhone: "9876543210",
      partySize: 2,
    });

    expect(apiClient.post).toHaveBeenCalledWith(QUEUE_ENDPOINTS.REGISTER_WALK_IN(restaurantId), {
      json: {
        guestName: "Anita Roy",
        guestPhone: "+919876543210",
        partySize: 2,
        specialNotes: undefined,
      },
    });
  });
});
