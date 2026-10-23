import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import type React from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CheckoutFailurePageProps {
  errorMessage?: string;
  cartId?: string;
  onRetry?: () => void;
}

export const CheckoutFailurePage: React.FC<CheckoutFailurePageProps> = ({
  errorMessage: propError,
  cartId: propCartId,
  onRetry,
}) => {
  const location = useLocation();
  const state = (location.state as { errorMessage?: string; cartId?: string }) || {};
  const errorMessage =
    propError ||
    state.errorMessage ||
    "The transaction could not be completed or the order request timed out.";
  const cartId = propCartId || state.cartId;

  const retryUrl = cartId ? `/checkout?cartId=${encodeURIComponent(cartId)}` : "/checkout";

  return (
    <div className="py-6 sm:py-12 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-9 shadow-sm text-center">
          {/* Failure Alert Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <AlertCircle className="h-9 w-9" />
          </div>

          <Badge className="bg-rose-100 text-rose-800 border-rose-200 font-bold text-xs uppercase tracking-wider px-3 py-1">
            Order Unsuccessful
          </Badge>

          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-neutral-900">
            Checkout Was Not Completed
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
            We were unable to process your order. No charges have been deducted from your account.
          </p>

          {/* Error Details Box */}
          <div className="mt-6 rounded-2xl border border-rose-200/70 bg-rose-50/50 p-4.5 text-left text-xs space-y-2">
            <span className="font-bold uppercase tracking-wider text-rose-700 text-[10px]">
              Failure Reason
            </span>
            <p className="font-medium text-neutral-800 break-words leading-relaxed">
              {errorMessage}
            </p>
          </div>

          <p className="mt-4 text-xs text-neutral-500 text-left">
            Please check your payment details or network connection. Your cart items are preserved
            so you can retry checkout immediately.
          </p>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            {onRetry ? (
              <Button
                type="button"
                onClick={onRetry}
                className="w-full sm:flex-1 h-11 rounded-xl bg-[#ff6b00] hover:bg-[#e65a00] text-white font-bold text-sm shadow-md shadow-orange-500/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Checkout
              </Button>
            ) : (
              <Link
                to={retryUrl}
                className="w-full sm:flex-1 h-11 rounded-xl bg-[#ff6b00] hover:bg-[#e65a00] text-white font-bold text-sm shadow-md shadow-orange-500/20 inline-flex items-center justify-center transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Checkout
              </Link>
            )}

            <Link
              to="/"
              className="w-full sm:flex-1 h-11 rounded-xl border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 inline-flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFailurePage;
