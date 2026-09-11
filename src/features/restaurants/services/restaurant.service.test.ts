import { apiClient } from "@/lib/api/client";
import { restaurantService } from "./restaurant.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
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
});
