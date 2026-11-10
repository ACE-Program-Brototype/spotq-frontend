import { AlertCircle, ChevronRight, Filter, RefreshCw, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { BillingPagination } from "@/features/subscription/components/BillingPagination";
import { InvoiceTable } from "@/features/subscription/components/InvoiceTable";
import {
  SUBSCRIPTION_HISTORY_CONFIG,
  SUBSCRIPTION_HISTORY_MESSAGES,
  SUBSCRIPTION_HISTORY_STATUS_OPTIONS,
} from "@/features/subscription/constants/subscription-history.constants";
import { useSubscriptionHistory } from "@/features/subscription/hooks/useSubscriptionHistory";
import type { SubscriptionBillingFilterStatus } from "@/features/subscription/types/subscription-history.types";

export default function BillingHistoryPage() {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || user?.id;

  const [page, setPage] = useState<number>(SUBSCRIPTION_HISTORY_CONFIG.DEFAULT_PAGE);
  const [status, setStatus] = useState<SubscriptionBillingFilterStatus>(
    SUBSCRIPTION_HISTORY_CONFIG.DEFAULT_STATUS,
  );

  const { transactions, pagination, isLoading, isFetching, isError, error, refetch } =
    useSubscriptionHistory(restaurantId, {
      page,
      limit: SUBSCRIPTION_HISTORY_CONFIG.DEFAULT_LIMIT,
      status,
    });

  const handleStatusChange = (newStatus: SubscriptionBillingFilterStatus) => {
    setStatus(newStatus);
    setPage(SUBSCRIPTION_HISTORY_CONFIG.DEFAULT_PAGE);
  };

  const handleResetFilters = () => {
    setStatus(SUBSCRIPTION_HISTORY_CONFIG.DEFAULT_STATUS);
    setPage(SUBSCRIPTION_HISTORY_CONFIG.DEFAULT_PAGE);
  };

  const isFiltered = status !== SUBSCRIPTION_HISTORY_CONFIG.DEFAULT_STATUS;

  return (
    <div
      className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
      data-testid="billing-history-page"
    >
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500">
        <Link
          to={RESTAURANT_ROUTES.SETTINGS_ACCOUNT}
          className="hover:text-neutral-900 transition-colors"
        >
          {SUBSCRIPTION_HISTORY_MESSAGES.BREADCRUMB_SETTINGS}
        </Link>
        <ChevronRight className="size-3.5 text-neutral-400" />
        <Link
          to={RESTAURANT_ROUTES.SUBSCRIPTION}
          className="hover:text-neutral-900 transition-colors"
        >
          {SUBSCRIPTION_HISTORY_MESSAGES.BREADCRUMB_BILLING}
        </Link>
        <ChevronRight className="size-3.5 text-neutral-400" />
        <span className="font-medium text-neutral-900" aria-current="page">
          {SUBSCRIPTION_HISTORY_MESSAGES.BREADCRUMB_CURRENT}
        </span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            {SUBSCRIPTION_HISTORY_MESSAGES.PAGE_TITLE}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {SUBSCRIPTION_HISTORY_MESSAGES.PAGE_SUBTITLE}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="border-[#f3e6de] text-neutral-700 hover:bg-[#faf5f0]"
            data-testid="billing-history-refresh-button"
            aria-label={SUBSCRIPTION_HISTORY_MESSAGES.REFRESH_BUTTON_LABEL}
          >
            <RefreshCw
              className={`size-3.5 mr-1.5 text-neutral-500 ${
                isFetching ? "animate-spin text-[#ea580c]" : ""
              }`}
              aria-hidden="true"
            />
            <span>
              {isFetching
                ? SUBSCRIPTION_HISTORY_MESSAGES.REFRESHING_LABEL
                : SUBSCRIPTION_HISTORY_MESSAGES.REFRESH_BUTTON_LABEL}
            </span>
          </Button>
        </div>
      </div>

      {/* Filters and Controls Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#f3e6de] bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600">
            <Filter className="size-3.5 text-neutral-400" aria-hidden="true" />
            <span>{SUBSCRIPTION_HISTORY_MESSAGES.STATUS_FILTER_LABEL}:</span>
          </div>

          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as SubscriptionBillingFilterStatus)}
            aria-label={SUBSCRIPTION_HISTORY_MESSAGES.STATUS_FILTER_LABEL}
            className="h-9 px-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-100/70 focus:outline-hidden focus:ring-1 focus:ring-neutral-400 cursor-pointer transition-colors"
            data-testid="status-filter-select"
          >
            {SUBSCRIPTION_HISTORY_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {isFiltered && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 px-2.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
              data-testid="reset-filter-toolbar-button"
            >
              <RotateCcw className="size-3 mr-1" aria-hidden="true" />
              <span>{SUBSCRIPTION_HISTORY_MESSAGES.RESET_FILTER_BUTTON}</span>
            </Button>
          )}
        </div>

        {pagination && (
          <div className="text-xs text-neutral-500 font-medium" data-testid="total-records-count">
            {SUBSCRIPTION_HISTORY_MESSAGES.TOTAL_COUNT_LABEL}: {pagination.totalRecords}
          </div>
        )}
      </div>

      {/* Error State Banner */}
      {isError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          data-testid="billing-history-error-banner"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 shrink-0 text-rose-600 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-rose-900">
                {SUBSCRIPTION_HISTORY_MESSAGES.FETCH_ERROR_TITLE}
              </h3>
              <p className="mt-0.5 text-xs text-rose-700">
                {error instanceof Error
                  ? error.message
                  : SUBSCRIPTION_HISTORY_MESSAGES.FETCH_ERROR_DESCRIPTION}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-rose-300 text-rose-800 hover:bg-rose-100 self-start sm:self-auto shrink-0"
            data-testid="error-retry-button"
          >
            <RotateCcw className="size-3.5 mr-1.5" aria-hidden="true" />
            <span>{SUBSCRIPTION_HISTORY_MESSAGES.RETRY_BUTTON}</span>
          </Button>
        </div>
      )}

      {/* Invoices Table */}
      <InvoiceTable
        transactions={transactions}
        isLoading={isLoading}
        isFiltered={isFiltered}
        onResetFilter={handleResetFilters}
      />

      {/* Pagination */}
      {pagination && (
        <BillingPagination
          currentPage={page}
          totalPages={pagination.totalPages}
          totalRecords={pagination.totalRecords}
          pageSize={SUBSCRIPTION_HISTORY_CONFIG.DEFAULT_LIMIT}
          onPageChange={setPage}
          disabled={isLoading || isFetching}
        />
      )}
    </div>
  );
}
