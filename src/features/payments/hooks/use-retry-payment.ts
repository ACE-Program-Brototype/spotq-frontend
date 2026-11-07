/**
 * useRetryPayment Hook
 * Orchestrates payment retry initiation, Razorpay checkout modal lifecycle,
 * payment signature verification, in-place optimistic mutations, and tax invoice download.
 */

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { loadRazorpayScript } from "@/lib/utils/razorpay";
import {
  CUSTOMER_INVOICE_CONFIG,
  CUSTOMER_PAYMENT_MESSAGES,
  CUSTOMER_PAYMENT_QUERY_KEYS,
  CUSTOMER_PAYMENT_STATUS,
  RAZORPAY_CHECKOUT_CONFIG,
} from "../constants/customer-payment.constants";
import { customerPaymentService } from "../services/customer-payment.service";
import type {
  CustomerPaymentTransaction,
  GetCustomerPaymentHistoryResponse,
  RazorpayStandardInstance,
  RazorpayStandardOptions,
} from "../types/customer-payment.types";
import { parseApiError } from "../utils/customer-payment.utils";

export function useRetryPayment() {
  const queryClient = useQueryClient();
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);

  /**
   * Initiates payment retry, launches modal, and verifies completion.
   */
  const handleRetry = async (transaction: CustomerPaymentTransaction) => {
    if (retryingId) return;

    try {
      setRetryingId(transaction.transactionId);

      // 1. Ensure Razorpay checkout script is loaded
      const isLoaded = await loadRazorpayScript();
      const RazorpayConstructor = (
        window as unknown as {
          Razorpay?: new (options: RazorpayStandardOptions) => RazorpayStandardInstance;
        }
      ).Razorpay;
      if (!isLoaded || !RazorpayConstructor) {
        toast.error(CUSTOMER_PAYMENT_MESSAGES.TOAST_SCRIPT_LOAD_ERROR);
        setRetryingId(null);
        return;
      }

      // 2. Request backend to initiate retry order
      const retryData = await customerPaymentService.retryPayment(transaction.transactionId);

      // 3. Configure and open Razorpay Standard Checkout modal
      const options: RazorpayStandardOptions = {
        key: retryData.keyId,
        amount: retryData.amountPaise,
        currency: retryData.currency || RAZORPAY_CHECKOUT_CONFIG.DEFAULT_CURRENCY,
        order_id: retryData.razorpayOrderId,
        name: RAZORPAY_CHECKOUT_CONFIG.MERCHANT_NAME,
        description: RAZORPAY_CHECKOUT_CONFIG.RETRY_DESCRIPTION,
        theme: {
          color: RAZORPAY_CHECKOUT_CONFIG.THEME_COLOR,
        },
        modal: {
          ondismiss: () => {
            // User cancelled/closed modal without paying
            setRetryingId(null);
          },
        },
        handler: async (response) => {
          try {
            // 4. Verify payment with backend signature check
            await customerPaymentService.verifyPayment({
              orderId: retryData.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            toast.success(CUSTOMER_PAYMENT_MESSAGES.TOAST_PAYMENT_SUCCESS);

            // 5. In-place table row update to CAPTURED in TanStack Query cache
            queryClient.setQueriesData<GetCustomerPaymentHistoryResponse>(
              { queryKey: CUSTOMER_PAYMENT_QUERY_KEYS.ALL },
              (old) => {
                if (!old) return old;
                return {
                  ...old,
                  transactions: old.transactions.map((tx) =>
                    tx.transactionId === transaction.transactionId ||
                    tx.orderId === retryData.orderId
                      ? {
                          ...tx,
                          status: CUSTOMER_PAYMENT_STATUS.CAPTURED,
                          retryEligible: false,
                          _justSucceeded: true,
                        }
                      : tx,
                  ),
                };
              },
            );

            // Refetch to sync fresh state with server
            queryClient.invalidateQueries({
              queryKey: CUSTOMER_PAYMENT_QUERY_KEYS.ALL,
            });
          } catch (verifyErr) {
            const parsed = await parseApiError(verifyErr);
            toast.error(parsed.message || CUSTOMER_PAYMENT_MESSAGES.TOAST_VERIFY_FAILED);
          } finally {
            setRetryingId(null);
          }
        },
      };

      const razorpayInstance = new RazorpayConstructor(options);
      razorpayInstance.open();
    } catch (err) {
      setRetryingId(null);
      const parsed = await parseApiError(err);

      if (parsed.status === 409) {
        // Already paid scenario
        toast.info(CUSTOMER_PAYMENT_MESSAGES.TOAST_ALREADY_PAID);
        queryClient.setQueriesData<GetCustomerPaymentHistoryResponse>(
          { queryKey: CUSTOMER_PAYMENT_QUERY_KEYS.ALL },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              transactions: old.transactions.map((tx) =>
                tx.transactionId === transaction.transactionId
                  ? { ...tx, status: CUSTOMER_PAYMENT_STATUS.CAPTURED, retryEligible: false }
                  : tx,
              ),
            };
          },
        );
        queryClient.invalidateQueries({ queryKey: CUSTOMER_PAYMENT_QUERY_KEYS.ALL });
      } else if (parsed.status === 422) {
        // Order expired scenario
        toast.error(CUSTOMER_PAYMENT_MESSAGES.TOAST_ORDER_EXPIRED);
        queryClient.setQueriesData<GetCustomerPaymentHistoryResponse>(
          { queryKey: CUSTOMER_PAYMENT_QUERY_KEYS.ALL },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              transactions: old.transactions.map((tx) =>
                tx.transactionId === transaction.transactionId
                  ? { ...tx, retryEligible: false }
                  : tx,
              ),
            };
          },
        );
      } else {
        toast.error(parsed.message || CUSTOMER_PAYMENT_MESSAGES.TOAST_RETRY_FAILED);
      }
    }
  };

  /**
   * Downloads official GST tax invoice PDF via backend presigned S3 URL.
   */
  const handleDownloadInvoice = async (transaction: CustomerPaymentTransaction) => {
    if (downloadingInvoiceId) return;

    try {
      setDownloadingInvoiceId(transaction.transactionId);
      const fileName = CUSTOMER_INVOICE_CONFIG.formatFileName(
        transaction.orderNumber || transaction.orderId,
      );

      const target = transaction.invoiceUrl || transaction.transactionId;
      const downloadUrl = await customerPaymentService.getInvoiceDownloadUrl(target);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(CUSTOMER_PAYMENT_MESSAGES.TOAST_INVOICE_DOWNLOAD_SUCCESS);
    } catch {
      toast.error(CUSTOMER_PAYMENT_MESSAGES.TOAST_INVOICE_DOWNLOAD_ERROR);
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  return {
    handleRetry,
    handleDownloadInvoice,
    retryingId,
    downloadingInvoiceId,
    isRetrying: (id: string) => retryingId === id,
    isDownloading: (id: string) => downloadingInvoiceId === id,
  };
}
