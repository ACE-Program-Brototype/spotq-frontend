import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import type { Column } from "@/components/common/table";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils/cn";
import { FinanceDetailDrawer } from "../components/FinanceDetailDrawer";
import { FinanceLedger } from "../components/FinanceLedger";
import { FinancePageHeader } from "../components/FinancePageHeader";
import { FinanceSummary as FinanceSummaryCards } from "../components/FinanceSummary";
import type { LedgerFilterState } from "../components/LedgerFilters";
import {
  DEFAULT_FINANCE_DATE_PRESET,
  FINANCE_MESSAGES,
  FINANCE_PAGE_SIZE,
} from "../constants/finance.constants";
import { useFinanceLedger } from "../hooks/useFinanceLedger";
import { useFinanceSummary } from "../hooks/useFinanceSummary";
import { financeService } from "../services/finance.service";
import type { DatePreset, LedgerEntryType, MasterLedgerEntry } from "../types/finance.types";
import { getDateRange } from "../utils/finance.utils";
import { formatDate, formatPaise, typeLabels, typeStyles } from "../utils/finance-display.utils";

export type { DatePreset } from "../types/finance.types";

function getErrorMessage(error: unknown, fallback = FINANCE_MESSAGES.ERROR): string {
  if (!error) return "";
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function PlatformFinancePage() {
  // Keep ledger filters and pagination together so filter changes can reset the page.
  const [filters, setFilters] = useState<LedgerFilterState>({
    search: "",
    type: "ALL",
    datePreset: DEFAULT_FINANCE_DATE_PRESET as DatePreset,
    customStart: "",
    customEnd: "",
    page: 1,
  });
  // Debounce free-text search to avoid fetching on every keystroke.
  const debouncedSearch = useDebounce(filters.search, 300);
  const [selected, setSelected] = useState<MasterLedgerEntry | null>(null);
  const [copied, setCopied] = useState(false);
  const range = useMemo(
    () => getDateRange(filters.datePreset, filters.customStart, filters.customEnd),
    [filters.datePreset, filters.customStart, filters.customEnd],
  );

  const summaryQuery = useFinanceSummary();
  // Build API params from the active filters; omit optional filters when unset.
  const ledgerParams = useMemo(
    () => ({
      page: filters.page,
      limit: FINANCE_PAGE_SIZE,
      ...(filters.type !== "ALL" && { type: filters.type as LedgerEntryType }),
      ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
      ...range,
    }),
    [debouncedSearch, filters.page, filters.type, range],
  );
  const ledgerQuery = useFinanceLedger(ledgerParams);
  const summary = summaryQuery.data;
  const entries = ledgerQuery.data?.entries ?? [];
  const totalPages = ledgerQuery.data?.pagination?.totalPages ?? 1;
  const exportMutation = useMutation({ mutationFn: financeService.downloadFinanceCsv });
  const exporting = exportMutation.isPending;
  const summaryError = getErrorMessage(summaryQuery.error);
  const ledgerError = getErrorMessage(ledgerQuery.error);
  const exportError = getErrorMessage(exportMutation.error);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  const exportCsv = () =>
    exportMutation.mutate({
      ...(filters.type !== "ALL" && { type: filters.type as LedgerEntryType }),
      ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
      ...range,
    });

  const refresh = () => {
    void summaryQuery.refetch();
    void ledgerQuery.refetch();
  };

  const copyTransactionId = async () => {
    if (!selected) return;
    await navigator.clipboard.writeText(selected.id);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const columns: Column<MasterLedgerEntry>[] = [
    {
      key: "createdAt",
      header: "Date & time",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-xs text-slate-600">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: "id",
      header: "Entry ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium text-slate-500">{row.id}</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: ({ row }) => (
        <span
          className={cn(
            "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold",
            typeStyles[row.type as LedgerEntryType] ||
              "border-slate-200 bg-slate-50 text-slate-700",
          )}
        >
          {typeLabels[row.type as LedgerEntryType] || row.type}
        </span>
      ),
    },
    {
      key: "restaurantId",
      header: "Restaurant",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-600">{row.restaurantId || "—"}</span>
      ),
    },
    {
      key: "reference",
      header: "Ref / order ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-600">{row.referenceId || "—"}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      cell: ({ row }) => {
        const positive = row.type === "CUSTOMER_PAYMENT_INTAKE";
        return (
          <span
            className={cn(
              "whitespace-nowrap font-mono font-bold tabular-nums",
              positive
                ? "text-emerald-700"
                : row.type === "REFUND_EXPENSE"
                  ? "text-rose-700"
                  : "text-purple-700",
            )}
          >
            {positive ? "+" : "−"}
            {formatPaise(row.amountPaise)}
          </span>
        );
      },
    },
  ];

  const resetFilters = () => {
    setFilters({
      search: "",
      type: "ALL",
      datePreset: DEFAULT_FINANCE_DATE_PRESET,
      customStart: "",
      customEnd: "",
      page: 1,
    });
  };

  return (
    <div className="space-y-6 pb-8">
      <FinancePageHeader exporting={exporting} onExport={exportCsv} />

      <FinanceSummaryCards
        summary={summary ?? null}
        loading={summaryQuery.isPending}
        error={summaryError}
      />

      <FinanceLedger
        entries={entries}
        columns={columns}
        totalPages={totalPages}
        page={filters.page}
        pageSize={FINANCE_PAGE_SIZE}
        loading={ledgerQuery.isPending || ledgerQuery.isFetching}
        error={ledgerError}
        filters={{
          search: filters.search,
          type: filters.type,
          datePreset: filters.datePreset,
          customStart: filters.customStart,
          customEnd: filters.customEnd,
          // LedgerFilters owns field updates and resets page to 1 when a filter changes.
          setFilters,
        }}
        onPageChange={(page) => setFilters((state) => ({ ...state, page }))}
        onRowClick={setSelected}
        onRetry={refresh}
        onResetFilters={resetFilters}
      />

      {exportError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>Export failed: {exportError}</span>
          <button
            type="button"
            onClick={exportCsv}
            disabled={exporting}
            className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm disabled:opacity-50"
          >
            Retry export
          </button>
        </div>
      )}

      {selected && (
        <FinanceDetailDrawer
          entry={selected}
          copied={copied}
          onCopy={() => void copyTransactionId()}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
