import type { AddCartItemInput } from "@/features/cart/types/cart.types";
import { calculateCartTotals, generateCartItemId, useCartStore } from "./cart.store";

describe("useCartStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.getState().clearCart();
  });

  const sampleItem1: AddCartItemInput = {
    restaurantId: "rest-1",
    restaurantName: "Burger Spot",
    menuItemId: "item-101",
    name: "Classic Cheeseburger",
    basePrice: 150,
    isVegetarian: false,
    selectedVariant: { id: "var-regular", name: "Regular", price: 150 },
    selectedAddons: [{ id: "addon-cheese", name: "Extra Cheese", price: 30 }],
    quantity: 1,
  };

  const sampleItem2DiffVariant: AddCartItemInput = {
    ...sampleItem1,
    selectedVariant: { id: "var-large", name: "Large", price: 200 },
    quantity: 1,
  };

  const sampleItemOtherRestaurant: AddCartItemInput = {
    restaurantId: "rest-2",
    restaurantName: "Pizza Palace",
    menuItemId: "item-201",
    name: "Margherita Pizza",
    basePrice: 250,
    isVegetarian: true,
    selectedVariant: null,
    selectedAddons: [],
    quantity: 1,
  };

  it("should initialize with empty state", () => {
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.restaurantId).toBeNull();
    expect(state.restaurantName).toBeNull();
    expect(state.totalCount).toBe(0);
    expect(state.totalAmount).toBe(0);
  });

  it("should add item to empty cart and compute totals accurately", () => {
    const result = useCartStore.getState().addItem(sampleItem1);
    expect(result.success).toBe(true);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.restaurantId).toBe("rest-1");
    expect(state.restaurantName).toBe("Burger Spot");
    expect(state.totalCount).toBe(1);
    // 150 (variant) + 30 (addon) = 180
    expect(state.totalAmount).toBe(180);
    expect(state.items[0]?.unitPrice).toBe(180);
    expect(state.items[0]?.subtotal).toBe(180);
  });

  it("should increment quantity instead of creating duplicate for exact same configuration", () => {
    useCartStore.getState().addItem(sampleItem1);
    const result = useCartStore.getState().addItem({
      ...sampleItem1,
      quantity: 2,
    });

    expect(result.success).toBe(true);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.totalCount).toBe(3);
    expect(state.items[0]?.quantity).toBe(3);
    expect(state.items[0]?.subtotal).toBe(540);
    expect(state.totalAmount).toBe(540);
  });

  it("should create separate cart items when variants or add-ons differ", () => {
    useCartStore.getState().addItem(sampleItem1);
    useCartStore.getState().addItem(sampleItem2DiffVariant);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(2);
    expect(state.totalCount).toBe(2);
    // Item 1: 180, Item 2: 200 + 30 = 230
    expect(state.totalAmount).toBe(410);
  });

  it("should block adding items from different restaurant and return requiresConfirmation", () => {
    useCartStore.getState().addItem(sampleItem1);
    const result = useCartStore.getState().addItem(sampleItemOtherRestaurant);

    expect(result.success).toBe(false);
    expect(result.requiresConfirmation).toBe(true);
    expect(result.currentRestaurantName).toBe("Burger Spot");

    // Existing cart remains unchanged
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.restaurantId).toBe("rest-1");
  });

  it("should clear old items and add new item when confirmReplaceCartAndAdd is called", () => {
    useCartStore.getState().addItem(sampleItem1);
    useCartStore.getState().confirmReplaceCartAndAdd(sampleItemOtherRestaurant);

    const state = useCartStore.getState();
    expect(state.restaurantId).toBe("rest-2");
    expect(state.restaurantName).toBe("Pizza Palace");
    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.menuItemId).toBe("item-201");
    expect(state.totalCount).toBe(1);
    expect(state.totalAmount).toBe(250);
  });

  it("should update quantity and recalculate subtotals and totals", () => {
    useCartStore.getState().addItem(sampleItem1);
    const itemId = useCartStore.getState().items[0]?.id as string;

    useCartStore.getState().updateQuantity(itemId, 2);
    let state = useCartStore.getState();
    expect(state.items[0]?.quantity).toBe(3);
    expect(state.items[0]?.subtotal).toBe(540);
    expect(state.totalCount).toBe(3);
    expect(state.totalAmount).toBe(540);

    useCartStore.getState().updateQuantity(itemId, -1);
    state = useCartStore.getState();
    expect(state.items[0]?.quantity).toBe(2);
    expect(state.items[0]?.subtotal).toBe(360);
    expect(state.totalCount).toBe(2);
    expect(state.totalAmount).toBe(360);
  });

  it("should remove item when quantity is decremented to 0 or below", () => {
    useCartStore.getState().addItem(sampleItem1);
    useCartStore.getState().addItem(sampleItem2DiffVariant);
    const item1Id = useCartStore.getState().items[0]?.id as string;

    useCartStore.getState().updateQuantity(item1Id, -1);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.selectedVariant?.id).toBe("var-large");
    expect(state.totalCount).toBe(1);
  });

  it("should reset to empty initial state when last item reaches 0 quantity", () => {
    useCartStore.getState().addItem(sampleItem1);
    const item1Id = useCartStore.getState().items[0]?.id as string;

    useCartStore.getState().updateQuantity(item1Id, -1);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.restaurantId).toBeNull();
    expect(state.restaurantName).toBeNull();
    expect(state.totalCount).toBe(0);
    expect(state.totalAmount).toBe(0);
  });

  it("should remove specific item via removeItem", () => {
    useCartStore.getState().addItem(sampleItem1);
    const item1Id = useCartStore.getState().items[0]?.id as string;

    useCartStore.getState().removeItem(item1Id);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.restaurantId).toBeNull();
  });

  it("should completely reset cart on clearCart", () => {
    useCartStore.getState().addItem(sampleItem1);
    useCartStore.getState().addItem(sampleItem2DiffVariant);

    useCartStore.getState().clearCart();
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.restaurantId).toBeNull();
    expect(state.restaurantName).toBeNull();
    expect(state.totalCount).toBe(0);
    expect(state.totalAmount).toBe(0);
  });

  it("generateCartItemId produces consistent identifiers regardless of add-on order", () => {
    const key1 = generateCartItemId("item-1", "var-1", ["a1", "a2"]);
    const key2 = generateCartItemId("item-1", "var-1", ["a2", "a1"]);
    expect(key1).toBe(key2);
  });

  it("calculateCartTotals accurately tallies quantities and amounts", () => {
    const totals = calculateCartTotals([
      {
        id: "1",
        menuItemId: "m1",
        name: "Item 1",
        isVegetarian: true,
        selectedVariant: null,
        selectedAddons: [],
        unitPrice: 100,
        quantity: 2,
        subtotal: 200,
      },
      {
        id: "2",
        menuItemId: "m2",
        name: "Item 2",
        isVegetarian: false,
        selectedVariant: null,
        selectedAddons: [],
        unitPrice: 50,
        quantity: 3,
        subtotal: 150,
      },
    ]);

    expect(totals.totalCount).toBe(5);
    expect(totals.totalAmount).toBe(350);
  });
});
