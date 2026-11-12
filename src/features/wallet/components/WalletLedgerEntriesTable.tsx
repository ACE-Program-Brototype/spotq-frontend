import { ArrowDownLeft, ArrowUpRight, RotateCcw, Search } from "lucide-react";
import { useMemo } from "react";
import { type Column, DataTable } from "@/components/common/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/utils/date";
import { WALLET_LEDGER_STATUSES, WALLET_LEDGER_TYPES } from "../constants/wallet.constants";
import type { WalletLedgerEntry, WalletLedgerPagination } from "../types/wallet.types";

interface WalletLedgerEntriesTableProps {
  entries: readonly WalletLedgerEntry[];
  pagination?: WalletLedgerPagination;
  isLoading: boolean;
  search: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

const formatLabel = (value: string) =>
  value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

export function WalletLedgerEntriesTable({
  entries,
  pagination,
  isLoading,
  search,
  type,
  status,
  startDate,
  endDate,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onPageChange,
  onClearFilters,
}: WalletLedgerEntriesTableProps) {
  const columns = useMemo<Column<WalletLedgerEntry>[]>(
    () => [
      {
        key: "createdAt",
        header: "Date & time",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-xs">{formatDate(row.createdAt)}</span>
        ),
      },
      {
        key: "type",
        header: "Type",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-neutral-800">
            {row.type.startsWith("CREDIT") ? (
              <ArrowDownLeft className="size-3.5 text-emerald-600" />
            ) : (
              <ArrowUpRight className="size-3.5 text-orange-600" />
            )}
            {formatLabel(row.type)}
          </span>
        ),
      },
      {
        key: "amountPaise",
        header: "Amount",
        cell: ({ row }) => (
          <span
            className={`whitespace-nowrap text-xs font-bold ${row.type.startsWith("CREDIT") ? "text-emerald-700" : "text-neutral-900"}`}
          >
            {row.type.startsWith("CREDIT") ? "+" : "−"}
            {formatCurrency(row.amountPaise / 100)}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-700">
            {formatLabel(row.status)}
          </span>
        ),
      },
      {
        key: "balanceAfterPaise",
        header: "Balance after",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-xs font-medium text-neutral-700">
            {formatCurrency(row.balanceAfterPaise / 100)}
          </span>
        ),
      },
      {
        key: "referenceId",
        header: "Reference / UTR",
        cell: ({ row }) => (
          <div className="max-w-56">
            <p className="truncate font-mono text-[11px] text-neutral-700" title={row.referenceId}>
              {row.referenceId}
            </p>
            {row.utrNumber && (
              <p className="mt-0.5 truncate text-[11px] text-neutral-500" title={row.utrNumber}>
                UTR: {row.utrNumber}
              </p>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <section aria-labelledby="wallet-ledger-heading" className="min-w-0 space-y-4">
      <div>
        <h2 id="wallet-ledger-heading" className="text-lg font-bold text-neutral-900">
          Wallet ledger
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Review wallet credits, withdrawals, and payout updates.
        </p>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-3 rounded-2xl border border-[#eddcd4] bg-white p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-6">
        <div className="relative min-w-0 sm:col-span-2 lg:col-span-1">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
          />
          <Input
            aria-label="Search wallet ledger"
            placeholder="Search reference or UTR"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="min-w-0 pl-9"
          />
        </div>
        <select
          aria-label="Filter by type"
          value={type}
          onChange={(event) => onTypeChange(event.target.value)}
          className="h-9 w-full min-w-0 rounded-md border border-input bg-white px-3 text-sm"
        >
          <option value="">All types</option>
          {WALLET_LEDGER_TYPES.map((value) => (
            <option key={value} value={value}>
              {formatLabel(value)}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-9 w-full min-w-0 rounded-md border border-input bg-white px-3 text-sm"
        >
          <option value="">All statuses</option>
          {WALLET_LEDGER_STATUSES.map((value) => (
            <option key={value} value={value}>
              {formatLabel(value)}
            </option>
          ))}
        </select>
        <Input
          aria-label="Start date"
          type="date"
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
          className="min-w-0"
        />
        <Input
          aria-label="End date"
          type="date"
          min={startDate || undefined}
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
          className="min-w-0"
        />
        <Button
          type="button"
          variant="outline"
          onClick={onClearFilters}
          aria-label="Clear wallet ledger filters"
          disabled={!search && !type && !status && !startDate && !endDate}
          className="w-full gap-2"
        >
          <RotateCcw className="size-4" />
          Clear filters
        </Button>
      </div>
      <DataTable
        aria-label="Wallet ledger entries"
        data={entries}
        columns={columns}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        loadingRowCount={5}
        theme="restaurant"
        className="min-w-0"
        containerClassName="min-w-0"
        emptyTitle="No wallet entries found"
        emptyDescription="Wallet activity matching these filters will appear here."
        pagination={
          pagination
            ? {
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                totalItems: pagination.totalRecords,
                pageSize: pagination.limit,
                onPageChange,
                theme: "restaurant",
              }
            : undefined
        }
      />
    </section>
  );
}
