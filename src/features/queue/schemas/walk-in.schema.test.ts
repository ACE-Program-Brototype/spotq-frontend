import { normalizePhone, walkInSchema } from "./walk-in.schema";

describe("walkInSchema", () => {
  const validData = {
    guestName: "David Miller",
    guestPhone: "9876543210",
    partySize: 2,
    specialNotes: "Prefers booth seating",
  };

  describe("guestName", () => {
    it("accepts a valid guest name", () => {
      const res = walkInSchema.safeParse(validData);
      expect(res.success).toBe(true);
    });

    it("rejects an empty guest name", () => {
      const res = walkInSchema.safeParse({ ...validData, guestName: "" });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toBe("Guest name is required");
      }
    });

    it("rejects name with less than 2 characters", () => {
      const res = walkInSchema.safeParse({ ...validData, guestName: "A" });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toBe("Guest name must be at least 2 characters");
      }
    });

    it("rejects name exceeding 50 characters", () => {
      const res = walkInSchema.safeParse({
        ...validData,
        guestName: "A".repeat(51),
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toBe("Guest name cannot exceed 50 characters");
      }
    });
  });

  describe("guestPhone", () => {
    it("accepts 10-digit phone number and +91 prefixed formats", () => {
      const validNumbers = ["9876543210", "+919876543210", "+91 9876543210", "+91-98765-43210"];

      for (const phone of validNumbers) {
        const res = walkInSchema.safeParse({ ...validData, guestPhone: phone });
        expect(res.success).toBe(true);
      }
    });

    it("rejects 7-digit phone numbers", () => {
      const res = walkInSchema.safeParse({
        ...validData,
        guestPhone: "1234567",
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toBe("Please enter a valid 10-digit mobile number");
      }
    });

    it("rejects 9-digit phone numbers", () => {
      const res = walkInSchema.safeParse({
        ...validData,
        guestPhone: "987654321",
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toBe("Please enter a valid 10-digit mobile number");
      }
    });

    it("rejects 11-digit phone numbers without +91 prefix", () => {
      const res = walkInSchema.safeParse({
        ...validData,
        guestPhone: "98765432101",
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toBe("Please enter a valid 10-digit mobile number");
      }
    });

    it("rejects dummy phone numbers not starting with 6-9", () => {
      const invalidStartingDigits = ["0000000000", "1111111111", "5555555555", "+911234567890"];
      for (const phone of invalidStartingDigits) {
        const res = walkInSchema.safeParse({
          ...validData,
          guestPhone: phone,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
          expect(res.error.issues[0].message).toBe("Please enter a valid 10-digit mobile number");
        }
      }
    });

    it("rejects empty phone number", () => {
      const res = walkInSchema.safeParse({ ...validData, guestPhone: "" });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toBe("Phone number is required");
      }
    });
  });

  describe("normalizePhone helper", () => {
    it("normalizes 10-digit number to +91XXXXXXXXXX", () => {
      expect(normalizePhone("9876543210")).toBe("+919876543210");
    });

    it("normalizes +91 formatted numbers with spaces/hyphens to +91XXXXXXXXXX", () => {
      expect(normalizePhone("+91 98765 43210")).toBe("+919876543210");
      expect(normalizePhone("+91-9876543210")).toBe("+919876543210");
      expect(normalizePhone("+919876543210")).toBe("+919876543210");
    });

    it("falls back to trimmed raw string if fewer than 10 digits are provided", () => {
      expect(normalizePhone("123")).toBe("123");
      expect(normalizePhone("   98765   ")).toBe("98765");
    });
  });

  describe("partySize", () => {
    it("accepts party size between 1 and 100", () => {
      for (const size of [1, 2, 4, 6, 20, 50, 100]) {
        const res = walkInSchema.safeParse({ ...validData, partySize: size });
        expect(res.success).toBe(true);
      }
    });

    it("rejects party size less than 1", () => {
      const res = walkInSchema.safeParse({ ...validData, partySize: 0 });
      expect(res.success).toBe(false);
    });

    it("rejects party size greater than 100", () => {
      const res = walkInSchema.safeParse({ ...validData, partySize: 101 });
      expect(res.success).toBe(false);
    });
  });

  describe("specialNotes", () => {
    it("accepts optional special notes", () => {
      const res = walkInSchema.safeParse({
        ...validData,
        specialNotes: "High chair needed",
      });
      expect(res.success).toBe(true);
    });

    it("rejects notes longer than 250 characters", () => {
      const res = walkInSchema.safeParse({
        ...validData,
        specialNotes: "N".repeat(251),
      });
      expect(res.success).toBe(false);
    });
  });
});
