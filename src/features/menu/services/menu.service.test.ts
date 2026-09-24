import { apiClient } from "@/lib/api/client";
import { menuService } from "./menu.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("menuService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCategories", () => {
    it("returns categories array from API response", async () => {
      const mockCategories = [
        {
          id: "cat-1",
          restaurantId: "res-1",
          name: "Starters",
          displayOrder: 1,
          isActive: true,
        },
      ];

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: true, data: mockCategories }),
      });

      const result = await menuService.getCategories("res-1");
      expect(result).toEqual(mockCategories);
    });

    it("returns empty array when restaurantId is missing", async () => {
      const result = await menuService.getCategories("");
      expect(result).toEqual([]);
      expect(apiClient.get).not.toHaveBeenCalled();
    });
  });

  describe("createCategory", () => {
    it("posts new category and returns created object", async () => {
      const createdCategory = {
        id: "cat-new",
        restaurantId: "res-1",
        name: "Desserts",
        description: "Sweet treats",
        displayOrder: 3,
        isActive: true,
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: true, data: createdCategory }),
      });

      const result = await menuService.createCategory("res-1", {
        name: "Desserts",
        description: "Sweet treats",
        displayOrder: 3,
      });

      expect(apiClient.post).toHaveBeenCalled();
      expect(result).toEqual(createdCategory);
    });
  });

  describe("getAddons", () => {
    it("returns addons array from API response", async () => {
      const mockAddons = [
        {
          id: "add-1",
          restaurantId: "res-1",
          name: "Extra Cheese",
          price: 50,
          isAvailable: true,
        },
      ];

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: true, data: mockAddons }),
      });

      const result = await menuService.getAddons("res-1");
      expect(result).toEqual(mockAddons);
    });
  });

  describe("createMenuItem", () => {
    it("posts complete menu item payload and returns created menu item", async () => {
      const mockItemResponse = {
        id: "item-1",
        restaurantId: "res-1",
        categoryId: "cat-1",
        name: "Farmhouse Pizza",
        dietaryType: "VEG",
        isAvailable: true,
        variants: [
          {
            id: "var-1",
            menuItemId: "item-1",
            name: "Regular",
            portion: "Medium 10 inch",
            price: 350,
            isDefault: true,
            isAvailable: true,
          },
        ],
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: true, data: mockItemResponse }),
      });

      const result = await menuService.createMenuItem("res-1", {
        name: "Farmhouse Pizza",
        categoryId: "cat-1",
        dietaryType: "VEG",
        isAvailable: true,
        variants: [
          {
            name: "Regular",
            portion: "Medium 10 inch",
            price: 350,
            isDefault: true,
            isAvailable: true,
          },
        ],
        addonIds: ["add-1"],
      });

      expect(apiClient.post).toHaveBeenCalled();
      expect(result.id).toBe("item-1");
    });
  });
});
