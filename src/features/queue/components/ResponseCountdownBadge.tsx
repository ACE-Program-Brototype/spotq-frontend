import { AlertTriangle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface ResponseCountdownBadgeProps {
  deadline: string | null;
  className?: string;
}

function getSecondsRemaining(deadline: string | null): number | null {
  if (!deadline) return null;
  const targetTime = new Date(deadline).getTime();
  if (Number.isNaN(targetTime)) return null;
  const diff = Math.floor((targetTime - Date.now()) / 1000);
  return diff > 0 ? diff : 0;
}

export function ResponseCountdownBadge({ deadline, className = "" }: ResponseCountdownBadgeProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(() =>
    getSecondsRemaining(deadline),
  );

  useEffect(() => {
    const initial = getSecondsRemaining(deadline);
    setSecondsRemaining(initial);

    if (initial === null || initial <= 0) {
      return;
    }

    const interval = setInterval(() => {
      const remaining = getSecondsRemaining(deadline);
      setSecondsRemaining(remaining);
      if (remaining === null || remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  if (secondsRemaining === null) {
    return null;
  }

  if (secondsRemaining <= 0) {
    return (
      <span
        data-testid="countdown-expired"
        className={`inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700 border border-red-200 animate-pulse ${className}`}
      >
        <AlertTriangle className="size-3 text-red-600 shrink-0" />
        <span>Expired</span>
      </span>
    );
  }

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <span
      data-testid="countdown-active"
      className={`inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200 ${className}`}
    >
      <Clock className="size-3 text-amber-600 shrink-0" />
      <span>{formatted}</span>
    </span>
  );
}
