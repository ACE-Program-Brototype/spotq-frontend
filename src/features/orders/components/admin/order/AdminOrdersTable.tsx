/**
 * Platform Admin Orders Table Component
 * Displays system-wide orders with sorting, copyable IDs, financial breakdowns,
 * responsive mobile view, and drawer/modal trigger.
 */

import { ArrowDown, ArrowUp, ArrowUpDown, Check, Copy, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import {
  ADMIN_ORDERS_MESSAGES,
  ADMIN_ORDERS_SORT_BY,
  ADMIN_ORDERS_SORT_ORDER,
  ADMIN_ORDERS_TABLE_COLUMNS,
  ADMIN_ORDERS_TABLE_LABELS,
  ARIA_SORT_VALUES,
} from "@/features/orders/constants/admin-orders.constants";
import type {
  AdminOrderListItem,
  AdminOrdersSortBy,
  AdminOrdersSortOrder,
} from "@/features/orders/types/admin-orders.types";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { AdminOrdersEmptyState } from "@/features/orders/components/admin/order/AdminOrdersEmptyState";
import { AdminOrdersMobileList } from "@/features/orders/components/admin/order/AdminOrdersMobileList";
import { AdminOrdersSkeleton } from "@/features/orders/components/admin/order/AdminOrdersSkeleton";
import { AdminPaymentStatusBadge } from "@/features/orders/components/admin/order/AdminPaymentStatusBadge";
import { OrderStatusBadge } from "@/features/orders/components/admin/order/OrderStatusBadge";

interface AdminOrdersTableProps {
  orders: AdminOrderListItem[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
  onPageChange: (page: number) => void;
  onOrderClick: (order: AdminOrderListItem) => void;
  sortBy: AdminOrdersSortBy;
  sortOrder: AdminOrdersSortOrder;
  onSortChange: (field: AdminOrdersSortBy) => void;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
}

export function AdminOrdersTable({
  orders,
  isLoading,
  currentPage,
  totalPages,
  totalOrders,
  limit,
  onPageChange,
  onOrderClick,
  sortBy,
  sortOrder,
  onSortChange,
  hasActiveFilters = false,
  onResetFilters,
}: AdminOrdersTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch {
      toast.error(ADMIN_ORDERS_MESSAGES.COPY_FAILED);
    }
  };

  const renderSortIcon = (field: AdminOrdersSortBy) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="size-3 text-slate-400 group-hover:text-slate-600" />;
    }
    return sortOrder === ADMIN_ORDERS_SORT_ORDER.ASC ? (
      <ArrowUp className="size-3 text-[#0052cc]" />
    ) : (
      <ArrowDown className="size-3 text-[#0052cc]" />
    );
  };

  if (isLoading) {
    return <AdminOrdersSkeleton />;
  }

  if (orders.length === 0) {
    return (
      <AdminOrdersEmptyState hasActiveFilters={hasActiveFilters} onResetFilters={onResetFilters} />
    );
  }

  return (
    <div className="space-y-4" data-testid="admin-orders-table-container">
      {/* Desktop & Tablet Table */}
      <div className="hidden md:block rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/60 text-slate-500 uppercase tracking-wider font-semibold select-none">
                <th className="py-3.5 px-4">{ADMIN_ORDERS_TABLE_COLUMNS.ORDER}</th>
                <th className="py-3.5 px-4">{ADMIN_ORDERS_TABLE_COLUMNS.RESTAURANT}</th>
                <th
                  className="py-3.5 px-4"
                  aria-sort={
                    sortBy === ADMIN_ORDERS_SORT_BY.STATUS
                      ? sortOrder === ADMIN_ORDERS_SORT_ORDER.ASC
                        ? ARIA_SORT_VALUES.ASCENDING
                        : ARIA_SORT_VALUES.DESCENDING
                      : ARIA_SORT_VALUES.NONE
                  }
                >
                  <button
                    type="button"
                    onClick={() => onSortChange(ADMIN_ORDERS_SORT_BY.STATUS)}
                    className="flex items-center gap-1.5 uppercase tracking-wider font-semibold hover:text-slate-800 transition-colors cursor-pointer group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0052cc] rounded-xs"
                    title={ADMIN_ORDERS_TABLE_LABELS.SORT_BY_STATUS}
                  >
                    <span>{ADMIN_ORDERS_TABLE_COLUMNS.STATUS}</span>
                    {renderSortIcon(ADMIN_ORDERS_SORT_BY.STATUS)}
                  </button>
                </th>
                <th className="py-3.5 px-4">{ADMIN_ORDERS_TABLE_COLUMNS.PAYMENT}</th>
                <th
                  className="py-3.5 px-4"
                  aria-sort={
                    sortBy === ADMIN_ORDERS_SORT_BY.TOTAL_AMOUNT
                      ? sortOrder === ADMIN_ORDERS_SORT_ORDER.ASC
                        ? ARIA_SORT_VALUES.ASCENDING
                        : ARIA_SORT_VALUES.DESCENDING
                      : ARIA_SORT_VALUES.NONE
                  }
                >
                  <button
                    type="button"
                    onClick={() => onSortChange(ADMIN_ORDERS_SORT_BY.TOTAL_AMOUNT)}
                    className="flex items-center gap-1.5 uppercase tracking-wider font-semibold hover:text-slate-800 transition-colors cursor-pointer group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0052cc] rounded-xs"
                    title={ADMIN_ORDERS_TABLE_LABELS.SORT_BY_TOTAL_AMOUNT}
                  >
                    <span>{ADMIN_ORDERS_TABLE_COLUMNS.AMOUNT}</span>
                    {renderSortIcon(ADMIN_ORDERS_SORT_BY.TOTAL_AMOUNT)}
                  </button>
                </th>
                <th
                  className="py-3.5 px-4"
                  aria-sort={
                    sortBy === ADMIN_ORDERS_SORT_BY.CREATED_AT
                      ? sortOrder === ADMIN_ORDERS_SORT_ORDER.ASC
                        ? ARIA_SORT_VALUES.ASCENDING
                        : ARIA_SORT_VALUES.DESCENDING
                      : ARIA_SORT_VALUES.NONE
                  }
                >
                  <button
                    type="button"
                    onClick={() => onSortChange(ADMIN_ORDERS_SORT_BY.CREATED_AT)}
                    className="flex items-center gap-1.5 uppercase tracking-wider font-semibold hover:text-slate-800 transition-colors cursor-pointer group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0052cc] rounded-xs"
                    title={ADMIN_ORDERS_TABLE_LABELS.SORT_BY_DATE}
                  >
                    <span>{ADMIN_ORDERS_TABLE_COLUMNS.DATE}</span>
                    {renderSortIcon(ADMIN_ORDERS_SORT_BY.CREATED_AT)}
                  </button>
                </th>
                <th className="py-3.5 px-4 text-right">{ADMIN_ORDERS_TABLE_COLUMNS.ACTION}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                return (
                  <tr
                    key={order.orderId}
                    onClick={() => onOrderClick(order)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    data-testid={`admin-order-row-${order.orderId}`}
                  >
                    {/* Order # */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900 group-hover:text-[#0052cc] transition-colors">
                          #{order.orderNumber}
                        </span>
                        <button
                          type="button"
                          onClick={(e) =>
                            handleCopy(e, order.orderNumber, `orderNum-${order.orderId}`)
                          }
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-opacity"
                          title={ADMIN_ORDERS_TABLE_LABELS.COPY_ORDER_NUMBER}
                        >
                          {copiedId === `orderNum-${order.orderId}` ? (
                            <Check className="size-3 text-emerald-600" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Restaurant */}
                    <td className="py-3.5 px-4">
                      <p
                        className="font-semibold text-slate-900 truncate max-w-[180px]"
                        title={order.restaurantName ?? ""}
                      >
                        {order.restaurantName || ADMIN_ORDERS_TABLE_LABELS.DEFAULT_RESTAURANT_NAME}
                      </p>
                    </td>

                    {/* Order Status */}
                    <td className="py-3.5 px-4">
                      <OrderStatusBadge status={order.status} size="sm" />
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-4">
                      <AdminPaymentStatusBadge status={order.paymentStatus} size="sm" />
                    </td>

                    {/* Pricing / Total Amount */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">
                        {formatCurrency(order.totalAmount)}
                      </span>
                      <span
                        className="text-[10px] text-slate-400 block"
                        title={ADMIN_ORDERS_TABLE_LABELS.PLATFORM_FEE_ASSESSED}
                      >
                        {ADMIN_ORDERS_TABLE_LABELS.FEE_PREFIX} {formatCurrency(order.platformFeeAssessed)}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOrderClick(order);
                        }}
                        className="rounded-lg text-slate-400 hover:text-[#0052cc] hover:bg-blue-50"
                        title={ADMIN_ORDERS_TABLE_LABELS.VIEW_ORDER_BREAKDOWN}
                        aria-label={ADMIN_ORDERS_TABLE_LABELS.VIEW_ORDER_ARIA(order.orderNumber)}
                      >
                        <Eye className="size-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination */}
        <div className="border-t border-slate-100 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalOrders}
            pageSize={limit}
            onPageChange={onPageChange}
            theme="admin"
          />
        </div>
      </div>

      {/* Mobile Cards View */}
      <AdminOrdersMobileList
        orders={orders}
        currentPage={currentPage}
        totalPages={totalPages}
        totalOrders={totalOrders}
        limit={limit}
        onPageChange={onPageChange}
        onOrderClick={onOrderClick}
      />
    </div>
  );
}
