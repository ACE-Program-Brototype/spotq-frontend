/**
 * Staff Order Details Page
 * Dedicated operational order inspection terminal for kitchen staff and chefs.
 * Displays scannable item cards, customizations, cooking notes, live timer, and status actions.
 */

import { AlertCircle, ArrowLeft, Receipt, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { STAFF_ROUTES } from "@/app/router/staff/staff.routes.constants";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { StaffOrderDetailHeader } from "@/features/orders/components/staff/details/StaffOrderDetailHeader";
import { StaffOrderDetailSkeleton } from "@/features/orders/components/staff/details/StaffOrderDetailSkeleton";
import { StaffOrderItemCard } from "@/features/orders/components/staff/details/StaffOrderItemCard";
import { StaffOrderNotesCard } from "@/features/orders/components/staff/details/StaffOrderNotesCard";
import { StaffOrderStatusActionBar } from "@/features/orders/components/staff/details/StaffOrderStatusActionBar";
import { StaffOrderSummaryCard } from "@/features/orders/components/staff/details/StaffOrderSummaryCard";
import {
  STAFF_ORDER_DETAILS_MESSAGES,
  STAFF_ORDERS_MESSAGES,
} from "@/features/orders/constants/staff-orders.constants";
import { useStaffOrderDetail } from "@/features/orders/hooks/use-staff-order-detail";
import { cn } from "@/lib/utils/cn";

export default function StaffOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";

  const {
    data: order,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useStaffOrderDetail(restaurantId, orderId || "");

  // Missing Restaurant Assignment State
  if (!restaurantId) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-dashed border-neutral-200 shadow-xs">
          <div className="size-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 shadow-xs">
            <AlertCircle className="size-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            {STAFF_ORDERS_MESSAGES.NO_RESTAURANT_TITLE}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-500">
            {STAFF_ORDERS_MESSAGES.NO_RESTAURANT_DESC}
          </p>
          <div className="mt-5">
            <Link to={STAFF_ROUTES.DASHBOARD}>
              <Button type="button" variant="outline" className="rounded-xl text-xs">
                {STAFF_ORDER_DETAILS_MESSAGES.BACK_TO_DASHBOARD}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading State (keep skeleton active during initial load or while retrying without data)
  if (isLoading || (isFetching && !order)) {
    return <StaffOrderDetailSkeleton />;
  }

  // Error or Not Found State (only after all retries are exhausted)
  if ((isError && !isFetching) || !order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="size-14 rounded-2xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#e8631b] mx-auto mb-4 shadow-2xs">
          <Receipt className="size-7" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">
          {STAFF_ORDER_DETAILS_MESSAGES.ORDER_NOT_FOUND_TITLE}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-neutral-500">
          {error instanceof Error
            ? error.message
            : STAFF_ORDER_DETAILS_MESSAGES.ORDER_NOT_FOUND_DESC}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-xl border-neutral-200 text-xs font-semibold gap-1.5"
          >
            <RefreshCw className={cn("size-3.5 text-[#e8631b]", isFetching && "animate-spin")} />
            {STAFF_ORDER_DETAILS_MESSAGES.TRY_AGAIN}
          </Button>
          <Link to={STAFF_ROUTES.ORDERS}>
            <Button
              type="button"
              className="rounded-xl bg-[#e8631b] text-white hover:bg-[#d45614] text-xs font-semibold gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              {STAFF_ORDER_DETAILS_MESSAGES.BACK_TO_ORDERS}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header (Order #, Badges, Live Timer, Back Link) */}
      <StaffOrderDetailHeader order={order} />

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Order Items & Customer Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-600">
                {STAFF_ORDER_DETAILS_MESSAGES.ORDER_ITEMS_HEADING(order.items.length)}
              </h2>
              <span className="text-xs font-semibold text-neutral-400">
                {STAFF_ORDER_DETAILS_MESSAGES.TOTAL_ITEMS_COUNT(order.totalQuantity)}
              </span>
            </div>

            {/* Item Cards List */}
            <div className="space-y-3.5">
              {order.items.map((item, index) => (
                <StaffOrderItemCard
                  key={item.id ?? `${order.id}-item-${item.menuItemId}-${index}`}
                  item={item}
                  itemNumber={index + 1}
                />
              ))}
            </div>
          </div>

          {/* General Customer Notes */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 px-1">
              {STAFF_ORDER_DETAILS_MESSAGES.GENERAL_INSTRUCTIONS_HEADING}
            </h3>
            <StaffOrderNotesCard customerNotes={order.customerNotes} />
          </div>
        </div>

        {/* Right Column: Status Actions & Order Overview */}
        <div className="space-y-5 lg:sticky lg:top-6">
          {/* Status Action Card */}
          <StaffOrderStatusActionBar order={order} restaurantId={restaurantId} />

          {/* Summary / Metadata Card */}
          <StaffOrderSummaryCard order={order} />
        </div>
      </div>
    </div>
  );
}
