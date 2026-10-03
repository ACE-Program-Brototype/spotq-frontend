import { apiClient } from "@/lib/api/client";
import { staffMenuService } from "./staff-menu.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("staffMenuService", () => {
  const mockRestaurantId = "res-uuid-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getStaffMenuItems", () => {
    it("returns default empty response when restaurantId is not provided", async () => {
      const result = await staffMenuService.getStaffMenuItems("");

      expect(result.items).toEqual([]);
      expect(result.totalCount).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    it("fetches staff menu items with query params successfully", async () => {
      const mockApiResponse = {
        success: true,
        message: "Staff menu items retrieved successfully",
        data: {
          restaurantId: mockRestaurantId,
          page: 1,
          limit: 12,
          totalCount: 1,
          totalPages: 1,
          items: [
            {
              id: "item-1",
              name: "Chicken Biriyani",
              sku: "CHK-BIR-01",
              description: "Aromatic basmati rice cooked with chicken",
              basePrice: 220,
              categoryId: "cat-1",
              categoryName: "Main Course",
              displayOrder: 1,
              isActive: true,
              isAvailable: true,
              unavailabilityReason: null,
              autoResetAt: null,
              variantCount: 2,
              hasVariants: true,
              variants: [
                {
                  id: "var-1",
                  name: "Regular",
                  sku: "CHK-BIR-REG",
                  price: 220,
                  isDefault: true,
                  isAvailable: true,
                },
                {
                  id: "var-2",
                  name: "Large",
                  sku: "CHK-BIR-LRG",
                  price: 340,
                  isDefault: false,
                  isAvailable: true,
                },
              ],
              updatedAt: "2026-10-02T10:00:00.000Z",
            },
          ],
        },
      };

      const mockJson = jest.fn().mockResolvedValue(mockApiResponse);
      (apiClient.get as jest.Mock).mockReturnValue({ json: mockJson });

      const result = await staffMenuService.getStaffMenuItems(mockRestaurantId, {
        page: 1,
        limit: 12,
        search: "biriyani",
        categoryId: "cat-1",
        isAvailable: true,
        includeInactive: false,
        includeVariants: true,
        sortBy: "displayOrder",
        sortOrder: "asc",
      });

      expect(apiClient.get).toHaveBeenCalledWith(
        `restaurants/${mockRestaurantId}/staff/menu/items`,
        {
          searchParams: {
            page: 1,
            limit: 12,
            search: "biriyani",
            categoryId: "cat-1",
            isAvailable: true,
            includeInactive: false,
            includeVariants: true,
            sortBy: "displayOrder",
            sortOrder: "asc",
          },
        },
      );

      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("Chicken Biriyani");
      expect(result.items[0].variants).toHaveLength(2);
      expect(result.totalCount).toBe(1);
    });

    it("handles null data from API response gracefully", async () => {
      const mockJson = jest.fn().mockResolvedValue({
        success: true,
        message: "Empty",
        data: null,
      });
      (apiClient.get as jest.Mock).mockReturnValue({ json: mockJson });

      const result = await staffMenuService.getStaffMenuItems(mockRestaurantId);

      expect(result.items).toEqual([]);
      expect(result.totalCount).toBe(0);
    });
  });

  describe("getStaffCategories", () => {
    it("returns empty array when restaurantId is empty", async () => {
      const result = await staffMenuService.getStaffCategories("");

      expect(result).toEqual([]);
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    it("returns array when API response data is an array of categories", async () => {
      const mockCategories = [
        {
          id: "cat-1",
          restaurantId: mockRestaurantId,
          name: "Starters",
          displayOrder: 1,
          isActive: true,
        },
        {
          id: "cat-2",
          restaurantId: mockRestaurantId,
          name: "Main Course",
          displayOrder: 2,
          isActive: true,
        },
      ];

      const mockJson = jest.fn().mockResolvedValue({
        success: true,
        data: mockCategories,
      });
      (apiClient.get as jest.Mock).mockReturnValue({ json: mockJson });

      const result = await staffMenuService.getStaffCategories(mockRestaurantId);

      expect(apiClient.get).toHaveBeenCalledWith(
        `restaurants/${mockRestaurantId}/staff/menu/categories`,
      );
      expect(result).toEqual(mockCategories);
    });

    it("returns mapped categories with fallback restaurantId when API response is an envelope object", async () => {
      const mockEnvelope = {
        restaurantId: "custom-res-id",
        categories: [
          {
            id: "cat-1",
            name: "Desserts",
            displayOrder: 3,
            isActive: true,
          },
          {
            id: "cat-2",
            restaurantId: "explicit-res-id",
            name: "Beverages",
            displayOrder: 4,
            isActive: true,
          },
        ],
      };

      const mockJson = jest.fn().mockResolvedValue({
        success: true,
        data: mockEnvelope,
      });
      (apiClient.get as jest.Mock).mockReturnValue({ json: mockJson });

      const result = await staffMenuService.getStaffCategories(mockRestaurantId);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "cat-1",
        restaurantId: "custom-res-id",
        name: "Desserts",
        displayOrder: 3,
        isActive: true,
      });
      expect(result[1]).toEqual({
        id: "cat-2",
        restaurantId: "explicit-res-id",
        name: "Beverages",
        displayOrder: 4,
        isActive: true,
      });
    });

    it("returns empty array when API response data is null or unexpected structure", async () => {
      const mockJson = jest.fn().mockResolvedValue({
        success: true,
        data: null,
      });
      (apiClient.get as jest.Mock).mockReturnValue({ json: mockJson });

      const result = await staffMenuService.getStaffCategories(mockRestaurantId);

      expect(result).toEqual([]);
    });
  });
});
