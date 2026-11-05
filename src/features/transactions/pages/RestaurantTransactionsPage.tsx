/**
 * RestaurantTransactionsPage
 * Root page for Restaurant Admin Payment Transactions Ledger & Detail Drawer.
 */

import { AlertCircle, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TransactionDetailDrawer } from "../components/TransactionDetailDrawer";
import { TransactionFilters } from "../components/TransactionFilters";
import { TransactionsHeader } from "../components/TransactionsHeader";
import { TransactionsTable } from "../components/TransactionsTable";
import { TRANSACTION_MESSAGES } from "../constants/transaction-messages.constants";
import { useTransactionFilters } from "../hooks/useTransactionFilters";
import { useTransactions } from "../hooks/useTransactions";
import { transactionService } from "../services/transaction.service";
import { downloadTransactionsCsv } from "../utils/transaction-export.utils";

export function RestaurantTransactionsPage() {
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const {
    queryParams,
    searchInput,
    setSearchInput,
    status,
    handleStatusChange,
    method,
    handleMethodChange,
    datePreset,
    handleDatePresetChange,
    customStartDate,
    handleCustomStartDateChange,
    customEndDate,
    handleCustomEndDateChange,
    setPage,
    sortBy,
    sortOrder,
    handleSortChange,
    resetFilters,
    isFiltered,
    isDateRangeInvalid,
  } = useTransactionFilters();

  const { data, isLoading, isError, refetch } = useTransactions(queryParams);

  const transactions = data?.transactions ?? [];
  const pagination = data?.pagination;

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const exportData = await transactionService.getTransactions({
        ...queryParams,
        page: 1,
        limit: 1000,
      });

      const recordsToExport = exportData.transactions;

      if (!recordsToExport || recordsToExport.length === 0) {
        toast.error(TRANSACTION_MESSAGES.EXPORT_EMPTY);
        return;
      }

      const success = downloadTransactionsCsv(recordsToExport, "restaurant-transactions");
      if (success) {
        toast.success(TRANSACTION_MESSAGES.EXPORT_SUCCESS);
      } else {
        toast.error(TRANSACTION_MESSAGES.EXPORT_ERROR);
      }
    } catch {
      toast.error(TRANSACTION_MESSAGES.EXPORT_ERROR);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
      data-testid="restaurant-transactions-page"
    >
      {/* Page Header */}
      <TransactionsHeader
        isLoading={isLoading}
        isExporting={isExporting}
        onRefresh={() => refetch()}
        onExportCsv={handleExportCsv}
        disabledExport={transactions.length === 0}
      />

      {/* Filter and Search Bar */}
      <TransactionFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        status={status}
        onStatusChange={handleStatusChange}
        method={method}
        onMethodChange={handleMethodChange}
        datePreset={datePreset}
        onDatePresetChange={handleDatePresetChange}
        customStartDate={customStartDate}
        onCustomStartDateChange={handleCustomStartDateChange}
        customEndDate={customEndDate}
        onCustomEndDateChange={handleCustomEndDateChange}
        isFiltered={isFiltered}
        isDateRangeInvalid={isDateRangeInvalid}
        onResetFilters={resetFilters}
      />

      {/* Error Feedback State */}
      {isError && (
        <div
          data-testid="transactions-error-banner"
          className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5 text-rose-600 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-rose-900">
                {TRANSACTION_MESSAGES.ERROR_TITLE}
              </h4>
              <p className="text-xs text-rose-700">{TRANSACTION_MESSAGES.ERROR_DESCRIPTION}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl border-rose-300 text-rose-700 hover:bg-rose-100 gap-1.5 shrink-0"
          >
            <RotateCcw className="size-3.5" />
            <span>{TRANSACTION_MESSAGES.RETRY}</span>
          </Button>
        </div>
      )}

      {/* Responsive Transactions Data Table */}
      <TransactionsTable
        transactions={transactions}
        pagination={pagination}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onPageChange={setPage}
        onSelectTransaction={(id) => setSelectedTransactionId(id)}
      />

      {/* Slide-Over Drawer for Transaction Deep Details */}
      <TransactionDetailDrawer
        transactionId={selectedTransactionId}
        onClose={() => setSelectedTransactionId(null)}
      />
    </div>
  );
}
