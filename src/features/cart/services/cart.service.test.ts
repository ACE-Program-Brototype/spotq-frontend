import { apiClient } from "@/lib/api/client";
import { cartService } from "./cart.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
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

    expect(apiClient.get).toHaveBeenCalledWith("carts/cart-123");
    expect(result.cartId).toBe("cart-123");
    expect(result.items).toHaveLength(1);
    expect(result.items[0].addons).toHaveLength(1);
    expect(result.subtotal).toBe(538);
  });

  it("adds an item to an existing cart", async () => {
    const mockAddData = {
      cartId: "cart-123",
      restaurantId: "rest-456",
      itemCount: 3,
      subtotal: 750,
      updatedAt: "2026-10-16T10:05:00.000Z",
      items: [
        {
          id: "item-2",
          menuItemId: "dish-2",
          quantity: 1,
          unitPrice: 212,
          totalPrice: 212,
        },
      ],
    };

    (apiClient.post as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        statusCode: 201,
        message: "Cart item added successfully",
        data: mockAddData,
      }),
    });

    const payload = {
      restaurantId: "rest-456",
      menuItemId: "dish-2",
      variantId: null,
      addonIds: [],
      quantity: 1,
      specialInstructions: "Extra crispy",
    };

    const result = await cartService.addItem("cart-123", payload);

    expect(apiClient.post).toHaveBeenCalledWith("carts/cart-123/items", {
      json: payload,
    });
    expect(result.cartId).toBe("cart-123");
    expect(result.itemCount).toBe(3);
    expect(result.subtotal).toBe(750);
  });

  it("adds an item without cartId, hitting carts/items", async () => {
    const mockAddData = {
      cartId: "cart-created-1",
      restaurantId: "rest-456",
      itemCount: 1,
      subtotal: 212,
      updatedAt: "2026-10-16T10:05:00.000Z",
      items: [],
    };

    (apiClient.post as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        statusCode: 201,
        message: "Cart item added successfully",
        data: mockAddData,
      }),
    });

    const payload = {
      restaurantId: "rest-456",
      menuItemId: "dish-2",
      variantId: null,
      addonIds: [],
      quantity: 1,
      specialInstructions: null,
    };

    const result = await cartService.addItem(null, payload);

    expect(apiClient.post).toHaveBeenCalledWith("carts/items", {
      json: payload,
    });
    expect(result.cartId).toBe("cart-created-1");
  });

  it("updates an item quantity in the cart", async () => {
    const mockUpdateData = {
      cartId: "cart-123",
      restaurantId: "rest-456",
      itemCount: 5,
      subtotal: 1250,
      updatedAt: "2026-10-16T10:10:00.000Z",
      items: [
        {
          cartItemId: "item-1",
          menuItemId: "dish-1",
          quantity: 5,
          unitPrice: 250,
          totalPrice: 1250,
        },
      ],
    };

    (apiClient.patch as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        statusCode: 200,
        message: "Cart item updated successfully",
        data: mockUpdateData,
      }),
    });

    const result = await cartService.updateQuantity("cart-123", "item-1", 5);

    expect(apiClient.patch).toHaveBeenCalledWith("carts/cart-123/items/item-1", {
      json: { quantity: 5 },
    });
    expect(result.cartId).toBe("cart-123");
    expect(result.itemCount).toBe(5);
    expect(result.subtotal).toBe(1250);
  });

  it("removes an item from the cart", async () => {
    const mockRemoveData = {
      cartId: "cart-123",
      restaurantId: "rest-456",
      itemCount: 0,
      subtotal: 0,
      updatedAt: "2026-10-16T10:12:00.000Z",
      items: [],
    };

    (apiClient.delete as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        statusCode: 200,
        message: "Cart item removed successfully",
        data: mockRemoveData,
      }),
    });

    const result = await cartService.removeItem("cart-123", "item-1");

    expect(apiClient.delete).toHaveBeenCalledWith("carts/cart-123/items/item-1");
    expect(result.cartId).toBe("cart-123");
    expect(result.itemCount).toBe(0);
    expect(result.subtotal).toBe(0);
  });
});
