export interface VerificationApprovedViewProps {
  onProceedToSubscription: () => void;
}

export function VerificationApprovedView({
  onProceedToSubscription,
}: VerificationApprovedViewProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <svg
          className="h-10 w-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-bold tracking-wide uppercase text-emerald-800">
        Verified &amp; Approved
      </span>
      <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">
        Application Approved!
      </h1>
      <p className="mt-2 max-w-md text-sm text-neutral-600">
        Congratulations! Your restaurant account has been verified. You can now select your
        subscription plan to get started.
      </p>

      <div className="mt-8 w-full flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onProceedToSubscription}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Proceed to Subscription
        </button>
      </div>
    </div>
  );
}
