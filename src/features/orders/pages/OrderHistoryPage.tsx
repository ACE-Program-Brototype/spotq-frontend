/**
 * OrderHistoryPage Component
 * Main Customer Order History screen featuring rich status badges,
 * segmented filter bar, balanced responsive grid, and pagination controls.
 */

import { AlertCircle, Receipt, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerSidebar } from "@/features/profile/components/CustomerSidebar";
import { useCustomerProfile } from "@/features/profile/hooks/use-customer-profile";
import { OrderCard } from "../components/OrderCard";
import { OrderFilterChips } from "../components/OrderFilterChips";
import { OrderHistoryEmptyState } from "../components/OrderHistoryEmptyState";
import { OrderHistorySkeleton } from "../components/OrderHistorySkeleton";
import { OrderPagination } from "../components/OrderPagination";
import { ORDER_FILTER_STATUS, ORDER_MESSAGES } from "../constants/orders.constants";
import { useOrderHistory } from "../hooks/use-order-history";

export function OrderHistoryPage() {
  const { data: profile } = useCustomerProfile();

  const {
    orders,
    pagination,
    setPage,
    status,
    setStatus,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useOrderHistory();

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col lg:flex-row gap-8 items-start">
        {/* Customer Sidebar Navigation */}
        <CustomerSidebar profile={profile} />

        {/* Main Orders Content Area */}
        <div className="flex flex-1 w-full flex-col gap-6 min-w-0">
          {/* Header & Filter Section */}
          <div className="flex flex-col gap-4 pb-3 border-b border-neutral-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
                    {ORDER_MESSAGES.PAGE_TITLE}
                  </h1>
                  {pagination.total_orders > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fef3ec] text-[#e8631b] border border-[#fbd3b7] text-xs font-bold">
                      <Receipt className="size-3" />
                      <span>{pagination.total_orders}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium text-neutral-500">
                  {ORDER_MESSAGES.PAGE_SUBTITLE}
                </p>
              </div>
            </div>

            {/* Segmented Status Filter Chips */}
            <OrderFilterChips selectedStatus={status} onSelect={setStatus} disabled={isFetching} />
          </div>

          {/* Conditional View: Loading, Error, Empty, or Orders Grid */}
          {isLoading ? (
            <OrderHistorySkeleton />
          ) : isError ? (
            <div
              data-testid="order-history-error-state"
              className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 sm:p-12 text-center border border-red-100 shadow-xs gap-4"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
                <AlertCircle className="size-7" />
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <h3 className="text-lg font-bold text-neutral-900">
                  {ORDER_MESSAGES.FETCH_ERROR_TITLE}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500">
                  {error?.message || ORDER_MESSAGES.FETCH_ERROR_DESCRIPTION}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold px-5 py-2.5 gap-2"
              >
                <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
                <span>{isFetching ? ORDER_MESSAGES.RETRYING : ORDER_MESSAGES.RETRY}</span>
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <OrderHistoryEmptyState
              statusFilter={status}
              onClearFilter={() => setStatus(ORDER_FILTER_STATUS.ALL)}
            />
          ) : (
            <div className="flex flex-col gap-5">
              {/* Responsive Grid of Order Cards */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {orders.map((order) => (
                  <OrderCard key={order.order_id} order={order} />
                ))}
              </div>

              {/* Seamless Pagination Controls */}
              <OrderPagination
                pagination={pagination}
                onPageChange={setPage}
                disabled={isFetching}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderHistoryPage;
