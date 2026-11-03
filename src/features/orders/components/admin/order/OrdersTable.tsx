import { Eye, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { Spinner } from "@/components/common/LoadingIndicator";
import { DataTablePagination } from "@/components/common/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate, formatTime } from "@/lib/utils/date";
import type { RestaurantOrderListItem } from "../../../types/restaurant-orders.types";
import { OrderStatusBadge } from "./OrderStatusBadge";

export interface OrdersTableProps {
  orders: RestaurantOrderListItem[];
  onQuickView?: (order: RestaurantOrderListItem) => void;
  onOrderClick?: (order: RestaurantOrderListItem) => void;
  currentPage?: number;
  totalPages?: number;
  totalOrders?: number;
  onPageChange?: (page: number) => void;
  onResetFilters?: () => void;
  isLoading?: boolean;
}

export function OrdersTable({
  orders,
  onQuickView,
  onOrderClick,
  currentPage = 1,
  totalPages = 1,
  totalOrders,
  onPageChange,
  onResetFilters,
  isLoading = false,
}: OrdersTableProps) {
  const navigate = useNavigate();
  const displayTotal = totalOrders ?? orders.length;

  const handleSelectOrder = (order: RestaurantOrderListItem) => {
    if (onOrderClick) {
      onOrderClick(order);
    } else if (onQuickView) {
      onQuickView(order);
    } else {
      navigate(RESTAURANT_ROUTES.ORDERS.DETAIL(order.orderId));
    }
  };

  return (
    <div className="rounded-2xl border border-[#eddcd4] bg-white shadow-2xs overflow-hidden">
      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto min-w-full">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#eddcd4] bg-[#faf7f5] text-xs font-bold uppercase tracking-wider text-neutral-500 select-none">
              <th scope="col" className="py-3.5 px-4 sm:px-6">
                Order Number
              </th>
              <th scope="col" className="py-3.5 px-4">
                Date / Time
              </th>
              <th scope="col" className="py-3.5 px-4">
                Items
              </th>
              <th scope="col" className="py-3.5 px-4">
                Total Amount
              </th>
              <th scope="col" className="py-3.5 px-4">
                Status
              </th>
              <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3e6de]">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Spinner size="lg" theme="brand" />
                    <p className="text-xs font-medium text-neutral-500">Loading orders...</p>
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 px-4 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="size-14 rounded-2xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#e8631b] mb-4 shadow-2xs">
                      <ShoppingBag className="size-7" />
                    </div>
                    <h3 className="text-base font-bold text-neutral-900">No orders found</h3>
                    <p className="mt-1 text-xs text-neutral-500">
                      There are currently no orders matching your selected filters. Try adjusting
                      your date range, status, or search query.
                    </p>
                    {onResetFilters && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onResetFilters}
                        className="mt-4 rounded-xl border-[#eddcd4] text-xs font-semibold hover:bg-[#faf7f5]"
                      >
                        Reset All Filters
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.orderId}
                  onClick={() => handleSelectOrder(order)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectOrder(order);
                    }
                  }}
                  tabIndex={0}
                  className="hover:bg-[#fef3ec]/40 focus:bg-[#fef3ec]/40 focus:outline-none cursor-pointer transition-colors group select-none"
                >
                  {/* Order Number & Table/Type */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#9a3412] transition-colors">
                          #{order.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                            order.orderType === "DINE_IN"
                              ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                              : order.orderType === "PRE_ORDER"
                                ? "bg-blue-50 text-blue-800 border border-blue-200/60"
                                : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                          }`}
                        >
                          {order.orderType === "DINE_IN"
                            ? `T-${order.tableNumber ?? "?"}`
                            : order.orderType === "PRE_ORDER"
                              ? "Pre-Order"
                              : "Takeaway"}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500 truncate max-w-[160px]">
                        {order.customerName ?? "Guest Customer"}
                      </span>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-neutral-900">
                        {formatDate(order.createdAt, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {formatTime(order.createdAt)}
                      </span>
                    </div>
                  </td>

                  {/* Items Summary */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col max-w-xs">
                      <span className="text-xs font-bold text-neutral-800">
                        {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                      </span>
                      <span
                        className="text-xs text-neutral-500 truncate"
                        title={order.itemsSummary ?? undefined}
                      >
                        {order.itemsSummary}
                      </span>
                    </div>
                  </td>

                  {/* Total Amount in INR */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="text-xs sm:text-sm font-bold text-neutral-900 font-mono">
                      {formatCurrency(order.grandTotal)}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.orderStatus} size="sm" />
                  </td>

                  {/* View Details Action */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectOrder(order);
                      }}
                      className="rounded-xl border border-[#eddcd4] bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:border-[#e8631b] hover:bg-[#fef3ec] hover:text-[#9a3412] shadow-2xs transition-all gap-1.5"
                    >
                      <Eye className="size-3.5 text-[#e8631b]" />
                      <span>View Details</span>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {orders.length > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={displayTotal}
          pageSize={10}
          onPageChange={onPageChange ?? (() => {})}
          disabled={!onPageChange}
          theme="restaurant"
        />
      )}
    </div>
  );
}
