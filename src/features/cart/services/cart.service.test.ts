import { apiClient } from "@/lib/api/client";
import { cartService } from "./cart.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("cartService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches cart details by cartId", async () => {
    const mockCartData = {
      cartId: "cart-123",
      restaurantId: "rest-456",
      userId: "user-789",
      status: "ACTIVE",
      itemCount: 2,
      subtotal: 538,
      createdAt: "2026-10-16T10:00:00.000Z",
      updatedAt: "2026-10-16T10:00:00.000Z",
      expiresAt: "2026-10-17T10:00:00.000Z",
      items: [
        {
          cartItemId: "item-1",
          menuItemId: "dish-1",
          menuItemName: "Butter Chicken",
          variantId: "var-1",
          variantName: "Full",
          quantity: 2,
          unitPrice: 250,
          totalPrice: 500,
          specialInstructions: "Spicy",
          addons: [
            {
              addonId: "addon-1",
              addonName: "Extra Butter",
              price: 19,
            },
          ],
        },
      ],
    };

    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        statusCode: 200,
        message: "Cart retrieved successfully",
        data: mockCartData,
      }),
    });

    const result = await cartService.getCart("cart-123");

    expect(apiClient.get).toHaveBeenCalledWith("orders/carts/cart-123");
    expect(result.cartId).toBe("cart-123");
    expect(result.items).toHaveLength(1);
    expect(result.items[0].addons).toHaveLength(1);
    expect(result.subtotal).toBe(538);
  });
});
