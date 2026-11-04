import { DataTable, Pagination } from "@/components/common";
import type { Column } from "@/components/common/table";
import type { MasterLedgerEntry } from "../types/finance.types";
import { LedgerFilters, type LedgerFiltersProps } from "./LedgerFilters";

interface FinanceLedgerProps {
  entries: MasterLedgerEntry[];
  columns: Column<MasterLedgerEntry>[];
  totalPages: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string;
  filters: LedgerFiltersProps;
  onPageChange: (page: number) => void;
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
  onPageChange,
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
            className="rounded-lg border px-3 py-2 text-sm"
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
      {!error && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
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
      className="m-4 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"
    >
      <span>{error}</span>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm"
      >
        Retry
      </button>
    </div>
  );
}
