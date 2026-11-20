import { AlertCircle, ArrowRight, RotateCcw, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/restaurant/restaurant.routes.constants";
import { Button } from "@/components/ui/button";
import { WALLET_MESSAGES } from "@/features/wallet/constants/wallet.constants";

export interface WalletEmptyStateProps {
  isNotFound?: boolean;
  errorMessage?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function WalletEmptyState({
  isNotFound = false,
  errorMessage,
  onRetry,
  isRetrying = false,
}: WalletEmptyStateProps) {
  if (isNotFound) {
    return (
      <section
        role="status"
        aria-label={WALLET_MESSAGES.NOT_INITIALIZED_TITLE}
        className="flex flex-col items-center justify-center rounded-2xl border border-[#eddcd4] bg-[#faf7f5]/80 px-6 py-16 text-center select-none shadow-xs sm:py-20"
        data-testid="wallet-not-initialized"
      >
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-orange-200/60 bg-orange-100/60 text-[#e8631b] shadow-2xs">
          <Wallet className="size-7" />
        </div>

        <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">
          {WALLET_MESSAGES.NOT_INITIALIZED_TITLE}
        </h2>

        <p className="mt-2 max-w-md text-sm text-neutral-600 leading-relaxed">
          {WALLET_MESSAGES.NOT_INITIALIZED_DESCRIPTION}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            className="rounded-xl border-[#eddcd4] bg-white text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] gap-2"
          >
            <RotateCcw className={`size-3.5 ${isRetrying ? "animate-spin" : ""}`} />
            {WALLET_MESSAGES.ACTION_CHECK_AGAIN}
          </Button>

          <Link
            to={RESTAURANT_ROUTES.DASHBOARD}
            className="inline-flex h-8 items-center gap-2 rounded-xl bg-[#e8631b] px-3 text-xs font-semibold text-white shadow-2xs hover:bg-[#d55716] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#e8631b] focus-visible:ring-offset-2"
          >
            {WALLET_MESSAGES.ACTION_DASHBOARD}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      role="alert"
      aria-label={WALLET_MESSAGES.UNABLE_TO_LOAD_TITLE}
      className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/60 px-6 py-12 text-center select-none shadow-xs sm:py-16"
      data-testid="wallet-load-error"
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-rose-200 bg-rose-100 text-rose-600 shadow-2xs">
        <AlertCircle className="size-6" />
      </div>

      <h2 className="text-base font-bold text-neutral-900 sm:text-lg">
        {WALLET_MESSAGES.UNABLE_TO_LOAD_TITLE}
      </h2>

      <p className="mt-1.5 max-w-md text-sm text-rose-700">
        {errorMessage || WALLET_MESSAGES.UNABLE_TO_LOAD_DESCRIPTION}
      </p>

      <div className="mt-5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isRetrying}
          className="rounded-xl border-rose-200 bg-white text-xs font-semibold text-rose-800 hover:bg-rose-50 gap-2"
        >
          <RotateCcw className={`size-3.5 ${isRetrying ? "animate-spin" : ""}`} />
          {WALLET_MESSAGES.ACTION_RETRY}
        </Button>
      </div>
    </section>
  );
}

