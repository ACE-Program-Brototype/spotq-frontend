/**
 * Staff Orders Listing Page
 * Dedicated operational order terminal for restaurant staff.
 * Supports status filtering, search by order number, order type filtering, and FIFO ordering.
 */

import { RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils/cn";
import { StaffOrdersFilters } from "../components/staff/StaffOrdersFilters";
import { StaffOrdersTable } from "../components/staff/StaffOrdersTable";
import { STAFF_ORDERS_DEFAULTS } from "../constants/staff-orders.constants";
import { useStaffOrders } from "../hooks/use-staff-orders";
import type { StaffOrderFilterStatus, StaffOrderSortOrder } from "../types/staff-orders.types";

export default function StaffOrdersPage() {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";

  // Filter toolbar state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, STAFF_ORDERS_DEFAULTS.SEARCH_DEBOUNCE_MS);

  const [statusFilter, setStatusFilter] = useState<StaffOrderFilterStatus>("ALL");
  const [sortOrder, setSortOrder] = useState<StaffOrderSortOrder>(STAFF_ORDERS_DEFAULTS.SORT_ORDER);
  const [currentPage, setCurrentPage] = useState<number>(STAFF_ORDERS_DEFAULTS.PAGE);

  // TanStack Query hook
  const { data, isLoading, isFetching, refetch } = useStaffOrders(restaurantId, {
    search: debouncedSearch.trim() || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
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
    setStatusFilter("ALL");
    setSortOrder(STAFF_ORDERS_DEFAULTS.SORT_ORDER);
    setCurrentPage(STAFF_ORDERS_DEFAULTS.PAGE);
  }, []);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== "ALL" ||
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
            disabled={isFetching}
            title="Refresh orders feed"
            className="rounded-xl border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 shadow-2xs gap-1.5 h-9"
          >
            <RefreshCw className={cn("size-3.5 text-[#e8631b]", isFetching && "animate-spin")} />
            <span className="text-xs font-semibold">Refresh</span>
          </Button>
        </div>
      </div>

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

      {/* Orders Table */}
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
    </div>
  );
}
