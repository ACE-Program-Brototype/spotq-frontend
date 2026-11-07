import { apiClient } from "@/lib/api/client";
import { subscriberService } from "./subscriber.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("subscriberService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getSubscribers", () => {
    it("should fetch subscribers with default params", async () => {
      const mockResponse = {
        success: true,
        message: "Subscribers retrieved successfully",
        data: {
          subscribers: [
            {
              id: "sub-1",
              restaurantId: "rest-1",
              restaurantName: "Spicy Bistro",
              subscriberName: "Jane Doe",
              subscriberEmail: "jane@example.com",
              planName: "Pro Monthly",
              planCode: "PRO_MONTHLY",
              billingCycle: "MONTHLY",
              price: 499900,
              currency: "INR",
              status: "ACTIVE",
              currentPeriodStart: "2026-11-01T00:00:00.000Z",
              currentPeriodEnd: "2026-12-01T00:00:00.000Z",
              createdAt: "2026-11-01T00:00:00.000Z",
            },
          ],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalItems: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await subscriberService.getSubscribers();

      expect(apiClient.get).toHaveBeenCalledWith(
        "subscribers",
        expect.objectContaining({
          searchParams: {
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            sortOrder: "desc",
          },
        }),
      );
      expect(result.subscribers).toHaveLength(1);
      expect(result.subscribers[0].restaurantName).toBe("Spicy Bistro");
    });

    it("should normalize nested plan and pricePaise from backend payload", async () => {
      const mockResponse = {
        success: true,
        message: "Subscribers retrieved successfully",
        data: {
          subscribers: [
            {
              id: "6cc7bab7-88b1-4bd7-94d7-102fafde9e97",
              restaurantId: "3dc35af0-3ff5-4ee9-a62a-fbb47124731b",
              restaurantName: "Biryani Blues Restaurant",
              subscriberName: "Rahul Sharma",
              subscriberEmail: "rahul@biryaniblues.com",
              planId: "74904c9b-4241-496a-b88f-3a33c6cf9650",
              status: "ACTIVE",
              currentPeriodStart: "2026-11-02T19:19:32.288Z",
              currentPeriodEnd: "2026-12-02T19:19:32.288Z",
              canceledAt: null,
              createdAt: "2026-11-02T19:19:32.393Z",
              updatedAt: "2026-11-02T19:19:32.393Z",
              plan: {
                id: "74904c9b-4241-496a-b88f-3a33c6cf9650",
                code: "QUEUE_PRO",
                name: "Queue Pro",
                description: "Real-time digital queue management",
                pricePaise: 149900,
                currency: "INR",
                billingCycle: "MONTHLY",
                features: ["Real-time digital queue management"],
                isActive: true,
              },
            },
          ],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalItems: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await subscriberService.getSubscribers();
      expect(result.subscribers[0].planName).toBe("Queue Pro");
      expect(result.subscribers[0].planCode).toBe("QUEUE_PRO");
      expect(result.subscribers[0].billingCycle).toBe("MONTHLY");
      expect(result.subscribers[0].price).toBe(149900);
      expect(result.subscribers[0].restaurantName).toContain("Restaurant");
    });

    it("should pass status and search filters when provided", async () => {
      const mockResponse = {
        success: true,
        message: "Subscribers retrieved successfully",
        data: {
          subscribers: [],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      await subscriberService.getSubscribers({
        page: 2,
        status: "ACTIVE",
        search: "bistro",
      });

      expect(apiClient.get).toHaveBeenCalledWith(
        "subscribers",
        expect.objectContaining({
          searchParams: expect.objectContaining({
            page: 2,
            status: "ACTIVE",
            search: "bistro",
          }),
        }),
      );
    });

    it("should map backend page, limit, and hasPrevPage fields into SubscriberPagination", async () => {
      const mockResponse = {
        success: true,
        message: "Subscribers retrieved successfully",
        data: {
          subscribers: [],
          pagination: {
            page: 2,
            limit: 15,
            totalItems: 32,
            totalPages: 3,
            hasNextPage: true,
            hasPrevPage: true,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await subscriberService.getSubscribers({ page: 2, limit: 15 });

      expect(result.pagination).toEqual({
        currentPage: 2,
        pageSize: 15,
        totalItems: 32,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });
  });

  describe("getSubscriberDetails", () => {
    it("should fetch subscriber details by id", async () => {
      const mockDetail = {
        id: "sub-1",
        restaurantId: "rest-1",
        restaurantName: "Spicy Bistro",
        subscriberName: "Jane Doe",
        subscriberEmail: "jane@example.com",
        status: "ACTIVE",
        currentPeriodStart: "2026-11-01T00:00:00.000Z",
        currentPeriodEnd: "2026-12-01T00:00:00.000Z",
        canceledAt: null,
        createdAt: "2026-11-01T00:00:00.000Z",
        updatedAt: "2026-11-01T00:00:00.000Z",
        plan: {
          id: "plan-1",
          name: "Pro Monthly",
          code: "PRO_MONTHLY",
          billingCycle: "MONTHLY",
          price: 499900,
          currency: "INR",
          description: "Full plan",
          features: ["Feature A"],
        },
        transactions: [],
        invoices: [],
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: true, data: mockDetail }),
      });

      const result = await subscriberService.getSubscriberDetails("sub-1");

      expect(apiClient.get).toHaveBeenCalledWith("subscribers/sub-1");
      expect(result.id).toBe("sub-1");
      expect(result.plan?.code).toBe("PRO_MONTHLY");
    });
  });
});
