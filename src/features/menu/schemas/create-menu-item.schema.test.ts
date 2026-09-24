import { createMenuItemSchema } from "./create-menu-item.schema";

describe("createMenuItemSchema", () => {
  const validMenuItem = {
    name: "Classic Cheeseburger",
    categoryId: "cat-1234-uuid",
    description: "Juicy beef patty with aged cheddar",
    dietaryType: "NON_VEG" as const,
    preparationTime: 15,
    imageUrl: "restaurants/res-1/menus/burger.jpg",
    isAvailable: true,
    variants: [
      {
        name: "Regular",
        portion: "Single Patty",
        price: 249,
        sku: "BUR-REG-01",
        isDefault: true,
        isAvailable: true,
      },
    ],
    selectedAddonIds: ["addon-1"],
    addonOverrides: { "addon-1": 35 },
  };

  it("validates full valid menu item payload", () => {
    const result = createMenuItemSchema.safeParse(validMenuItem);
    expect(result.success).toBe(true);
  });

  it("fails when name is missing or empty", () => {
    const invalid = { ...validMenuItem, name: "  " };
    const result = createMenuItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("fails when categoryId is missing", () => {
    const invalid = { ...validMenuItem, categoryId: "" };
    const result = createMenuItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("fails when variants array is empty", () => {
    const invalid = { ...validMenuItem, variants: [] };
    const result = createMenuItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("fails when no variant is set as default", () => {
    const invalid = {
      ...validMenuItem,
      variants: [
        {
          name: "Regular",
          portion: "1 Person",
          price: 150,
          isDefault: false,
          isAvailable: true,
        },
      ],
    };
    const result = createMenuItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("fails when multiple variants are set as default", () => {
    const invalid = {
      ...validMenuItem,
      variants: [
        {
          name: "Regular",
          portion: "1 Person",
          price: 150,
          isDefault: true,
          isAvailable: true,
        },
        {
          name: "Large",
          portion: "2 Persons",
          price: 250,
          isDefault: true,
          isAvailable: true,
        },
      ],
    };
    const result = createMenuItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("fails when variant price is negative", () => {
    const invalid = {
      ...validMenuItem,
      variants: [
        {
          name: "Regular",
          portion: "1 Person",
          price: -20,
          isDefault: true,
          isAvailable: true,
        },
      ],
    };
    const result = createMenuItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
