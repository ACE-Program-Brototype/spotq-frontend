import {
  normalizeStaffPhone,
  updateStaffProfileSchema,
  validateAvatarFile,
} from "./update-staff-profile.schema";

describe("updateStaffProfileSchema", () => {
  describe("name validation", () => {
    it("accepts valid names", () => {
      const validNames = ["Ravi Kumar", "Julian Montgomery", "Mary-Jane Watson", "O'Connor"];
      for (const name of validNames) {
        const result = updateStaffProfileSchema.safeParse({
          name,
          phone: "+919876543210",
        });
        expect(result.success).toBe(true);
      }
    });

    it("rejects empty name or whitespace-only name", () => {
      const emptyNames = ["", "   ", "\t\n"];
      for (const name of emptyNames) {
        const result = updateStaffProfileSchema.safeParse({
          name,
          phone: "+919876543210",
        });
        expect(result.success).toBe(false);
      }
    });

    it("rejects name shorter than 2 characters", () => {
      const result = updateStaffProfileSchema.safeParse({
        name: "A",
        phone: "+919876543210",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 2 characters");
      }
    });

    it("rejects name longer than 100 characters", () => {
      const result = updateStaffProfileSchema.safeParse({
        name: "A".repeat(101),
        phone: "+919876543210",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("cannot exceed 100 characters");
      }
    });

    it("rejects name with numbers or special characters", () => {
      const invalidNames = ["Ravi123", "John@Doe", "Alex_Smith", "<script>alert()</script>"];
      for (const name of invalidNames) {
        const result = updateStaffProfileSchema.safeParse({
          name,
          phone: "+919876543210",
        });
        expect(result.success).toBe(false);
      }
    });
  });

  describe("phone validation", () => {
    it("accepts valid Indian phone numbers in various common formats", () => {
      const validPhones = [
        "9876543210",
        "+919876543210",
        "+91 9876543210",
        "+91 98765 43210",
        "09876543210",
      ];
      for (const phone of validPhones) {
        const result = updateStaffProfileSchema.safeParse({
          name: "Ravi Kumar",
          phone,
        });
        expect(result.success).toBe(true);
      }
    });

    it("rejects empty or invalid phone numbers", () => {
      const invalidPhones = [
        "",
        "   ",
        "12345",
        "abcdefghij",
        "5555555555", // Indian numbers start with 6-9
        "1234567890123456",
      ];
      for (const phone of invalidPhones) {
        const result = updateStaffProfileSchema.safeParse({
          name: "Ravi Kumar",
          phone,
        });
        expect(result.success).toBe(false);
      }
    });
  });

  describe("normalizeStaffPhone", () => {
    it("formats 10-digit number to +91XXXXXXXXXX", () => {
      expect(normalizeStaffPhone("9876543210")).toBe("+919876543210");
    });

    it("formats number with existing +91 and spaces to +91XXXXXXXXXX", () => {
      expect(normalizeStaffPhone("+91 98765 43210")).toBe("+919876543210");
    });

    it("formats 0-prefixed number to +91XXXXXXXXXX", () => {
      expect(normalizeStaffPhone("09876543210")).toBe("+919876543210");
    });
  });

  describe("validateAvatarFile", () => {
    it("accepts valid image formats under 2MB", () => {
      const validFile = new File(["dummy content"], "avatar.jpg", { type: "image/jpeg" });
      const result = validateAvatarFile(validFile);
      expect(result.valid).toBe(true);
    });

    it("rejects non-image or unsupported formats", () => {
      const pdfFile = new File(["dummy content"], "doc.pdf", { type: "application/pdf" });
      const result = validateAvatarFile(pdfFile);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("rejects image files exceeding 2MB", () => {
      const largeContent = new Uint8Array(2.5 * 1024 * 1024);
      const largeFile = new File([largeContent], "large.png", { type: "image/png" });
      const result = validateAvatarFile(largeFile);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
