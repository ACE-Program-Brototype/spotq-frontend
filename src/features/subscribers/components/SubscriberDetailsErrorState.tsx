import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SUBSCRIBER_MESSAGES } from "../constants/subscriber.constants";

export interface SubscriberDetailsErrorStateProps {
  isNotFound?: boolean;
  onBack: () => void;
  onRetry?: () => void;
}

export function SubscriberDetailsErrorState({
  isNotFound = false,
  onBack,
  onRetry,
}: SubscriberDetailsErrorStateProps) {
  return (
    <div className="space-y-6" data-testid="subscriber-details-error-state">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 mb-2"
        data-testid="subscriber-error-back-btn"
      >
        <ArrowLeft className="size-4" />
        {SUBSCRIBER_MESSAGES.DETAILS_PAGE_BACK_BUTTON}
      </Button>

      <Card className="border-slate-200">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div
            className={`flex size-14 items-center justify-center rounded-full mb-4 ${
              isNotFound ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
            }`}
          >
            <AlertCircle className="size-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {isNotFound
              ? SUBSCRIBER_MESSAGES.DETAILS_NOT_FOUND_TITLE
              : SUBSCRIBER_MESSAGES.DETAILS_ERROR_TITLE}
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md">
            {isNotFound
              ? SUBSCRIBER_MESSAGES.DETAILS_NOT_FOUND_DESCRIPTION
              : SUBSCRIBER_MESSAGES.DETAILS_ERROR_DESCRIPTION}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBack}
              className="rounded-xl"
            >
              {SUBSCRIBER_MESSAGES.DETAILS_PAGE_BACK_BUTTON}
            </Button>
            {!isNotFound && onRetry && (
              <Button
                type="button"
                size="sm"
                onClick={onRetry}
                className="gap-1.5 rounded-xl bg-[#1e3a5f] text-white hover:bg-[#1e3a5f]/90"
                data-testid="subscriber-error-retry-btn"
              >
                <RefreshCw className="size-3.5" />
                {SUBSCRIBER_MESSAGES.RETRY_BUTTON}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
