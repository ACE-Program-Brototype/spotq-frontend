import { AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/router/routes.constants";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SubscriberFilters } from "../components/SubscriberFilters";
import { SubscriberTable } from "../components/SubscriberTable";
import { SubscriberTableSkeleton } from "../components/SubscriberTableSkeleton";
import { SUBSCRIBER_MESSAGES } from "../constants/subscriber.constants";
import { useSubscribers } from "../hooks/use-subscribers";
import type { SubscriberSummary } from "../types/subscriber.types";

export function AdminSubscribersPage() {
  const {
    subscribers,
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
    sortOrder,
    toggleSortOrder,
    resetFilters,
    isFiltered,
  } = useSubscribers();

  const navigate = useNavigate();

  const handleViewDetails = (subscriber: SubscriberSummary) => {
    navigate(ADMIN_ROUTES.SUBSCRIBER_DETAIL(subscriber.id));
  };

  return (
    <div className="space-y-6" data-testid="admin-subscribers-page">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {SUBSCRIBER_MESSAGES.PAGE_TITLE}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{SUBSCRIBER_MESSAGES.PAGE_SUBTITLE}</p>
      </div>

      {/* Filter and Search Bar */}
      <SubscriberFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sortOrder={sortOrder}
        onToggleSort={toggleSortOrder}
        onClearFilters={resetFilters}
        isFiltered={isFiltered}
        disabled={isLoading}
      />

      {/* Main Content Area */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          {isLoading ? (
            <SubscriberTableSkeleton rowCount={limit} />
          ) : isError ? (
            <div
              className="flex flex-col items-center justify-center p-12 text-center"
              data-testid="subscriber-error-state"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4">
                <AlertCircle className="size-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {SUBSCRIBER_MESSAGES.ERROR_TITLE}
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                {SUBSCRIBER_MESSAGES.ERROR_DESCRIPTION}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-4 gap-2 rounded-xl"
                data-testid="subscriber-list-retry-btn"
              >
                <RefreshCw className="size-3.5" />
                {SUBSCRIBER_MESSAGES.RETRY_BUTTON}
              </Button>
            </div>
          ) : (
            <SubscriberTable
              subscribers={subscribers}
              onViewDetails={handleViewDetails}
              isFiltered={isFiltered}
              onResetFilters={resetFilters}
            />
          )}

          {/* Pagination Footer */}
          {!isLoading && !isError && subscribers.length > 0 && pagination && (
            <div className="border-t border-slate-200/80">
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
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

export default AdminSubscribersPage;
