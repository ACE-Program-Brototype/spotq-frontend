/**
 * TransactionsHeader Component
 * Page heading, breadcrumbs, refresh action, and CSV export button.
 * Responsive design optimized for mobile and desktop viewports.
 */

import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TRANSACTION_MESSAGES } from "../constants/transaction-messages.constants";

interface TransactionsHeaderProps {
  isLoading: boolean;
  isExporting: boolean;
  onRefresh: () => void;
  onExportCsv: () => void;
  disabledExport: boolean;
}

export function TransactionsHeader({
  isLoading,
  isExporting,
  onRefresh,
  onExportCsv,
  disabledExport,
}: TransactionsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
            {TRANSACTION_MESSAGES.BREADCRUMB_PARENT}
          </span>
          <span className="text-xs text-neutral-300">/</span>
          <span className="text-xs font-medium text-neutral-500">
            {TRANSACTION_MESSAGES.BREADCRUMB_CURRENT}
          </span>
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          {TRANSACTION_MESSAGES.PAGE_TITLE}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-2xl break-words leading-relaxed">
          {TRANSACTION_MESSAGES.PAGE_SUBTITLE}
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-11 sm:h-9 px-3 rounded-xl border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 shadow-2xs min-h-[44px] sm:min-h-0"
          title="Refresh transactions"
        >
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin text-[#e8631b]" : ""}`} />
        </Button>

        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={onExportCsv}
          disabled={disabledExport || isExporting}
          data-testid="export-csv-button"
          className="h-11 sm:h-9 px-3.5 rounded-xl bg-[#e8631b] hover:bg-[#d45513] text-white shadow-2xs gap-2 font-medium min-h-[44px] sm:min-h-0"
        >
          <Download className="size-4 shrink-0" />
          <span className="text-xs sm:text-sm whitespace-nowrap">
            {isExporting ? TRANSACTION_MESSAGES.EXPORTING_CSV : TRANSACTION_MESSAGES.EXPORT_CSV}
          </span>
        </Button>
      </div>
    </div>
  );
}
