import {
  formatDate,
  formatDateOfBirth,
  formatDateTime,
  formatGender,
  formatPhoneNumber,
  formatRole,
  formatStatus,
  getInitials,
  getProfileInitials,
  normalizeStaffProfile,
  resolveAvatarUrl,
} from "./profile.utils";

describe("profile.utils", () => {
  describe("formatDateOfBirth", () => {
    it("formats a valid YYYY-MM-DD date to readable string", () => {
      expect(formatDateOfBirth("1995-04-12")).toBe("April 12, 1995");
    });

    it("returns fallback for null or empty dates", () => {
      expect(formatDateOfBirth(null, "Not specified")).toBe("Not specified");
      expect(formatDateOfBirth("", "Not specified")).toBe("Not specified");
    });
  });

  describe("formatGender", () => {
    it("capitalizes gender correctly", () => {
      expect(formatGender("MALE")).toBe("Male");
      expect(formatGender("FEMALE")).toBe("Female");
      expect(formatGender("OTHER")).toBe("Other");
    });

    it("returns fallback for missing gender", () => {
      expect(formatGender(null)).toBe("Not specified");
    });
  });

  describe("formatPhoneNumber", () => {
    it("formats Indian phone numbers with spacing", () => {
      expect(formatPhoneNumber("+919876543210")).toBe("+91 98765 43210");
    });

    it("returns raw string if not matching standard format", () => {
      expect(formatPhoneNumber("12345")).toBe("12345");
    });

    it("returns fallback for missing phone", () => {
      expect(formatPhoneNumber(null)).toBe("Not provided");
    });
  });

  describe("getProfileInitials", () => {
    it("extracts first and last initials", () => {
      expect(getProfileInitials("John Doe")).toBe("JD");
      expect(getProfileInitials("Rahul Kumar Sharma")).toBe("RS");
    });

    it("handles single name", () => {
      expect(getProfileInitials("Rahul")).toBe("RA");
    });

    it("returns fallback for missing name", () => {
      expect(getProfileInitials(null)).toBe("CU");
    });
  });

  describe("getInitials", () => {
    it("extracts first and last initials", () => {
      expect(getInitials("Julian Montgomery")).toBe("JM");
    });

    it("handles single name", () => {
      expect(getInitials("Julian")).toBe("JU");
    });

    it("returns fallback for empty string", () => {
      expect(getInitials("")).toBe("SP");
    });
  });

  describe("formatRole", () => {
    it("formats STAFF to Staff", () => {
      expect(formatRole("STAFF")).toBe("Staff");
    });

    it("formats RESTAURANT_STAFF to Staff", () => {
      expect(formatRole("RESTAURANT_STAFF")).toBe("Staff");
    });

    it("formats MANAGER to Manager", () => {
      expect(formatRole("MANAGER")).toBe("Manager");
    });
  });

  describe("formatStatus", () => {
    it("formats ACTIVE to Active", () => {
      expect(formatStatus("ACTIVE")).toBe("Active");
    });
  });

  describe("formatDate", () => {
    it("formats ISO string to localized date", () => {
      const result = formatDate("2024-10-24T08:42:00.000Z");
      expect(result).toBe("October 24, 2024");
    });
  });

  describe("formatDateTime", () => {
    it("formats valid ISO timestamp", () => {
      const result = formatDateTime("2024-10-24T08:42:00.000Z");
      expect(result).toMatch(/October \d+, 2024 - \d{2}:\d{2} [AP]M/);
    });
  });

  describe("resolveAvatarUrl", () => {
    it("returns null for empty avatar", () => {
      expect(resolveAvatarUrl("")).toBeNull();
      expect(resolveAvatarUrl(null)).toBeNull();
    });

    it("returns full http url directly", () => {
      expect(resolveAvatarUrl("https://example.com/avatar.jpg")).toBe(
        "https://example.com/avatar.jpg",
      );
    });
  });

  describe("normalizeStaffProfile", () => {
    it("normalizes snake_case backend payload", () => {
      const raw = {
        id: "staff-1",
        restaurant_id: "rest-1",
        fullname: "Julian Montgomery",
        email: "j.montgomery@dineline.com",
        phone: "+1 (555) 234-8901",
        avatar_url: "https://example.com/avatar.jpg",
        role: "MANAGER",
        status: "ACTIVE",
        created_at: "2024-10-24T08:42:00.000Z",
      };

      const normalized = normalizeStaffProfile(raw);
      expect(normalized).toEqual({
        id: "staff-1",
        restaurantId: "rest-1",
        fullName: "Julian Montgomery",
        email: "j.montgomery@dineline.com",
        phone: "+1 (555) 234-8901",
        avatarUrl: "https://example.com/avatar.jpg",
        role: "Manager",
        status: "Active",
        createdAt: "2024-10-24T08:42:00.000Z",
      });
    });
  });
});
