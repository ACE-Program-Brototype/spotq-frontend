import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getRestaurantVerificationStatus,
  type VerificationStatus,
} from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function VerificationStatusPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [status, setStatus] = useState<VerificationStatus>("UNDER_REVIEW");
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const restaurantEmail = user?.email || "your email";
  const restaurantId = user?.restaurantId || user?.id || user?._id;

  const fetchStatus = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await getRestaurantVerificationStatus(restaurantId);
        if (response?.data) {
          const fetchedStatus = response.data.status;
          setStatus(fetchedStatus);
          if (response.data.rejectionReason) {
            setRejectionReason(response.data.rejectionReason);
          }
          if (fetchedStatus === "VERIFIED") {
            toast.success("Application approved! Redirecting to dashboard...");
            setTimeout(() => {
              navigate("/restaurant/dashboard", { replace: true });
            }, 1200);
          } else if (isManualRefresh) {
            toast.info(
              `Status refreshed: Application is ${fetchedStatus.replace("_", " ").toLowerCase()}.`,
            );
          }
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to fetch verification status.";
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [restaurantId, navigate],
  );

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleCheckStatus = () => {
    fetchStatus(true);
  };

  const handleEditApplication = () => {
    navigate("/restaurant/onboarding/business-information");
  };

  const handleGoToDashboard = () => {
    navigate("/restaurant/dashboard", { replace: true });
  };

  const handleSignOut = () => {
    useAuthStore.getState().clearAuth();
    navigate("/restaurant/email/verification", { replace: true });
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white p-12 shadow-xs text-center">
          <svg
            className="h-10 w-10 animate-spin text-orange-500 mb-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-sm font-medium text-neutral-600">Loading verification status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Main Status Container */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8">
        {/* State 1: VERIFIED */}
        {status === "VERIFIED" && (
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
              Congratulations! Your restaurant account has been verified. You can now access your
              partner dashboard and start managing your restaurant.
            </p>

            <div className="mt-8 w-full flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Go to Restaurant Dashboard
              </button>
            </div>
          </div>
        )}

        {/* State 2: REJECTED */}
        {status === "REJECTED" && (
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
                onClick={handleEditApplication}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Edit &amp; Resubmit Application
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-2xl border border-neutral-300 bg-white px-5 py-3.5 text-sm font-semibold text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* State 3: SUBMITTED or UNDER_REVIEW */}
        {(status === "SUBMITTED" || status === "UNDER_REVIEW") && (
          <>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400/20 opacity-75" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3.5 py-1 text-xs font-bold tracking-wide uppercase text-amber-800">
                {status === "SUBMITTED" ? "Application Submitted" : "Verification Pending"}
              </span>

              <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">
                {status === "SUBMITTED" ? "Application Received" : "Application Under Review"}
              </h1>
              <p className="mt-2 max-w-md text-sm text-neutral-600">
                {status === "SUBMITTED"
                  ? "Thank you for submitting your onboarding application. It is queued for review by our verification team."
                  : "Thank you for submitting your onboarding application. Our team is currently reviewing your restaurant credentials and uploaded documents."}
              </p>
            </div>

            {/* Timeline & Next Steps */}
            <div className="mt-8 space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5">
              <h2 className="text-sm font-semibold text-neutral-900">What happens next?</h2>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-[10px]">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Application Submitted</p>
                    <p className="text-neutral-500">
                      All business information, location data, and documents were received.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-[10px]">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">
                      Document &amp; FSSAI Audit (In Progress)
                    </p>
                    <p className="text-neutral-500">
                      Our verification agents verify FSSAI registration, GST, and owner identity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-300 text-neutral-600 font-bold text-[10px]">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-700">Account Activation</p>
                    <p className="text-neutral-500">
                      Once approved, you will receive a notification at{" "}
                      <span className="font-medium text-neutral-800">{restaurantEmail}</span> to
                      access your partner dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimated Time Info Card */}
            <div className="mt-6 flex items-center gap-3.5 rounded-2xl border border-orange-100 bg-orange-50/50 p-4 text-xs text-orange-900">
              <svg
                className="h-5 w-5 shrink-0 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold">Estimated Turnaround Time</p>
                <p className="mt-0.5 text-orange-800">
                  Reviews are typically completed within <strong>24 to 48 business hours</strong>.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleCheckStatus}
                disabled={isRefreshing}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
              >
                {isRefreshing ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Checking...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Check Status
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-2xl border border-neutral-300 bg-white px-5 py-3.5 text-sm font-semibold text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
