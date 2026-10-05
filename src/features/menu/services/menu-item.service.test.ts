import { apiClient } from "@/lib/api/client";
import { menuItemService } from "./menu-item.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
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

  describe("getMenuItem / getMenuItemById", () => {
    it("fetches single menu item detail by id using getMenuItem", async () => {
      const mockDetail = {
        id: "item-123",
        restaurantId: mockRestaurantId,
        categoryId: "cat-1",
        categoryName: "Appetizers",
        name: "Crispy Spring Rolls",
        description: "Freshly prepared rolls with sweet chili dip.",
        price: 220,
        isVegetarian: true,
        isAvailable: true,
        variants: [
          {
            id: "v-1",
            name: "6 Pieces",
            portion: "Regular",
            price: 220,
            isDefault: true,
            isAvailable: true,
          },
        ],
        addons: [],
      };

      const mockJson = jest.fn().mockResolvedValue({ success: true, data: mockDetail });
      (apiClient.get as jest.Mock).mockReturnValue({ json: mockJson });

      const result = await menuItemService.getMenuItem(mockRestaurantId, "item-123");

      expect(apiClient.get).toHaveBeenCalledWith(
        `restaurants/${mockRestaurantId}/menu/items/item-123`,
      );
      expect(result.id).toBe("item-123");
      expect(result.name).toBe("Crispy Spring Rolls");
    });

    it("fetches single menu item detail by id using getMenuItemById alias", async () => {
      const mockDetail = {
        id: "item-123",
        restaurantId: mockRestaurantId,
        categoryId: "cat-1",
        name: "Crispy Spring Rolls",
        price: 220,
        isVegetarian: true,
        isAvailable: true,
        variants: [],
      };

      const mockJson = jest.fn().mockResolvedValue({ success: true, data: mockDetail });
      (apiClient.get as jest.Mock).mockReturnValue({ json: mockJson });

      const result = await menuItemService.getMenuItemById(mockRestaurantId, "item-123");
      expect(result.id).toBe("item-123");
    });

    it("throws an error if restaurantId or menuItemId is missing", async () => {
      await expect(menuItemService.getMenuItem("", "item-123")).rejects.toThrow(
        "Restaurant ID and Menu Item ID are required.",
      );
      await expect(menuItemService.getMenuItemById(mockRestaurantId, "")).rejects.toThrow(
        "Restaurant ID and Menu Item ID are required.",
      );
    });
  });

  describe("updateMenuItemAvailability", () => {
    it("patches item availability correctly", async () => {
      const mockJson = jest.fn().mockResolvedValue({
        success: true,
        data: { isAvailable: false },
      });
      (apiClient.patch as jest.Mock).mockReturnValue({ json: mockJson });

      const result = await menuItemService.updateMenuItemAvailability(
        mockRestaurantId,
        "item-123",
        false,
      );

      expect(apiClient.patch).toHaveBeenCalledWith(
        `restaurants/${mockRestaurantId}/menu/items/item-123/status`,
        { json: { isAvailable: false } },
      );
      expect(result.isAvailable).toBe(false);
    });

    it("throws an error if backend returns success: false", async () => {
      const mockJson = jest.fn().mockResolvedValue({
        success: false,
        message: "Failed to update item availability status",
      });
      (apiClient.patch as jest.Mock).mockReturnValue({ json: mockJson });

      await expect(
        menuItemService.updateMenuItemAvailability(mockRestaurantId, "item-123", true),
      ).rejects.toThrow("Failed to update item availability status");
    });
  });

  describe("deleteMenuItem", () => {
    it("calls delete endpoint with correct URL", async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue(undefined);

      await menuItemService.deleteMenuItem(mockRestaurantId, "item-123");

      expect(apiClient.delete).toHaveBeenCalledWith(
        `restaurants/${mockRestaurantId}/menu/items/item-123`,
      );
    });

    it("throws an error if restaurantId or menuItemId is missing", async () => {
      await expect(menuItemService.deleteMenuItem("", "item-123")).rejects.toThrow(
        "Restaurant ID and Menu Item ID are required to delete a menu item.",
      );
      await expect(menuItemService.deleteMenuItem(mockRestaurantId, "")).rejects.toThrow(
        "Restaurant ID and Menu Item ID are required to delete a menu item.",
      );
      expect(apiClient.delete).not.toHaveBeenCalled();
    });
  });
});
