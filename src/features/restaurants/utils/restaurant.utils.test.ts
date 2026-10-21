import { formatOperatingTime, getStaffInitials } from "./restaurant.utils";

describe("getStaffInitials", () => {
  it("should return two letters for a two-word full name", () => {
    expect(getStaffInitials("Julian Montgomery")).toBe("JM");
  });

  it("should return the first two characters for a single word name", () => {
    expect(getStaffInitials("Julian")).toBe("JU");
  });

  it("should return the default fallback when name is empty or missing", () => {
    expect(getStaffInitials("")).toBe("ST");
    expect(getStaffInitials(null)).toBe("ST");
    expect(getStaffInitials(undefined)).toBe("ST");
  });

  it("should support a custom fallback", () => {
    expect(getStaffInitials("", "NA")).toBe("NA");
  });
});

describe("formatOperatingTime", () => {
  it("should format ISO epoch timestamp strings into 12-hour format", () => {
    expect(formatOperatingTime("1970-01-01T10:00:00.000Z")).toBe("10:00 AM");
    expect(formatOperatingTime("1970-01-01T23:00:00.000Z")).toBe("11:00 PM");
    expect(formatOperatingTime("1970-01-01T00:30:00.000Z")).toBe("12:30 AM");
    expect(formatOperatingTime("1970-01-01T12:00:00.000Z")).toBe("12:00 PM");
  });

  it("should format 24-hour time strings into 12-hour format", () => {
    expect(formatOperatingTime("10:00")).toBe("10:00 AM");
    expect(formatOperatingTime("22:45")).toBe("10:45 PM");
    expect(formatOperatingTime("09:15:00")).toBe("9:15 AM");
  });

  it("should preserve already formatted 12-hour strings", () => {
    expect(formatOperatingTime("10:00 AM")).toBe("10:00 AM");
    expect(formatOperatingTime("11:00 PM")).toBe("11:00 PM");
  });

  it("should handle null, undefined, and empty string safely", () => {
    expect(formatOperatingTime(null)).toBe("");
    expect(formatOperatingTime(undefined)).toBe("");
    expect(formatOperatingTime("")).toBe("");
  });
});

