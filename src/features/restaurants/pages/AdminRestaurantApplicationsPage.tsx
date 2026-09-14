import { AlertCircle, FileCheck2, RefreshCw } from "lucide-react";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RestaurantApplicationFilters } from "../components/applications/RestaurantApplicationFilters";
import { RestaurantApplicationTable } from "../components/applications/RestaurantApplicationTable";
import { RestaurantEmptyState } from "../components/RestaurantEmptyState";
import { APPLICATION_MESSAGES } from "../constants/restaurant-application.constants";
import { useRestaurantApplications } from "../hooks/useRestaurantApplications";
import type { ApplicationSortByType } from "../types/restaurant-application.types";

export function AdminRestaurantApplicationsPage() {
  const {
    applications,
    pagination,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    limit,
    status,
    setStatus,
    search,
    setSearch,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    handleSort,
    resetFilters,
    isFiltered,
  } = useRestaurantApplications();

  return (
    <div className="space-y-6" data-testid="admin-restaurant-applications-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#ff6b00]/10 text-[#ff6b00]">
              <FileCheck2 className="size-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {APPLICATION_MESSAGES.PAGE_TITLE}
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">{APPLICATION_MESSAGES.PAGE_SUBTITLE}</p>
        </div>

        {pagination && typeof pagination.total === "number" && (
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs text-xs font-semibold text-slate-700">
            <span className="size-2 rounded-full bg-[#ff6b00]" />
            <span>
              Total: <strong>{pagination.total}</strong> applications
            </span>
          </div>
        )}
      </div>

      {/* Filter and Search Toolbar */}
      <RestaurantApplicationFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
        toDate={toDate}
        onToDateChange={setToDate}
        sortBy={sortBy as ApplicationSortByType}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onToggleSortOrder={toggleSortOrder}
        isFiltered={isFiltered}
        onResetFilters={resetFilters}
        disabled={isLoading}
      />

      {/* Main Table Card */}
      <Card className="border-slate-200/80 shadow-2xs overflow-hidden bg-white">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <LoadingIndicator variant="table-skeleton" theme="admin" />
            </div>
          ) : isError ? (
            <div
              role="alert"
              className="flex flex-col items-center justify-center py-16 px-4 text-center"
              data-testid="application-error-state"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4 shadow-2xs">
                <AlertCircle className="size-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {APPLICATION_MESSAGES.ERROR_TITLE}
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                {APPLICATION_MESSAGES.ERROR_DESCRIPTION}
              </p>
              <div className="mt-5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="rounded-xl border-slate-200 text-xs font-semibold hover:bg-slate-50 gap-2 cursor-pointer"
                >
                  <RefreshCw className="size-3.5" />
                  {APPLICATION_MESSAGES.RETRY_BUTTON}
                </Button>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <RestaurantEmptyState isFiltered={isFiltered} onClearFilters={resetFilters} />
          ) : (
            <RestaurantApplicationTable
              applications={applications}
              sortBy={sortBy as ApplicationSortByType}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          )}

          {/* Pagination Footer */}
          {!isLoading && !isError && applications.length > 0 && pagination && (
            <div className="border-t border-slate-200/80 bg-slate-50/40">
              <Pagination
                currentPage={page}
                totalPages={pagination.total_pages}
                totalItems={pagination.total}
                pageSize={limit}
                theme="admin"
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminRestaurantApplicationsPage;
