import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  SUBSCRIPTION_MESSAGES,
  SUBSCRIPTION_QUERY_KEYS,
} from "@/features/subscription/constants/subscription.constants";
import { loadRazorpayScript } from "@/features/subscription/hooks/useRazorpayCheckout";
import { subscriptionService } from "@/features/subscription/services/subscription.service";
import type {
  RazorpayInstance,
  RazorpayOptions,
  RazorpayPaymentSuccessResponse,
  UseSubscriptionRenewalOptions,
} from "@/features/subscription/types/subscription.types";
import {
  generateIdempotencyKey,
  resolveErrorMessage,
} from "@/features/subscription/utils/subscription-renewal.utils";

export function useSubscriptionRenewal({ onSuccess, onError }: UseSubscriptionRenewalOptions = {}) {
  const queryClient = useQueryClient();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [customErrorMessage, setCustomErrorMessage] = useState<string | null>(null);
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

  const resetAttemptKey = useCallback(() => {
    attemptKeyRef.current = null;
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

  const renewalMutation = useMutation({
    mutationFn: async ({
      subscriptionId,
      planId,
      idempotencyKey,
    }: {
      subscriptionId: string;
      planId: string;
      idempotencyKey: string;
    }) => {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        throw new Error(SUBSCRIPTION_MESSAGES.SCRIPT_LOAD_ERROR);
      }

      return subscriptionService.renewSubscription(subscriptionId, planId, idempotencyKey);
    },
  });

  const clearError = useCallback(() => {
    renewalMutation.reset();
    if (isMountedRef.current) {
      setCustomErrorMessage(null);
    }
  }, [renewalMutation]);

  const releaseLock = useCallback(() => {
    inFlightRef.current = false;
    if (isMountedRef.current) {
      setIsCheckoutOpen(false);
      setIsVerifying(false);
    }
  }, []);

  const initiateRenewal = useCallback(
    async (subscriptionId: string, planId: string) => {
      if (inFlightRef.current || renewalMutation.isPending) {
        return;
      }

      inFlightRef.current = true;
      if (isMountedRef.current) {
        setCustomErrorMessage(null);
      }

      const idempotencyKey = resolveAttemptIdempotencyKey(subscriptionId, planId);

      try {
        const renewalOrder = await renewalMutation.mutateAsync({
          subscriptionId,
          planId,
          idempotencyKey,
        });
        attemptKeyRef.current = null;
        if (isMountedRef.current) {
          setIsCheckoutOpen(true);
        }

        const options: RazorpayOptions = {
          key: renewalOrder.keyId,
          amount: renewalOrder.amount,
          currency: renewalOrder.currency,
          name: "SpotQ",
          description: `${renewalOrder.plan.name} Subscription Renewal`,
          order_id: renewalOrder.orderId,
          prefill: {
            name: renewalOrder.restaurant.name || "",
            email: renewalOrder.restaurant.email || "",
            contact: renewalOrder.restaurant.phone || "",
          },
          theme: {
            color: "#ea580c",
          },
          handler: async (paymentResponse: RazorpayPaymentSuccessResponse) => {
            if (isMountedRef.current) {
              setIsVerifying(true);
            }
            try {
              const verified = await subscriptionService.verifyPayment({
                razorpayOrderId: paymentResponse.razorpay_order_id,
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpaySignature: paymentResponse.razorpay_signature,
              });

              await queryClient.invalidateQueries({
                queryKey: SUBSCRIPTION_QUERY_KEYS.RESTAURANT_STATUS,
              });

              toast.success(
                "Subscription renewed successfully! Your updated validity dates are now active.",
              );
              onSuccess?.(verified);
            } catch (verifyErr) {
              const message = await resolveErrorMessage(
                verifyErr,
                SUBSCRIPTION_MESSAGES.PAYMENT_VERIFY_FAILED,
              );
              if (isMountedRef.current) {
                setCustomErrorMessage(message);
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
            setCustomErrorMessage(failureMessage);
          }
          toast.error(failureMessage);
          onError?.(new Error(failureMessage));
        });

        instance.open();
      } catch (err) {
        releaseLock();
        const message = await resolveErrorMessage(
          err,
          "Failed to initiate subscription renewal. Please try again.",
        );
        if (isMountedRef.current) {
          setCustomErrorMessage(message);
        }
        toast.error(message);
        onError?.(err instanceof Error ? err : new Error(message));
      }
    },
    [onError, onSuccess, queryClient, releaseLock, renewalMutation, resolveAttemptIdempotencyKey],
  );

  const isSubmitting = renewalMutation.isPending || isVerifying || isCheckoutOpen;
  const errorMessage = customErrorMessage;

  return {
    initiateRenewal,
    isSubmitting,
    errorMessage,
    clearError,
    resetAttemptKey,
  };
}
