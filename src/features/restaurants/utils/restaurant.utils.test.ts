import { getStaffInitials } from "./restaurant.utils";

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
