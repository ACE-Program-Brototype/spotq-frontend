import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CHECKOUT_VIEW_STATUS, type CheckoutViewStatus } from "../constants/checkout.constants";
import { type CheckoutFormValues, checkoutFormSchema } from "../schemas/checkout-form.schema";
import { checkoutService } from "../services/checkout.service";
import type { PlacedOrderData, PlaceOrderPayload, PriceBreakdown } from "../types/checkout.types";
import { useOrderRazorpay } from "./useOrderRazorpay";

export { CHECKOUT_VIEW_STATUS, type CheckoutViewStatus };

export function useCheckout() {
  const authUser = useAuthStore((state) => state.user);

  // In-memory lifecycle status
  const [viewStatus, setViewStatus] = useState<CheckoutViewStatus>(CHECKOUT_VIEW_STATUS.CHECKOUT);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrderData | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  // 1. TanStack Query: Fetch checkout details
  const {
    data: checkoutData,
    isLoading: isLoadingCart,
    error: cartQueryError,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ["checkout", "details"],
    queryFn: () => checkoutService.getCheckoutDetails(),
  });

  const cartError = cartQueryError instanceof Error ? cartQueryError.message : null;

  // 2. React Hook Form with Zod
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      userName: authUser?.fullName || "",
      userPhone: authUser?.phone || "",
      specialInstructions: "",
    },
  });

  // 3. Razorpay integration hook
  const { launchPayment, isProcessingPayment } = useOrderRazorpay({
    onSuccess: (confirmedOrder) => {
      setPlacedOrder(confirmedOrder);
      setViewStatus(CHECKOUT_VIEW_STATUS.SUCCESS);
    },
    onFailure: (errorMessage) => {
      setOrderError(errorMessage);
      setViewStatus(CHECKOUT_VIEW_STATUS.FAILURE);
    },
    onDismiss: () => {},
  });

  // 4. TanStack Mutation: Place order
  const placeOrderMutation = useMutation({
    mutationFn: (payload: PlaceOrderPayload) => checkoutService.placeOrder(payload),
    onSuccess: async (res, variables) => {
      const createdOrder = res.data;
      if (createdOrder.paymentDraft) {
        await launchPayment(createdOrder, createdOrder.paymentDraft, {
          name: variables.userName || undefined,
          phone: variables.userPhone || undefined,
          email: authUser?.email || undefined,
        });
      } else {
        setPlacedOrder(createdOrder);
        setViewStatus(CHECKOUT_VIEW_STATUS.SUCCESS);
      }
    },
    onError: (err: unknown) => {
      const errorMsg =
        err instanceof Error ? err.message : "Unable to place order. Please try again.";
      setOrderError(errorMsg);
      toast.error(errorMsg);
      setViewStatus(CHECKOUT_VIEW_STATUS.FAILURE);
    },
  });

  // 5. Submit handler connecting React Hook Form to TanStack Mutation
  const handleCheckout = form.handleSubmit((values) => {
    if (placeOrderMutation.isPending || isProcessingPayment) return;

    if (!checkoutData) {
      toast.error("Checkout details are not loaded yet. Please ensure your cart has items.");
      return;
    }

    placeOrderMutation.mutate({
      restaurantId: checkoutData.restaurantId,
      cartId: checkoutData.cartId,
      paymentMode: "ONLINE",
      userName: values.userName?.trim() || null,
      userPhone: values.userPhone?.trim() || null,
      specialInstructions: values.specialInstructions?.trim() || null,
    });
  });

  // 6. Authoritative price breakdown directly from backend checkout data
  const priceBreakdown: PriceBreakdown = useMemo(() => {
    const itemsSubtotal = checkoutData?.subtotal ?? 0;
    const gstAmount = checkoutData?.taxAmount ?? 0;
    const platformFee = checkoutData?.platformFee ?? 0;
    const gstRate = itemsSubtotal > 0 && gstAmount > 0 ? gstAmount / itemsSubtotal : 0.05;
    const grandTotal = checkoutData?.grandTotal ?? itemsSubtotal + gstAmount + platformFee;

    return {
      itemsSubtotal,
      gstAmount,
      gstRate,
      platformFee,
      grandTotal,
    };
  }, [checkoutData]);

  const isSubmitting = placeOrderMutation.isPending || isProcessingPayment;

  const resetToCheckout = () => {
    setViewStatus(CHECKOUT_VIEW_STATUS.CHECKOUT);
    setOrderError(null);
  };

  return {
    cart: checkoutData,
    cartId: checkoutData?.cartId,
    isLoadingCart,
    cartError,
    refetchCart: () => {
      void refetchCart();
    },
    priceBreakdown,
    form,
    isSubmitting,
    handleCheckout,
    viewStatus,
    placedOrder,
    orderError,
    resetToCheckout,
  };
}
