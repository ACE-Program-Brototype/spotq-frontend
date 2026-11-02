import { apiClient } from "@/lib/api/client";
import { QUEUE_ENDPOINTS } from "../constants/queue.constants";
import { queueService } from "./queue.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe("queueService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerWalkIn", () => {
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

  describe("getQueueEta", () => {
    it("fetches ETA using GET with searchParams", async () => {
      const restaurantId = "rest-eta-1";
      const mockEtaResponse = {
        success: true,
        data: {
          estimatedWaitMinutes: 25,
          partiesAhead: 3,
          partySize: 4,
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockEtaResponse),
      });

      const result = await queueService.getQueueEta(restaurantId, 4);

      expect(apiClient.get).toHaveBeenCalledWith(QUEUE_ENDPOINTS.GET_ETA(restaurantId), {
        searchParams: { partySize: 4 },
      });
      expect(result).toEqual(mockEtaResponse);
    });
  });

  describe("joinQueue", () => {
    it("submits customer join queue payload with fid using POST", async () => {
      const restaurantId = "rest-join-2";
      const mockJoinResponse = {
        success: true,
        message: "Queue registration completed successfully",
        data: {
          queueEntryId: "entry-101",
          restaurantId,
          userId: "user-2",
          guestName: "Sam Test",
          guestPhone: "+15551234567",
          queueNumber: "Q-016",
          partySize: 4,
          registrationType: "ONLINE",
          position: 1,
          estimatedWaitMinutes: 5,
          status: "WAITING",
          joinedAt: "2026-11-03T10:00:00.000Z",
          websocket: {
            path: "/ws/queues",
            room: "ticket:entry-101",
            ticketId: "entry-101",
            subscribeEvent: "join:ticket",
            updateEvent: "queue:position-updated",
          },
        },
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockJoinResponse),
      });

      const result = await queueService.joinQueue(restaurantId, {
        guestName: "Sam Test",
        guestPhone: "+15551234567",
        partySize: 4,
        fid: "fcm-token-xyz",
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        "queues/customer/restaurants/rest-join-2/queue/join",
        {
          json: {
            guestName: "Sam Test",
            guestPhone: "+15551234567",
            partySize: 4,
            specialNotes: undefined,
            fid: "fcm-token-xyz",
          },
        },
      );
      expect(result).toEqual(mockJoinResponse);
    });

    it("verifies GET_ETA resolves to queue service customer route", async () => {
      expect(QUEUE_ENDPOINTS.GET_ETA("rest-123")).toBe("queues/customer/rest-123/eta");
    });
  });
});
