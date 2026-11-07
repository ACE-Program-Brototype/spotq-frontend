/**
 * CustomerPaymentHistoryPage Component
 * Dedicated customer payments dashboard matching Figma frames 547:7577 & 547:7771.
 * Integrates CustomerSidebar, filter tabs, responsive table/cards,
 * Razorpay retry trigger, and server-side pagination.
 */

import { AlertCircle, CreditCard, RefreshCw } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { CustomerSidebar } from "@/features/profile/components/CustomerSidebar";
import { useCustomerProfile } from "@/features/profile/hooks/use-customer-profile";
import { CustomerPaymentDateFilter } from "../components/CustomerPaymentDateFilter";
import { CustomerPaymentHistoryEmptyState } from "../components/CustomerPaymentHistoryEmptyState";
import { CustomerPaymentHistoryMobileCards } from "../components/CustomerPaymentHistoryMobileCards";
import { CustomerPaymentHistorySkeleton } from "../components/CustomerPaymentHistorySkeleton";
import { CustomerPaymentHistoryTable } from "../components/CustomerPaymentHistoryTable";
import { CustomerPaymentSortSelect } from "../components/CustomerPaymentSortSelect";
import { PaymentFilterTabs } from "../components/PaymentFilterTabs";
import {
  CUSTOMER_PAYMENT_MESSAGES,
  PAYMENT_FILTER_STATUS,
} from "../constants/customer-payment.constants";
import { useCustomerPaymentHistory } from "../hooks/use-customer-payment-history";
import { useRetryPayment } from "../hooks/use-retry-payment";

export function CustomerPaymentHistoryPage() {
  const { data: profile } = useCustomerProfile();

  const {
    transactions,
    pagination,
    setPage,
    status,
    setStatus,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    clearDateRange,
    isDateFiltered,
    sortBy,
    sortOrder,
    setSort,
    handleToggleSort,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useCustomerPaymentHistory();

  const { handleRetry, handleDownloadInvoice, isRetrying, isDownloading } = useRetryPayment();

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col lg:flex-row gap-8 items-start">
        {/* Customer Sidebar Navigation */}
        <CustomerSidebar profile={profile} />

        {/* Main Content Area */}
        <div className="flex flex-1 w-full flex-col gap-6 min-w-0">
          {/* Header & Filter Section */}
          <div className="flex flex-col gap-4 pb-3 border-b border-neutral-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
                    {CUSTOMER_PAYMENT_MESSAGES.PAGE_TITLE}
                  </h1>
                  {pagination.totalItems > 0 && (
                    <span
                      data-testid="payment-count-badge"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fef3ec] text-[#e8631b] border border-[#fbd3b7] text-xs font-bold"
                    >
                      <CreditCard className="size-3" />
                      <span>{pagination.totalItems}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium text-neutral-500">
                  {CUSTOMER_PAYMENT_MESSAGES.PAGE_SUBTITLE}
                </p>
              </div>
            </div>

            {/* Segmented Status Filter Tabs, Date Picker & Sort Selector */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <PaymentFilterTabs
                  selectedStatus={status}
                  onSelect={setStatus}
                  disabled={isFetching}
                />
                <CustomerPaymentSortSelect
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onChange={setSort}
                  disabled={isFetching}
                />
              </div>

              <div className="flex items-center justify-between">
                <CustomerPaymentDateFilter
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  onClear={clearDateRange}
                  disabled={isFetching}
                />
              </div>
            </div>
          </div>

          {/* Conditional Views: Loading, Error, Empty, or Table / Mobile Cards */}
          {isLoading ? (
            <CustomerPaymentHistorySkeleton />
          ) : isError ? (
            <div
              data-testid="customer-payment-history-error-state"
              className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 sm:p-12 text-center border border-red-100 shadow-xs gap-4"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
                <AlertCircle className="size-7" />
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <h3 className="text-lg font-bold text-neutral-900">
                  {CUSTOMER_PAYMENT_MESSAGES.ERROR_TITLE}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500">
                  {error?.message || CUSTOMER_PAYMENT_MESSAGES.ERROR_DESCRIPTION}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold px-5 py-2.5 gap-2 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
                <span>{CUSTOMER_PAYMENT_MESSAGES.ERROR_RETRY}</span>
              </Button>
            </div>
          ) : transactions.length === 0 ? (
            <CustomerPaymentHistoryEmptyState
              statusFilter={status}
              isFiltered={status !== PAYMENT_FILTER_STATUS.ALL || isDateFiltered}
              onClearFilter={() => {
                setStatus(PAYMENT_FILTER_STATUS.ALL);
                clearDateRange();
              }}
            />
          ) : (
            <div className="flex flex-col gap-6 w-full">
              {/* Desktop Table View (Figma 547:7577) */}
              <div className="hidden md:block">
                <CustomerPaymentHistoryTable
                  transactions={transactions}
                  onRetry={handleRetry}
                  onDownloadInvoice={handleDownloadInvoice}
                  isRetrying={isRetrying}
                  isDownloading={isDownloading}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleToggleSort}
                />
              </div>

              {/* Mobile Card Feed View (Figma 547:7771) */}
              <div className="block md:hidden">
                <CustomerPaymentHistoryMobileCards
                  transactions={transactions}
                  onRetry={handleRetry}
                  onDownloadInvoice={handleDownloadInvoice}
                  isRetrying={isRetrying}
                  isDownloading={isDownloading}
                />
              </div>

              {/* Server-Side Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center sm:justify-end pt-2">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    pageSize={pagination.pageSize}
                    onPageChange={setPage}
                    theme="customer"
                    disabled={isFetching}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerPaymentHistoryPage;
