import { formatCurrency } from "./currency";

describe("formatCurrency", () => {
  it("formats standard integer amount to INR currency string", () => {
    expect(formatCurrency(538)).toBe("₹538.00");
  });

  it("formats decimal amounts correctly", () => {
    expect(formatCurrency(129.5)).toBe("₹129.50");
    expect(formatCurrency(19.99)).toBe("₹19.99");
  });

  it("formats string amounts correctly", () => {
    expect(formatCurrency("250.75")).toBe("₹250.75");
  });

  it("handles zero, null, undefined, and NaN gracefully", () => {
    expect(formatCurrency(0)).toBe("₹0.00");
    expect(formatCurrency(null)).toBe("₹0.00");
    expect(formatCurrency(undefined)).toBe("₹0.00");
    expect(formatCurrency(Number.NaN)).toBe("₹0.00");
  });
});
