import {
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
} from "./currency";

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

describe("formatCompactNumber", () => {
  it("keeps numbers below 1000 without suffix", () => {
    expect(formatCompactNumber(0)).toBe("0");
    expect(formatCompactNumber(150)).toBe("150");
    expect(formatCompactNumber(950)).toBe("950");
  });

  it("formats thousands into K with decimal precision", () => {
    expect(formatCompactNumber(1200)).toBe("1.2K");
    expect(formatCompactNumber(125400.5)).toBe("125.4K");
  });

  it("formats millions into M with decimal precision", () => {
    expect(formatCompactNumber(1500000)).toBe("1.5M");
    expect(formatCompactNumber(12500000)).toBe("12.5M");
  });

  it("formats billions into B with decimal precision", () => {
    expect(formatCompactNumber(2350000000)).toBe("2.4B");
  });

  it("handles null, undefined, and NaN safely", () => {
    expect(formatCompactNumber(null)).toBe("0");
    expect(formatCompactNumber(undefined)).toBe("0");
    expect(formatCompactNumber(Number.NaN)).toBe("0");
  });
});

describe("formatCompactCurrency", () => {
  it("formats numbers below 1000 with currency symbol", () => {
    expect(formatCompactCurrency(0)).toBe("₹0");
    expect(formatCompactCurrency(500)).toBe("₹500");
  });

  it("formats thousands with K and currency symbol", () => {
    expect(formatCompactCurrency(1200)).toBe("₹1.2K");
    expect(formatCompactCurrency(125400.5)).toBe("₹125.4K");
  });

  it("formats millions with M and currency symbol", () => {
    expect(formatCompactCurrency(1500000)).toBe("₹1.5M");
  });

  it("formats billions with B and currency symbol", () => {
    expect(formatCompactCurrency(2350000000)).toBe("₹2.4B");
  });

  it("handles negative numbers safely", () => {
    expect(formatCompactCurrency(-15000)).toBe("-₹15K");
  });

  it("handles null, undefined, and NaN safely", () => {
    expect(formatCompactCurrency(null)).toBe("₹0");
    expect(formatCompactCurrency(undefined)).toBe("₹0");
    expect(formatCompactCurrency(Number.NaN)).toBe("₹0");
  });
});

