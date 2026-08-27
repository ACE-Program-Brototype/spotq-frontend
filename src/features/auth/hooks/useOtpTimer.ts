import { useCallback, useEffect, useMemo, useState } from "react";

export interface UseOtpTimerOptions {
  email?: string;
  defaultSeconds?: number;
  prefix?: string;
}

export function useOtpTimer({
  email = "",
  defaultSeconds = 60,
  prefix = "spotq_otp_expiry",
}: UseOtpTimerOptions = {}) {
  const normalizedEmail = email.trim().toLowerCase();
  const storageKey = useMemo(
    () => (normalizedEmail ? `${prefix}_${normalizedEmail}` : ""),
    [prefix, normalizedEmail],
  );

  const getRemainingSeconds = useCallback((key: string): number => {
    if (!key || typeof window === "undefined" || !window.localStorage) return 0;
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return 0;

      const expiry = Number(stored);
      if (!Number.isFinite(expiry)) {
        localStorage.removeItem(key);
        return 0;
      }

      const remaining = Math.ceil((expiry - Date.now()) / 1000);
      if (remaining <= 0) {
        localStorage.removeItem(key);
        return 0;
      }

      return remaining;
    } catch {
      return 0;
    }
  }, []);

  const [seconds, setSeconds] = useState<number>(() => {
    if (storageKey) {
      const remaining = getRemainingSeconds(storageKey);
      return remaining > 0 ? remaining : defaultSeconds;
    }
    return defaultSeconds;
  });

  const startTimer = useCallback(
    (customDuration?: number) => {
      const duration = customDuration ?? defaultSeconds;
      if (storageKey && typeof window !== "undefined" && window.localStorage) {
        try {
          const expiry = Date.now() + duration * 1000;
          localStorage.setItem(storageKey, String(expiry));
        } catch {
          // Ignore localStorage errors
        }
      }
      setSeconds(duration);
    },
    [storageKey, defaultSeconds],
  );

  const resetTimer = useCallback(() => {
    if (storageKey && typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Ignore localStorage errors
      }
    }
    setSeconds(0);
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;

    if (!localStorage.getItem(storageKey)) {
      startTimer();
    } else {
      setSeconds(getRemainingSeconds(storageKey));
    }

    const interval = window.setInterval(() => {
      const remaining = getRemainingSeconds(storageKey);
      setSeconds(remaining);
    }, 500);

    return () => window.clearInterval(interval);
  }, [storageKey, getRemainingSeconds, startTimer]);

  return {
    seconds,
    startTimer,
    resetTimer,
    isExpired: seconds <= 0,
  };
}
