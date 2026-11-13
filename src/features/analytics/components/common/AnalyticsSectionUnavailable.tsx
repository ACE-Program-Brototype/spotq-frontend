import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionErrorDto } from "@/features/analytics/types/restaurant-analytics.types";
import { cn } from "@/lib/utils/cn";

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
        "flex flex-col items-center justify-center p-3.5 sm:p-5 text-center rounded-xl sm:rounded-2xl border border-amber-200 bg-amber-50/40 shadow-2xs",
        className,
      )}
    >
      <div className="flex size-8 sm:size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 border border-amber-200/60">
        <AlertTriangle className="size-4 sm:size-5" />
      </div>
      <h3 className="mt-2 sm:mt-2.5 text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
        {title}
      </h3>
      <p className="mt-1 max-w-xs text-[11px] sm:text-xs text-neutral-600 line-clamp-2">
        {error?.message ||
          "This analytics section is temporarily unavailable while downstream services sync."}
      </p>
      {error?.code && (
        <span className="mt-1 inline-block text-[9px] sm:text-[10px] font-mono font-medium text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded-sm truncate max-w-full">
          {error.code}
        </span>
      )}
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-2.5 h-6 sm:h-7 px-2.5 gap-1 rounded-lg border-amber-300 bg-white text-[11px] sm:text-xs font-semibold text-neutral-700 hover:bg-amber-50"
        >
          <RefreshCw className="size-2.5 sm:size-3 text-amber-700" />
          <span>Retry</span>
        </Button>
      )}
    </div>
  );
}
