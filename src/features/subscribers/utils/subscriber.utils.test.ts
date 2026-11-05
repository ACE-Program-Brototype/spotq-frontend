import {
  formatBillingCycle,
  formatDate,
  formatDateTime,
  formatPrice,
  getPaymentStatusBadgeClass,
  getSubscriberStatusStyles,
} from "./subscriber.utils";

describe("subscriber.utils", () => {
  describe("formatPrice", () => {
    it("should format paise to INR currency string", () => {
      const formatted = formatPrice(499900, "INR");
      expect(formatted).toContain("4,999");
    });

    it("should return not applicable for invalid amount", () => {
      expect(formatPrice(NaN as unknown as number)).toBe("-");
    });
  });

  describe("formatDate", () => {
    it("should format ISO date string", () => {
      const formatted = formatDate("2026-11-01T00:00:00.000Z");
      expect(formatted).toBe("Nov 1, 2026");
    });

    it("should return dash for null or undefined", () => {
      expect(formatDate(null)).toBe("-");
      expect(formatDate(undefined)).toBe("-");
      expect(formatDate("invalid")).toBe("-");
    });
  });

  describe("formatDateTime", () => {
    it("should format ISO datetime string", () => {
      const formatted = formatDateTime("2026-11-01T10:30:00.000Z");
      expect(formatted).toContain("Nov 1, 2026");
    });

    it("should return dash for invalid datetime", () => {
      expect(formatDateTime(null)).toBe("-");
    });
  });

  describe("formatBillingCycle", () => {
    it("should capitalize billing cycle string", () => {
      expect(formatBillingCycle("MONTHLY")).toBe("Monthly");
      expect(formatBillingCycle("YEARLY")).toBe("Yearly");
    });

    it("should return dash for null or undefined", () => {
      expect(formatBillingCycle(null)).toBe("-");
    });
  });

  describe("getSubscriberStatusStyles", () => {
    it("should return active styles for ACTIVE status", () => {
      const styles = getSubscriberStatusStyles("ACTIVE");
      expect(styles.label).toBe("ACTIVE");
      expect(styles.badge).toContain("emerald");
    });

    it("should return pending styles for PENDING status", () => {
      const styles = getSubscriberStatusStyles("PENDING");
      expect(styles.label).toBe("PENDING");
      expect(styles.badge).toContain("amber");
    });

    it("should return cancelled styles for CANCELLED status", () => {
      const styles = getSubscriberStatusStyles("CANCELLED");
      expect(styles.label).toBe("CANCELLED");
      expect(styles.badge).toContain("rose");
    });

    it("should return fallback styles for unknown status", () => {
      const styles = getSubscriberStatusStyles("UNKNOWN");
      expect(styles.label).toBe("UNKNOWN");
    });
  });

  describe("getPaymentStatusBadgeClass", () => {
    it("should return emerald classes for SUCCESS and PAID", () => {
      expect(getPaymentStatusBadgeClass("SUCCESS")).toContain("emerald");
      expect(getPaymentStatusBadgeClass("PAID")).toContain("emerald");
    });

    it("should return rose classes for FAILED", () => {
      expect(getPaymentStatusBadgeClass("FAILED")).toContain("rose");
    });
  });
});
