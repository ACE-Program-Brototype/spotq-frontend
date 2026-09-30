import { createCategorySchema } from "./create-category.schema";

describe("createCategorySchema", () => {
  it("validates valid category input successfully", () => {
    const validData = {
      name: "Starters & Appetizers",
      description: "Crispy and savory starters",
      displayOrder: 1,
      isActive: true,
    };
    const result = createCategorySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when category name is empty", () => {
    const invalidData = {
      name: "   ",
      description: "Some description",
      displayOrder: 0,
      isActive: true,
    };
    const result = createCategorySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails when display order is negative", () => {
    const invalidData = {
      name: "Main Course",
      description: "Mains",
      displayOrder: -1,
      isActive: true,
    };
    const result = createCategorySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
