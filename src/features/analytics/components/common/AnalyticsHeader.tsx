import { Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export interface AnalyticsHeaderProps {
  restaurantName?: string;
  generatedAt?: string;
  isFetching?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function AnalyticsHeader({
  restaurantName,
  generatedAt,
  isFetching = false,
  onRefresh,
  className,
}: AnalyticsHeaderProps) {
  const formattedTime = generatedAt
    ? new Date(generatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#eddcd4]",
        className,
      )}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
          Analytics & Performance
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          {restaurantName ? `${restaurantName} Analytics` : "Restaurant Analytics"}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500">
          Monitor your real-time revenue, order volume, and menu item performance.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
        {formattedTime && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#eddcd4] bg-[#faf7f5] text-[11px] font-medium text-neutral-600">
            <Clock className="size-3.5 text-[#9a3412]" />
            <span>Updated {formattedTime}</span>
          </div>
        )}

        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-8 gap-1.5 rounded-xl border-[#eddcd4] px-3 text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] hover:text-neutral-900"
          >
            <RefreshCw className={cn("size-3.5 text-[#9a3412]", isFetching && "animate-spin")} />
            <span>{isFetching ? "Refreshing..." : "Refresh"}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
