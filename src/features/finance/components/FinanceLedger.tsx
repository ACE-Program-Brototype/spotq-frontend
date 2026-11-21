import { AlertCircle, RotateCcw } from "lucide-react";
import { DataTable, Pagination } from "@/components/common";
import type { Column } from "@/components/common/table";
import { Button } from "@/components/ui/button";
import { FinanceLedgerMobileCard } from "@/features/finance/components/FinanceLedgerMobileCard";
import {
  LedgerFilters,
  type LedgerFiltersProps,
} from "@/features/finance/components/LedgerFilters";
import {
  FINANCE_MESSAGES,
  FINANCE_PAGE_SIZE_OPTIONS,
} from "@/features/finance/constants/finance.constants";
import type { MasterLedgerEntry } from "@/features/finance/types/finance.types";

interface FinanceLedgerProps {
  entries: MasterLedgerEntry[];
  columns: Column<MasterLedgerEntry>[];
  totalPages: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string;
  filters: LedgerFiltersProps;
  restaurantMap?: Map<string, string>;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onRowClick: (entry: MasterLedgerEntry) => void;
  onRetry: () => void;
  onResetFilters: () => void;
}

export function FinanceLedger({
  entries,
  columns,
  totalPages,
  page,
  pageSize,
  loading,
  error,
  filters,
  restaurantMap,
  onPageChange,
  onLimitChange,
  onRowClick,
  onRetry,
  onResetFilters,
}: FinanceLedgerProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
      <div className="flex min-w-0 flex-col gap-3 border-b border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900">Global master ledger</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
            {entries.length} entries on this page
          </span>
        </div>
        <LedgerFilters {...filters} />
      </div>
      {error && <FinanceLedgerError error={error} onRetry={onRetry} />}

      {/* Desktop Table View (>= 640px) */}
      <div className="hidden sm:block">
        <DataTable
          data={entries}
          columns={columns}
          isLoading={loading}
          loadingRowCount={6}
          error={null}
          emptyTitle="No ledger entries found"
          emptyDescription="Try adjusting your search or date range to find matching transactions."
          emptyAction={
            <button
              type="button"
              className="rounded-lg border px-3 py-2 text-sm cursor-pointer"
              onClick={onResetFilters}
            >
              Clear filters
            </button>
          }
          onRowClick={onRowClick}
          rowClassName="cursor-pointer transition-colors hover:bg-indigo-50/40 focus-visible:bg-indigo-50/60"
          getRowId={(entry) => entry.id}
          aria-label="Global master ledger"
          tableClassName="min-w-[920px] text-sm"
          headerClassName="border-b border-slate-200 bg-slate-50/80 text-[10px] tracking-[0.12em]"
        />
      </div>

      {/* Mobile Stacked Cards View (< 640px) */}
      <div className="block sm:hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 w-full animate-pulse rounded-2xl bg-slate-100 border border-slate-200/60"
              />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-800">No ledger entries found</p>
            <p className="text-xs text-slate-500">
              Try adjusting your search or date range to find matching transactions.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 rounded-xl cursor-pointer"
              onClick={onResetFilters}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="p-3.5 space-y-3">
            {entries.map((entry) => {
              const resName =
                entry.restaurantName ||
                (entry.restaurantId ? restaurantMap?.get(entry.restaurantId) : null) ||
                (entry.restaurantId ? "SpotQ Partner Venue" : "SpotQ Platform");
              return (
                <FinanceLedgerMobileCard
                  key={entry.id}
                  entry={entry}
                  restaurantName={resName}
                  onClick={onRowClick}
                />
              );
            })}
          </div>
        )}
      </div>

      {!error && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          pageSizeOptions={FINANCE_PAGE_SIZE_OPTIONS}
          onPageSizeChange={onLimitChange}
          pageSizeLabel={FINANCE_MESSAGES.ROWS_PER_PAGE}
          onPageChange={onPageChange}
          disabled={loading}
          theme="admin"
          className="border-t border-slate-200"
        />
      )}
    </section>
  );
}

function FinanceLedgerError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="m-4 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-900 sm:flex-row sm:items-center sm:justify-between shadow-xs"
    >
      <div className="flex items-center gap-2.5">
        <AlertCircle className="size-5 text-rose-600 shrink-0" aria-hidden="true" />
        <span className="font-medium text-rose-900">{error}</span>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onRetry}
        className="gap-1.5 rounded-xl border-rose-200 bg-white text-rose-700 hover:bg-rose-100 hover:text-rose-900 shrink-0 font-semibold cursor-pointer"
      >
        <RotateCcw className="size-3.5" aria-hidden="true" />
        <span>{FINANCE_MESSAGES.RETRY}</span>
      </Button>
    </div>
  );
}
