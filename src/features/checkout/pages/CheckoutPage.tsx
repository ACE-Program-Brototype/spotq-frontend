import {
  AlertCircle,
  ArrowLeft,
  Clock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Utensils,
} from "lucide-react";
import type React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CustomerDetailsCard } from "../components/CustomerDetailsCard";
import { OrderDetailsCard } from "../components/OrderDetailsCard";
import { OrderSummaryCard } from "../components/OrderSummaryCard";
import { PaymentMethodCard } from "../components/PaymentMethodCard";
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
    userName,
    setUserName,
    userPhone,
    setUserPhone,
    specialInstructions,
    setSpecialInstructions,
    paymentMode,
    setPaymentMode,
    isSubmitting,
    handleCheckout,
    errors,
    viewStatus,
    placedOrder,
    orderError,
    resetToCheckout,
  } = useCheckout();

  // 1. In-memory Success View (Driven by API response, no URL route path needed)
  if (viewStatus === "SUCCESS" && placedOrder) {
    return <CheckoutSuccessPage order={placedOrder} onReset={resetToCheckout} />;
  }

  // 2. In-memory Failure View (Driven by API response, no URL route path needed)
  if (viewStatus === "FAILURE") {
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
    <div className="w-full pb-16">
      <div className="mx-auto max-w-6xl py-4 sm:py-6">
        {/* Navigation & Breadcrumb */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Menu</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400">
            <span>SpotQ</span>
            <span>•</span>
            <span className="text-[#ff6b00] font-semibold">Checkout</span>
          </div>
        </div>

        {/* Page Title & Subtitle */}
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            {cart?.restaurantName
              ? `Review your order from ${cart.restaurantName}`
              : "Complete your order details below"}
          </p>
        </div>

        {/* Cart Error State (Real API Error) */}
        {cartError && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-900">Failed to load cart</h4>
                <p className="text-xs text-rose-700 mt-0.5">{cartError}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={refetchCart}
              className="rounded-xl border-rose-300 bg-white text-rose-800 hover:bg-rose-50 text-xs font-semibold shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Retry Cart
            </Button>
          </div>
        )}

        {/* Main 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Order Items, Customer Info, Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Order Details Card */}
            <OrderDetailsCard cart={cart} isLoading={isLoadingCart} />

            {/* 2. Customer Information (userName & userPhone) */}
            <CustomerDetailsCard
              userName={userName}
              setUserName={setUserName}
              userPhone={userPhone}
              setUserPhone={setUserPhone}
              specialInstructions={specialInstructions}
              setSpecialInstructions={setSpecialInstructions}
              errors={errors}
              isSubmitting={isSubmitting}
            />

            {/* 3. Payment Method Card (ONLINE & PAY_AT_COUNTER) */}
            <PaymentMethodCard
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right Column: Order Summary (Sticky on Desktop) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
            <OrderSummaryCard
              priceBreakdown={priceBreakdown}
              paymentMode={paymentMode}
              isSubmitting={isSubmitting}
              onCheckout={handleCheckout}
              itemCount={cart?.itemCount || 0}
            />

            {/* Trust and Service Guarantee Widget */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4.5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                <Sparkles className="h-4 w-4 text-[#ff6b00]" />
                SpotQ Realtime Dining Experience
              </div>

              <div className="space-y-2 text-xs text-neutral-500">
                <div className="flex items-start gap-2">
                  <Utensils className="h-3.5 w-3.5 text-neutral-400 mt-0.5 shrink-0" />
                  <span>Orders are synced real-time with kitchen display system (KDS).</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-neutral-400 mt-0.5 shrink-0" />
                  <span>Live preparation tracking and counter paging upon order placement.</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>PCI-DSS compliant encrypted checkout with Instant Refund guarantee.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
