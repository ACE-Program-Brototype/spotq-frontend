import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Download,
  Loader2,
  Receipt,
  RefreshCw,
  Store,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/customer/customer.routes.constants";
import { Button } from "@/components/ui/button";
import { CancelOrderTriggerButton } from "@/features/orders/components/admin/order/cancel-order/CancelOrderTriggerButton";
import { CustomerOrderDetailSkeleton } from "@/features/orders/components/customer/CustomerOrderDetailSkeleton";
import { OrderCustomerItemList } from "@/features/orders/components/customer/OrderCustomerItemList";
import { OrderDiningContextCard } from "@/features/orders/components/customer/OrderDiningContextCard";
import { OrderPaymentCard } from "@/features/orders/components/customer/OrderPaymentCard";
import { OrderPricingCard } from "@/features/orders/components/customer/OrderPricingCard";
import { OrderStatusHistoryTimeline } from "@/features/orders/components/customer/OrderStatusHistoryTimeline";
import { OrderStatusTracker } from "@/features/orders/components/customer/OrderStatusTracker";
import {
  CUSTOMER_ORDER_STATUS,
  CUSTOMER_PAYMENT_STATUS,
  ORDER_STATUS_VARIANTS,
} from "@/features/orders/constants/customer-order-details.constants";
import {
  useCustomerOrderDetails,
  useCustomerOrderRefundStatus,
} from "@/features/orders/hooks/use-customer-order-details";
import { useDownloadInvoice } from "@/features/orders/hooks/use-download-invoice";
import { formatDate } from "@/lib/utils/date";

export default function CustomerOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const activeOrderId = orderId ?? "";
  const {
    data: order,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCustomerOrderDetails(activeOrderId);
  const isOrderCancelled = order?.status?.toUpperCase() === CUSTOMER_ORDER_STATUS.CANCELLED;
  const paymentStatus = order?.payment?.status?.toUpperCase();
  const canShowRefundStatus =
    isOrderCancelled &&
    (paymentStatus === CUSTOMER_PAYMENT_STATUS.PAID ||
      paymentStatus === CUSTOMER_PAYMENT_STATUS.REFUNDED);
  const refundQuery = useCustomerOrderRefundStatus(activeOrderId, canShowRefundStatus);
  const { downloadInvoice, isDownloading: isDownloadingInvoice } = useDownloadInvoice();

  const handleBack = () => {
    navigate(CUSTOMER_ROUTES.ORDERS);
  };

  const handleDownloadInvoice = () => {
    downloadInvoice(order?.payment?.payment_id, order?.order_number);
  };

  if (isLoading) {
    return <CustomerOrderDetailSkeleton />;
  }

  if (isError || !order) {
    return (
      <div
        data-testid="customer-order-error-state"
        className="max-w-xl mx-auto rounded-3xl bg-white border border-rose-200 p-8 sm:p-12 text-center space-y-4 shadow-xs my-8"
      >
        <div className="size-14 mx-auto rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
          <AlertCircle className="size-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Unable to load order</h3>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
            We could not find or retrieve details for this order. It may not belong to your account
            or does not exist.
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-xl flex items-center gap-2 text-xs font-semibold"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Try Again</span>
          </Button>
          <Button
            type="button"
            onClick={handleBack}
            className="rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold"
          >
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const statusVariant = ORDER_STATUS_VARIANTS[order.status?.toUpperCase()] ?? {
    badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-300",
    label: order.status,
  };
  const isPaid = order.payment?.status?.toUpperCase() === "PAID";
  const canDownloadInvoice = isPaid && Boolean(order.payment?.payment_id);

  return (
    <div
      data-testid="customer-order-detail-page"
      className="space-y-4 sm:space-y-6 max-w-6xl mx-auto pb-12 sm:pb-16 print:p-0 print:max-w-none"
    >
      {/* 1. Header & Navigation */}
      <div className="flex flex-col gap-3 sm:gap-4 print:hidden">
        <div>
          <button
            type="button"
            data-testid="order-back-button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
            <span>Back to Orders</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex size-9 sm:size-11 items-center justify-center rounded-xl sm:rounded-2xl bg-[#fef3ec] text-[#e8631b] border border-[#fae2d3] shadow-2xs shrink-0">
              <Receipt className="size-4.5 sm:size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1
                  data-testid="customer-order-number"
                  className="text-lg sm:text-2xl font-black tracking-tight text-neutral-900 font-mono"
                >
                  #{order.order_number}
                </h1>
                <span
                  data-testid="customer-order-status-badge"
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold border ${statusVariant.badgeClass}`}
                >
                  {statusVariant.label}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-neutral-500 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-neutral-700">
                  <Store className="size-3 sm:size-3.5 text-[#e8631b]" />
                  <span>{order.restaurant?.name ?? "Restaurant"}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3 sm:size-3.5 text-neutral-400" />
                  <span>Placed {formatDate(order.created_at)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadInvoice}
              disabled={!canDownloadInvoice || isDownloadingInvoice}
              data-testid="download-invoice-btn"
              title={
                canDownloadInvoice
                  ? "Download official GST tax invoice"
                  : "Invoice is available once payment is completed"
              }
              className="rounded-xl border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 shadow-2xs gap-1.5 text-xs font-semibold cursor-pointer disabled:cursor-not-allowed"
            >
              {isDownloadingInvoice ? (
                <Loader2 className="size-3.5 animate-spin text-neutral-500" />
              ) : (
                <Download className="size-3.5 text-neutral-500" />
              )}
              <span>{isDownloadingInvoice ? "Downloading..." : "Download Invoice"}</span>
            </Button>

            <CancelOrderTriggerButton
              orderId={order.order_id}
              orderNumber={order.order_number}
              status={order.status}
              onCancelled={() => refetch()}
            />
          </div>
        </div>
      </div>

      {/* 2. Visual Status Tracker */}
      <OrderStatusTracker status={order.status} statusHistory={order.status_history} />

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Items & History */}
        <div className="lg:col-span-2 space-y-6">
          <OrderCustomerItemList items={order.items} />

          <OrderStatusHistoryTimeline statusHistory={order.status_history} />
        </div>

        {/* Right Column: Service Context, Payment & Billing */}
        <div className="space-y-6">
          <OrderDiningContextCard
            restaurant={order.restaurant}
            orderType={order.order_type}
            tableNumber={order.table_number}
            queueEntryId={order.queue_entry_id}
            specialInstructions={order.special_instructions}
          />

          <OrderPaymentCard
            payment={order.payment}
            refundStatus={refundQuery.data}
            isRefundLoading={canShowRefundStatus && refundQuery.isLoading}
            refundError={
              canShowRefundStatus && refundQuery.isError
                ? "Unable to retrieve refund status. Please refresh to try again."
                : undefined
            }
          />

          <OrderPricingCard pricing={order.pricing} />
        </div>
      </div>
    </div>
  );
}
