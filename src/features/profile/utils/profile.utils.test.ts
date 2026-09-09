import {
  formatDateOfBirth,
  formatGender,
  formatPhoneNumber,
  getProfileInitials,
} from "./profile.utils";

describe("profile.utils", () => {
  describe("formatDateOfBirth", () => {
    it("formats valid YYYY-MM-DD date into localized string", () => {
      expect(formatDateOfBirth("1995-04-12")).toBe("April 12, 1995");
      expect(formatDateOfBirth("2000-01-01")).toBe("January 1, 2000");
    });

    it("returns fallback for null or empty dates", () => {
      expect(formatDateOfBirth(null)).toBeNull();
      expect(formatDateOfBirth(undefined, "Not specified")).toBe("Not specified");
      expect(formatDateOfBirth("", "Not specified")).toBe("Not specified");
    });

    it("returns raw string when date format is unexpected", () => {
      expect(formatDateOfBirth("invalid-date")).toBe("invalid-date");
    });
  });

  describe("formatGender", () => {
    it("capitalizes gender correctly", () => {
      expect(formatGender("MALE")).toBe("Male");
      expect(formatGender("FEMALE")).toBe("Female");
      expect(formatGender("OTHER")).toBe("Other");
    });

    it("returns fallback when gender is null or undefined", () => {
      expect(formatGender(null)).toBe("Not specified");
      expect(formatGender(undefined, "Custom fallback")).toBe("Custom fallback");
    });
  });

  describe("formatPhoneNumber", () => {
    it("formats Indian +91 phone numbers into formatted format", () => {
      expect(formatPhoneNumber("+919876543210")).toBe("+91 98765 43210");
    });

    it("returns raw phone for non-+91 or non-standard formats", () => {
      expect(formatPhoneNumber("+14155552671")).toBe("+14155552671");
    });

    it("returns fallback when phone is null or undefined", () => {
      expect(formatPhoneNumber(null)).toBe("Not provided");
      expect(formatPhoneNumber(undefined, "None")).toBe("None");
    });
  });

  describe("getProfileInitials", () => {
    it("returns 2 uppercase initials for multi-word names", () => {
      expect(getProfileInitials("Jane Doe")).toBe("JD");
      expect(getProfileInitials("John Michael Smith")).toBe("JS");
    });

    it("returns 2 uppercase letters for single-word names", () => {
      expect(getProfileInitials("Alex")).toBe("AL");
    });

    it("returns fallback for empty or whitespace strings", () => {
      expect(getProfileInitials(null)).toBe("CU");
      expect(getProfileInitials("")).toBe("CU");
      expect(getProfileInitials("   ")).toBe("CU");
    });
  });
});
