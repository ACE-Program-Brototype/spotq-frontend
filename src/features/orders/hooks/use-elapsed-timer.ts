import { useEffect, useState } from "react";
import { ELAPSED_TIMER_CONFIG } from "@/features/orders/constants/staff-orders.constants";
import type {
  ElapsedTimerResult,
  ElapsedUrgency,
} from "@/features/orders/types/staff-orders.types";
import { computeElapsed } from "@/features/orders/utils/elapsed-timer.utils";

export type { ElapsedTimerResult, ElapsedUrgency };

/**
 * Custom hook that calculates and live-updates the elapsed time from an ISO date string.
 * Categorizes urgency into normal (<15m), warning (15-30m), and critical (>=30m).
 */
export function useElapsedTimer(isoTimestamp?: string | null): ElapsedTimerResult {
  const [elapsed, setElapsed] = useState<ElapsedTimerResult>(() => computeElapsed(isoTimestamp));

  useEffect(() => {
    setElapsed(computeElapsed(isoTimestamp));

    const intervalId = setInterval(() => {
      setElapsed(computeElapsed(isoTimestamp));
    }, ELAPSED_TIMER_CONFIG.TICK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isoTimestamp]);

  return elapsed;
}
