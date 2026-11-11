/**
 * Staff Orders Listing Page
 * Dedicated operational order terminal for restaurant staff.
 * Supports status filtering, search by order number, order type filtering, and FIFO ordering.
 */

import { AlertCircle, RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { StaffOrdersFilters } from "@/features/orders/components/staff/StaffOrdersFilters";
import { StaffOrdersTable } from "@/features/orders/components/staff/StaffOrdersTable";
import {
  STAFF_ORDER_FILTER_STATUS,
  STAFF_ORDERS_DEFAULTS,
  STAFF_ORDERS_MESSAGES,
} from "@/features/orders/constants/staff-orders.constants";
import { useStaffOrders } from "@/features/orders/hooks/use-staff-orders";
import type {
  StaffOrderFilterStatus,
  StaffOrderSortOrder,
} from "@/features/orders/types/staff-orders.types";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils/cn";

export default function StaffOrdersPage() {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";

  // Filter toolbar state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, STAFF_ORDERS_DEFAULTS.SEARCH_DEBOUNCE_MS);

  const [statusFilter, setStatusFilter] = useState<StaffOrderFilterStatus>(
    STAFF_ORDER_FILTER_STATUS.ALL,
  );
  const [sortOrder, setSortOrder] = useState<StaffOrderSortOrder>(STAFF_ORDERS_DEFAULTS.SORT_ORDER);
  const [currentPage, setCurrentPage] = useState<number>(STAFF_ORDERS_DEFAULTS.PAGE);

  // TanStack Query hook
  const { data, isLoading, isFetching, isError, error, refetch } = useStaffOrders(restaurantId, {
    search: debouncedSearch.trim() || undefined,
    status: statusFilter !== STAFF_ORDER_FILTER_STATUS.ALL ? statusFilter : undefined,
    sortOrder,
    page: currentPage,
    limit: STAFF_ORDERS_DEFAULTS.LIMIT,
  });

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(STAFF_ORDERS_DEFAULTS.PAGE);
  }, []);

  const handleStatusChange = useCallback((status: StaffOrderFilterStatus) => {
    setStatusFilter(status);
    setCurrentPage(STAFF_ORDERS_DEFAULTS.PAGE);
  }, []);

  const handleToggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(STAFF_ORDERS_DEFAULTS.PAGE);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter(STAFF_ORDER_FILTER_STATUS.ALL);
    setSortOrder(STAFF_ORDERS_DEFAULTS.SORT_ORDER);
    setCurrentPage(STAFF_ORDERS_DEFAULTS.PAGE);
  }, []);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== STAFF_ORDER_FILTER_STATUS.ALL ||
    sortOrder !== STAFF_ORDERS_DEFAULTS.SORT_ORDER;

  const orders = data?.orders ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: STAFF_ORDERS_DEFAULTS.LIMIT,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#e8631b]">
              Kitchen & Service Terminal
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Orders Feed
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
            Staff Orders
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Monitor incoming restaurant orders and coordinate preparation in FIFO sequence.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={!restaurantId || isFetching}
            title="Refresh orders feed"
            className="rounded-xl border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 shadow-2xs gap-1.5 h-9"
          >
            <RefreshCw className={cn("size-3.5 text-[#e8631b]", isFetching && "animate-spin")} />
            <span className="text-xs font-semibold">Refresh</span>
          </Button>
        </div>
      </div>

      {!restaurantId ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-neutral-200 shadow-xs">
          <div className="size-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 shadow-xs">
            <AlertCircle className="size-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            {STAFF_ORDERS_MESSAGES.NO_RESTAURANT_TITLE}
          </h3>
          <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-neutral-500">
            {STAFF_ORDERS_MESSAGES.NO_RESTAURANT_DESC}
          </p>
        </div>
      ) : (
        <>
          {/* Filters Toolbar */}
          <StaffOrdersFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            sortOrder={sortOrder}
            onToggleSortOrder={handleToggleSortOrder}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Orders Table or Error State */}
          {isError && !isLoading ? (
            <div
              data-testid="staff-orders-error-state"
              className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 sm:p-12 text-center border border-red-100 shadow-xs gap-4"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
                <AlertCircle className="size-7" />
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                  {STAFF_ORDERS_MESSAGES.FETCH_ERROR_TITLE}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500">
                  {error instanceof Error ? error.message : STAFF_ORDERS_MESSAGES.FETCH_FAILED}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                variant="outline"
                className="rounded-xl border-neutral-200 text-xs font-semibold hover:bg-neutral-50 gap-1.5"
              >
                <RefreshCw
                  className={cn("size-3.5 text-[#e8631b]", isFetching && "animate-spin")}
                />
                Try again
              </Button>
            </div>
          ) : (
            <StaffOrdersTable
              orders={orders}
              isLoading={isLoading}
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalOrders={pagination.total}
              limit={pagination.limit}
              onPageChange={setCurrentPage}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handleClearFilters}
            />
          )}
        </>
      )}
    </div>
  );
}
