import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OrderReceiptCard } from "../components/OrderReceiptCard";
import { ReceiptSkeleton } from "../components/ReceiptSkeleton";
import { ORDER_RECEIPT_MESSAGES } from "../constants/order-receipt.constants";
import { useOrderReceipt } from "../hooks/use-order-receipt";

export default function OrderReceiptPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const activeOrderId = orderId ?? "ord_992817203";
  const { data: receipt, isLoading, isError, refetch } = useOrderReceipt(activeOrderId);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div
      data-testid="order-receipt-page"
      className="min-h-screen bg-neutral-50/60 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-xl mx-auto mb-6">
        <button
          type="button"
          data-testid="receipt-back-button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>{ORDER_RECEIPT_MESSAGES.BACK_TO_ORDERS}</span>
        </button>

        <div className="mt-4">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            {ORDER_RECEIPT_MESSAGES.PAGE_TITLE}
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">{ORDER_RECEIPT_MESSAGES.PAGE_SUBTITLE}</p>
        </div>
      </div>

      {isLoading && <ReceiptSkeleton />}

      {isError && (
        <div
          data-testid="receipt-error-state"
          className="max-w-xl mx-auto rounded-2xl bg-white border border-rose-200 p-8 text-center space-y-4 shadow-xs"
        >
          <div className="size-12 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertCircle className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              {ORDER_RECEIPT_MESSAGES.ERROR_TITLE}
            </h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
              {ORDER_RECEIPT_MESSAGES.ERROR_DESCRIPTION}
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="size-3.5" />
              <span>{ORDER_RECEIPT_MESSAGES.RETRY_BUTTON}</span>
            </Button>
            <Button type="button" onClick={handleBack} className="bg-neutral-900 text-white">
              {ORDER_RECEIPT_MESSAGES.BACK_TO_HOME}
            </Button>
          </div>
        </div>
      )}

      {receipt && !isLoading && !isError && <OrderReceiptCard receipt={receipt} />}
    </div>
  );
}
