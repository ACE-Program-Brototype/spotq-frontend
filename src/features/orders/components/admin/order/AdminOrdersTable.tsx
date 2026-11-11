/**
 * Platform Admin Orders Table Component
 * Displays system-wide orders with sorting, copyable IDs, financial breakdowns,
 * responsive mobile view, and drawer/modal trigger.
 */

import { ArrowDown, ArrowUp, ArrowUpDown, Check, Copy, Eye, User } from "lucide-react";
import { useState } from "react";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import type {
  AdminOrderListItem,
  AdminOrdersSortBy,
  AdminOrdersSortOrder,
} from "@/features/orders/types/admin-orders.types";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { AdminOrdersEmptyState } from "./AdminOrdersEmptyState";
import { AdminOrdersSkeleton } from "./AdminOrdersSkeleton";
import { AdminPaymentStatusBadge } from "./AdminPaymentStatusBadge";
import { OrderStatusBadge } from "./OrderStatusBadge";

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

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderSortIcon = (field: AdminOrdersSortBy) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="size-3 text-slate-400 group-hover:text-slate-600" />;
    }
    return sortOrder === "asc" ? (
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
      {/* ── Desktop & Tablet Table ── */}
      <div className="hidden md:block rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/60 text-slate-500 uppercase tracking-wider font-semibold select-none">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Restaurant</th>
                <th className="py-3.5 px-4">Customer</th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors group"
                  onClick={() => onSortChange("status")}
                  title="Sort by Status"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Order Status</span>
                    {renderSortIcon("status")}
                  </div>
                </th>
                <th className="py-3.5 px-4">Payment</th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors group"
                  onClick={() => onSortChange("totalAmount")}
                  title="Sort by Total Amount"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Amount</span>
                    {renderSortIcon("totalAmount")}
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors group"
                  onClick={() => onSortChange("createdAt")}
                  title="Sort by Date Created"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Date</span>
                    {renderSortIcon("createdAt")}
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Action</th>
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
                          title="Copy order number"
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
                        {order.restaurantName || "SpotQ Restaurant"}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                        <User className="size-3.5 text-slate-400" />
                        <span>{order.customerId ? "Customer" : "Guest"}</span>
                      </span>
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
                        title="Platform fee assessed"
                      >
                        Fee: {formatCurrency(order.platformFeeAssessed)}
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
                        title="View order breakdown"
                        aria-label={`View order ${order.orderNumber}`}
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

      {/* ── Mobile Cards View (< md) ── */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => {
          return (
            <div
              key={order.orderId}
              className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3"
            >
              {/* Card Header: Order # + Created Date */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-sm font-bold text-slate-900">
                    #{order.orderNumber}
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {order.restaurantName || "SpotQ Restaurant"}
                  </p>
                </div>
                <span className="text-xs text-slate-400">{formatDate(order.createdAt)}</span>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <OrderStatusBadge status={order.status} size="sm" />
                <AdminPaymentStatusBadge status={order.paymentStatus} size="sm" />
              </div>

              {/* Financials */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Total
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Platform Fee
                  </span>
                  <span className="font-bold text-[#0052cc]">
                    {formatCurrency(order.platformFeeAssessed)}
                  </span>
                </div>
              </div>

              {/* Mobile Card Action */}
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOrderClick(order)}
                  className="rounded-xl border-slate-200 text-xs font-semibold gap-1.5 h-8 text-[#0052cc]"
                >
                  <Eye className="size-3.5" />
                  <span>View Details</span>
                </Button>
              </div>
            </div>
          );
        })}

        {/* Mobile Pagination */}
        <div className="pt-2">
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
    </div>
  );
}
