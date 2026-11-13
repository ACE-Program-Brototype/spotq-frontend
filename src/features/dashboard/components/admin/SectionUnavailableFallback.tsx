import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SectionUnavailableFallbackProps {
  title: string;
  serviceName: string;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

export function SectionUnavailableFallback({
  title,
  serviceName,
  errorMessage,
  onRetry,
  className = "",
}: SectionUnavailableFallbackProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-8 text-center ${className}`}
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <AlertTriangle className="size-5" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-md text-xs text-slate-600">
        {errorMessage ||
          `Data from ${serviceName} is temporarily unavailable due to circuit protection. Operating with graceful fallback.`}
      </p>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4 gap-1.5 border-amber-300 bg-white text-xs font-medium text-amber-800 hover:bg-amber-100/60"
        >
          <RefreshCw className="size-3.5" />
          Retry Connection
        </Button>
      )}
    </div>
  );
}
