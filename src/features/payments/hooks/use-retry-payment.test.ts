import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { toast } from "sonner";
import { loadRazorpayScript } from "@/lib/utils/razorpay";
import { customerPaymentService } from "../services/customer-payment.service";
import type { CustomerPaymentTransaction } from "../types/customer-payment.types";
import { useRetryPayment } from "./use-retry-payment";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("../services/customer-payment.service", () => ({
  customerPaymentService: {
    retryPayment: jest.fn(),
    verifyPayment: jest.fn(),
    getInvoiceDownloadUrl: jest.fn(),
  },
}));

jest.mock("@/lib/utils/razorpay", () => ({
  loadRazorpayScript: jest.fn(),
}));

function createWrapper(queryClient = new QueryClient()) {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useRetryPayment", () => {
  let mockRazorpayConstructor: jest.Mock;
  let mockRazorpayOpen: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    mockRazorpayOpen = jest.fn();
    mockRazorpayConstructor = jest.fn().mockImplementation(() => ({
      open: mockRazorpayOpen,
    }));
    window.Razorpay = mockRazorpayConstructor as unknown as typeof window.Razorpay;
  });

  afterEach(() => {
    delete (window as { Razorpay?: unknown }).Razorpay;
  });

  const sampleFailedTx: CustomerPaymentTransaction = {
    transactionId: "tx-failed-1",
    orderId: "order-uuid-1",
    orderNumber: "SQ-98214",
    amountPaise: 54000,
    amountInRupees: 540,
    currency: "INR",
    paymentMethod: "UPI",
    status: "FAILED",
    createdAt: "2026-10-27T03:35:00.000Z",
    hasInvoice: false,
    retryEligible: true,
  };

  it("initiates retry, launches Razorpay modal, and verifies on success", async () => {
    (loadRazorpayScript as jest.Mock).mockResolvedValue(true);
    (customerPaymentService.retryPayment as jest.Mock).mockResolvedValue({
      transactionId: "tx-failed-1",
      orderId: "order-uuid-1",
      razorpayOrderId: "order_EK98a123cd45",
      amountPaise: 54000,
      amountInRupees: 540,
      currency: "INR",
      keyId: "rzp_test_SpotQKey123",
    });
    (customerPaymentService.verifyPayment as jest.Mock).mockResolvedValue({
      success: true,
    });

    const queryClient = new QueryClient();
    queryClient.setQueryData(["customer-payments", "history", {}], {
      transactions: [sampleFailedTx],
      pagination: { currentPage: 1, totalItems: 1 },
    });

    const { result } = renderHook(() => useRetryPayment(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.handleRetry(sampleFailedTx);
    });

    expect(loadRazorpayScript).toHaveBeenCalled();
    expect(customerPaymentService.retryPayment).toHaveBeenCalledWith("tx-failed-1");
    expect(mockRazorpayConstructor).toHaveBeenCalled();
    expect(mockRazorpayOpen).toHaveBeenCalled();

    // Trigger modal handler
    const options = mockRazorpayConstructor.mock.calls[0][0];
    await act(async () => {
      await options.handler({
        razorpay_order_id: "order_EK98a123cd45",
        razorpay_payment_id: "pay_12345",
        razorpay_signature: "sig_abcde",
      });
    });

    expect(customerPaymentService.verifyPayment).toHaveBeenCalledWith({
      orderId: "order-uuid-1",
      razorpayOrderId: "order_EK98a123cd45",
      razorpayPaymentId: "pay_12345",
      razorpaySignature: "sig_abcde",
    });
    expect(toast.success).toHaveBeenCalledWith("Payment successful! Food order confirmed.");
  });

  it("handles modal dismissal gracefully", async () => {
    (loadRazorpayScript as jest.Mock).mockResolvedValue(true);
    (customerPaymentService.retryPayment as jest.Mock).mockResolvedValue({
      transactionId: "tx-failed-1",
      orderId: "order-uuid-1",
      razorpayOrderId: "order_EK98a123cd45",
      amountPaise: 54000,
      amountInRupees: 540,
      currency: "INR",
      keyId: "rzp_test_SpotQKey123",
    });

    const { result } = renderHook(() => useRetryPayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleRetry(sampleFailedTx);
    });

    const options = mockRazorpayConstructor.mock.calls[0][0];
    act(() => {
      options.modal.ondismiss();
    });

    expect(result.current.isRetrying("tx-failed-1")).toBe(false);
  });

  it("handles 409 conflict already paid error", async () => {
    (loadRazorpayScript as jest.Mock).mockResolvedValue(true);
    const conflictErr = {
      response: {
        status: 409,
        clone: () => ({
          json: async () => ({ message: "Already paid" }),
        }),
      },
    };
    (customerPaymentService.retryPayment as jest.Mock).mockRejectedValue(conflictErr);

    const { result } = renderHook(() => useRetryPayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleRetry(sampleFailedTx);
    });

    expect(toast.info).toHaveBeenCalledWith("This order has already been paid.");
  });

  it("handles 422 order expired error", async () => {
    (loadRazorpayScript as jest.Mock).mockResolvedValue(true);
    const expiredErr = {
      response: {
        status: 422,
        clone: () => ({
          json: async () => ({ message: "Order expired" }),
        }),
      },
    };
    (customerPaymentService.retryPayment as jest.Mock).mockRejectedValue(expiredErr);

    const { result } = renderHook(() => useRetryPayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleRetry(sampleFailedTx);
    });

    expect(toast.error).toHaveBeenCalledWith("Payment window expired. Cart has been released.");
  });

  it("downloads invoice via invoiceUrl when present", async () => {
    const successTxWithUrl: CustomerPaymentTransaction = {
      ...sampleFailedTx,
      status: "CAPTURED",
      hasInvoice: true,
      invoiceUrl: "/api/v1/payments/transactions/tx-failed-1/invoice",
    };

    (customerPaymentService.getInvoiceDownloadUrl as jest.Mock).mockResolvedValue(
      "https://spotq-invoices.s3.amazonaws.com/receipt.pdf",
    );

    const { result } = renderHook(() => useRetryPayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleDownloadInvoice(successTxWithUrl);
    });

    expect(customerPaymentService.getInvoiceDownloadUrl).toHaveBeenCalledWith(
      "/api/v1/payments/transactions/tx-failed-1/invoice",
    );
    expect(toast.success).toHaveBeenCalledWith("Tax invoice downloaded successfully.");
  });

  it("downloads invoice via transactionId fallback when invoiceUrl is absent", async () => {
    const successTxWithoutUrl: CustomerPaymentTransaction = {
      ...sampleFailedTx,
      status: "CAPTURED",
      hasInvoice: true,
      invoiceUrl: null,
    };

    (customerPaymentService.getInvoiceDownloadUrl as jest.Mock).mockResolvedValue(
      "https://spotq-invoices.s3.amazonaws.com/receipt-direct.pdf",
    );

    const { result } = renderHook(() => useRetryPayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleDownloadInvoice(successTxWithoutUrl);
    });

    expect(customerPaymentService.getInvoiceDownloadUrl).toHaveBeenCalledWith("tx-failed-1");
    expect(toast.success).toHaveBeenCalledWith("Tax invoice downloaded successfully.");
  });

  it("handles invoice download error gracefully with error toast", async () => {
    (customerPaymentService.getInvoiceDownloadUrl as jest.Mock).mockRejectedValue(
      new Error("Download failed"),
    );

    const { result } = renderHook(() => useRetryPayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleDownloadInvoice(sampleFailedTx);
    });

    expect(toast.error).toHaveBeenCalledWith("Failed to download tax invoice.");
  });
});
