import { formatDate, formatTime } from "./date";

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

describe("formatTime", () => {
  it("returns fallback '--:--' when input is falsy or undefined", () => {
    expect(formatTime(undefined)).toBe("--:--");
    expect(formatTime(null)).toBe("--:--");
    expect(formatTime("")).toBe("--:--");
  });

  it("returns custom fallback when specified for empty/falsy input", () => {
    expect(formatTime(undefined, undefined, "N/A")).toBe("N/A");
  });

  it("returns fallback '--:--' for invalid date strings", () => {
    expect(formatTime("invalid-time-string")).toBe("--:--");
  });

  it("formats valid ISO date string to time format", () => {
    const iso = "2024-03-11T14:30:00.000Z";
    const formatted = formatTime(iso);
    expect(formatted).toMatch(/\d{1,2}:\d{2}/);
  });
});
