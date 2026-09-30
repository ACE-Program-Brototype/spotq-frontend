import { apiClient } from "@/lib/api/client";
import { menuItemService } from "./menu-item.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("menuItemService", () => {
  const mockRestaurantId = "res-uuid-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getMenuItems", () => {
    it("returns default empty data when restaurantId is not provided", async () => {
      const result = await menuItemService.getMenuItems("");

      expect(result.items).toEqual([]);
      expect(result.stats.totalMenuItems).toBe(0);
      expect(result.pagination.total).toBe(0);
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    it("fetches menu items with query params successfully", async () => {
      const mockApiResponse = {
        success: true,
        message: "Menu items retrieved successfully",
        data: {
          stats: {
            totalCategories: 3,
            totalMenuItems: 8,
            availableItems: 7,
            outOfStockItems: 1,
          },
          items: [
            {
              id: "item-1",
              restaurantId: mockRestaurantId,
              categoryId: "cat-1",
              categoryName: "Appetizers",
              name: "Spring Rolls",
              price: 180,
              isVegetarian: true,
              isFeatured: true,
              isAvailable: true,
              image: "https://example.com/spring-rolls.jpg",
              createdAt: "2026-09-29T10:00:00.000Z",
              updatedAt: "2026-09-29T10:00:00.000Z",
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 8,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
      };

      const mockJson = jest.fn().mockResolvedValue(mockApiResponse);
      (apiClient.get as jest.Mock).mockReturnValue({ json: mockJson });

      const result = await menuItemService.getMenuItems(mockRestaurantId, {
        page: 1,
        limit: 10,
        search: "spring",
        categoryId: "cat-1",
        status: "AVAILABLE",
        isVegetarian: true,
        sortBy: "price",
        sortOrder: "asc",
      });

      expect(apiClient.get).toHaveBeenCalledWith(`restaurants/${mockRestaurantId}/menu/items`, {
        searchParams: {
          page: 1,
          limit: 10,
          search: "spring",
          categoryId: "cat-1",
          status: "AVAILABLE",
          isVegetarian: true,
          sortBy: "price",
          sortOrder: "asc",
        },
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("Spring Rolls");
      expect(result.stats.totalCategories).toBe(3);
      expect(result.stats.availableItems).toBe(7);
    });
  });
});
