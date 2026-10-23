import { apiClient } from "@/lib/api/client";
import { CART_ENDPOINTS } from "../constants/cart.constants";
import type { AddToCartPayload } from "../types/cart.types";
import { cartService } from "./cart.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe("cartService", () => {
  const mockPayload: AddToCartPayload = {
    restaurantId: "e2f4104e-97af-4ed2-88ad-92beef8f159d",
    menuItemId: "56271820-f0b8-4c5c-8b9d-61a3da550a80",
    quantity: 2,
    addonIds: ["5ca738ce-0791-46f4-a6c5-55e0b29dca25"],
    specialInstructions: "Extra raitha please",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addToCart", () => {
    it("calls apiClient.post with CART_ENDPOINTS.ADD_ITEM and json payload", async () => {
      const mockResponse = { success: true, message: "Item added" };
      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await cartService.addToCart(mockPayload);

      expect(apiClient.post).toHaveBeenCalledTimes(1);
      expect(apiClient.post).toHaveBeenCalledWith(CART_ENDPOINTS.ADD_ITEM, {
        json: mockPayload,
      });
      expect(result).toEqual(mockResponse);
    });

    it("propagates errors if apiClient throws", async () => {
      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockRejectedValue(new Error("Network Error")),
      });

      await expect(cartService.addToCart(mockPayload)).rejects.toThrow("Network Error");
    });
  });
});
