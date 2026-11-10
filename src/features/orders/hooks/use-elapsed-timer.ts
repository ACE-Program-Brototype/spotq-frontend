import { useEffect, useState } from "react";

export type ElapsedUrgency = "normal" | "warning" | "critical";

export interface ElapsedTimerResult {
  formattedElapsed: string;
  totalMinutes: number;
  totalSeconds: number;
  urgency: ElapsedUrgency;
}

/**
 * Pure function to calculate elapsed time and urgency level from an ISO date string.
 */
export function computeElapsed(isoTimestamp?: string | null): ElapsedTimerResult {
  if (!isoTimestamp) {
    return {
      formattedElapsed: "0m 0s",
      totalMinutes: 0,
      totalSeconds: 0,
      urgency: "normal",
    };
  }

  const createdTime = new Date(isoTimestamp).getTime();
  if (Number.isNaN(createdTime)) {
    return {
      formattedElapsed: "0m 0s",
      totalMinutes: 0,
      totalSeconds: 0,
      urgency: "normal",
    };
  }

  const now = Date.now();
  const diffSeconds = Math.max(0, Math.floor((now - createdTime) / 1000));
  const totalMinutes = Math.floor(diffSeconds / 60);
  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  let formattedElapsed = "";
  if (hours > 0) {
    formattedElapsed = `${hours}h ${minutes}m`;
  } else {
    formattedElapsed = `${minutes}m ${seconds}s`;
  }

  let urgency: ElapsedUrgency = "normal";
  if (totalMinutes >= 30) {
    urgency = "critical";
  } else if (totalMinutes >= 15) {
    urgency = "warning";
  }

  return {
    formattedElapsed,
    totalMinutes,
    totalSeconds: diffSeconds,
    urgency,
  };
}

/**
 * Custom hook that calculates and live-updates the elapsed time from an ISO date string.
 * Categorizes urgency into normal (<15m), warning (15-30m), and critical (>30m).
 */
export function useElapsedTimer(isoTimestamp?: string | null): ElapsedTimerResult {
  const [elapsed, setElapsed] = useState<ElapsedTimerResult>(() => computeElapsed(isoTimestamp));

  useEffect(() => {
    setElapsed(computeElapsed(isoTimestamp));

    const intervalId = setInterval(() => {
      setElapsed(computeElapsed(isoTimestamp));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isoTimestamp]);

  return elapsed;
}
