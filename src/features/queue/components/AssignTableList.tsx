import { AlertCircle, Table as TableIcon } from "lucide-react";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import type { TableItem } from "@/features/tables/types/table.types";
import { AssignTableCard } from "./AssignTableCard";

interface AssignTableListProps {
  sections: string[];
  activeSectionFilter: string;
  onSelectSection: (section: string) => void;
  allTablesCount: number;
  displayedTables: TableItem[];
  isLoadingTables: boolean;
  isTablesError: boolean;
  tablesErrorMessage?: string;
  onRetryTables: () => void;
  selectedTables: Record<string, number>;
  isSubmitting: boolean;
  onToggleTable: (table: TableItem) => void;
  onAdjustSeats: (tableId: string, delta: number, maxCapacity: number) => void;
}

export function AssignTableList({
  sections,
  activeSectionFilter,
  onSelectSection,
  allTablesCount,
  displayedTables,
  isLoadingTables,
  isTablesError,
  tablesErrorMessage,
  onRetryTables,
  selectedTables,
  isSubmitting,
  onToggleTable,
  onAdjustSeats,
}: AssignTableListProps) {
  return (
    <>
      {/* Section Filter Chips */}
      {sections.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectSection("ALL")}
            className={`h-7 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeSectionFilter === "ALL"
                ? "bg-[#9a3412] text-white shadow-2xs"
                : "bg-[#faf7f5] text-neutral-600 hover:bg-[#eddcd4]/50 border border-[#eddcd4]"
            }`}
          >
            All Sections ({allTablesCount})
          </button>
          {sections.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => onSelectSection(sec)}
              className={`h-7 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeSectionFilter === sec
                  ? "bg-[#9a3412] text-white shadow-2xs"
                  : "bg-[#faf7f5] text-neutral-600 hover:bg-[#eddcd4]/50 border border-[#eddcd4]"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      )}

      {/* Loading Tables State */}
      {isLoadingTables && (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <Spinner className="size-6 text-[#9a3412] mb-2" />
          <p className="text-xs text-neutral-500">Loading dining floor tables...</p>
        </div>
      )}

      {/* Tables Loading Error */}
      {isTablesError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-red-600 shrink-0" />
            <span>{tablesErrorMessage || "Failed to load tables"}</span>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={onRetryTables}
            className="h-7 px-2.5 rounded-lg bg-red-700 text-white font-bold text-xs"
          >
            Retry
          </Button>
        </div>
      )}

      {/* No Tables Available State */}
      {!isLoadingTables && !isTablesError && displayedTables.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-[#eddcd4] bg-[#faf7f5]/60">
          <TableIcon className="size-7 text-[#9a3412] mb-2" />
          <p className="text-sm font-bold text-neutral-900">No Tables in This Section</p>
          <p className="text-xs text-neutral-500 mt-0.5">
            Switch section filter or create tables from the Tables management page.
          </p>
        </div>
      )}

      {/* Tables Grid */}
      {!isLoadingTables && !isTablesError && displayedTables.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-neutral-700">Select Available Tables:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {displayedTables.map((table) => (
              <AssignTableCard
                key={table.id}
                table={table}
                isSelected={selectedTables[table.id] !== undefined}
                allocatedSeats={selectedTables[table.id]}
                isSubmitting={isSubmitting}
                onToggle={onToggleTable}
                onAdjustSeats={onAdjustSeats}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
