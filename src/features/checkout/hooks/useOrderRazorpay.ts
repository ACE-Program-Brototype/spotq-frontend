import { useState } from "react";
import { toast } from "sonner";
import { loadRazorpayScript } from "@/features/subscription/hooks/useRazorpayCheckout";
import type {
  RazorpayOptions,
  RazorpayPaymentSuccessResponse,
} from "@/features/subscription/types/subscription.types";
import { checkoutService } from "../services/checkout.service";
import type { PaymentDraftData, PlacedOrderData } from "../types/checkout.types";

interface UseOrderRazorpayOptions {
  onSuccess: (order: PlacedOrderData) => void;
  onFailure: (errorMessage: string) => void;
  onDismiss?: () => void;
}

export function useOrderRazorpay({ onSuccess, onFailure, onDismiss }: UseOrderRazorpayOptions) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const launchPayment = async (
    order: PlacedOrderData,
    draft: PaymentDraftData,
    customerPrefill?: { name?: string; phone?: string; email?: string },
  ) => {
    try {
      setIsProcessingPayment(true);

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        throw new Error(
          "Unable to load Razorpay payment gateway. Please check your internet connection.",
        );
      }

      const options: RazorpayOptions = {
        key: draft.keyId,
        amount: draft.amountPaise,
        currency: draft.currency,
        name: "SpotQ",
        description: `Order ${order.orderNumber}`,
        order_id: draft.razorpayOrderId,
        prefill: {
          name: customerPrefill?.name || order.userName || "",
          contact: customerPrefill?.phone || order.userPhone || "",
          email: customerPrefill?.email || "",
        },
        theme: {
          color: "#ff6b00",
        },
        handler: async (response: RazorpayPaymentSuccessResponse) => {
          try {
            await checkoutService.verifyOrderPayment({
              orderId: draft.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            toast.success("Payment verified! Order confirmed.");
            onSuccess({
              ...order,
              paymentStatus: "PAID",
              orderStatus: "CONFIRMED",
            });
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Payment verification failed";
            toast.error(message);
            onFailure(message);
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
            toast.info("Payment was cancelled or closed");
            onDismiss?.();
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on?.("payment.failed", (response) => {
        setIsProcessingPayment(false);
        const failureMessage =
          response?.error?.description || response?.error?.reason || "Payment failed via gateway";
        toast.error(failureMessage);
        onFailure(failureMessage);
      });

      razorpayInstance.open();
    } catch (err: unknown) {
      setIsProcessingPayment(false);
      const message = err instanceof Error ? err.message : "Failed to initiate payment gateway";
      toast.error(message);
      onFailure(message);
    }
  };

  return {
    launchPayment,
    isProcessingPayment,
  };
}
