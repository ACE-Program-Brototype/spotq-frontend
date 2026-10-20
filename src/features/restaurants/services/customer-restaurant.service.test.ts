import { apiClient } from "@/lib/api/client";
import { customerRestaurantService } from "./customer-restaurant.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("customerRestaurantService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches customer restaurants with default query params", async () => {
    const mockApiResponse = {
      success: true,
      statusCode: 200,
      message: "Success",
      data: [
        {
          id: "rest-1",
          restaurantName: "Spice Route",
          city: "Ernakulam",
          state: "Kerala",
          cuisineType: "North Indian",
          averageCost: 450,
          createdAt: "2026-10-10T12:00:00.000Z",
        },
      ],
      pagination: {
        page: 1,
        limit: 8,
        total: 1,
        totalPages: 1,
      },
    };

    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    });

    const result = await customerRestaurantService.getRestaurants();

    expect(apiClient.get).toHaveBeenCalledWith("restaurants/customers", {
      searchParams: {
        page: 1,
        limit: 8,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    });

    expect(result.restaurants).toHaveLength(1);
    expect(result.restaurants[0].restaurantName).toBe("Spice Route");
    expect(result.pagination.total).toBe(1);
  });

  it("attaches search, category (cuisine), and price filters when provided", async () => {
    const mockApiResponse = {
      success: true,
      data: [],
      pagination: { page: 2, limit: 8, total: 0, totalPages: 0 },
    };

    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    });

    await customerRestaurantService.getRestaurants({
      page: 2,
      limit: 8,
      search: "Biryani",
      cuisine: "Mandi",
      minPrice: 200,
      maxPrice: 800,
      sortBy: "price",
      sortOrder: "asc",
    });

    expect(apiClient.get).toHaveBeenCalledWith("restaurants/customers", {
      searchParams: {
        page: 2,
        limit: 8,
        search: "Biryani",
        cuisine: "Mandi",
        minPrice: 200,
        maxPrice: 800,
        sortBy: "price",
        sortOrder: "asc",
      },
    });
  });

  it("ignores 'All' category filter when querying backend", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({ success: true, data: [] }),
    });

    await customerRestaurantService.getRestaurants({
      cuisine: "All",
    });

    expect(apiClient.get).toHaveBeenCalledWith("restaurants/customers", {
      searchParams: {
        page: 1,
        limit: 8,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    });
  });

  it("attaches search, city, and cuisine query parameters simultaneously", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({ success: true, data: [] }),
    });

    await customerRestaurantService.getRestaurants({
      page: 1,
      limit: 8,
      search: "Shawarma",
      city: "Kozhikode",
      cuisine: "Mandi",
    });

    expect(apiClient.get).toHaveBeenCalledWith("restaurants/customers", {
      searchParams: {
        page: 1,
        limit: 8,
        search: "Shawarma",
        city: "Kozhikode",
        cuisine: "Mandi",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    });
  });

  it("handles empty data and defaults pagination correctly", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        data: [],
      }),
    });

    const result = await customerRestaurantService.getRestaurants();

    expect(result.restaurants).toEqual([]);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 8,
      total: 0,
      totalPages: 1,
    });
  });

  it("handles non-array or missing response data gracefully", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({
        success: true,
      }),
    });

    const result = await customerRestaurantService.getRestaurants();

    expect(result.restaurants).toEqual([]);
    expect(result.pagination.total).toBe(0);
  });

  describe("getRestaurantDetails", () => {
    it("fetches customer restaurant details by ID with default includeMenu=true", async () => {
      const mockDetails = {
        id: "rest-123",
        restaurantName: "Spice Symphony",
        city: "New Delhi",
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockDetails,
        }),
      });

      const result = await customerRestaurantService.getRestaurantDetails("rest-123");

      expect(apiClient.get).toHaveBeenCalledWith("restaurants/rest-123", {
        searchParams: {
          includeMenu: "true",
        },
        signal: undefined,
      });
      expect(result).toEqual(mockDetails);
    });

    it("supports includeMenu=false and forwards AbortSignal", async () => {
      const controller = new AbortController();
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: { id: "rest-456" },
        }),
      });

      await customerRestaurantService.getRestaurantDetails("rest-456", false, controller.signal);

      expect(apiClient.get).toHaveBeenCalledWith("restaurants/rest-456", {
        searchParams: {
          includeMenu: "false",
        },
        signal: controller.signal,
      });
    });
  });
});
