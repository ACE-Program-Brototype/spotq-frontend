import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CHECKOUT_PRICING } from "../constants/checkout.constants";
import { checkoutService } from "../services/checkout.service";
import type {
  CheckoutDetailsData,
  PaymentModeType,
  PlacedOrderData,
  PlaceOrderPayload,
  PriceBreakdown,
} from "../types/checkout.types";
import { useOrderRazorpay } from "./useOrderRazorpay";

export type CheckoutViewStatus = "CHECKOUT" | "SUCCESS" | "FAILURE";

export function useCheckout() {
  const [searchParams] = useSearchParams();
  const authUser = useAuthStore((state) => state.user);

  // 1. Table context from QR scan (e.g. ?table=4)
  const tableParam = searchParams.get("table");
  const tableNumber = tableParam ? Number(tableParam) || null : null;

  // 2. Checkout details state (GET /orders/checkout - decoded from customer JWT)
  const [checkoutData, setCheckoutData] = useState<CheckoutDetailsData | null>(null);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const fetchCheckoutDetails = useCallback(async () => {
    setIsLoadingCheckout(true);
    setCheckoutError(null);
    try {
      const data = await checkoutService.getCheckoutDetails();
      setCheckoutData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load checkout details";
      setCheckoutError(msg);
      setCheckoutData(null);
    } finally {
      setIsLoadingCheckout(false);
    }
  }, []);

  useEffect(() => {
    fetchCheckoutDetails();
  }, [fetchCheckoutDetails]);

  // 3. Customer fields & Payment mode (from real logged-in auth user)
  const [userName, setUserName] = useState<string>(authUser?.fullName || authUser?.name || "");
  const [userPhone, setUserPhone] = useState<string>(authUser?.phone || "");
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<PaymentModeType>("ONLINE");

  // Keep customer name/phone in sync with auth store if initially empty
  useEffect(() => {
    if (authUser) {
      setUserName((prev) => prev || authUser.fullName || authUser.name || "");
      setUserPhone((prev) => prev || authUser.phone || "");
    }
  }, [authUser]);

  // Keep payment mode in sync with backend contract if specified
  useEffect(() => {
    if (checkoutData?.payment?.mode) {
      setPaymentMode(checkoutData.payment.mode);
    }
  }, [checkoutData?.payment?.mode]);

  // 4. In-memory lifecycle status
  const [viewStatus, setViewStatus] = useState<CheckoutViewStatus>("CHECKOUT");
  const [placedOrder, setPlacedOrder] = useState<PlacedOrderData | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 5. Razorpay integration hook
  const { launchPayment, isProcessingPayment } = useOrderRazorpay({
    onSuccess: (confirmedOrder) => {
      setPlacedOrder(confirmedOrder);
      setViewStatus("SUCCESS");
      setIsSubmitting(false);
    },
    onFailure: (errorMessage) => {
      setOrderError(errorMessage);
      setViewStatus("FAILURE");
      setIsSubmitting(false);
    },
    onDismiss: () => {
      setIsSubmitting(false);
    },
  });

  // 6. Authoritative price breakdown from backend checkout data
  const priceBreakdown: PriceBreakdown = useMemo(() => {
    const itemsSubtotal = checkoutData?.subtotal || 0;
    const gstAmount =
      checkoutData?.taxAmount ?? Math.round(itemsSubtotal * CHECKOUT_PRICING.GST_RATE * 100) / 100;
    const gstRate = checkoutData?.taxPercent
      ? checkoutData.taxPercent / 100
      : CHECKOUT_PRICING.GST_RATE;
    const platformFee = 0;
    const grandTotal = checkoutData?.totalAmount ?? itemsSubtotal + gstAmount + platformFee;

    return {
      itemsSubtotal,
      gstAmount,
      gstRate,
      platformFee,
      grandTotal,
    };
  }, [checkoutData]);

  // 7. Order placement with strict payload & payment launch
  const handleCheckout = useCallback(async () => {
    if (isSubmitting || isProcessingPayment) return;

    if (!checkoutData) {
      toast.error("Checkout details are not loaded yet. Please ensure your cart has items.");
      return;
    }

    const newErrors: Record<string, string> = {};
    if (userPhone.trim() && !/^\+?[0-9\s-]{7,20}$/.test(userPhone.trim())) {
      newErrors.userPhone = "Please enter a valid mobile number (7-20 digits)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please enter a valid mobile number before placing order");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // Enforce strict payload matching backend placeOrderBodySchema
    const payload: PlaceOrderPayload = {
      restaurantId: checkoutData.restaurantId,
      cartId: checkoutData.cartId,
      paymentMode,
      userName: userName.trim() || null,
      userPhone: userPhone.trim() || null,
      specialInstructions: specialInstructions.trim() || null,
    };

    console.info("[SpotQ Checkout] Placing order with payload:", payload);

    try {
      const res = await checkoutService.placeOrder(payload);
      const createdOrder = res.data;

      console.info("[SpotQ Checkout] Order placed successfully:", createdOrder);

      // Launch Razorpay checkout modal with paymentDraft
      if (createdOrder.paymentDraft) {
        await launchPayment(createdOrder, createdOrder.paymentDraft, {
          name: userName.trim(),
          phone: userPhone.trim(),
          email: authUser?.email || undefined,
        });
      } else {
        // Fallback for orders verified/completed directly
        setPlacedOrder(createdOrder);
        setViewStatus("SUCCESS");
        setIsSubmitting(false);
      }
    } catch (err: unknown) {
      console.error("[SpotQ Checkout] Order placement failed:", err);
      const errorMsg =
        err instanceof Error ? err.message : "Unable to place order. Please try again.";
      setOrderError(errorMsg);
      toast.error(errorMsg);
      setViewStatus("FAILURE");
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    isProcessingPayment,
    checkoutData,
    userName,
    userPhone,
    paymentMode,
    specialInstructions,
    launchPayment,
    authUser?.email,
  ]);

  const resetToCheckout = useCallback(() => {
    setViewStatus("CHECKOUT");
    setOrderError(null);
  }, []);

  return {
    cartId: checkoutData?.cartId,
    tableNumber,
    cart: checkoutData,
    isLoadingCart: isLoadingCheckout,
    cartError: checkoutError,
    refetchCart: fetchCheckoutDetails,
    priceBreakdown,
    userName,
    setUserName,
    userPhone,
    setUserPhone,
    specialInstructions,
    setSpecialInstructions,
    paymentMode,
    setPaymentMode,
    isSubmitting: isSubmitting || isProcessingPayment,
    handleCheckout,
    errors,
    viewStatus,
    placedOrder,
    orderError,
    resetToCheckout,
  };
}
