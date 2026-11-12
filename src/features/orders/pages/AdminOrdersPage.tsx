/**
 * Platform Admin Orders Page
 * Comprehensive order monitor, financial reporting, multi-filter search,
 * and lifecycle tracking for spotq-admin.
 */

import { AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils/cn";
import { AdminOrderDetailModal } from "../components/admin/order/AdminOrderDetailModal";
import {
  type AdminDatePreset,
  AdminOrdersFilters,
} from "../components/admin/order/AdminOrdersFilters";
import { AdminOrdersMetrics } from "../components/admin/order/AdminOrdersMetrics";
import { AdminOrdersTable } from "../components/admin/order/AdminOrdersTable";
import { ADMIN_ORDERS_DEFAULTS, ADMIN_ORDERS_MESSAGES } from "../constants/admin-orders.constants";
import { useAdminOrders } from "../hooks/use-admin-orders";
import type {
  AdminOrderFilterPaymentStatus,
  AdminOrderFilterStatus,
  AdminOrderListItem,
  AdminOrdersSortBy,
  AdminOrdersSortOrder,
} from "../types/admin-orders.types";

export default function AdminOrdersPage() {
  // ── State Management ──
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, ADMIN_ORDERS_DEFAULTS.SEARCH_DEBOUNCE_MS);

  const [statusFilter, setStatusFilter] = useState<AdminOrderFilterStatus>("ALL");
  const [paymentStatusFilter, setPaymentStatusFilter] =
    useState<AdminOrderFilterPaymentStatus>("ALL");
  const [datePreset, setDatePreset] = useState<AdminDatePreset>("ALL");

  const [sortBy, setSortBy] = useState<AdminOrdersSortBy>(ADMIN_ORDERS_DEFAULTS.SORT_BY);
  const [sortOrder, setSortOrder] = useState<AdminOrdersSortOrder>(
    ADMIN_ORDERS_DEFAULTS.SORT_ORDER,
  );
  const [currentPage, setCurrentPage] = useState<number>(ADMIN_ORDERS_DEFAULTS.PAGE);

  const [selectedOrder, setSelectedOrder] = useState<AdminOrderListItem | null>(null);

  // ── Compute Date Range Strings ──
  const dateParams = useMemo(() => {
    if (datePreset === "TODAY") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    }
    if (datePreset === "LAST_7_DAYS") {
      const start = new Date();
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    }
    if (datePreset === "LAST_30_DAYS") {
      const start = new Date();
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    }
    return {};
  }, [datePreset]);

  // ── TanStack Query Hook ──
  const { data, isLoading, isFetching, isError, error, refetch } = useAdminOrders({
    search: debouncedSearch.trim() || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    paymentStatus: paymentStatusFilter !== "ALL" ? paymentStatusFilter : undefined,
    startDate: dateParams.startDate,
    endDate: dateParams.endDate,
    sortBy,
    sortOrder,
    page: currentPage,
    limit: ADMIN_ORDERS_DEFAULTS.LIMIT,
  });

  // ── Filter & Sort Handlers ──
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(ADMIN_ORDERS_DEFAULTS.PAGE);
  }, []);

  const handleStatusChange = useCallback((status: AdminOrderFilterStatus) => {
    setStatusFilter(status);
    setCurrentPage(ADMIN_ORDERS_DEFAULTS.PAGE);
  }, []);

  const handlePaymentStatusChange = useCallback((status: AdminOrderFilterPaymentStatus) => {
    setPaymentStatusFilter(status);
    setCurrentPage(ADMIN_ORDERS_DEFAULTS.PAGE);
  }, []);

  const handleDatePresetChange = useCallback((preset: AdminDatePreset) => {
    setDatePreset(preset);
    setCurrentPage(ADMIN_ORDERS_DEFAULTS.PAGE);
  }, []);

  const handleSortChange = useCallback(
    (field: AdminOrdersSortBy) => {
      if (sortBy === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(field);
        setSortOrder("desc");
      }
      setCurrentPage(ADMIN_ORDERS_DEFAULTS.PAGE);
    },
    [sortBy],
  );

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setPaymentStatusFilter("ALL");
    setDatePreset("ALL");
    setSortBy(ADMIN_ORDERS_DEFAULTS.SORT_BY);
    setSortOrder(ADMIN_ORDERS_DEFAULTS.SORT_ORDER);
    setCurrentPage(ADMIN_ORDERS_DEFAULTS.PAGE);
  }, []);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== "ALL" ||
    paymentStatusFilter !== "ALL" ||
    datePreset !== "ALL" ||
    sortBy !== ADMIN_ORDERS_DEFAULTS.SORT_BY ||
    sortOrder !== ADMIN_ORDERS_DEFAULTS.SORT_ORDER;

  const orders = data?.orders ?? [];
  const pagination = data?.pagination ?? {
    currentPage: 1,
    limit: ADMIN_ORDERS_DEFAULTS.LIMIT,
    totalOrders: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  const metrics = data?.metrics ?? ADMIN_ORDERS_DEFAULTS.INITIAL_METRICS;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10" data-testid="admin-orders-page">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#0052cc]">
              Console Operations
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#0052cc] border border-blue-100">
              <ShoppingBag className="size-3" />
              Platform Orders
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {ADMIN_ORDERS_MESSAGES.PAGE_TITLE}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {ADMIN_ORDERS_MESSAGES.PAGE_SUBTITLE}
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
            title={ADMIN_ORDERS_MESSAGES.REFRESH_TITLE}
            className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs gap-1.5 h-9"
          >
            <RefreshCw className={cn("size-3.5 text-[#0052cc]", isFetching && "animate-spin")} />
            <span className="text-xs font-semibold">Refresh</span>
          </Button>
        </div>
      </div>

      {/* ── Metrics Cards Section ── */}
      <AdminOrdersMetrics metrics={metrics} />

      {/* ── Filters Toolbar ── */}
      <AdminOrdersFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        paymentStatusFilter={paymentStatusFilter}
        onPaymentStatusChange={handlePaymentStatusChange}
        datePreset={datePreset}
        onDatePresetChange={handleDatePresetChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        disabled={isLoading}
      />

      {/* ── Error State Banner ── */}
      {isError && !isLoading && (
        <div
          data-testid="admin-orders-error-state"
          className="flex flex-col sm:flex-row items-center justify-between rounded-2xl bg-rose-50 border border-rose-200/80 p-4 sm:p-5 gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 shrink-0">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900">
                {ADMIN_ORDERS_MESSAGES.FETCH_ERROR_TITLE}
              </h3>
              <p className="text-xs text-rose-700 mt-0.5">
                {error instanceof Error ? error.message : ADMIN_ORDERS_MESSAGES.FETCH_ERROR_DESC}
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            variant="outline"
            size="sm"
            className="rounded-xl border-rose-200 bg-white text-rose-700 hover:bg-rose-50 text-xs font-semibold shrink-0 gap-1.5"
          >
            <RefreshCw className={cn("size-3.5 text-rose-600", isFetching && "animate-spin")} />
            <span>{ADMIN_ORDERS_MESSAGES.TRY_AGAIN}</span>
          </Button>
        </div>
      )}

      {/* ── Listing Table & Pagination ── */}
      <AdminOrdersTable
        orders={orders}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        totalOrders={pagination.totalOrders}
        limit={pagination.limit}
        onPageChange={setCurrentPage}
        onOrderClick={setSelectedOrder}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleClearFilters}
      />

      {/* ── Order Detail Modal ── */}
      <AdminOrderDetailModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
