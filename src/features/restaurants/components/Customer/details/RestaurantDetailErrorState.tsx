import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";

export interface RestaurantDetailErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function RestaurantDetailErrorState({
  message = "Failed to load restaurant details. The restaurant might have been temporarily unlisted.",
  onRetry,
}: RestaurantDetailErrorStateProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 mb-4 shadow-xs">
        <AlertCircle className="size-8" />
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
        Restaurant Unavailable
      </h2>

      <p className="mt-2 max-w-md text-xs sm:text-sm text-neutral-500 leading-relaxed">
        {message}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            type="button"
            variant="outline"
            onClick={onRetry}
            className="font-bold text-xs"
          >
            <RefreshCw className="size-3.5 mr-1.5" />
            Try Again
          </Button>
        )}

        <Link
          to={CUSTOMER_ROUTES.HOME}
          className="inline-flex items-center justify-center rounded-lg h-8 px-3 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs transition-colors"
        >
          <ArrowLeft className="size-3.5 mr-1.5" />
          Browse Other Restaurants
        </Link>
      </div>
    </div>
  );
}
