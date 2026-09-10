import { formatMemberSince, getCustomerInitials } from "./customer.utils";

describe("customer.utils", () => {
  describe("formatMemberSince", () => {
    it("should format ISO string into Member since MMM YYYY", () => {
      const result = formatMemberSince("2023-01-15T10:00:00.000Z");
      expect(result).toBe("Member since Jan 2023");
    });

    it("should return empty string for null or invalid date", () => {
      expect(formatMemberSince(null)).toBe("");
      expect(formatMemberSince(undefined)).toBe("");
      expect(formatMemberSince("invalid-date")).toBe("");
    });
  });

  describe("getCustomerInitials", () => {
    it("should return initials for two-word names", () => {
      expect(getCustomerInitials("Rahul Sharma")).toBe("RS");
    });

    it("should return first two characters for single word name", () => {
      expect(getCustomerInitials("Admin")).toBe("AD");
    });

    it("should fallback to CU for empty or undefined input", () => {
      expect(getCustomerInitials("")).toBe("CU");
      expect(getCustomerInitials(null)).toBe("CU");
    });
  });
});
