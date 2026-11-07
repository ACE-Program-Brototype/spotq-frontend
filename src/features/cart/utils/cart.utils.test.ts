import { calculateCartTotals, calculateUnitPrice, generateCartItemId } from "./cart.utils";

describe("cart.utils", () => {
  it("generateCartItemId produces consistent identifiers regardless of add-on order", () => {
    const key1 = generateCartItemId("item-1", "var-1", ["a1", "a2"]);
    const key2 = generateCartItemId("item-1", "var-1", ["a2", "a1"]);
    expect(key1).toBe(key2);
  });

  it("generateCartItemId uses none for null or undefined variantId", () => {
    expect(generateCartItemId("item-1", null, [])).toBe("item-1_v:none_a:");
    expect(generateCartItemId("item-1", undefined, [])).toBe("item-1_v:none_a:");
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

  it("calculateUnitPrice considers base price and add-ons when variant is null", () => {
    const price = calculateUnitPrice({
      restaurantId: "r1",
      restaurantName: "R1",
      menuItemId: "m1",
      name: "Item",
      basePrice: 150,
      isVegetarian: true,
      selectedVariant: null,
      selectedAddons: [
        { id: "a1", name: "Cheese", price: 30 },
        { id: "a2", name: "Dip", price: 20 },
      ],
    });

    expect(price).toBe(200);
  });

  it("calculateUnitPrice uses variant price instead of base price when variant is selected", () => {
    const price = calculateUnitPrice({
      restaurantId: "r1",
      restaurantName: "R1",
      menuItemId: "m1",
      name: "Item",
      basePrice: 150,
      isVegetarian: true,
      selectedVariant: { id: "v1", name: "Large", price: 220 },
      selectedAddons: [{ id: "a1", name: "Cheese", price: 30 }],
    });

    expect(price).toBe(250);
  });
});
