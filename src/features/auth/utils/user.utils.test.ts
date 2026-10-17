import type { User } from "../types/auth.types";
import { getUserDisplayName, getUserInitials } from "./user.utils";

describe("user.utils", () => {
  describe("getUserDisplayName", () => {
    it("returns fullName when provided", () => {
      const user: Partial<User> = {
        fullName: "Julian Montgomery",
        name: "Julian",
        email: "j@example.com",
      };
      expect(getUserDisplayName(user)).toBe("Julian Montgomery");
    });

    it("falls back to name when fullName is missing or empty", () => {
      const user: Partial<User> = { fullName: "", name: "Julian", email: "j@example.com" };
      expect(getUserDisplayName(user)).toBe("Julian");
    });

    it("falls back to email prefix when both fullName and name are missing", () => {
      const user: Partial<User> = { email: "julian.montgomery@example.com" };
      expect(getUserDisplayName(user)).toBe("julian.montgomery");
    });

    it("returns custom fallback when user is null or undefined", () => {
      expect(getUserDisplayName(null, "Guest")).toBe("Guest");
      expect(getUserDisplayName(undefined, "Guest")).toBe("Guest");
    });

    it("returns empty string by default when no identifiers exist", () => {
      expect(getUserDisplayName(null)).toBe("");
      expect(getUserDisplayName(undefined)).toBe("");
      expect(getUserDisplayName({ email: "" })).toBe("");
    });

    it("trims whitespace from full name or name", () => {
      expect(getUserDisplayName({ fullName: "  Alex Smith  " })).toBe("Alex Smith");
    });
  });

  describe("getUserInitials", () => {
    it("extracts first and last initials from multi-word names", () => {
      expect(getUserInitials("Julian Montgomery")).toBe("JM");
      expect(getUserInitials("Rahul Kumar Sharma")).toBe("RS");
      expect(getUserInitials({ fullName: "Julian Montgomery" })).toBe("JM");
    });

    it("takes first two letters for single-word names with length >= 2", () => {
      expect(getUserInitials("Julian")).toBe("JU");
      expect(getUserInitials({ fullName: "Julian" })).toBe("JU");
    });

    it("takes single letter for single-character name", () => {
      expect(getUserInitials("J")).toBe("J");
      expect(getUserInitials({ name: "J" })).toBe("J");
    });

    it("handles multiple spaces gracefully", () => {
      expect(getUserInitials("   John    Doe   ")).toBe("JD");
    });

    it("derives initials from user email prefix when names are absent", () => {
      expect(getUserInitials({ email: "fayas@example.com" })).toBe("FA");
      expect(getUserInitials({ email: "fayas.ahmed@example.com" })).toBe("FA");
    });

    it("falls back to default fallback 'CU' when no name or user exists", () => {
      expect(getUserInitials(null)).toBe("CU");
      expect(getUserInitials(undefined)).toBe("CU");
      expect(getUserInitials("")).toBe("CU");
      expect(getUserInitials("   ")).toBe("CU");
    });

    it("respects custom fallback", () => {
      expect(getUserInitials(null, "NA")).toBe("NA");
      expect(getUserInitials("", "NA")).toBe("NA");
    });
  });
});
