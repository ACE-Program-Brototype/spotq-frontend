import { act, renderHook } from "@testing-library/react";
import { toast } from "sonner";
import { customerPaymentService } from "@/features/payments/services/customer-payment.service";
import { useDownloadInvoice } from "./use-download-invoice";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/features/payments/services/customer-payment.service", () => ({
  customerPaymentService: {
    getInvoiceDownloadUrl: jest.fn(),
  },
}));

describe("useDownloadInvoice", () => {
  const mockDownloadUrl =
    "https://spotq-restaurant-files.s3.ap-south-1.amazonaws.com/spotq-order-invoices/invoice-123.pdf";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("opens invoice in a new window when successful", async () => {
    (customerPaymentService.getInvoiceDownloadUrl as jest.Mock).mockResolvedValue(mockDownloadUrl);
    const mockWindowOpen = jest.fn().mockReturnValue({});
    window.open = mockWindowOpen;

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useDownloadInvoice({ onSuccess }));

    await act(async () => {
      await result.current.downloadInvoice("pay-uuid-123", "ORD-101");
    });

    expect(customerPaymentService.getInvoiceDownloadUrl).toHaveBeenCalledWith("pay-uuid-123");
    expect(mockWindowOpen).toHaveBeenCalledWith(mockDownloadUrl, "_blank", "noopener,noreferrer");
    expect(toast.success).toHaveBeenCalledWith("Invoice opened in new tab");
    expect(onSuccess).toHaveBeenCalledWith(mockDownloadUrl);
    expect(result.current.isDownloading).toBe(false);
  });

  it("falls back to anchor tag click when pop-up blocker prevents window.open", async () => {
    (customerPaymentService.getInvoiceDownloadUrl as jest.Mock).mockResolvedValue(mockDownloadUrl);
    window.open = jest.fn().mockReturnValue(null);

    const appendChildSpy = jest.spyOn(document.body, "appendChild");
    const clickSpy = jest.fn();
    const createElementSpy = jest
      .spyOn(document, "createElement")
      .mockImplementation((tagName: string) => {
        const el = document.createElementNS("http://www.w3.org/1999/xhtml", tagName);
        if (tagName.toLowerCase() === "a") {
          el.click = clickSpy;
        }
        return el;
      });

    const { result } = renderHook(() => useDownloadInvoice());

    await act(async () => {
      await result.current.downloadInvoice("pay-uuid-123", "ORD-101");
    });

    expect(clickSpy).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Invoice opened in new tab");

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
  });

  it("shows error toast when paymentId is missing or empty", async () => {
    const { result } = renderHook(() => useDownloadInvoice());

    await act(async () => {
      await result.current.downloadInvoice("   ");
    });

    expect(customerPaymentService.getInvoiceDownloadUrl).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Invoice is not available for this order.");
  });

  it("handles API errors gracefully and calls onError", async () => {
    (customerPaymentService.getInvoiceDownloadUrl as jest.Mock).mockRejectedValue(
      new Error("Invoice not ready"),
    );

    const onError = jest.fn();
    const { result } = renderHook(() => useDownloadInvoice({ onError }));

    await act(async () => {
      await result.current.downloadInvoice("pay-uuid-123");
    });

    expect(toast.error).toHaveBeenCalledWith("Invoice not ready");
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(result.current.isDownloading).toBe(false);
  });
});
