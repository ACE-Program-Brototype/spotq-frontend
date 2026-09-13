import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PROFILE_MESSAGES } from "../constants/profile.constants";

interface StaffProfileErrorStateProps {
  message?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function StaffProfileErrorState({
  message = PROFILE_MESSAGES.FETCH_ERROR,
  onRetry,
  isRetrying = false,
}: StaffProfileErrorStateProps) {
  return (
    <Card
      role="alert"
      className="rounded-2xl border-red-200 bg-red-50/70 p-6 sm:p-8 text-center max-w-xl mx-auto my-12 shadow-xs"
    >
      <CardContent className="p-0 space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <AlertCircle className="size-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-neutral-900">
            {PROFILE_MESSAGES.UNABLE_TO_LOAD}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">{message}</p>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="bg-[#9a3412] hover:bg-[#7c2d12] text-white font-semibold rounded-xl px-5 h-10 shadow-xs inline-flex items-center gap-2"
          >
            <RefreshCw className={`size-4 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? PROFILE_MESSAGES.RETRYING : PROFILE_MESSAGES.RETRY}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
