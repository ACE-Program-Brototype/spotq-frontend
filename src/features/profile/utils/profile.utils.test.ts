import env from "@/config/env";
import {
  formatDate,
  formatDateTime,
  formatRole,
  formatStatus,
  getInitials,
  normalizeStaffProfile,
  resolveAvatarUrl,
} from "./profile.utils";

describe("profile.utils", () => {
  describe("resolveAvatarUrl", () => {
    it("returns null for null, undefined, or empty values", () => {
      expect(resolveAvatarUrl(null)).toBeNull();
      expect(resolveAvatarUrl(undefined)).toBeNull();
      expect(resolveAvatarUrl("")).toBeNull();
      expect(resolveAvatarUrl("   ")).toBeNull();
    });

    it("returns absolute URLs directly", () => {
      expect(resolveAvatarUrl("https://example.com/avatar.jpg")).toBe(
        "https://example.com/avatar.jpg",
      );
      expect(resolveAvatarUrl("http://localhost:9000/bucket/img.png")).toBe(
        "http://localhost:9000/bucket/img.png",
      );
      expect(resolveAvatarUrl("data:image/png;base64,abc123==")).toBe(
        "data:image/png;base64,abc123==",
      );
    });

    it("constructs full MinIO / CDN URL when cdnBaseUrl is set", () => {
      // simulate cdnBaseUrl
      const originalCdn = env.cdnBaseUrl;
      Object.defineProperty(env, "cdnBaseUrl", {
        value: "http://localhost:9000/spotq-assets",
        configurable: true,
      });

      expect(resolveAvatarUrl("restaurants/uuid/staff/avatar.jpg")).toBe(
        "http://localhost:9000/spotq-assets/restaurants/uuid/staff/avatar.jpg",
      );
      expect(resolveAvatarUrl("/restaurants/uuid/staff/avatar.jpg")).toBe(
        "http://localhost:9000/spotq-assets/restaurants/uuid/staff/avatar.jpg",
      );

      // restore
      Object.defineProperty(env, "cdnBaseUrl", {
        value: originalCdn,
        configurable: true,
      });
    });

    it("returns null if cdnBaseUrl is empty and avatar is an S3 key", () => {
      const originalCdn = env.cdnBaseUrl;
      Object.defineProperty(env, "cdnBaseUrl", {
        value: "",
        configurable: true,
      });

      expect(resolveAvatarUrl("restaurants/uuid/staff/avatar.jpg")).toBeNull();

      Object.defineProperty(env, "cdnBaseUrl", {
        value: originalCdn,
        configurable: true,
      });
    });
  });

  describe("getInitials", () => {
    it("extracts initials for multiple words", () => {
      expect(getInitials("Julian Montgomery")).toBe("JM");
      expect(getInitials("Alex Vance Johnson")).toBe("AJ");
    });

    it("extracts initials for a single word", () => {
      expect(getInitials("Alex")).toBe("AL");
    });

    it("returns fallback for empty names", () => {
      expect(getInitials("")).toBe("SP");
      expect(getInitials(null)).toBe("SP");
      expect(getInitials(undefined, "JD")).toBe("JD");
    });
  });

  describe("formatRole", () => {
    it("formats role enums to title case", () => {
      expect(formatRole("MANAGER")).toBe("Manager");
      expect(formatRole("RESTAURANT_STAFF")).toBe("Staff");
      expect(formatRole("RESTAURANT_ADMIN")).toBe("Admin");
      expect(formatRole("SERVER")).toBe("Server");
    });

    it("handles missing role", () => {
      expect(formatRole(null)).toBe("Staff");
      expect(formatRole("")).toBe("Staff");
    });
  });

  describe("formatStatus", () => {
    it("formats status enums to title case", () => {
      expect(formatStatus("ACTIVE")).toBe("Active");
      expect(formatStatus("INACTIVE")).toBe("Inactive");
      expect(formatStatus("SUSPENDED")).toBe("Suspended");
    });

    it("handles missing status", () => {
      expect(formatStatus(null)).toBe("Active");
      expect(formatStatus("")).toBe("Active");
    });
  });

  describe("formatDate", () => {
    it("formats a valid ISO timestamp to Month DD, YYYY", () => {
      const result = formatDate("2024-10-24T08:42:00.000Z");
      expect(result).toBe("October 24, 2024");
    });

    it("returns fallback when date string is missing", () => {
      expect(formatDate(null)).toBe("Not recorded");
      expect(formatDate(undefined)).toBe("Not recorded");
    });
  });

  describe("formatDateTime", () => {
    it("formats a valid ISO timestamp", () => {
      const result = formatDateTime("2024-10-24T08:42:00.000Z");
      expect(result).toMatch(/October \d+, 2024 - \d{2}:\d{2} [AP]M/);
    });

    it("returns fallback when date string is missing", () => {
      expect(formatDateTime(null)).toBe("Not recorded");
      expect(formatDateTime(undefined)).toBe("Not recorded");
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

    it("normalizes camelCase backend payload", () => {
      const raw = {
        id: "staff-2",
        restaurantId: "rest-2",
        fullName: "Sarah Connor",
        email: "sarah@dineline.com",
        phoneNumber: null,
        avatar: null,
        role: "RESTAURANT_STAFF",
        status: "ACTIVE",
        createdAt: "2025-01-01T10:00:00.000Z",
      };

      const normalized = normalizeStaffProfile(raw);
      expect(normalized).toEqual({
        id: "staff-2",
        restaurantId: "rest-2",
        fullName: "Sarah Connor",
        email: "sarah@dineline.com",
        phone: null,
        avatarUrl: null,
        role: "Staff",
        status: "Active",
        createdAt: "2025-01-01T10:00:00.000Z",
      });
    });
  });
});
