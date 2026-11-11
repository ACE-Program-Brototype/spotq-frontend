import { Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLATFORM_ANALYTICS_MESSAGES } from "../../constants/platform-analytics.constants";
import { formatSyncTimestamp } from "../../utils/platform-analytics.utils";

export interface PlatformDashboardHeaderProps {
  generatedAt?: string;
  isFetching?: boolean;
  onRefresh?: () => void;
  onExportClick?: () => void;
}

export function PlatformDashboardHeader({
  generatedAt,
  isFetching = false,
  onRefresh,
  onExportClick,
}: PlatformDashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {PLATFORM_ANALYTICS_MESSAGES.PAGE_TITLE}
          </h1>
          <Badge
            variant="secondary"
            className="border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700"
          >
            Superadmin
          </Badge>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          {PLATFORM_ANALYTICS_MESSAGES.PAGE_SUBTITLE}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="text-right text-[11px] text-slate-500 mr-1 hidden lg:block">
          <span className="text-slate-400">Last Synced: </span>
          <span className="font-medium text-slate-700">{formatSyncTimestamp(generatedAt)}</span>
        </div>

        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin text-slate-900" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          onClick={onExportClick}
          className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium shadow-xs gap-1.5"
        >
          <Download className="size-3.5" />
          {PLATFORM_ANALYTICS_MESSAGES.EXPORT_BUTTON}
        </Button>
      </div>
    </div>
  );
}
