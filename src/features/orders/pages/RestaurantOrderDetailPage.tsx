import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  History,
  MessageSquare,
  Phone,
  Printer,
  Receipt,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate, formatTime } from "@/lib/utils/date";
import { OrderStatusBadge } from "../components/admin/order/OrderStatusBadge";
import { RESTAURANT_ORDERS_MESSAGES } from "../constants/restaurant-orders.constants";
import { useRestaurantOrderDetail } from "../hooks/use-restaurant-order-detail";

export default function RestaurantOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const restaurantId = useAuthStore((state) => state.user?.restaurantId || "");

  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useRestaurantOrderDetail(restaurantId, orderId || "");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 max-w-7xl mx-auto">
        <Spinner size="lg" theme="brand" />
        <p className="text-sm font-medium text-neutral-500">Loading order details...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="size-14 rounded-2xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#e8631b] mb-4 shadow-2xs">
          <Receipt className="size-7" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">
          {RESTAURANT_ORDERS_MESSAGES.ORDER_NOT_FOUND_TITLE}
        </h2>
        <p className="mt-1.5 text-xs text-neutral-500">
          {RESTAURANT_ORDERS_MESSAGES.ORDER_NOT_FOUND_DESC}
        </p>
        <div className="mt-5 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            className="rounded-xl border-[#eddcd4]"
          >
            Retry
          </Button>
          <Link to={RESTAURANT_ROUTES.ORDERS.ROOT}>
            <Button type="button" className="rounded-xl bg-[#e8631b] text-white hover:bg-[#d45614]">
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. Back Navigation & Page Header */}
      <div className="flex flex-col gap-4">
        <div>
          <Link
            to={RESTAURANT_ROUTES.ORDERS.ROOT}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-[#9a3412] transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Orders</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[#fef3ec] text-[#e8631b] border border-[#fae2d3] shadow-2xs">
              <Receipt className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-neutral-900">
                  #{order.orderNumber}
                </h1>
                <OrderStatusBadge status={order.orderStatus} size="md" />
                <span
                  className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-bold ${
                    order.orderType === "DINE_IN"
                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                      : order.orderType === "PRE_ORDER"
                        ? "bg-blue-50 text-blue-800 border border-blue-200"
                        : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                  }`}
                >
                  {order.orderType === "DINE_IN"
                    ? `Dine-In • Table ${order.tableNumber ?? "--"}`
                    : order.orderType === "PRE_ORDER"
                      ? "Pre-Order"
                      : "Takeaway Pickup"}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-neutral-400" />
                <span>Placed on {formatDate(order.createdAt)}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="rounded-xl border-[#eddcd4] bg-white text-neutral-700 hover:bg-[#faf7f5] shadow-2xs gap-1.5"
            >
              <Printer className="size-4 text-neutral-500" />
              <span>Print</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Cancellation Notice if Cancelled */}
      {order.orderStatus === "CANCELLED" && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-rose-800 text-sm">
            <AlertTriangle className="size-4 text-rose-600 shrink-0" />
            <span>This order was cancelled</span>
          </div>
          {order.cancellationReason && (
            <p className="mt-1 text-rose-700 font-medium">Reason: {order.cancellationReason}</p>
          )}
          {order.cancelledAt && (
            <p className="mt-0.5 text-rose-500 text-[11px]">
              Cancelled on: {formatDate(order.cancelledAt)}
            </p>
          )}
        </div>
      )}

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Items, Notes, Status Timeline) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ordered Items Card */}
          <div className="rounded-2xl border border-[#eddcd4] bg-white shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#f3e6de] bg-[#fffcf9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="size-4 text-[#e8631b]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
                  Ordered Items ({order.items?.length ?? 0})
                </h2>
              </div>
              <span className="text-xs font-semibold text-neutral-500">
                {(order.items ?? []).reduce((sum, item) => sum + item.quantity, 0)} total quantity
              </span>
            </div>

            <div className="divide-y divide-[#f3e6de] p-4 sm:p-5">
              {(order.items ?? []).map((item) => (
                <div key={item.itemId} className="py-4 first:pt-1 last:pb-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex size-7 items-center justify-center rounded-xl bg-[#fef3ec] text-[#9a3412] text-xs font-bold border border-[#fae2d3]">
                          {item.quantity}×
                        </span>
                        <span className="text-sm sm:text-base font-bold text-neutral-900">
                          {item.itemName}
                        </span>
                      </div>

                      {item.variantName && (
                        <p className="mt-1 ml-9 text-xs font-medium text-neutral-500">
                          Variant:{" "}
                          <span className="text-neutral-800 font-semibold">{item.variantName}</span>
                        </p>
                      )}

                      {/* Addons List */}
                      {item.addons && item.addons.length > 0 && (
                        <div className="mt-2 ml-9 space-y-1">
                          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                            Add-ons:
                          </p>
                          {item.addons.map((addon) => (
                            <div
                              key={addon.addonId}
                              className="text-xs text-neutral-600 flex items-center gap-2"
                            >
                              <span className="text-[#e8631b] font-bold">+</span>
                              <span>{addon.addonName}</span>
                              <span className="text-neutral-400 font-medium">
                                ({formatCurrency(addon.price)})
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Item-specific special instructions */}
                      {item.specialInstructions && (
                        <div className="mt-2.5 ml-9 flex items-start gap-2 rounded-xl bg-amber-50/80 border border-amber-200/70 p-2.5 text-xs text-amber-900">
                          <MessageSquare className="size-3.5 shrink-0 text-amber-600 mt-0.5" />
                          <span>
                            <strong className="font-semibold">Special Request:</strong>{" "}
                            {item.specialInstructions}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-base font-bold text-neutral-900 font-mono">
                        {formatCurrency(item.totalPrice)}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {formatCurrency(item.unitPrice)} ea
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order-Level Special Instructions */}
          {order.specialInstructions && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5 shadow-2xs">
              <div className="flex items-start gap-3 text-xs text-amber-950">
                <FileText className="size-5 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-amber-900">Kitchen &amp; Order Notes</h3>
                  <p className="mt-1 text-xs text-amber-900/90 leading-relaxed">
                    {order.specialInstructions}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status History & Audit Timeline */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="rounded-2xl border border-[#eddcd4] bg-white p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#f3e6de]">
                <History className="size-4 text-[#e8631b]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Order Status History
                </h3>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#eddcd4]">
                {order.statusHistory.map((history) => (
                  <div
                    key={`${history.currentStatus}-${history.createdAt}-${history.changedBy}`}
                    className="relative text-xs"
                  >
                    <span className="absolute -left-6 top-1 size-2.5 rounded-full bg-[#e8631b] ring-4 ring-white" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <OrderStatusBadge status={history.currentStatus} size="sm" />
                        <span className="font-semibold text-neutral-800">
                          by {history.changedBy}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400">
                        {formatDate(history.createdAt)}
                      </span>
                    </div>
                    {history.notes && <p className="mt-1 text-neutral-600 pl-1">{history.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Customer, Service Mode, Billing) */}
        <div className="space-y-6">
          {/* Customer Details Card */}
          <div className="rounded-2xl border border-[#eddcd4] bg-white p-4 sm:p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-2">
              <User className="size-4 text-[#e8631b]" />
              <span>Customer Information</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase">
                  Customer Name
                </p>
                <p className="font-bold text-neutral-900 mt-0.5">
                  {order.customer?.name ?? "Guest Customer"}
                </p>
              </div>

              {order.customer?.phone && (
                <div>
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase">
                    Phone Number
                  </p>
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="flex items-center gap-1.5 font-medium text-neutral-800 hover:text-[#9a3412] transition-colors mt-0.5"
                  >
                    <Phone className="size-3.5 text-neutral-400" />
                    <span>{order.customer.phone}</span>
                  </a>
                </div>
              )}

              {order.customer?.userId && (
                <div>
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase">User ID</p>
                  <p className="font-mono text-xs text-neutral-600 bg-neutral-50 p-1.5 rounded-lg border border-neutral-200/60 truncate mt-0.5">
                    {order.customer.userId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dining / Service Mode Card */}
          <div className="rounded-2xl border border-[#eddcd4] bg-white p-4 sm:p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-2">
              <Clock className="size-4 text-[#e8631b]" />
              <span>Service Details</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#faf7f5] border border-[#eddcd4]">
                <p className="text-[10px] font-semibold uppercase text-neutral-400">Order Mode</p>
                <p className="font-bold text-neutral-900 mt-0.5">
                  {order.orderType === "DINE_IN"
                    ? "Dine-In"
                    : order.orderType === "PRE_ORDER"
                      ? "Pre-Order"
                      : "Takeaway"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#faf7f5] border border-[#eddcd4]">
                <p className="text-[10px] font-semibold uppercase text-neutral-400">Table Number</p>
                <p className="font-bold text-neutral-900 mt-0.5">
                  {order.tableNumber !== null && order.tableNumber !== undefined
                    ? `Table ${order.tableNumber}`
                    : "N/A"}
                </p>
              </div>
            </div>

            {order.estimatedReadyAt && (
              <div className="mt-3 p-3 rounded-xl bg-[#faf7f5] border border-[#eddcd4] text-xs">
                <p className="text-[10px] font-semibold uppercase text-neutral-400">
                  Estimated Ready Time
                </p>
                <p className="font-bold text-neutral-900 mt-0.5">
                  {formatTime(order.estimatedReadyAt)}
                </p>
              </div>
            )}
          </div>

          {/* Payment & Billing Breakdown Card */}
          <div className="rounded-2xl border border-[#eddcd4] bg-white p-4 sm:p-5 shadow-2xs space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
              <CreditCard className="size-4 text-emerald-600" />
              <span>Payment &amp; Billing</span>
            </h3>

            {/* Payment Mode & Status badge */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#faf7f5] border border-[#eddcd4] text-xs">
              <span className="font-semibold text-neutral-600">
                Mode: <strong className="text-neutral-900">{order.paymentMode}</strong>
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  order.paymentStatus === "PAID" || order.paymentStatus === "PAID_OFFLINE"
                    ? "bg-emerald-100 text-emerald-800"
                    : order.paymentStatus === "REFUNDED"
                      ? "bg-purple-100 text-purple-800"
                      : order.paymentStatus === "FAILED"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>

            {/* Itemized charges */}
            <div className="space-y-2 text-xs text-neutral-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900 font-mono">
                  {formatCurrency(order.pricing?.subtotal ?? 0)}
                </span>
              </div>

              {(order.pricing?.discountAmount ?? 0) > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>
                    Discount {order.pricing?.couponCode ? `(${order.pricing.couponCode})` : ""}
                  </span>
                  <span className="font-mono">-{formatCurrency(order.pricing.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Taxes (GST 5%)</span>
                <span className="font-medium text-neutral-900 font-mono">
                  {formatCurrency(order.pricing?.taxAmount ?? 0)}
                </span>
              </div>

              {(order.pricing?.platformFee ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-medium text-neutral-900 font-mono">
                    {formatCurrency(order.pricing.platformFee)}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-[#eddcd4] flex justify-between items-center text-sm font-bold text-neutral-900">
                <span className="text-sm uppercase tracking-wider text-neutral-600">
                  Grand Total
                </span>
                <span className="text-xl text-[#9a3412] font-mono">
                  {formatCurrency(order.pricing?.grandTotal ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
