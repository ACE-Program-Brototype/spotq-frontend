import { RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils/cn";
import { OrdersFilters } from "../components/admin/order/OrdersFilters";
import { OrdersOverview } from "../components/admin/order/OrdersOverview";
import { OrdersTable } from "../components/admin/order/OrdersTable";
import { RESTAURANT_ORDERS_DEFAULTS } from "../constants/restaurant-orders.constants";
import { useRestaurantOrders } from "../hooks/use-restaurant-orders";
import { useRestaurantOrdersOverview } from "../hooks/use-restaurant-orders-overview";
import type {
  OrderDateRangeFilter,
  RestaurantOrderFilterStatus,
  RestaurantOrderListItem,
  RestaurantOrderSortBy,
  RestaurantOrderSortOrder,
} from "../types/restaurant-orders.types";

export default function RestaurantOrdersPage() {
  const navigate = useNavigate();
  const restaurantId = useAuthStore((state) => state.user?.restaurantId || "");

  // Filter toolbar UI interaction state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(
    searchQuery,
    RESTAURANT_ORDERS_DEFAULTS.SEARCH_DEBOUNCE_MS,
  );
  const [statusFilter, setStatusFilter] = useState<RestaurantOrderFilterStatus>("ALL");
  const [dateRange, setDateRange] = useState<OrderDateRangeFilter>("TODAY");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<RestaurantOrderSortBy>(
    RESTAURANT_ORDERS_DEFAULTS.DEFAULT_SORT_BY,
  );
  const [sortOrder, setSortOrder] = useState<RestaurantOrderSortOrder>(
    RESTAURANT_ORDERS_DEFAULTS.DEFAULT_SORT_ORDER,
  );

  // Compute date range ISO strings for query
  const dateParams = useMemo(() => {
    if (dateRange === "TODAY") {
      const from = new Date();
      from.setHours(0, 0, 0, 0);
      const to = new Date();
      to.setHours(23, 59, 59, 999);
      return { from: from.toISOString(), to: to.toISOString() };
    }
    if (dateRange === "LAST_7_DAYS") {
      const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      from.setHours(0, 0, 0, 0);
      const to = new Date();
      to.setHours(23, 59, 59, 999);
      return { from: from.toISOString(), to: to.toISOString() };
    }
    return {};
  }, [dateRange]);

  // 1. Fetch Overview Metrics
  const {
    data: metricsData,
    isLoading: isOverviewLoading,
    refetch: refetchOverview,
  } = useRestaurantOrdersOverview(restaurantId, dateParams);

  // 2. Fetch Orders List
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isFetching: isOrdersFetching,
    refetch: refetchOrders,
  } = useRestaurantOrders(restaurantId, {
    page: currentPage,
    limit: RESTAURANT_ORDERS_DEFAULTS.LIMIT,
    search: debouncedSearchQuery,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    from: dateParams.from,
    to: dateParams.to,
    sortBy,
    sortOrder,
  });

  const handleRefresh = () => {
    refetchOverview();
    refetchOrders();
  };

  // Navigate to dedicated order details page
  const handleOpenOrderDetails = (order: RestaurantOrderListItem) => {
    navigate(RESTAURANT_ROUTES.ORDERS.DETAIL(order.orderId));
  };

  const handleSortChange = (field: RestaurantOrderSortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(RESTAURANT_ORDERS_DEFAULTS.PAGE);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(RESTAURANT_ORDERS_DEFAULTS.PAGE);
  };

  const handleStatusChange = (status: RestaurantOrderFilterStatus) => {
    setStatusFilter(status);
    setCurrentPage(RESTAURANT_ORDERS_DEFAULTS.PAGE);
  };

  const handleDateRangeChange = (range: OrderDateRangeFilter) => {
    setDateRange(range);
    setCurrentPage(RESTAURANT_ORDERS_DEFAULTS.PAGE);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setDateRange("TODAY");
    setSortBy(RESTAURANT_ORDERS_DEFAULTS.DEFAULT_SORT_BY);
    setSortOrder(RESTAURANT_ORDERS_DEFAULTS.DEFAULT_SORT_ORDER);
    setCurrentPage(RESTAURANT_ORDERS_DEFAULTS.PAGE);
  };

  const metrics = metricsData ?? RESTAURANT_ORDERS_DEFAULTS.INITIAL_METRICS;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* A. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
              Order Management
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3ec] px-2 py-0.5 text-[10px] font-bold text-[#9a3412] border border-[#fae2d3]">
              <span className="size-1.5 rounded-full bg-[#e8631b] animate-pulse" />
              Live Orders
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Orders
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Manage and monitor restaurant orders.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isOrdersFetching || isOverviewLoading}
            title="Refresh order list"
            className="rounded-xl border-[#eddcd4] bg-white text-neutral-700 hover:bg-[#faf7f5] shadow-2xs gap-1.5 h-9"
          >
            <RefreshCw
              className={cn(
                "size-3.5 text-[#e8631b]",
                (isOrdersFetching || isOverviewLoading) && "animate-spin",
              )}
            />
            <span className="text-xs font-semibold">Refresh</span>
          </Button>
        </div>
      </div>

      {/* B. Overview Metric Cards */}
      <OrdersOverview metrics={metrics} />

      {/* C. Filters and Search Section */}
      <OrdersFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onClearFilters={handleClearFilters}
      />

      {/* D. Orders Listing Table */}
      <OrdersTable
        orders={ordersData?.orders ?? []}
        isLoading={isOrdersLoading}
        onOrderClick={handleOpenOrderDetails}
        currentPage={currentPage}
        totalPages={ordersData?.totalPages ?? 1}
        totalOrders={ordersData?.totalOrders ?? 0}
        onPageChange={setCurrentPage}
        onResetFilters={handleClearFilters}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
    </div>
  );
}
