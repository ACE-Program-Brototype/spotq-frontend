import { Gender, PROFILE_MESSAGES } from "../constants/profile.constants";
import { editProfileSchema } from "./edit-profile.schema";

describe("editProfileSchema", () => {
  it("accepts valid profile data with full name, email, 10-digit phone, dob, and gender", () => {
    const result = editProfileSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: "9876543210",
      dob: "1995-04-12",
      gender: Gender.FEMALE,
    });

    expect(result.success).toBe(true);
  });

  it("accepts optional phone when null or empty string", () => {
    const resultWithNull = editProfileSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: null,
      dob: null,
      gender: null,
    });
    expect(resultWithNull.success).toBe(true);

    const resultWithEmpty = editProfileSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: "",
      dob: "",
      gender: "",
    });
    expect(resultWithEmpty.success).toBe(true);
  });

  it("rejects phone numbers that are not exactly 10 digits", () => {
    const resultShort = editProfileSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: "12345",
      dob: null,
      gender: null,
    });

    expect(resultShort.success).toBe(false);
    if (!resultShort.success) {
      expect(resultShort.error.issues[0].message).toBe(PROFILE_MESSAGES.VALIDATION.PHONE_INVALID);
    }

    const resultChars = editProfileSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: "98765abcd0",
      dob: null,
      gender: null,
    });

    expect(resultChars.success).toBe(false);
  });

  it("rejects short full name", () => {
    const result = editProfileSchema.safeParse({
      fullName: "A",
      email: "jane@example.com",
      phone: "9876543210",
      dob: null,
      gender: null,
    });

    expect(result.success).toBe(false);
  });

  it("rejects future date of birth", () => {
    const nextYear = new Date().getFullYear() + 2;
    const result = editProfileSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: "9876543210",
      dob: `${nextYear}-01-01`,
      gender: null,
    });

    expect(result.success).toBe(false);
  });
});
