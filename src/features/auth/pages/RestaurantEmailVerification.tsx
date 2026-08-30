import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import restaurantEmailVerificationBg from "@/features/auth/assets/restaurant-email-verification-bg.jpeg";
import { useRestaurantEmailOtp } from "@/features/auth/hooks/useRestaurantEmailOtp";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EmailVerificationProps {
  onCodeSent?: (email: string) => void;
  requestOtp?: (email: string) => Promise<void>;
}

export default function EmailVerification({ onCodeSent, requestOtp }: EmailVerificationProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const { mutateAsync: sendRestaurantOtp, isPending: isSendingOtp } = useRestaurantEmailOtp();

  const trimmedEmail = email.trim();
  const isEmpty = trimmedEmail.length === 0;
  const isValid = EMAIL_REGEX.test(trimmedEmail);
  const showValidationError = touched && !isValid;

  const canSubmit = isValid && !isSendingOtp;

  const executeRequestOtp = async (nextEmail: string) => {
    if (requestOtp) {
      await requestOtp(nextEmail);
      return;
    }

    await sendRestaurantOtp({ email: nextEmail });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setApiError(null);

    if (!isValid) return;

    setPendingEmail(trimmedEmail);
    setIsConfirmOpen(true);
  };

  const handleConfirmSendOtp = async () => {
    setIsConfirmOpen(false);

    try {
      await executeRequestOtp(pendingEmail);
      onCodeSent?.(pendingEmail);
      navigate("/restaurant/otp/verification", {
        state: { email: pendingEmail },
        replace: false,
      });
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "We couldn't send the code. Please try again.",
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-900">
      {/* Background hero image */}
      <div className="absolute inset-0">
        <img src={restaurantEmailVerificationBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col justify-center px-6 py-16 sm:px-12 lg:px-24">
        <div className="flex w-full flex-col items-start justify-between gap-12 lg:flex-row lg:items-center">
          {/* Left: brand lockup + headline */}
          <div className="max-w-xl text-white">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <span className="text-lg font-bold text-orange-500">S</span>
              </div>
            </div>
            <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-white/90">
              PARTNER WITH SPOTQ!
            </p>
            <div className="mb-6 h-1 w-14 rounded-full bg-orange-500" />
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Run your restaurant,
              <br />
              the smart way
            </h1>
            <p className="mt-4 max-w-md text-base text-white/80">
              Queues, QR ordering, menus, and tables — all in one place.
            </p>
          </div>

          {/* Right: Get Started card */}
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <h2 className="text-2xl font-bold text-neutral-900">Get Started</h2>

            <form onSubmit={handleSubmit} noValidate className="mt-6">
              <div className="mb-2 flex items-start justify-between gap-2">
                <label htmlFor="email" className="text-sm text-neutral-600">
                  Enter your restaurant email to continue
                </label>
              </div>

              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Enter restaurant email"
                value={email}
                disabled={isSendingOtp}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (apiError) setApiError(null);
                }}
                onBlur={() => setTouched(true)}
                aria-invalid={showValidationError}
                aria-describedby={showValidationError ? "email-error" : "email-hint"}
                className={`w-full rounded-md border px-4 py-2 text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 disabled:bg-neutral-50 disabled:text-neutral-400 ${
                  showValidationError
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
                }`}
              />

              {showValidationError ? (
                <p id="email-error" role="alert" className="mt-2 text-sm text-red-600">
                  {isEmpty
                    ? "Please enter your email address."
                    : "Please enter a valid email address."}
                </p>
              ) : (
                <p id="email-hint" className="mt-2 text-sm text-neutral-500">
                  We'll send a one-time verification code to this email.
                </p>
              )}

              {apiError && (
                <div
                  role="alert"
                  className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {apiError}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className={`mt-6 flex w-full items-center justify-center rounded-lg py-2 text-base font-semibold text-white transition-colors ${
                  canSubmit
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "cursor-not-allowed bg-neutral-300"
                }`}
              >
                {isSendingOtp ? (
                  <>
                    <svg
                      className="mr-2 h-5 w-5 animate-spin text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      role="img"
                      aria-label="Loading"
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
                    Sending code...
                  </>
                ) : (
                  "Continue"
                )}
              </button>

              <p className="mt-6 text-center text-xs text-neutral-500">
                By continuing, I agree to SpotQ's{" "}
                <a
                  href="/terms"
                  className="font-medium text-neutral-700 underline underline-offset-2 hover:text-orange-600"
                >
                  terms &amp; conditions
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Send verification code?"
        description={`We’ll send a one-time verification code to ${pendingEmail}.`}
        confirmText="Send code"
        cancelText="Cancel"
        isLoading={isSendingOtp}
        loadingText="Sending code…"
        onConfirm={handleConfirmSendOtp}
      />
    </div>
  );
}
