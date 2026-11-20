import { Eye } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import {
  ADMIN_ORDERS_FILTER_LABELS,
  ADMIN_ORDERS_PAGE_SIZE_OPTIONS,
  ADMIN_ORDERS_TABLE_LABELS,
} from "@/features/orders/constants/admin-orders.constants";
import type { AdminOrderListItem } from "@/features/orders/types/admin-orders.types";
import { AdminPaymentStatusBadge } from "@/features/orders/components/admin/order/AdminPaymentStatusBadge";
import { OrderStatusBadge } from "@/features/orders/components/admin/order/OrderStatusBadge";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";

interface AdminOrdersMobileListProps {
  orders: AdminOrderListItem[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onOrderClick: (order: AdminOrderListItem) => void;
}

export function AdminOrdersMobileList({
  orders,
  currentPage,
  totalPages,
  totalOrders,
  limit,
  onPageChange,
  onLimitChange,
  onOrderClick,
}: AdminOrdersMobileListProps) {
  return (
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
                  {order.restaurantName || ADMIN_ORDERS_TABLE_LABELS.DEFAULT_RESTAURANT_NAME}
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
                  {ADMIN_ORDERS_TABLE_LABELS.TOTAL}
                </span>
                <span className="text-sm font-black text-slate-900">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {ADMIN_ORDERS_TABLE_LABELS.PLATFORM_FEE}
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
                <span>{ADMIN_ORDERS_TABLE_LABELS.VIEW_DETAILS}</span>
              </Button>
            </div>
          </div>
        );
      })}

      {/* Mobile Pagination */}
      <div className="pt-2 flex flex-col gap-2">
        {onLimitChange && (
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>{ADMIN_ORDERS_FILTER_LABELS.ROWS_PER_PAGE}</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              aria-label={ADMIN_ORDERS_FILTER_LABELS.ROWS_PER_PAGE}
              className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700"
            >
              {ADMIN_ORDERS_PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
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
  );
}
