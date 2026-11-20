import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import type { Column } from "@/components/common/table";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils/cn";
import { FinanceDetailDrawer } from "@/features/finance/components/FinanceDetailDrawer";
import { FinanceLedger } from "@/features/finance/components/FinanceLedger";
import { FinancePageHeader } from "@/features/finance/components/FinancePageHeader";
import { FinanceSummary as FinanceSummaryCards } from "@/features/finance/components/FinanceSummary";
import type { LedgerFilterState } from "@/features/finance/components/LedgerFilters";
import {
  DEFAULT_FINANCE_DATE_PRESET,
  FINANCE_MESSAGES,
  FINANCE_PAGE_SIZE,
  LEDGER_ENTRY_TYPE,
} from "@/features/finance/constants/finance.constants";
import { useFinanceLedger } from "@/features/finance/hooks/useFinanceLedger";
import { useFinanceSummary } from "@/features/finance/hooks/useFinanceSummary";
import { financeService } from "@/features/finance/services/finance.service";
import { restaurantService } from "@/features/restaurants/services/restaurant.service";
import type { DatePreset, LedgerEntryType, MasterLedgerEntry } from "@/features/finance/types/finance.types";
import { getDateRange, getErrorMessage } from "@/features/finance/utils/finance.utils";
import { formatDate, formatPaise, typeLabels, typeStyles } from "@/features/finance/utils/finance-display.utils";

export type { DatePreset } from "@/features/finance/types/finance.types";

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

  const restaurantsQuery = useQuery({
    queryKey: ["admin", "restaurants", "lookup"],
    queryFn: () => restaurantService.getAdminRestaurants({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const restaurantMap = useMemo(() => {
    const map = new Map<string, string>();
    if (restaurantsQuery.data?.restaurants) {
      for (const r of restaurantsQuery.data.restaurants) {
        map.set(r.id, r.restaurant_name);
      }
    }
    return map;
  }, [restaurantsQuery.data?.restaurants]);

  const exportMutation = useMutation({ mutationFn: financeService.downloadFinanceCsv });
  const exporting = exportMutation.isPending;
  const summaryError = getErrorMessage(summaryQuery.error, FINANCE_MESSAGES.SUMMARY_ERROR);
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
      key: "restaurant",
      header: "Restaurant",
      cell: ({ row }) => {
        const name =
          row.restaurantName ||
          (row.restaurantId ? restaurantMap.get(row.restaurantId) : null) ||
          (row.restaurantId ? "SpotQ Partner Venue" : "SpotQ Platform");
        return (
          <span className="text-xs font-semibold text-slate-800 break-words">
            {name}
          </span>
        );
      },
    },
    {
      key: "referenceId",
      header: "Order ID",
      cell: ({ row }) => {
        if (!row.referenceId) {
          return <span className="font-mono text-xs text-slate-400">—</span>;
        }
        return (
          <span
            className="inline-block max-w-[130px] truncate rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-700 border border-slate-200/60"
            title={row.referenceId}
          >
            {row.referenceId}
          </span>
        );
      },
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      cell: ({ row }) => {
        const positive = row.type === LEDGER_ENTRY_TYPE.CUSTOMER_PAYMENT_INTAKE;
        return (
          <span
            className={cn(
              "whitespace-nowrap font-mono font-bold tabular-nums",
              positive
                ? "text-emerald-700"
                : row.type === LEDGER_ENTRY_TYPE.REFUND_EXPENSE
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
        onRetry={() => summaryQuery.refetch()}
        isRetrying={summaryQuery.isFetching}
      />

      <FinanceLedger
        entries={entries}
        columns={columns}
        totalPages={totalPages}
        page={filters.page}
        pageSize={FINANCE_PAGE_SIZE}
        loading={ledgerQuery.isPending || ledgerQuery.isFetching}
        error={ledgerError}
        restaurantMap={restaurantMap}
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
          restaurantName={
            selected.restaurantName ||
            (selected.restaurantId ? restaurantMap.get(selected.restaurantId) : null)
          }
          copied={copied}
          onCopy={() => void copyTransactionId()}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
