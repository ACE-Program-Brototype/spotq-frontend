export interface VerificationRejectedViewProps {
  rejectionReason: string | null;
  onEditApplication: () => void;
  onSignOut: () => void;
}

export function VerificationRejectedView({
  rejectionReason,
  onEditApplication,
  onSignOut,
}: VerificationRejectedViewProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
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
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100/80 px-3.5 py-1 text-xs font-bold tracking-wide uppercase text-red-800">
        Application Rejected
      </span>
      <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">
        Verification Unsuccessful
      </h1>
      <p className="mt-2 max-w-md text-sm text-neutral-600">
        Unfortunately, your restaurant onboarding application was rejected by our review team.
      </p>

      <div className="mt-6 w-full rounded-2xl border border-red-200 bg-red-50/70 p-4 text-left text-xs text-red-900">
        <p className="font-bold text-red-950">Rejection Details:</p>
        <p className="mt-1 text-red-800">
          {rejectionReason ||
            "Some details or documents submitted did not pass our verification standards. Please update your details and resubmit."}
        </p>
      </div>

      <div className="mt-8 w-full flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onEditApplication}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Edit &amp; Resubmit Application
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="rounded-2xl border border-neutral-300 bg-white px-5 py-3.5 text-sm font-semibold text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
