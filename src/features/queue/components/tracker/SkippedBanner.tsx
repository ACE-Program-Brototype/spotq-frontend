import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export interface SkippedBannerProps {
  reason?: string;
  position?: number;
}

export function SkippedBanner({ reason, position }: SkippedBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative rounded-xl border border-amber-300 bg-amber-50/90 p-4 text-amber-900 shadow-sm animate-in fade-in slide-in-from-top-2">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
        <div className="min-w-0 flex-1 pr-6">
          <h4 className="text-sm font-bold text-amber-950">Party Skipped</h4>
          <p className="mt-0.5 text-xs text-amber-800 leading-relaxed">
            {reason || "Your turn was temporarily passed by restaurant staff."}
            {typeof position === "number" && (
              <span className="block mt-1 font-semibold text-amber-950">
                You have been moved to position #{position} in line.
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-3 rounded-md p-1 text-amber-700 hover:bg-amber-100/80 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
