import { createAddonSchema } from "./create-addon.schema";

describe("createAddonSchema", () => {
  it("validates valid addon input successfully", () => {
    const validData = {
      name: "Extra Cheese",
      description: "Melted mozzarella",
      price: 40,
      isAvailable: true,
    };
    const result = createAddonSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when addon name is missing", () => {
    const invalidData = {
      name: "",
      price: 25,
      isAvailable: true,
    };
    const result = createAddonSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails when price is negative", () => {
    const invalidData = {
      name: "Garlic Dip",
      price: -10,
      isAvailable: true,
    };
    const result = createAddonSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
