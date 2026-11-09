import {
  formatOrderDisplayId,
  isPaymentRetryExpired,
  normalizePaymentStatus,
  parseApiError,
} from "./customer-payment.utils";

describe("customer-payment.utils", () => {
  describe("isPaymentRetryExpired", () => {
    it("returns true if retryEligible is explicitly false", () => {
      expect(isPaymentRetryExpired(new Date(Date.now() + 600000).toISOString(), false)).toBe(true);
    });

    it("returns false if retryEligible is true and expiry is in the future", () => {
      const future = new Date(Date.now() + 600000).toISOString();
      expect(isPaymentRetryExpired(future, true)).toBe(false);
    });

    it("returns true if expiry is in the past", () => {
      const past = new Date(Date.now() - 600000).toISOString();
      expect(isPaymentRetryExpired(past, true)).toBe(true);
    });

    it("returns false if retryExpiresAt is missing and retryEligible is true", () => {
      expect(isPaymentRetryExpired(null, true)).toBe(false);
    });
  });

  describe("normalizePaymentStatus", () => {
    it("normalizes CAPTURED and SUCCESS to SUCCESS", () => {
      expect(normalizePaymentStatus("CAPTURED")).toBe("SUCCESS");
      expect(normalizePaymentStatus("captured")).toBe("SUCCESS");
      expect(normalizePaymentStatus("SUCCESS")).toBe("SUCCESS");
    });

    it("normalizes FAILED to FAILED", () => {
      expect(normalizePaymentStatus("FAILED")).toBe("FAILED");
      expect(normalizePaymentStatus("failed")).toBe("FAILED");
    });

    it("normalizes REFUNDED to REFUNDED", () => {
      expect(normalizePaymentStatus("REFUNDED")).toBe("REFUNDED");
      expect(normalizePaymentStatus("refunded")).toBe("REFUNDED");
    });

    it("defaults unknown or pending statuses to PENDING", () => {
      expect(normalizePaymentStatus("UNKNOWN")).toBe("PENDING");
      expect(normalizePaymentStatus("PENDING")).toBe("PENDING");
      expect(normalizePaymentStatus("INITIATED")).toBe("PENDING");
      expect(normalizePaymentStatus(null)).toBe("PENDING");
    });
  });

  describe("parseApiError", () => {
    it("extracts status and message from response object", async () => {
      const mockResponse = {
        status: 409,
        clone: () => ({
          json: async () => ({ message: "Already paid" }),
        }),
      };
      const error = { response: mockResponse };
      const parsed = await parseApiError(error);

      expect(parsed.status).toBe(409);
      expect(parsed.message).toBe("Already paid");
    });

    it("extracts message from standard Error object", async () => {
      const error = new Error("Network timeout");
      const parsed = await parseApiError(error);

      expect(parsed.message).toBe("Network timeout");
    });

    it("handles null or non-object gracefully", async () => {
      expect(await parseApiError(null)).toEqual({});
      expect(await parseApiError("string-error")).toEqual({});
    });
  });

  describe("formatOrderDisplayId", () => {
    it("formats human-readable order number with # prefix", () => {
      expect(formatOrderDisplayId("1042", "ce559b09-a501-4265")).toBe("#1042");
      expect(formatOrderDisplayId("SQ-98214", "ce559b09-a501-4265")).toBe("#SQ-98214");
    });

    it("formats UUID without # and with ellipsis", () => {
      expect(formatOrderDisplayId(undefined, "ce559b09-a501-4265-96d3-1f4e046014f5")).toBe(
        "ce559b09...",
      );
      expect(formatOrderDisplayId(null, "7503439b-2d9d-4142-aba6-77bd8cfbf84b")).toBe(
        "7503439b...",
      );
    });

    it("returns placeholder when neither orderNumber nor orderId is provided", () => {
      expect(formatOrderDisplayId(undefined, undefined)).toBe("--");
      expect(formatOrderDisplayId(null, null)).toBe("--");
    });
  });
});
