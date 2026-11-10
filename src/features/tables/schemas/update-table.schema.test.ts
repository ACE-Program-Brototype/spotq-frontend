import { TABLE_SHAPE, UPDATE_TABLE_VALIDATION_MESSAGES } from "../constants/table.constants";
import { updateTableSchema } from "./update-table.schema";

describe("updateTableSchema", () => {
  it("passes validation with valid table data", () => {
    const validData = {
      tableCode: "T-10",
      sectionId: "123e4567-e89b-12d3-a456-426614174000",
      capacity: 4,
      tableShape: TABLE_SHAPE.SQUARE,
    };

    const result = updateTableSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tableCode).toBe("T-10");
      expect(result.data.capacity).toBe(4);
    }
  });

  it("fails validation when tableCode is empty", () => {
    const invalidData = {
      tableCode: "   ",
      sectionId: "123e4567-e89b-12d3-a456-426614174000",
      capacity: 4,
      tableShape: TABLE_SHAPE.CIRCLE,
    };

    const result = updateTableSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        UPDATE_TABLE_VALIDATION_MESSAGES.TABLE_CODE_REQUIRED,
      );
    }
  });

  it("fails validation when capacity is less than 1", () => {
    const invalidData = {
      tableCode: "T-01",
      sectionId: "123e4567-e89b-12d3-a456-426614174000",
      capacity: 0,
      tableShape: TABLE_SHAPE.CIRCLE,
    };

    const result = updateTableSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(UPDATE_TABLE_VALIDATION_MESSAGES.CAPACITY_MIN);
    }
  });

  it("fails validation when capacity exceeds 100", () => {
    const invalidData = {
      tableCode: "T-01",
      sectionId: "123e4567-e89b-12d3-a456-426614174000",
      capacity: 101,
      tableShape: TABLE_SHAPE.CIRCLE,
    };

    const result = updateTableSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(UPDATE_TABLE_VALIDATION_MESSAGES.CAPACITY_MAX);
    }
  });

  it("fails validation when sectionId is empty", () => {
    const invalidData = {
      tableCode: "T-01",
      sectionId: "",
      capacity: 4,
      tableShape: TABLE_SHAPE.SQUARE,
    };

    const result = updateTableSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        UPDATE_TABLE_VALIDATION_MESSAGES.SECTION_REQUIRED,
      );
    }
  });
});
