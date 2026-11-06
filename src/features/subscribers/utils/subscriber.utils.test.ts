import {
  formatBillingCycle,
  formatPrice,
  getPaymentStatusBadgeClass,
  getSubscriberStatusStyles,
} from "./subscriber.utils";

describe("subscriber.utils", () => {
  describe("formatPrice", () => {
    it("should format paise to INR currency string with two decimal places", () => {
      expect(formatPrice(499900, "INR")).toBe("₹4,999.00");
    });

    it("should return not applicable for invalid amount", () => {
      expect(formatPrice(NaN as unknown as number)).toBe("-");
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
