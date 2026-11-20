import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  CHECKOUT_MESSAGES,
  CHECKOUT_PAYMENT_STATUS,
  ORDER_PAYMENT_STATUS,
  ORDER_STATUS,
  RAZORPAY_CONFIG,
} from "@/features/checkout/constants/checkout.constants";
import { checkoutService } from "@/features/checkout/services/checkout.service";
import type { PaymentDraftData, PlacedOrderData } from "@/features/checkout/types/checkout.types";
import { loadRazorpayScript } from "@/features/subscription/hooks/useRazorpayCheckout";
import type {
  RazorpayOptions,
  RazorpayPaymentSuccessResponse,
} from "@/features/subscription/types/subscription.types";

interface UseOrderRazorpayOptions {
  onSuccess: (order: PlacedOrderData) => void;
  onFailure: (errorMessage: string) => void;
  onDismiss?: () => void;
}

export function useOrderRazorpay({ onSuccess, onFailure, onDismiss }: UseOrderRazorpayOptions) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const launchPayment = async (
    order: PlacedOrderData,
    draft: PaymentDraftData,
    customerPrefill?: { name?: string; phone?: string; email?: string },
  ) => {
    try {
      setIsProcessingPayment(true);

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        throw new Error(CHECKOUT_MESSAGES.GATEWAY_LOAD_ERROR);
      }

      const options: RazorpayOptions = {
        key: draft.keyId,
        amount: draft.amountPaise,
        currency: draft.currency,
        name: RAZORPAY_CONFIG.BRAND_NAME,
        description: CHECKOUT_MESSAGES.ORDER_DESCRIPTION(order.orderNumber),
        order_id: draft.razorpayOrderId,
        prefill: {
          name: customerPrefill?.name || order.userName || "",
          contact: customerPrefill?.phone || order.userPhone || "",
          email: customerPrefill?.email || "",
        },
        theme: {
          color: RAZORPAY_CONFIG.THEME_COLOR,
        },
        handler: async (response: RazorpayPaymentSuccessResponse) => {
          try {
            const verifyResponse = await checkoutService.verifyOrderPayment({
              orderId: draft.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyResponse.data?.status !== CHECKOUT_PAYMENT_STATUS.CAPTURED) {
              throw new Error(
                verifyResponse.message || CHECKOUT_MESSAGES.PAYMENT_CAPTURE_FAILED,
              );
            }

            toast.success(CHECKOUT_MESSAGES.PAYMENT_VERIFIED_SUCCESS);
            onSuccess({
              ...order,
              paymentStatus: ORDER_PAYMENT_STATUS.PAID,
              orderStatus: ORDER_STATUS.CONFIRMED,
            });
          } catch (err: unknown) {
            const message =
              err instanceof Error
                ? err.message
                : CHECKOUT_MESSAGES.PAYMENT_VERIFICATION_FAILED;
            toast.error(message);
            onFailure(message);
          } finally {
            if (isMountedRef.current) {
              setIsProcessingPayment(false);
            }
          }
        },
        modal: {
          ondismiss: () => {
            if (isMountedRef.current) {
              setIsProcessingPayment(false);
            }
            toast.info(CHECKOUT_MESSAGES.PAYMENT_CANCELLED);
            onDismiss?.();
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      // react-doctor-disable-next-line react-doctor/effect-needs-cleanup
      razorpayInstance.on?.(RAZORPAY_CONFIG.EVENT_PAYMENT_FAILED, (response) => {
        if (isMountedRef.current) {
          setIsProcessingPayment(false);
        }
        const failureMessage =
          response?.error?.description ||
          response?.error?.reason ||
          CHECKOUT_MESSAGES.GATEWAY_PAYMENT_FAILED;
        toast.error(failureMessage);
        onFailure(failureMessage);
      });

      razorpayInstance.open();
    } catch (err: unknown) {
      if (isMountedRef.current) {
        setIsProcessingPayment(false);
      }
      const message =
        err instanceof Error
          ? err.message
          : CHECKOUT_MESSAGES.GATEWAY_INITIATION_FAILED;
      toast.error(message);
      onFailure(message);
    }
  };

  return {
    launchPayment,
    isProcessingPayment,
  };
}
