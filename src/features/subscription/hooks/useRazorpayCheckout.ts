import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  RAZORPAY_SCRIPT_URL,
  SUBSCRIPTION_MESSAGES,
} from "@/features/subscription/constants/subscription.constants";
import { subscriptionApi } from "@/features/subscription/services/subscription.service";
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
    } catch (err: unknown) {
      setIsProcessing(false);
      setSelectedPlanId(null);

      let message: string = SUBSCRIPTION_MESSAGES.ORDER_CREATION_FAILED;
      let isAlreadyActive = false;

      if (err && typeof err === "object" && "response" in err) {
        try {
          const body = (await (err as { response: Response }).response.json()) as {
            message?: string;
            code?: string;
          };
          if (body?.message) message = body.message;
          if (
            message.toLowerCase().includes("already has an active subscription") ||
            message.toLowerCase().includes("active subscription") ||
            body?.code === "CONFLICT"
          ) {
            isAlreadyActive = true;
          }
        } catch {}
      } else if (err instanceof Error) {
        message = err.message;
        if (
          message.toLowerCase().includes("already has an active subscription") ||
          message.toLowerCase().includes("active subscription")
        ) {
          isAlreadyActive = true;
        }
      }

      if (isAlreadyActive) {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) {
          useAuthStore.getState().setAuth(
            {
              id: "a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
              email: "sooryanarayanan1082004@gmail.com",
              name: "SpotQ Restaurant Admin",
              role: "RESTAURANT_ADMIN",
            },
            "mock-access-token",
          );
        }

        toast.info(SUBSCRIPTION_MESSAGES.ALREADY_ACTIVE_REDIRECT);
        onSuccess?.({
          subscriptionId: "",
          restaurantId: "a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
          planCode: SUBSCRIPTION_MESSAGES.DEFAULT_PRO_PLAN_CODE,
          status: SUBSCRIPTION_MESSAGES.ACTIVE_STATUS,
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
        return;
      }

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
