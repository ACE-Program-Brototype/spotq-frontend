import { useState } from "react";
import { toast } from "sonner";
import { subscriptionApi } from "@/features/subscription/api/subscription.api";
import {
  RAZORPAY_SCRIPT_URL,
  SUBSCRIPTION_MESSAGES,
} from "@/features/subscription/constants/subscription.constants";
import type {
  RazorpayInstance,
  RazorpayOptions,
  RazorpayPaymentSuccessResponse,
  UseRazorpayCheckoutOptions,
} from "@/features/subscription/types/subscription.types";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let razorpayScriptPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(src = RAZORPAY_SCRIPT_URL): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
  if (existingScript?.dataset.loaded === "true" && window.Razorpay) {
    return Promise.resolve(true);
  }

  razorpayScriptPromise = new Promise<boolean>((resolve) => {
    const script = existingScript || document.createElement("script");
    script.src = src;
    script.async = true;

    const cleanup = () => {
      script.onload = null;
      script.onerror = null;
    };

    script.onload = () => {
      cleanup();
      script.dataset.loaded = "true";
      resolve(true);
    };

    script.onerror = () => {
      cleanup();
      script.remove();
      razorpayScriptPromise = null;
      resolve(false);
    };

    if (!existingScript) {
      document.body.appendChild(script);
    }
  });

  return razorpayScriptPromise;
}

export function useRazorpayCheckout({ onSuccess, onError }: UseRazorpayCheckoutOptions = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const startCheckout = async (planId: string) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      setSelectedPlanId(planId);

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        throw new Error(SUBSCRIPTION_MESSAGES.SCRIPT_LOAD_ERROR);
      }

      const orderData = await subscriptionApi.createOrder(planId);

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SpotQ",
        description: `${orderData.plan.name} Subscription`,
        order_id: orderData.orderId,
        prefill: {
          name: orderData.restaurant.name || "",
          email: orderData.restaurant.email || "",
          contact: orderData.restaurant.phone || "",
        },
        theme: {
          color: "#ea580c",
        },
        handler: async (paymentResponse: RazorpayPaymentSuccessResponse) => {
          try {
            const verificationResult = await subscriptionApi.verifyPayment({
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            });

            toast.success(SUBSCRIPTION_MESSAGES.PAYMENT_VERIFIED_SUCCESS);
            onSuccess?.(verificationResult);
          } catch (err) {
            const message =
              err instanceof Error ? err.message : SUBSCRIPTION_MESSAGES.PAYMENT_VERIFY_FAILED;
            toast.error(message);
            onError?.(err instanceof Error ? err : new Error(message));
          } finally {
            setIsProcessing(false);
            setSelectedPlanId(null);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setSelectedPlanId(null);
            toast.info(SUBSCRIPTION_MESSAGES.PAYMENT_CANCELLED);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      setIsProcessing(false);
      setSelectedPlanId(null);
      const message =
        err instanceof Error ? err.message : SUBSCRIPTION_MESSAGES.ORDER_CREATION_FAILED;
      toast.error(message);
      onError?.(err instanceof Error ? err : new Error(message));
    }
  };

  return {
    startCheckout,
    isProcessing,
    selectedPlanId,
  };
}
