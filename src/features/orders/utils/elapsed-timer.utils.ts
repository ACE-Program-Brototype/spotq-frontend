import {
  ELAPSED_TIMER_CONFIG,
  ELAPSED_URGENCY,
} from "@/features/orders/constants/staff-orders.constants";
import type {
  ElapsedTimerResult,
  ElapsedUrgency,
} from "@/features/orders/types/staff-orders.types";

const DEFAULT_ELAPSED_RESULT: ElapsedTimerResult = {
  formattedElapsed: ELAPSED_TIMER_CONFIG.DEFAULT_FORMATTED,
  totalMinutes: 0,
  totalSeconds: 0,
  urgency: ELAPSED_URGENCY.NORMAL,
};

/**
 * Calculates non-negative elapsed seconds from an ISO timestamp.
 * Returns null when the timestamp is missing or invalid.
 */
export function calculateElapsedSeconds(
  isoTimestamp?: string | null,
  nowMs: number = Date.now(),
): number | null {
  if (!isoTimestamp) {
    return null;
  }

  const createdTime = new Date(isoTimestamp).getTime();
  if (Number.isNaN(createdTime)) {
    return null;
  }

  return Math.max(0, Math.floor((nowMs - createdTime) / ELAPSED_TIMER_CONFIG.TICK_INTERVAL_MS));
}

/**
 * Formats an elapsed duration in seconds into a compact display string (e.g., "5m 20s" or "1h 15m").
 */
export function formatElapsedDuration(totalSeconds: number): string {
  const { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } = ELAPSED_TIMER_CONFIG;
  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  const minutes = Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m ${seconds}s`;
}

/**
 * Maps elapsed minutes to a kitchen urgency tier.
 */
export function resolveElapsedUrgency(totalMinutes: number): ElapsedUrgency {
  if (totalMinutes >= ELAPSED_TIMER_CONFIG.CRITICAL_MINUTES) {
    return ELAPSED_URGENCY.CRITICAL;
  }

  if (totalMinutes >= ELAPSED_TIMER_CONFIG.WARNING_MINUTES) {
    return ELAPSED_URGENCY.WARNING;
  }

  return ELAPSED_URGENCY.NORMAL;
}

/**
 * Computes formatted elapsed time and urgency tier from an ISO date string.
 */
export function computeElapsed(
  isoTimestamp?: string | null,
  nowMs: number = Date.now(),
): ElapsedTimerResult {
  const totalSeconds = calculateElapsedSeconds(isoTimestamp, nowMs);
  if (totalSeconds === null) {
    return DEFAULT_ELAPSED_RESULT;
  }

  const totalMinutes = Math.floor(totalSeconds / ELAPSED_TIMER_CONFIG.SECONDS_PER_MINUTE);

  return {
    formattedElapsed: formatElapsedDuration(totalSeconds),
    totalMinutes,
    totalSeconds,
    urgency: resolveElapsedUrgency(totalMinutes),
  };
}
