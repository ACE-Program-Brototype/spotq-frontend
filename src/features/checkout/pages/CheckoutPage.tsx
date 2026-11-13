import {
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import type React from "react";
import { Link } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { ContextBanner } from "../components/ContextBanner";
import { CustomerDetailsCard } from "../components/CustomerDetailsCard";
import { OrderDetailsCard } from "../components/OrderDetailsCard";
import { OrderSummaryCard } from "../components/OrderSummaryCard";
import { PaymentMethodCard } from "../components/PaymentMethodCard";
import { CHECKOUT_VIEW_STATUS } from "../constants/checkout.constants";
import { useCheckout } from "../hooks/useCheckout";
import { CheckoutFailurePage } from "./CheckoutFailurePage";
import { CheckoutSuccessPage } from "./CheckoutSuccessPage";

export const CheckoutPage: React.FC = () => {
  const {
    cartId,
    cart,
    isLoadingCart,
    cartError,
    refetchCart,
    priceBreakdown,
    form,
    isSubmitting,
    handleCheckout,
    viewStatus,
    placedOrder,
    orderError,
    resetToCheckout,
  } = useCheckout();

  // 1. In-memory Success View (Driven by API response, no URL route path needed)
  if (viewStatus === CHECKOUT_VIEW_STATUS.SUCCESS && placedOrder) {
    return <CheckoutSuccessPage order={placedOrder} onReset={resetToCheckout} />;
  }

  // 2. In-memory Failure View (Driven by API response, no URL route path needed)
  if (viewStatus === CHECKOUT_VIEW_STATUS.FAILURE) {
    return (
      <CheckoutFailurePage
        errorMessage={orderError || undefined}
        onRetry={resetToCheckout}
        cartId={cartId || undefined}
      />
    );
  }

  // 3. Checkout Form View
  return (
    <div className="w-full pb-14">
      <div className="mx-auto max-w-5xl px-3 sm:px-5 py-2.5 sm:py-3.5">
        {/* Navigation & Breadcrumb */}
        <div className="mb-2 sm:mb-2.5 flex items-center justify-between">
          <Link
            to={CUSTOMER_ROUTES.HOME}
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="size-3" />
            <span>Back to Menu</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-neutral-400">
            <span>SpotQ</span>
            <span>•</span>
            <span className="text-[#e8631b] font-semibold">Checkout</span>
          </div>
        </div>

        {/* Page Title & Subtitle */}
        <div className="mb-2.5 sm:mb-3.5 space-y-0.5">
          <h1 className="text-lg sm:text-xl font-black tracking-tight text-neutral-900">
            Secure Checkout
          </h1>
          <p className="text-[11px] sm:text-xs text-neutral-500">
            {cart?.restaurantName
              ? `Review your order from ${cart.restaurantName}`
              : "Complete your order details below"}
          </p>
        </div>

        {/* Cart Error State (Real API Error) */}
        {cartError && (
          <div className="mb-2.5 sm:mb-3.5 rounded-lg border border-rose-200 bg-rose-50/80 p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-start gap-2">
              <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-[13px] font-bold text-rose-900">Failed to load cart</h4>
                <p className="text-[10px] sm:text-[11px] text-rose-700 mt-0.5">{cartError}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetchCart()}
              className="rounded-md border-rose-300 bg-white text-rose-800 hover:bg-rose-50 text-[11px] font-semibold shrink-0 h-7"
            >
              <RefreshCw className="size-2.5 mr-1" />
              Retry Cart
            </Button>
          </div>
        )}

        {/* Restaurant Dining Context Banner */}
        {cart?.restaurantName && <ContextBanner restaurantName={cart.restaurantName} />}

        {/* Main 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3.5 items-start">
          {/* Left Column: Order Items, Customer Info, Payment Method */}
          <div className="lg:col-span-7 space-y-2.5 sm:space-y-3">
            {/* 1. Order Details Card */}
            <OrderDetailsCard cart={cart} isLoading={isLoadingCart} />

            {/* 2. Customer Information (userName & userPhone via React Hook Form) */}
            <CustomerDetailsCard
              register={form.register}
              errors={form.formState.errors}
              isSubmitting={isSubmitting}
            />

            {/* 3. Payment Method Card (Razorpay Online) */}
            <PaymentMethodCard isSubmitting={isSubmitting} />
          </div>

          {/* Right Column: Order Summary (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-4">
            <OrderSummaryCard
              priceBreakdown={priceBreakdown}
              paymentMode="ONLINE"
              isSubmitting={isSubmitting}
              onCheckout={handleCheckout}
              itemCount={cart?.itemCount || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
