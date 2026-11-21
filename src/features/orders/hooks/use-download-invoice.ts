import { useState } from "react";
import { toast } from "sonner";
import { customerPaymentService } from "@/features/payments/services/customer-payment.service";
import { parseApiError } from "@/features/payments/utils/customer-payment.utils";

export interface UseDownloadInvoiceOptions {
  onSuccess?: (downloadUrl: string) => void;
  onError?: (error: Error) => void;
}

export function useDownloadInvoice(options?: UseDownloadInvoiceOptions) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadInvoice = async (paymentId?: string | null, orderNumber?: string) => {
    const trimmedId = paymentId?.trim();
    if (!trimmedId) {
      toast.error("Invoice is not available for this order.");
      return;
    }

    try {
      setIsDownloading(true);
      const downloadUrl = await customerPaymentService.getInvoiceDownloadUrl(trimmedId);

      // Render/open and download the PDF invoice in a new window/tab
      const newWindow = window.open(downloadUrl, "_blank", "noopener,noreferrer");
      if (!newWindow) {
        // Fallback if pop-up blocker intervened
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        if (orderNumber) {
          link.download = `SpotQ-Invoice-${orderNumber}.pdf`;
        }
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      toast.success("Invoice opened in new tab");
      options?.onSuccess?.(downloadUrl);
      return downloadUrl;
    } catch (err) {
      const parsed = await parseApiError(err);
      const errorMessage = parsed.message || "Failed to download tax invoice. Please try again.";
      toast.error(errorMessage);
      options?.onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadInvoice,
    isDownloading,
  };
}
