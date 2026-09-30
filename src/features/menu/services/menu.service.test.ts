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

    it("propagates error when API call fails", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockRejectedValue(new Error("Network Error")),
      });

      await expect(menuService.getCategories("res-1")).rejects.toThrow("Network Error");
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

    it("throws error when API returns success false", async () => {
      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: false, message: "Category exists" }),
      });

      await expect(
        menuService.createCategory("res-1", {
          name: "Desserts",
        }),
      ).rejects.toThrow("Category exists");
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

    it("propagates error when API call fails", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockRejectedValue(new Error("Network Error")),
      });

      await expect(menuService.getAddons("res-1")).rejects.toThrow("Network Error");
    });
  });

  describe("createAddon", () => {
    it("posts new addon and returns created addon object", async () => {
      const mockAddon = {
        id: "add-1",
        restaurantId: "res-1",
        name: "Extra Jalapenos",
        price: 30,
        isAvailable: true,
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: true, data: mockAddon }),
      });

      const result = await menuService.createAddon("res-1", {
        name: "Extra Jalapenos",
        price: 30,
      });

      expect(apiClient.post).toHaveBeenCalled();
      expect(result).toEqual(mockAddon);
    });

    it("throws error when API returns success false", async () => {
      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: false, message: "Addon exists" }),
      });

      await expect(
        menuService.createAddon("res-1", {
          name: "Extra Jalapenos",
          price: 30,
        }),
      ).rejects.toThrow("Addon exists");
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
        description: "Fresh vegetables and mozzarella on crisp dough",
        dietaryType: "VEG",
        preparationTime: 20,
        imageUrl: "restaurants/res-1/menus/pizza.jpg",
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
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        "restaurants/res-1/menu/items",
        expect.objectContaining({
          json: expect.objectContaining({
            name: "Farmhouse Pizza",
            categoryId: "cat-1",
            description: "Fresh vegetables and mozzarella on crisp dough",
            preparationTime: 20,
            isVegetarian: true,
            images: [{ objectKey: "restaurants/res-1/menus/pizza.jpg", displayOrder: 0 }],
          }),
        }),
      );
      expect(result.id).toBe("item-1");
    });

    it("throws error when API returns success false", async () => {
      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: false, message: "Item exists" }),
      });

      await expect(
        menuService.createMenuItem("res-1", {
          name: "Farmhouse Pizza",
          categoryId: "cat-1",
          dietaryType: "VEG",
          isAvailable: true,
          variants: [
            {
              name: "Regular",
              portion: "Standard",
              price: 200,
              isDefault: true,
              isAvailable: true,
            },
          ],
        }),
      ).rejects.toThrow("Item exists");
    });
  });
});
