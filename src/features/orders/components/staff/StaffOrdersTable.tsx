import { ChevronRight, Clock, Eye, Ticket, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { STAFF_ROUTES } from "@/app/router/staff/staff.routes.constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/date";
import {
  STAFF_ORDER_STATUS_CONFIG,
  STAFF_ORDER_TYPE_CONFIG,
} from "../../constants/staff-orders.constants";
import type { StaffOrderListItem } from "../../types/staff-orders.types";
import { StaffOrdersEmptyState } from "./StaffOrdersEmptyState";
import { StaffOrdersPagination } from "./StaffOrdersPagination";
import { StaffOrdersSkeleton } from "./StaffOrdersSkeleton";

interface StaffOrdersTableProps {
  orders: StaffOrderListItem[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
  onPageChange: (page: number) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export function StaffOrdersTable({
  orders,
  isLoading,
  currentPage,
  totalPages,
  totalOrders,
  limit,
  onPageChange,
  hasActiveFilters,
  onResetFilters,
}: StaffOrdersTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
        <StaffOrdersSkeleton rowCount={limit > 10 ? 8 : limit} />
      </div>
    );
  }

  if (orders.length === 0) {
    return <StaffOrdersEmptyState hasFilters={hasActiveFilters} onResetFilters={onResetFilters} />;
  }

  return (
    <div className="space-y-4">
      {/* Orders List Container */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs">
        <div className="divide-y divide-neutral-100">
          {orders.map((order) => {
            const statusConfig = STAFF_ORDER_STATUS_CONFIG[order.status];
            const typeConfig = STAFF_ORDER_TYPE_CONFIG[order.orderType];
            const totalItemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

            return (
              <Link
                key={order.id}
                to={STAFF_ROUTES.ORDER_DETAILS(order.id)}
                className="p-4 sm:p-5 transition-colors duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/80 group cursor-pointer block"
              >
                {/* Left Column: Order Number, Type, Queue, Status, Time */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Order Number */}
                    <span className="text-sm sm:text-base font-black tracking-tight text-neutral-900 group-hover:text-[#e8631b] transition-colors">
                      {order.orderNumber}
                    </span>

                    {/* Order Type Badge */}
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-bold border",
                        typeConfig?.badgeClass ?? "bg-neutral-50 text-neutral-600",
                      )}
                    >
                      {typeConfig?.label ?? order.orderType}
                    </Badge>

                    {/* Queue ID Tag (if QUEUE_PRO) */}
                    {order.queueId && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
                        <Ticket className="size-3 text-purple-600" />
                        <span>Queue #{order.queueId.slice(0, 8)}</span>
                      </span>
                    )}

                    {/* Status Badge */}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border",
                        statusConfig?.badgeClass ?? "bg-neutral-50 text-neutral-700",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          statusConfig?.dotClass ?? "bg-neutral-500",
                        )}
                      />
                      {statusConfig?.label ?? order.status}
                    </span>
                  </div>

                  {/* Items Summary Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Utensils className="size-3.5 text-neutral-400 shrink-0" />
                    {order.items.map((item, itemIdx) => (
                      <span
                        key={item.id ?? `${order.id}-item-${item.menuItemId}-${itemIdx}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-neutral-100/80 px-2 py-0.5 text-xs text-neutral-700 font-medium border border-neutral-200/50"
                      >
                        <span className="font-bold text-neutral-900">{item.quantity}x</span>
                        <span>{item.name}</span>
                        {item.variant?.name && (
                          <span className="text-[10px] text-neutral-500">
                            ({item.variant.name})
                          </span>
                        )}
                        {item.addons.length > 0 && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 rounded px-1">
                            +{item.addons.map((a) => a.name).join(", ")}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Column: Order Time, Item Count & View Details Button */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 border-t border-neutral-100 pt-2 md:border-t-0 md:pt-0">
                  <div className="flex items-center md:flex-col md:items-end justify-between md:justify-center gap-1 text-xs text-neutral-400 shrink-0">
                    <span className="flex items-center gap-1 text-neutral-500 font-medium">
                      <Clock className="size-3 text-neutral-400" />
                      {formatDate(order.createdAt)}
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-500">
                      {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-neutral-200 text-xs font-semibold text-neutral-700 group-hover:border-[#e8631b] group-hover:text-[#e8631b] group-hover:bg-[#fef3ec] gap-1.5 shrink-0 h-8 px-3 transition-colors"
                  >
                    <Eye className="size-3.5 text-neutral-400 group-hover:text-[#e8631b]" />
                    <span>View Details</span>
                    <ChevronRight className="size-3.5 text-neutral-300 group-hover:text-[#e8631b] group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pagination Controls */}
      <StaffOrdersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalOrders={totalOrders}
        limit={limit}
        onPageChange={onPageChange}
      />
    </div>
  );
}
