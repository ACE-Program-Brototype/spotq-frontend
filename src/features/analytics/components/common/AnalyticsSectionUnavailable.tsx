import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { SectionErrorDto } from "../../types/restaurant-analytics.types";

export interface AnalyticsSectionUnavailableProps {
  title: string;
  error?: SectionErrorDto;
  onRetry?: () => void;
  className?: string;
}

export function AnalyticsSectionUnavailable({
  title,
  error,
  onRetry,
  className,
}: AnalyticsSectionUnavailableProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-amber-200 bg-amber-50/40 shadow-2xs",
        className,
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 border border-amber-200/60">
        <AlertTriangle className="size-5" />
      </div>
      <h3 className="mt-3 text-sm font-bold text-neutral-900">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-neutral-600">
        {error?.message ||
          "This analytics section is temporarily unavailable while downstream services sync."}
      </p>
      {error?.code && (
        <span className="mt-1.5 inline-block text-[10px] font-mono font-medium text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-sm">
          {error.code}
        </span>
      )}
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-3 h-7 gap-1.5 rounded-lg border-amber-300 bg-white text-xs font-semibold text-neutral-700 hover:bg-amber-50"
        >
          <RefreshCw className="size-3 text-amber-700" />
          <span>Retry</span>
        </Button>
      )}
    </div>
  );
}
