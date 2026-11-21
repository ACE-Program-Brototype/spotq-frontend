import { createTableSchema } from "./create-table.schema";

describe("createTableSchema", () => {
  it("accepts valid table data", () => {
    expect(
      createTableSchema.safeParse({
        tableCode: "T1",
        sectionId: "section-1",
        capacity: 4,
        tableShape: "CIRCLE",
      }).success,
    ).toBe(true);
  });

  it("rejects invalid table data", () => {
    expect(
      createTableSchema.safeParse({
        tableCode: "",
        sectionId: "",
        capacity: 0,
        tableShape: "TRIANGLE",
      }).success,
    ).toBe(false);
  });

  it("rejects tableCode exceeding 30 characters", () => {
    expect(
      createTableSchema.safeParse({
        tableCode: "A".repeat(31),
        sectionId: "section-1",
        capacity: 4,
        tableShape: "CIRCLE",
      }).success,
    ).toBe(false);
  });
});
