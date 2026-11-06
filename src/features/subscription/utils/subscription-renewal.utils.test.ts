import { SUBSCRIPTION_RENEWAL_TEXTS } from "@/features/subscription/constants/subscription.constants";
import type {
  RestaurantStatusData,
  SubscriptionPlan,
} from "@/features/subscription/types/subscription.types";
import {
  calculateProposedRenewalTerm,
  calculateRemainingDays,
  evaluateRenewalEligibility,
  resolveRenewalPlansByCycle,
} from "./subscription-renewal.utils";

const FIXED_NOW = new Date("2026-10-25T12:00:00.000Z");

function buildStatus(overrides: Partial<RestaurantStatusData> = {}): RestaurantStatusData {
  return {
    restaurantId: "rest-1",
    restaurantName: "Spice Garden",
    verificationStatus: "APPROVED",
    isSubscriptionActive: true,
    subscriptionPlanCode: "QUEUE_PRO",
    subscriptionEndsAt: "2026-11-01T12:00:00.000Z",
    navigationTarget: "/restaurant/dashboard",
    subscription: {
      id: "sub-123",
      status: "ACTIVE",
      planCode: "QUEUE_PRO",
      planName: "Queue Pro",
      currentPeriodStart: "2026-10-01T12:00:00.000Z",
      currentPeriodEnd: "2026-11-01T12:00:00.000Z",
    },
    ...overrides,
  };
}

const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: "plan-monthly",
    code: "QUEUE_PRO",
    name: "Queue Pro",
    pricePaise: 149900,
    priceInRupees: 1499,
    currency: "INR",
    billingCycle: "MONTHLY",
    features: ["Queue management"],
  },
  {
    id: "plan-yearly",
    code: "QUEUE_PRO_YEARLY",
    name: "Queue Pro Yearly",
    pricePaise: 1499000,
    priceInRupees: 14990,
    currency: "INR",
    billingCycle: "YEARLY",
    features: ["Queue management"],
  },
  {
    id: "plan-self-monthly",
    code: "SELF_PRO",
    name: "Self Pro",
    pricePaise: 250000,
    priceInRupees: 2500,
    currency: "INR",
    billingCycle: "MONTHLY",
    features: ["Self ordering"],
  },
];

describe("subscription-renewal.utils", () => {
  describe("calculateRemainingDays", () => {
    it("returns null for missing or invalid timestamps", () => {
      expect(calculateRemainingDays(null, FIXED_NOW)).toBeNull();
      expect(calculateRemainingDays(undefined, FIXED_NOW)).toBeNull();
      expect(calculateRemainingDays("not-a-date", FIXED_NOW)).toBeNull();
    });

    it("calculates exact and ceiling remaining days", () => {
      expect(calculateRemainingDays("2026-10-25T12:00:00.000Z", FIXED_NOW)).toBe(0);
      expect(calculateRemainingDays("2026-10-25T18:00:00.000Z", FIXED_NOW)).toBe(1);
      expect(calculateRemainingDays("2026-11-01T12:00:00.000Z", FIXED_NOW)).toBe(7);
      expect(calculateRemainingDays("2026-10-23T12:00:00.000Z", FIXED_NOW)).toBe(-2);
    });
  });

  describe("evaluateRenewalEligibility", () => {
    it("marks subscription with <= 7 days remaining as eligible and shows expiry banner", () => {
      const result = evaluateRenewalEligibility(buildStatus(), FIXED_NOW);
      expect(result.isEligible).toBe(true);
      expect(result.showExpiryBanner).toBe(true);
      expect(result.isOutsideWindow).toBe(false);
      expect(result.daysRemaining).toBe(7);
      expect(result.tooltipMessage).toBeNull();
    });

    it("marks subscription with 8 to 30 days remaining as eligible without showing expiry banner", () => {
      const status = buildStatus({
        subscriptionEndsAt: "2026-11-15T12:00:00.000Z",
        subscription: {
          id: "sub-123",
          status: "ACTIVE",
          planCode: "QUEUE_PRO",
          planName: "Queue Pro",
          currentPeriodStart: "2026-10-15T12:00:00.000Z",
          currentPeriodEnd: "2026-11-15T12:00:00.000Z",
        },
      });
      const result = evaluateRenewalEligibility(status, FIXED_NOW);
      expect(result.isEligible).toBe(true);
      expect(result.showExpiryBanner).toBe(false);
      expect(result.daysRemaining).toBe(21);
    });

    it("disables manual renewal with tooltip when more than 30 days remain", () => {
      const status = buildStatus({
        subscriptionEndsAt: "2026-12-10T12:00:00.000Z",
        subscription: {
          id: "sub-123",
          status: "ACTIVE",
          planCode: "QUEUE_PRO",
          planName: "Queue Pro",
          currentPeriodStart: "2026-09-10T12:00:00.000Z",
          currentPeriodEnd: "2026-12-10T12:00:00.000Z",
        },
      });
      const result = evaluateRenewalEligibility(status, FIXED_NOW);
      expect(result.isEligible).toBe(false);
      expect(result.isOutsideWindow).toBe(true);
      expect(result.showExpiryBanner).toBe(false);
      expect(result.tooltipMessage).toBe(SUBSCRIPTION_RENEWAL_TEXTS.ELIGIBILITY_TOOLTIP);
    });

    it("rejects cancelled and pending subscriptions", () => {
      const cancelled = buildStatus({
        isSubscriptionActive: false,
        subscription: {
          id: "sub-123",
          status: "CANCELLED",
          planCode: "QUEUE_PRO",
          planName: "Queue Pro",
          currentPeriodStart: "2026-10-01T12:00:00.000Z",
          currentPeriodEnd: "2026-10-28T12:00:00.000Z",
        },
      });
      expect(evaluateRenewalEligibility(cancelled, FIXED_NOW).isEligible).toBe(false);

      const pending = buildStatus({
        isSubscriptionActive: false,
        subscription: {
          id: "sub-123",
          status: "PENDING",
          planCode: "QUEUE_PRO",
          planName: "Queue Pro",
          currentPeriodStart: "2026-10-01T12:00:00.000Z",
          currentPeriodEnd: "2026-10-28T12:00:00.000Z",
        },
      });
      expect(evaluateRenewalEligibility(pending, FIXED_NOW).isEligible).toBe(false);
    });

    it("respects backend isEligibleForRenewal false override", () => {
      const status = buildStatus({
        subscription: {
          id: "sub-123",
          status: "ACTIVE",
          planCode: "QUEUE_PRO",
          planName: "Queue Pro",
          currentPeriodStart: "2026-10-01T12:00:00.000Z",
          currentPeriodEnd: "2026-10-28T12:00:00.000Z",
          isEligibleForRenewal: false,
        },
      });
      expect(evaluateRenewalEligibility(status, FIXED_NOW).isEligible).toBe(false);
    });
  });

  describe("resolveRenewalPlansByCycle", () => {
    it("resolves monthly and yearly variants for the current plan tier without mixing other tiers", () => {
      const resolved = resolveRenewalPlansByCycle(MOCK_PLANS, "QUEUE_PRO", "Queue Pro");
      expect(resolved.MONTHLY?.id).toBe("plan-monthly");
      expect(resolved.YEARLY?.id).toBe("plan-yearly");
      expect(resolved.initialCycle).toBe("MONTHLY");
    });

    it("preselects YEARLY when current plan is yearly", () => {
      const resolved = resolveRenewalPlansByCycle(
        MOCK_PLANS,
        "QUEUE_PRO_YEARLY",
        "Queue Pro Yearly",
      );
      expect(resolved.initialCycle).toBe("YEARLY");
    });

    it("leaves unsupported cycle undefined when backend only offers MONTHLY", () => {
      const resolved = resolveRenewalPlansByCycle(MOCK_PLANS, "SELF_PRO", "Self Pro");
      expect(resolved.MONTHLY?.id).toBe("plan-self-monthly");
      expect(resolved.YEARLY).toBeUndefined();
      expect(resolved.initialCycle).toBe("MONTHLY");
    });
  });

  describe("calculateProposedRenewalTerm", () => {
    it("extends from existing expiry date for active subscriptions", () => {
      const yearlyPreview = calculateProposedRenewalTerm(
        "2026-11-01T12:00:00.000Z",
        "YEARLY",
        FIXED_NOW,
      );
      expect(yearlyPreview?.isExpired).toBe(false);
      expect(yearlyPreview?.previewText).toBe("Renews from Nov 1, 2026 to Nov 1, 2027");

      const monthlyPreview = calculateProposedRenewalTerm(
        "2026-11-01T12:00:00.000Z",
        "MONTHLY",
        FIXED_NOW,
      );
      expect(monthlyPreview?.previewText).toBe("Renews from Nov 1, 2026 to Dec 1, 2026");
    });

    it("starts from current timestamp when subscription is already expired", () => {
      const expiredPreview = calculateProposedRenewalTerm(
        "2026-10-01T12:00:00.000Z",
        "MONTHLY",
        FIXED_NOW,
      );
      expect(expiredPreview?.isExpired).toBe(true);
      expect(expiredPreview?.previewText).toBe("Renews from Oct 25, 2026 to Nov 25, 2026");
    });

    it("clamps end-of-month dates properly when adding one month", () => {
      // Jan 31, 2026 -> Feb 28, 2026
      const jan31Preview = calculateProposedRenewalTerm(
        "2026-01-31T12:00:00.000Z",
        "MONTHLY",
        new Date("2026-01-15T12:00:00.000Z"),
      );
      expect(jan31Preview?.previewText).toBe("Renews from Jan 31, 2026 to Feb 28, 2026");

      // March 31, 2026 -> April 30, 2026
      const mar31Preview = calculateProposedRenewalTerm(
        "2026-03-31T12:00:00.000Z",
        "MONTHLY",
        new Date("2026-03-15T12:00:00.000Z"),
      );
      expect(mar31Preview?.previewText).toBe("Renews from Mar 31, 2026 to Apr 30, 2026");
    });

    it("clamps leap day properly when adding one year", () => {
      // Feb 29, 2024 (leap year) -> Feb 28, 2025 (non-leap year)
      const leapPreview = calculateProposedRenewalTerm(
        "2024-02-29T12:00:00.000Z",
        "YEARLY",
        new Date("2024-02-01T12:00:00.000Z"),
      );
      expect(leapPreview?.previewText).toBe("Renews from Feb 29, 2024 to Feb 28, 2025");
    });
  });
});
