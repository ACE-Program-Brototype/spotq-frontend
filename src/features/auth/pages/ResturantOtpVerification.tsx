import type { ClipboardEvent, KeyboardEvent } from "react";
import { useCallback, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import restaurantOtpVerificationBg from "@/features/auth/assets/restaurant-otp-verification-bg.avif";

import {
  RESTAURANT_MAX_ATTEMPTS_ERROR_CODE as MAX_ATTEMPTS_ERROR_CODE,
  RESTAURANT_OTP_LENGTH as OTP_LENGTH,
  RESTAURANT_RESEND_COOLDOWN_SECONDS as RESEND_COOLDOWN_SECONDS,
} from "@/features/auth/constants/auth.constants";
import { useOtpTimer } from "@/features/auth/hooks/useOtpTimer";
import { useRestaurantResendOtp } from "@/features/auth/hooks/useRestaurantResendOtp";
import { useRestaurantVerifyOtp } from "@/features/auth/hooks/useRestaurantVerifyOtp";
import type { OtpVerificationProps, VerifyOtpResponse } from "@/features/auth/types/auth.types";

/**
 * SpotQ — OTP Verification (Step 2 of restaurant auth)
 *
 * Layout/visual design mirrors the provided reference screenshot:
 * same full-bleed hero + white card shell as the Email Verification
 * page, with a back arrow, "Enter OTP" heading, masked-destination
 * copy, 6 separate digit boxes, resend-with-cooldown, and primary CTA.
 */

export default function OtpVerification({
  email: emailProp,
  onGoToDashboard,
  onGoToOnboarding,
  onBack,
  verifyOtp: verifyOtpProp,
  resendOtp: resendOtpProp,
}: OtpVerificationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const email = emailProp || (location.state as { email?: string } | null)?.email || "";
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [attemptsExhausted, setAttemptsExhausted] = useState(false);

  const { mutateAsync: verifyOtpMutation, isPending: isVerifying } = useRestaurantVerifyOtp();
  const { mutateAsync: resendOtpMutation, isPending: isResending } = useRestaurantResendOtp();

  const verifyOtp =
    verifyOtpProp ??
    (async (e: string, o: string): Promise<VerifyOtpResponse> =>
      verifyOtpMutation({ email: e, otp: o }));
  const resendOtp =
    resendOtpProp ?? (async (e: string): Promise<void> => resendOtpMutation({ email: e }));

  const { seconds: cooldown, startTimer } = useOtpTimer({
    email,
    defaultSeconds: RESEND_COOLDOWN_SECONDS,
    prefix: "restaurant_otp_expiry",
  });

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const otp = digits.join("");
  const isComplete = otp.length === OTP_LENGTH;
  const canVerify = isComplete && !isVerifying && !attemptsExhausted;
  const canResend = cooldown === 0 && !isResending && !isVerifying;
  const otpSlotIds = Array.from({ length: OTP_LENGTH }, (_, index) => `otp-digit-${index + 1}`);

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const handleChange = (index: number, rawValue: string) => {
    const value = rawValue.replace(/\D/g, "");
    if (apiError) setApiError(null);
    if (validationError) setValidationError(null);

    if (value.length === 0) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    // Handle paste-into-single-box or fast typing that yields multiple chars.
    const chars = value.split("");
    setDigits((prev) => {
      const next = [...prev];
      let cursor = index;
      for (const ch of chars) {
        if (cursor >= OTP_LENGTH) break;
        next[cursor] = ch;
        cursor += 1;
      }
      return next;
    });

    const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
    focusInput(nextIndex);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        focusInput(index - 1);
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
      return;
    }
    if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    setApiError(null);
    setValidationError(null);
    const chars = pasted.slice(0, OTP_LENGTH).split("");
    setDigits((prev) => {
      const next = [...prev];
      chars.forEach((ch, i) => {
        next[i] = ch;
      });
      return next;
    });
    focusInput(Math.min(chars.length, OTP_LENGTH - 1));
  };

  const resetOtpBoxes = useCallback(() => {
    setDigits(Array(OTP_LENGTH).fill(""));
    focusInput(0);
  }, [focusInput]);

  const handleVerify = useCallback(async () => {
    setApiError(null);

    if (!isComplete) {
      setValidationError(`Enter all ${OTP_LENGTH} digits to continue.`);
      return;
    }
    setValidationError(null);

    try {
      const result = await verifyOtp(email, otp);
      if (result.nextStep === "DASHBOARD") {
        onGoToDashboard?.();
        navigate("/restaurant/dashboard", {
          replace: true,
          state: { email },
        });
      } else {
        onGoToOnboarding?.(result.verificationToken);
        navigate("/restaurant/onboarding", {
          replace: true,
          state: {
            email,
            verificationToken: result.verificationToken,
          },
        });
      }
    } catch (err) {
      const code = (err as { code?: string })?.code;
      const message = err instanceof Error ? err.message : "Verification failed.";

      if (code === MAX_ATTEMPTS_ERROR_CODE) {
        setAttemptsExhausted(true);
        setApiError(
          "You've reached the maximum number of attempts. Request a new code to continue.",
        );
      } else {
        setApiError(message);
      }
      resetOtpBoxes();
    }
  }, [
    email,
    navigate,
    otp,
    isComplete,
    verifyOtp,
    onGoToDashboard,
    onGoToOnboarding,
    resetOtpBoxes,
  ]);

  const handleResend = useCallback(async () => {
    if (!canResend) return;
    setApiError(null);
    setValidationError(null);

    try {
      await resendOtp(email);
      // Only reset cooldown/attempts/boxes once the backend confirms success.
      startTimer(RESEND_COOLDOWN_SECONDS);
      setAttemptsExhausted(false);
      setDigits(Array(OTP_LENGTH).fill(""));
      focusInput(0);
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Couldn't resend the code. Please try again.",
      );
      // Do not reset the timer — backend didn't confirm a new OTP was sent.
    }
  }, [canResend, email, focusInput, resendOtp, startTimer]);

  const handleBack = useCallback(() => {
    onBack?.();
    navigate("/restaurant/email/verification", { replace: false });
  }, [navigate, onBack]);

  if (!email) {
    return <Navigate to="/restaurant/email/verification" replace />;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-900">
      {/* Background hero image */}
      <div className="absolute inset-0">
        <img src={restaurantOtpVerificationBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Back arrow */}
      <button
        type="button"
        onClick={handleBack}
        aria-label="Go back"
        className="absolute left-6 top-6 z-10 text-white/90 transition-opacity hover:opacity-75 sm:left-8 sm:top-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-7 w-7"
          role="img"
          aria-label="Go back"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>

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
              Reach customers far
              <br />
              away from you
            </h1>
          </div>

          {/* Right: Enter OTP card */}
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <h2 className="text-2xl font-bold text-neutral-900">Enter OTP</h2>

            <p className="mt-4 text-sm text-neutral-600">
              Enter OTP sent on email <span className="font-medium text-neutral-800">{email}</span>
            </p>

            {/* OTP boxes */}
            <div className="mt-5 flex justify-between gap-2" onPaste={handlePaste}>
              {otpSlotIds.map((slotId) => {
                const index = Number(slotId.replace("otp-digit-", "")) - 1;
                const digit = digits[index] ?? "";

                return (
                  <input
                    key={slotId}
                    ref={(el: HTMLInputElement | null) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    disabled={isVerifying || attemptsExhausted}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    aria-label={`Digit ${index + 1} of OTP`}
                    aria-invalid={!!validationError}
                    className={`h-11 w-full rounded-md border text-center text-lg font-semibold text-neutral-900 focus:outline-none focus:ring-2 disabled:bg-neutral-50 disabled:text-neutral-400 ${
                      validationError || apiError
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
                    }`}
                  />
                );
              })}
            </div>

            {validationError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {validationError}
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

            {/* Resend */}
            <div className="mt-5 text-center">
              {cooldown > 0 ? (
                <p className="text-sm text-neutral-500">Resend code in {cooldown}s</p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`text-sm font-semibold ${
                    canResend
                      ? "text-orange-600 hover:text-orange-700"
                      : "cursor-not-allowed text-neutral-400"
                  }`}
                >
                  {isResending ? "Sending new code..." : "Resend OTP"}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleVerify}
              disabled={!canVerify}
              className={`mt-6 flex w-full items-center justify-center rounded-lg py-3.5 text-base font-semibold text-white transition-colors ${
                canVerify
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "cursor-not-allowed bg-neutral-300"
              }`}
            >
              {isVerifying ? (
                <>
                  <svg
                    className="mr-2 h-5 w-5 animate-spin text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    role="img"
                    aria-label="Verifying"
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
                  Verifying...
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
          </div>
        </div>
      </div>
    </div>
  );
}
