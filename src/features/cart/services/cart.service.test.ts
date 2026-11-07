import { apiClient } from "@/lib/api/client";
import { CART_ENDPOINTS } from "../constants/cart.constants";
import { cartService } from "./cart.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe("cartService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("batchAddToCart", () => {
    it("calls apiClient.post with CART_ENDPOINTS.BATCH_ITEMS and returns response data", async () => {
      const mockPayload = {
        restaurantId: "rest-uuid-123",
        items: [
          {
            menuItemId: "item-uuid-456",
            quantity: 2,
            variantId: "var-uuid-789",
            addonIds: ["addon-uuid-001"],
          },
        ],
      };

      const mockResponse = {
        success: true,
        message: "Items added to cart successfully",
        data: {
          cartId: "cart-uuid-999",
          restaurantId: "rest-uuid-123",
          items: [],
          itemCount: 2,
          subtotal: 500,
        },
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await cartService.batchAddToCart(mockPayload);

      expect(apiClient.post).toHaveBeenCalledWith(CART_ENDPOINTS.BATCH_ITEMS, {
        json: mockPayload,
      });
      expect(result).toEqual(mockResponse);
    });

    it("throws error when apiClient.post fails", async () => {
      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockRejectedValue(new Error("Network Error")),
      });

      await expect(
        cartService.batchAddToCart({
          restaurantId: "rest-1",
          items: [],
        }),
      ).rejects.toThrow("Network Error");
    });
  });
});
