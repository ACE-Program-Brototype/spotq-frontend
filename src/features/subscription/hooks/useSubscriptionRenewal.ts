import { useQueryClient } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  SUBSCRIPTION_MESSAGES,
  SUBSCRIPTION_QUERY_KEYS,
  SUBSCRIPTION_RENEWAL_TEXTS,
} from "@/features/subscription/constants/subscription.constants";
import { loadRazorpayScript } from "@/features/subscription/hooks/useRazorpayCheckout";
import { subscriptionService } from "@/features/subscription/services/subscription.service";
import type {
  RazorpayInstance,
  RazorpayOptions,
  RazorpayPaymentSuccessResponse,
  UseSubscriptionRenewalOptions,
} from "@/features/subscription/types/subscription.types";
import type { NormalizedApiErrorData } from "@/lib/api/hooks/beforeError";

function generateIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `renew-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function resolveErrorMessage(err: unknown, fallback: string): Promise<string> {
  if (isHTTPError<NormalizedApiErrorData>(err)) {
    if (err.data && typeof err.data === "object") {
      if (err.data.message) {
        return err.data.message;
      }
      if (typeof err.data.error === "string") {
        return err.data.error;
      }
      if (typeof err.data.error === "object" && err.data.error?.message) {
        return err.data.error.message;
      }
    }
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
}

export function useSubscriptionRenewal({ onSuccess, onError }: UseSubscriptionRenewalOptions = {}) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inFlightRef = useRef(false);
  const isMountedRef = useRef(true);
  const razorpayInstanceRef = useRef<RazorpayInstance | null>(null);
  const attemptKeyRef = useRef<{ signature: string; key: string } | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      razorpayInstanceRef.current = null;
      attemptKeyRef.current = null;
    };
  }, []);

  const clearError = useCallback(() => {
    attemptKeyRef.current = null;
    if (isMountedRef.current) {
      setErrorMessage(null);
    }
  }, []);

  const releaseLock = useCallback(() => {
    inFlightRef.current = false;
    if (isMountedRef.current) {
      setIsSubmitting(false);
    }
  }, []);

  const resolveAttemptIdempotencyKey = useCallback((subscriptionId: string, planId: string) => {
    const signature = `${subscriptionId}:${planId || "CURRENT"}`;
    if (attemptKeyRef.current && attemptKeyRef.current.signature === signature) {
      return attemptKeyRef.current.key;
    }

    const freshKey = generateIdempotencyKey();
    attemptKeyRef.current = { signature, key: freshKey };
    return freshKey;
  }, []);

  const initiateRenewal = useCallback(
    async (subscriptionId: string, planId: string) => {
      if (inFlightRef.current) {
        return;
      }

      inFlightRef.current = true;
      if (isMountedRef.current) {
        setIsSubmitting(true);
        setErrorMessage(null);
      }

      const idempotencyKey = resolveAttemptIdempotencyKey(subscriptionId, planId);

      try {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded || !window.Razorpay) {
          throw new Error(SUBSCRIPTION_MESSAGES.SCRIPT_LOAD_ERROR);
        }

        const renewalOrder = await subscriptionService.renewSubscription(
          subscriptionId,
          planId,
          idempotencyKey,
        );
        attemptKeyRef.current = null;

        const options: RazorpayOptions = {
          key: renewalOrder.keyId,
          amount: renewalOrder.amount,
          currency: renewalOrder.currency,
          name: SUBSCRIPTION_RENEWAL_TEXTS.CHECKOUT_BRAND_NAME,
          description: SUBSCRIPTION_RENEWAL_TEXTS.CHECKOUT_DESCRIPTION(renewalOrder.plan.name),
          order_id: renewalOrder.orderId,
          prefill: {
            name: renewalOrder.restaurant.name || "",
            email: renewalOrder.restaurant.email || "",
            contact: renewalOrder.restaurant.phone || "",
          },
          theme: {
            color: SUBSCRIPTION_RENEWAL_TEXTS.CHECKOUT_THEME_COLOR,
          },
          handler: async (paymentResponse: RazorpayPaymentSuccessResponse) => {
            try {
              const verified = await subscriptionService.verifyPayment({
                razorpayOrderId: paymentResponse.razorpay_order_id,
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpaySignature: paymentResponse.razorpay_signature,
              });

              await queryClient.invalidateQueries({
                queryKey: SUBSCRIPTION_QUERY_KEYS.RESTAURANT_STATUS,
              });

              toast.success(SUBSCRIPTION_RENEWAL_TEXTS.RENEWAL_VERIFIED_SUCCESS);
              onSuccess?.(verified);
            } catch (verifyErr) {
              const message = await resolveErrorMessage(
                verifyErr,
                SUBSCRIPTION_MESSAGES.PAYMENT_VERIFY_FAILED,
              );
              if (isMountedRef.current) {
                setErrorMessage(message);
              }
              toast.error(message);
              onError?.(verifyErr instanceof Error ? verifyErr : new Error(message));
            } finally {
              releaseLock();
            }
          },
          modal: {
            ondismiss: () => {
              releaseLock();
              toast.info(SUBSCRIPTION_MESSAGES.PAYMENT_CANCELLED);
            },
          },
        };

        const instance = new window.Razorpay(options);
        razorpayInstanceRef.current = instance;

        instance.on?.("payment.failed", (response) => {
          releaseLock();
          const failureMessage =
            response?.error?.description ||
            response?.error?.reason ||
            SUBSCRIPTION_MESSAGES.PAYMENT_VERIFY_FAILED;
          if (isMountedRef.current) {
            setErrorMessage(failureMessage);
          }
          toast.error(failureMessage);
          onError?.(new Error(failureMessage));
        });

        instance.open();
      } catch (err) {
        releaseLock();
        const message = await resolveErrorMessage(
          err,
          SUBSCRIPTION_RENEWAL_TEXTS.RENEWAL_INITIATION_FAILED,
        );
        if (isMountedRef.current) {
          setErrorMessage(message);
        }
        toast.error(message);
        onError?.(err instanceof Error ? err : new Error(message));
      }
    },
    [onError, onSuccess, queryClient, releaseLock, resolveAttemptIdempotencyKey],
  );

  return {
    initiateRenewal,
    isSubmitting,
    errorMessage,
    clearError,
  };
}
