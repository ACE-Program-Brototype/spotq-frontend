import { useCallback, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import restaurantOtpVerificationBg from "@/features/auth/assets/restaurant-otp-verification-bg.avif";
import { OtpResendSection } from "@/features/auth/components/OtpResendSection";
import { OtpSlotInputs } from "@/features/auth/components/OtpSlotInputs";
import { RestaurantOtpHeroSection } from "@/features/auth/components/RestaurantOtpHeroSection";
import {
  RESTAURANT_MAX_ATTEMPTS_ERROR_CODE as MAX_ATTEMPTS_ERROR_CODE,
  RESTAURANT_OTP_LENGTH as OTP_LENGTH,
  RESTAURANT_RESEND_COOLDOWN_SECONDS as RESEND_COOLDOWN_SECONDS,
} from "@/features/auth/constants/auth.constants";
import { useOtpInput } from "@/features/auth/hooks/useOtpInput";
import { useOtpTimer } from "@/features/auth/hooks/useOtpTimer";
import { useRestaurantResendOtp } from "@/features/auth/hooks/useRestaurantResendOtp";
import { useRestaurantVerifyOtp } from "@/features/auth/hooks/useRestaurantVerifyOtp";
import type { OtpVerificationProps, VerifyOtpResponse } from "@/features/auth/types/auth.types";

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
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [attemptsExhausted, setAttemptsExhausted] = useState(false);

  const clearErrors = useCallback(() => {
    setApiError(null);
    setValidationError(null);
  }, []);

  const {
    digits,
    setDigits,
    inputRefs,
    otp,
    isComplete,
    handleChange,
    handleKeyDown,
    handlePaste,
    resetOtpBoxes,
  } = useOtpInput({ length: OTP_LENGTH, onClearErrors: clearErrors });

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

  const canVerify = isComplete && !isVerifying && !attemptsExhausted;
  const canResend = cooldown === 0 && !isResending && !isVerifying;
  const otpSlotIds = Array.from({ length: OTP_LENGTH }, (_, index) => `otp-digit-${index + 1}`);

  const handleVerify = useCallback(async () => {
    setApiError(null);

    if (!isComplete) {
      setValidationError(`Enter all ${OTP_LENGTH} digits to continue.`);
      return;
    }
    setValidationError(null);

    try {
      const result = await verifyOtp(email, otp);

      if (result.nextStep === "VERIFICATION_STATUS") {
        onGoToOnboarding?.();
        navigate(RESTAURANT_ROUTES.ONBOARDING.STATUS, { replace: true });
      } else if (result.nextStep === "SUBSCRIPTION") {
        onGoToDashboard?.();
        navigate(RESTAURANT_ROUTES.SUBSCRIPTION, { replace: true });
      } else if (result.nextStep === "DASHBOARD") {
        onGoToDashboard?.();
        navigate(RESTAURANT_ROUTES.DASHBOARD, { replace: true });
      } else {
        onGoToOnboarding?.();
        navigate(RESTAURANT_ROUTES.ONBOARDING.BUSINESS_INFORMATION, { replace: true });
      }
    } catch (err: unknown) {
      const code =
        (err as { code?: string; errorCode?: string })?.code ||
        (err as { errorCode?: string })?.errorCode;

      if (code === MAX_ATTEMPTS_ERROR_CODE) {
        setAttemptsExhausted(true);
        setApiError("Maximum attempts reached. Please request a new OTP to continue.");
        setDigits(Array(OTP_LENGTH).fill(""));
      } else {
        setApiError((err as Error)?.message || "Invalid OTP. Please try again.");
        resetOtpBoxes();
      }
    }
  }, [
    email,
    isComplete,
    navigate,
    onGoToDashboard,
    onGoToOnboarding,
    otp,
    resetOtpBoxes,
    setDigits,
    verifyOtp,
  ]);

  const handleResend = useCallback(async () => {
    if (!canResend) return;
    setApiError(null);
    setValidationError(null);

    try {
      await resendOtp(email);
      setAttemptsExhausted(false);
      resetOtpBoxes();
      startTimer();
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const msg = e?.response?.data?.message || e?.message || "Failed to resend OTP.";
      setApiError(msg);
    }
  }, [canResend, email, resendOtp, resetOtpBoxes, startTimer]);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigate(RESTAURANT_ROUTES.LOGIN);
    }
  }, [navigate, onBack]);

  if (!email) {
    return <Navigate to={RESTAURANT_ROUTES.LOGIN} replace />;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-900">
      <div className="absolute inset-0">
        <img src={restaurantOtpVerificationBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

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

      <div className="relative flex min-h-screen flex-col justify-center px-6 py-16 sm:px-12 lg:px-24">
        <div className="flex w-full flex-col items-start justify-between gap-12 lg:flex-row lg:items-center">
          <RestaurantOtpHeroSection />

          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <h2 className="text-2xl font-bold text-neutral-900">Enter OTP</h2>
            <p className="mt-4 text-sm text-neutral-600">
              Enter OTP sent on email <span className="font-medium text-neutral-800">{email}</span>
            </p>

            <OtpSlotInputs
              digits={digits}
              slotIds={otpSlotIds}
              inputRefs={inputRefs}
              disabled={isVerifying || attemptsExhausted}
              hasError={Boolean(validationError || apiError)}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
            />

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

            <OtpResendSection
              cooldown={cooldown}
              canResend={canResend}
              isResending={isResending}
              onResend={handleResend}
            />

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
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="mt-6 text-center">
              <Link
                to={RESTAURANT_ROUTES.LOGIN}
                className="text-sm font-semibold text-neutral-600 hover:text-neutral-900"
              >
                Back to Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
