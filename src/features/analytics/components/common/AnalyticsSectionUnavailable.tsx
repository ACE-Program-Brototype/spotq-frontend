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
        "flex flex-col items-center justify-center px-2 py-1.5 md:p-4 text-center rounded-xl md:rounded-2xl border border-amber-200 bg-amber-50/40 shadow-2xs",
        className,
      )}
    >
      <div className="flex size-5 sm:size-5.5 md:size-8 items-center justify-center rounded-md md:rounded-lg bg-amber-100 text-amber-800 border border-amber-200/60">
        <AlertTriangle className="size-2.5 sm:size-3 md:size-4" />
      </div>
      <h3 className="mt-0.5 md:mt-1.5 text-[10px] sm:text-[11px] md:text-xs font-bold text-neutral-900 leading-tight truncate max-w-full">
        {title}
      </h3>
      <p className="mt-0.5 max-w-xs text-[9px] sm:text-[10px] md:text-[11px] text-neutral-600 line-clamp-1 md:line-clamp-2 leading-tight">
        {error?.message || "This section is temporarily unavailable while syncing."}
      </p>
      {error?.code && (
        <span className="mt-0.5 md:mt-1 inline-block text-[8px] sm:text-[9px] font-mono font-medium text-amber-700 bg-amber-100/80 px-1 py-0.2 md:px-1.5 md:py-0.5 rounded-xs sm:rounded-sm truncate max-w-full">
          {error.code}
        </span>
      )}
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-0.5 md:mt-2 h-4 sm:h-5 md:h-6 px-1.5 md:px-2.5 gap-0.5 md:gap-1 rounded-sm md:rounded-md border-amber-300 bg-white text-[9px] sm:text-[10px] md:text-xs font-semibold text-neutral-700 hover:bg-amber-50"
        >
          <RefreshCw className="size-2 md:size-2.5 text-amber-700" />
          <span>Retry</span>
        </Button>
      )}
    </div>
  );
}
