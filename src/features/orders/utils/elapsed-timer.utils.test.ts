import {
  ELAPSED_TIMER_CONFIG,
  ELAPSED_URGENCY,
} from "@/features/orders/constants/staff-orders.constants";
import {
  calculateElapsedSeconds,
  computeElapsed,
  formatElapsedDuration,
  resolveElapsedUrgency,
} from "@/features/orders/utils/elapsed-timer.utils";

describe("elapsed-timer.utils", () => {
  describe("calculateElapsedSeconds", () => {
    it("returns null for missing or invalid timestamps", () => {
      expect(calculateElapsedSeconds(null)).toBeNull();
      expect(calculateElapsedSeconds("")).toBeNull();
      expect(calculateElapsedSeconds("not-a-date")).toBeNull();
    });

    it("clamps future timestamps to 0", () => {
      const now = 1_700_000_000_000;
      const future = new Date(now + 10_000).toISOString();

      expect(calculateElapsedSeconds(future, now)).toBe(0);
    });
  });

  describe("formatElapsedDuration", () => {
    it("formats durations under 1 hour as minutes and seconds", () => {
      expect(formatElapsedDuration(320)).toBe("5m 20s");
    });

    it("formats durations of 1 hour or more as hours and minutes", () => {
      expect(formatElapsedDuration(4_500)).toBe("1h 15m");
    });
  });

  describe("resolveElapsedUrgency", () => {
    it("returns expected urgency tiers around configured thresholds", () => {
      expect(resolveElapsedUrgency(0)).toBe(ELAPSED_URGENCY.NORMAL);
      expect(resolveElapsedUrgency(ELAPSED_TIMER_CONFIG.WARNING_MINUTES - 1)).toBe(
        ELAPSED_URGENCY.NORMAL,
      );
      expect(resolveElapsedUrgency(ELAPSED_TIMER_CONFIG.WARNING_MINUTES)).toBe(
        ELAPSED_URGENCY.WARNING,
      );
      expect(resolveElapsedUrgency(ELAPSED_TIMER_CONFIG.CRITICAL_MINUTES)).toBe(
        ELAPSED_URGENCY.CRITICAL,
      );
    });
  });

  describe("computeElapsed", () => {
    it("returns default values when timestamp is missing", () => {
      expect(computeElapsed(null)).toEqual({
        formattedElapsed: ELAPSED_TIMER_CONFIG.DEFAULT_FORMATTED,
        totalMinutes: 0,
        totalSeconds: 0,
        urgency: ELAPSED_URGENCY.NORMAL,
      });
    });

    it("computes formatted elapsed time, minutes, seconds, and urgency", () => {
      const now = 1_700_000_000_000;
      const past = new Date(now - (18 * 60 + 5) * 1000).toISOString();

      expect(computeElapsed(past, now)).toEqual({
        formattedElapsed: "18m 5s",
        totalMinutes: 18,
        totalSeconds: 1085,
        urgency: ELAPSED_URGENCY.WARNING,
      });
    });
  });
});
