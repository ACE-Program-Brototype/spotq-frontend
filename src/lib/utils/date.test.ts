import { formatDate } from "./date";

describe("formatDate", () => {
  it("returns 'N/A' when input is falsy or undefined", () => {
    expect(formatDate(undefined)).toBe("N/A");
    expect(formatDate(null)).toBe("N/A");
    expect(formatDate("")).toBe("N/A");
  });

  it("formats valid ISO date string properly", () => {
    const iso = "2024-03-11T14:30:00.000Z";
    const formatted = formatDate(iso);
    expect(formatted).toContain("Mar 11, 2024");
  });

  it("returns original string for invalid date formats", () => {
    expect(formatDate("invalid-date-string")).toBe("invalid-date-string");
  });
});
