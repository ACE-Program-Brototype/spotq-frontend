import { normalizePhoneNumber, updateStaffInfoSchema } from "./update-staff-info.schema";

describe("updateStaffInfoSchema", () => {
  it("should validate valid name and phone number", () => {
    const validData = {
      name: "Ravi Kumar",
      phone: "+919876543210",
    };
    const result = updateStaffInfoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should validate phone number with spaces or dashes", () => {
    const data = {
      name: "Ravi Kumar",
      phone: "+91 98765-43210",
    };
    const result = updateStaffInfoSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("should validate 10-digit Indian phone number without prefix", () => {
    const data = {
      name: "Ravi Kumar",
      phone: "9876543210",
    };
    const result = updateStaffInfoSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("should fail when name is empty or only whitespace", () => {
    const emptyName = {
      name: "   ",
      phone: "+919876543210",
    };
    const result = updateStaffInfoSchema.safeParse(emptyName);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/name is required/i);
    }
  });

  it("should fail when name is less than 2 characters", () => {
    const shortName = {
      name: "A",
      phone: "+919876543210",
    };
    const result = updateStaffInfoSchema.safeParse(shortName);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/at least 2 characters/i);
    }
  });

  it("should fail when phone number is invalid format", () => {
    const invalidPhone = {
      name: "Ravi Kumar",
      phone: "12345",
    };
    const result = updateStaffInfoSchema.safeParse(invalidPhone);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/valid phone number/i);
    }
  });

  it("should fail when phone is empty", () => {
    const emptyPhone = {
      name: "Ravi Kumar",
      phone: "",
    };
    const result = updateStaffInfoSchema.safeParse(emptyPhone);
    expect(result.success).toBe(false);
  });
});

describe("normalizePhoneNumber", () => {
  it("should normalize 10-digit phone to +91XXXXXXXXXX", () => {
    expect(normalizePhoneNumber("9876543210")).toBe("+919876543210");
  });

  it("should normalize +91 formatted phone to +91XXXXXXXXXX", () => {
    expect(normalizePhoneNumber("+91 98765 43210")).toBe("+919876543210");
  });

  it("should normalize phone with 0 prefix to +91XXXXXXXXXX", () => {
    expect(normalizePhoneNumber("09876543210")).toBe("+919876543210");
  });
});
