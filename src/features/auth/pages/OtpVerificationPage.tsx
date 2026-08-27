import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { OtpHeroPanel } from "../components/OtpHeroPanel";
import { OtpInput } from "../components/OtpInput";
import { useResendOtp } from "../hooks/use-resend-otp";
import { useVerifyOtp } from "../hooks/use-verify-email";

const OTP_RESEND_SECONDS = 59;

const getStorageKey = (email: string) => `spotq_otp_expiry_${email.trim().toLowerCase()}`;

const getRemainingSeconds = (key: string) => {
  const stored = localStorage.getItem(key);
  if (!stored) return 0;

  const expiry = Number(stored);
  if (!Number.isFinite(expiry)) {
    localStorage.removeItem(key);
    return 0;
  }

  const remaining = Math.ceil((expiry - Date.now()) / 1000);
  if (remaining <= 0) {
    localStorage.removeItem(key);
    return 0;
  }

  return remaining;
};

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "sample@gmail.com";
  const storageKey = useMemo(() => getStorageKey(email), [email]);

  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(() => getRemainingSeconds(storageKey));
  const [isResending, _setIsResending] = useState(false);

  const { handleVerifyOtp, isLoading } = useVerifyOtp();
  const { handleResendOtp, isLoading: isResendLoading } = useResendOtp();

  const startTimer = useCallback(() => {
    const expiry = Date.now() + OTP_RESEND_SECONDS * 1000;
    localStorage.setItem(storageKey, String(expiry));
    setSeconds(OTP_RESEND_SECONDS);
  }, [storageKey]);

  useEffect(() => {
    // Only create a timer when one doesn't already exist.
    if (!localStorage.getItem(storageKey)) {
      startTimer();
    } else {
      setSeconds(getRemainingSeconds(storageKey));
    }

    const interval = window.setInterval(() => {
      const remaining = getRemainingSeconds(storageKey);
      setSeconds(remaining);
    }, 250);

    return () => window.clearInterval(interval);
  }, [storageKey, startTimer]);

  const handleVerify = async () => {
    if (otp.length !== 6 || isLoading) {
      return;
    }
    await handleVerifyOtp(email, otp);
  };

  const handleComplete = (code: string) => {
    setOtp(code);
  };

  const handleResend = async () => {
    if (seconds > 0 || isResendLoading) {
      return;
    }

    const response = await handleResendOtp(email);

    if (!response?.success) {
      return;
    }

    setOtp("");

    const expiry = Date.now() + OTP_RESEND_SECONDS * 1000;

    localStorage.setItem(getStorageKey(email), expiry.toString());

    setSeconds(OTP_RESEND_SECONDS);
  };

  return (
    <div className="min-h-screen w-full flex bg-white text-foreground antialiased font-sans">
      <OtpHeroPanel />

      <main className="w-full md:w-1/2 min-h-screen flex flex-col bg-white">
        <header className="h-14 px-4 flex items-center border-b border-gray-100 md:hidden">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-1 mr-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="size-6 text-foreground/80" />
          </button>
          <h2 className="text-lg font-semibold">Verify</h2>
        </header>

        <div className="flex-1 w-full max-w-md mx-auto px-6 py-10 md:py-16 flex flex-col justify-center">
          <div className="flex justify-center mb-7 md:hidden">
            <div className="relative">
              <div className="size-24 rounded-full bg-[#ffe0d3] flex items-center justify-center">
                <ShieldCheck className="size-12 text-spotq-orange" strokeWidth={1.8} />
              </div>
              <div className="absolute -right-1 bottom-0 size-9 rounded-full bg-spotq-orange border-4 border-white shadow-md flex items-center justify-center">
                <ShieldCheck className="size-4 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Enter verification code
            </h1>
            <p className="mt-2 text-sm leading-5 text-gray-500">
              We&apos;ve sent a 6-digit code to your email{" "}
              <span className="font-medium text-gray-700">{email}</span>
            </p>
          </div>

          <div className="mt-8">
            <OtpInput
              value={otp}
              onChange={setOtp}
              onComplete={handleComplete}
              length={6}
              disabled={isLoading || isResending}
              autoFocus
            />
          </div>

          <div className="mt-5 flex items-center justify-center gap-1 text-xs text-gray-500">
            {seconds > 0 ? (
              <>
                <span>Resend code in</span>
                <span className="min-w-[28px] font-semibold text-spotq-orange tabular-nums">
                  0:{String(seconds).padStart(2, "0")}
                </span>
              </>
            ) : (
              <>
                <span>Didn&apos;t receive a code?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="font-semibold text-spotq-orange hover:text-spotq-orange/80 hover:underline disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </>
            )}
          </div>

          <Button
            type="button"
            onClick={handleVerify}
            disabled={otp.length !== 6 || isLoading || isResending}
            className="mt-5 w-full h-12 rounded-xl bg-spotq-orange text-white hover:bg-spotq-orange/90 disabled:bg-spotq-orange/60 transition-all font-semibold flex items-center justify-center gap-2 shadow-sm active:translate-y-[1px]"
          >
            {isLoading ? (
              <>
                <span className="size-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Account</span>
                <ShieldCheck className="size-4" strokeWidth={2} />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
