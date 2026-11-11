import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_HISTORY_MESSAGES } from "@/features/subscription/constants/subscription-history.constants";
import { cn } from "@/lib/utils/cn";

export interface DownloadInvoiceButtonProps {
  invoiceUrl: string | null;
  invoiceNumber?: string | null;
  className?: string;
}

export function DownloadInvoiceButton({
  invoiceUrl,
  invoiceNumber,
  className,
}: DownloadInvoiceButtonProps) {
  const hasInvoice = Boolean(invoiceUrl);

  const handleClick = () => {
    if (invoiceUrl) {
      window.open(invoiceUrl, "_blank", "noopener,noreferrer");
    }
  };

  const ariaLabel = invoiceNumber
    ? `${SUBSCRIPTION_HISTORY_MESSAGES.DOWNLOAD_INVOICE_ARIA} ${invoiceNumber}`
    : SUBSCRIPTION_HISTORY_MESSAGES.DOWNLOAD_INVOICE_ARIA;

  if (!hasInvoice) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled
        aria-disabled="true"
        title={SUBSCRIPTION_HISTORY_MESSAGES.INVOICE_NOT_AVAILABLE}
        className={cn("text-neutral-400 cursor-not-allowed opacity-60", className)}
        data-testid="download-invoice-button-disabled"
      >
        <FileText className="size-3.5 mr-1" aria-hidden="true" />
        <span>{SUBSCRIPTION_HISTORY_MESSAGES.INVOICE_UNAVAILABLE_LABEL}</span>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={cn(
        "text-xs font-medium text-[#9a3412] border-[#f3e6de] hover:bg-[#fef3ec] hover:text-[#7c2d12]",
        className,
      )}
      data-testid="download-invoice-button"
    >
      <Download className="size-3.5 mr-1 text-[#ea580c]" aria-hidden="true" />
      <span>{SUBSCRIPTION_HISTORY_MESSAGES.DOWNLOAD_BUTTON_LABEL}</span>
    </Button>
  );
}
