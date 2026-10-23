import { ArrowRight, CheckCircle2, Home, Store, Utensils } from "lucide-react";
import type React from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { OrderPlacementResponse } from "../types/checkout.types";

interface CheckoutSuccessPageProps {
  order?: OrderPlacementResponse["data"];
  onReset?: () => void;
}

export const CheckoutSuccessPage: React.FC<CheckoutSuccessPageProps> = ({
  order: propOrder,
  onReset,
}) => {
  const location = useLocation();
  const state = (location.state as { order?: OrderPlacementResponse["data"] }) || {};
  const order = propOrder || state.order;

  return (
    <div className="py-6 sm:py-12 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-9 shadow-sm text-center">
          {/* Celebratory Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <Badge className="font-bold text-xs uppercase tracking-wider px-3 py-1 bg-emerald-100 text-emerald-900 border-emerald-200">
            Order Confirmed & Placed
          </Badge>

          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-neutral-900">
            {order?.orderNumber ? `Order #${order.orderNumber}` : "Order Placed Successfully!"}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
            {order?.restaurantName
              ? `Your dining order has been transmitted directly to ${order.restaurantName} kitchen.`
              : "Your dining order has been transmitted directly to the kitchen."}
          </p>

          {/* Receipt Breakdown Card */}
          {order && (
            <div className="mt-6 rounded-2xl border border-neutral-100 bg-[#f9fafb] p-5 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                <span className="font-medium text-neutral-500">Restaurant</span>
                <span className="font-bold text-neutral-900">{order.restaurantName}</span>
              </div>

              {order.tableNumber && (
                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="font-medium text-neutral-500">Table Reference</span>
                  <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5 text-emerald-600" />
                    Table {order.tableNumber}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                <span className="font-medium text-neutral-500">Payment Method</span>
                <span className="font-bold text-neutral-900">
                  {order.paymentMode === "ONLINE" ? "Razorpay (Online Prepay)" : "Pay at Counter"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-neutral-900">Total Paid</span>
                <span className="text-base font-extrabold text-[#ff6b00]">
                  ₹{order.totalAmount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link
              to="/orders"
              className="w-full sm:flex-1 h-11 rounded-xl bg-[#ff6b00] hover:bg-[#e65a00] text-white font-bold text-sm shadow-md shadow-orange-500/20 inline-flex items-center justify-center transition-colors"
            >
              <Utensils className="h-4 w-4 mr-2" />
              Track Live Orders
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>

            <Link
              to="/"
              onClick={onReset}
              className="w-full sm:flex-1 h-11 rounded-xl border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 inline-flex items-center justify-center transition-colors"
            >
              <Home className="h-3.5 w-3.5 mr-1.5" />
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
