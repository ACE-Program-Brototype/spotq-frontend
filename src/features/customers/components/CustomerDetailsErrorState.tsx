import { AlertCircle, ArrowLeft, RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CUSTOMER_MESSAGES } from "../constants/customer.constants";

interface CustomerDetailsErrorStateProps {
  isNotFound: boolean;
  customerId?: string;
  onBack: () => void;
  onRetry: () => void;
}

export function CustomerDetailsErrorState({
  isNotFound,
  customerId,
  onBack,
  onRetry,
}: CustomerDetailsErrorStateProps) {
  if (isNotFound) {
    return (
      <div className="space-y-6" data-testid="admin-customer-details-not-found">
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 mb-2"
            data-testid="customer-details-back-btn"
          >
            <ArrowLeft className="size-4" />
            {CUSTOMER_MESSAGES.DETAILS_PAGE_BACK_BUTTON}
          </Button>
        </div>

        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 shadow-xs">
              <User className="size-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {CUSTOMER_MESSAGES.DETAILS_NOT_FOUND_TITLE}
            </h2>
            <p className="mt-1.5 max-w-md text-xs text-slate-500">
              {CUSTOMER_MESSAGES.DETAILS_NOT_FOUND_DESC}
            </p>
            {customerId && (
              <p className="mt-2 text-xs font-mono text-slate-400">
                {CUSTOMER_MESSAGES.DETAILS_PAGE_CUSTOMER_ID_LABEL}: {customerId}
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBack}
              className="mt-6 gap-2 text-xs font-semibold"
            >
              <ArrowLeft className="size-3.5" />
              {CUSTOMER_MESSAGES.DETAILS_PAGE_BACK_BUTTON}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-customer-details-error">
      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 mb-2"
          data-testid="customer-details-back-btn"
        >
          <ArrowLeft className="size-4" />
          {CUSTOMER_MESSAGES.DETAILS_PAGE_BACK_BUTTON}
        </Button>
      </div>

      <Card className="border-rose-200/80 bg-rose-50/30 shadow-xs">
        <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            {CUSTOMER_MESSAGES.DETAILS_FETCH_ERROR_TITLE}
          </h2>
          <p className="mt-1 max-w-md text-xs text-slate-500">
            {CUSTOMER_MESSAGES.DETAILS_FETCH_ERROR_DESC}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="gap-2 text-xs font-semibold bg-white"
            >
              <RefreshCw className="size-3.5" />
              {CUSTOMER_MESSAGES.RETRY_BUTTON}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-xs font-semibold text-slate-600"
            >
              {CUSTOMER_MESSAGES.DETAILS_PAGE_BACK_BUTTON}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
