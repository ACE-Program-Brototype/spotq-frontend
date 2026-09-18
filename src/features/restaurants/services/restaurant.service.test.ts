import { apiClient } from "@/lib/api/client";
import { restaurantService } from "./restaurant.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

describe("restaurantService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches admin restaurants with default parameters", async () => {
    const mockApiResponse = {
      success: true,
      data: {
        restaurants: [
          {
            id: "rest-123",
            restaurant_name: "Ajex Grand Bistro",
            owner_name: "Ajex Joshy",
            contact: {
              email: "ajex@example.com",
              phone: "+919876543210",
              owner_email: "ajex@example.com",
            },
            plan: "QUEUE_PRO",
            status: "APPROVED",
            is_subscription_active: true,
            is_blocked: false,
            created_at: "2026-09-10T12:00:00.000Z",
            updated_at: "2026-09-11T14:30:00.000Z",
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          total_pages: 1,
          has_next_page: false,
          has_prev_page: false,
        },
      },
    };

    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    });

    const result = await restaurantService.getAdminRestaurants();

    expect(apiClient.get).toHaveBeenCalledWith("restaurants/admin/restaurants", {
      searchParams: {
        page: 1,
        limit: 10,
        sort_by: "created_at",
        sort_order: "desc",
      },
    });

    expect(result.restaurants).toHaveLength(1);
    expect(result.restaurants[0].restaurant_name).toBe("Ajex Grand Bistro");
    expect(result.pagination.total).toBe(1);
  });

  it("applies search, status, and subscription filters properly", async () => {
    const mockApiResponse = {
      success: true,
      data: {
        restaurants: [],
        pagination: {
          page: 2,
          limit: 20,
          total: 0,
          total_pages: 0,
          has_next_page: false,
          has_prev_page: true,
        },
      },
    };

    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    });

    await restaurantService.getAdminRestaurants({
      page: 2,
      limit: 20,
      search: "Bistro",
      status: "APPROVED",
      plan: "QUEUE_PRO",
      is_subscription_active: true,
      created_from: "2026-01-01",
      created_to: "2026-12-31",
      sort_by: "restaurant_name",
      sort_order: "asc",
    });

    expect(apiClient.get).toHaveBeenCalledWith("restaurants/admin/restaurants", {
      searchParams: {
        page: 2,
        limit: 20,
        search: "Bistro",
        status: "APPROVED",
        plan: "QUEUE_PRO",
        is_subscription_active: true,
        created_from: "2026-01-01",
        created_to: "2026-12-31",
        sort_by: "restaurant_name",
        sort_order: "asc",
      },
    });
  });

  it("fetches single restaurant details by ID successfully", async () => {
    const mockDetails = {
      id: "a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      restaurant_name: "Metro Bistro",
      email: "contact@metrobistro.com",
      phone: "+15551234567",
      owner_name: "John Doe",
      owner_email: "owner@example.com",
      status: "APPROVED",
      onboarding_status: "COMPLETED",
      is_blocked: false,
      is_subscription_active: false,
      created_at: "2026-09-09T18:58:55.124Z",
      updated_at: "2026-09-11T14:07:51.567Z",
      address: {
        address_line1: "123 Main Street",
        city: "Metropolis",
        state: "New York",
        country: "USA",
        pincode: "10001",
      },
      settings: {
        seating_capacity: 20,
        is_opened: false,
      },
      staff: [],
      documents: [],
      images: [],
    };

    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        data: mockDetails,
      }),
    });

    const result = await restaurantService.getAdminRestaurantById(
      "a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    );

    expect(apiClient.get).toHaveBeenCalledWith(
      "restaurants/admin/restaurants/a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    );
    expect(result.restaurant_name).toBe("Metro Bistro");
    expect(result.address?.city).toBe("Metropolis");
  });

  it("throws error if restaurant ID is missing or empty in getAdminRestaurantById", async () => {
    await expect(restaurantService.getAdminRestaurantById("")).rejects.toThrow(
      "Restaurant ID is required",
    );
  });

  describe("blockRestaurant", () => {
    it("submits block request with reason and returns updated response", async () => {
      const mockResponse = {
        success: true,
        message: "Restaurant blocked successfully",
        data: {
          id: "rest-123",
          is_blocked: true,
          status: "SUSPENDED",
          block_reason: "Violation of terms",
        },
      };

      (apiClient.patch as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await restaurantService.blockRestaurant({
        restaurantId: "rest-123",
        reason: "Violation of terms",
      });

      expect(apiClient.patch).toHaveBeenCalledWith("restaurants/admin/restaurants/rest-123/block", {
        json: { reason: "Violation of terms" },
      });
      expect(result.success).toBe(true);
      expect(result.data?.is_blocked).toBe(true);
    });

    it("throws error when reason is empty or whitespace", async () => {
      await expect(
        restaurantService.blockRestaurant({
          restaurantId: "rest-123",
          reason: "   ",
        }),
      ).rejects.toThrow("A reason is required to block a restaurant");
    });

    it("throws error when restaurantId is missing", async () => {
      await expect(
        restaurantService.blockRestaurant({
          restaurantId: "",
          reason: "Valid reason",
        }),
      ).rejects.toThrow("Restaurant ID is required");
    });
  });

  describe("unblockRestaurant", () => {
    it("submits unblock request and returns response", async () => {
      const mockResponse = {
        success: true,
        message: "Restaurant unblocked successfully",
        data: {
          id: "rest-123",
          is_blocked: false,
          status: "ACTIVE",
          block_reason: null,
        },
      };

      (apiClient.patch as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await restaurantService.unblockRestaurant({
        restaurantId: "rest-123",
      });

      expect(apiClient.patch).toHaveBeenCalledWith(
        "restaurants/admin/restaurants/rest-123/unblock",
      );
      expect(result.success).toBe(true);
      expect(result.data?.is_blocked).toBe(false);
    });

    it("throws error when restaurantId is missing", async () => {
      await expect(
        restaurantService.unblockRestaurant({
          restaurantId: "",
        }),
      ).rejects.toThrow("Restaurant ID is required");
    });
  });
});
