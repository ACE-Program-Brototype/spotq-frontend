import { ArrowLeft, ArrowRight, Loader2, Mail, ShieldCheck } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import { OtpHeroPanel } from "../components/OtpHeroPanel";
import { OtpInput } from "../components/OtpInput";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { useResendOtp } from "../hooks/use-resend-otp";
import { useVerifyOtp } from "../hooks/use-verify-email";
import { useOtpTimer } from "../hooks/useOtpTimer";

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialEmail = searchParams.get("email")?.trim() || "";

  const [email, setEmail] = useState(initialEmail);
  const [inputEmail, setInputEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState("");

  const { seconds, startTimer } = useOtpTimer({ email, defaultSeconds: 59 });
  const { handleVerifyOtp, isLoading } = useVerifyOtp();
  const { handleResendOtp, isLoading: isResendLoading } = useResendOtp();

  const handleVerify = async () => {
    if (otp.length !== 6 || isLoading || !email) {
      return;
    }
    await handleVerifyOtp(email, otp);
  };

  const handleComplete = (code: string) => {
    setOtp(code);
  };

  const handleResend = async () => {
    if (seconds > 0 || isResendLoading || !email) {
      return;
    }

    const response = await handleResendOtp(email);
    if (!response?.success) {
      return;
    }

    setOtp("");
    startTimer(59);
  };

  const handleSendCode = async (event: FormEvent) => {
    event.preventDefault();
    const cleanEmail = inputEmail.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setEmailError(AUTH_MESSAGES.ENTER_VALID_EMAIL);
      return;
    }

    setEmailError("");
    const response = await handleResendOtp(cleanEmail);
    if (!response?.success) {
      return;
    }

    setEmail(cleanEmail);
    setSearchParams({ email: cleanEmail });
    setOtp("");
    startTimer(59);
  };

  const handleChangeEmail = () => {
    setEmail("");
    setOtp("");
    setSearchParams({});
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

          {!email ? (
            <form onSubmit={handleSendCode} className="space-y-6" noValidate>
              <div className="text-center md:text-left space-y-1.5">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                  Verify Your Email
                </h1>
                <p className="text-sm leading-5 text-gray-500">
                  Enter your registered email address to receive a 6-digit verification code.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification-email" error={!!emailError}>
                  Email Address
                </Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 size-5 text-gray-400 pointer-events-none" />
                  <Input
                    id="verification-email"
                    type="email"
                    value={inputEmail}
                    onChange={(e) => {
                      setInputEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="e.g. alex@example.com"
                    disabled={isResendLoading}
                    className={cn(
                      "h-12 rounded-xl bg-spotq-cream pl-11 pr-4 border-spotq-border focus-visible:border-spotq-orange focus-visible:ring-spotq-orange/50",
                      emailError && "border-destructive focus-visible:ring-destructive/30",
                    )}
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-destructive mt-1.5" role="alert">
                    {emailError}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isResendLoading || !inputEmail.trim()}
                className="w-full h-12 rounded-xl bg-spotq-orange text-white hover:bg-spotq-orange/90 transition-all font-semibold flex items-center justify-center gap-2 shadow-sm active:translate-y-[1px] cursor-pointer"
              >
                {isResendLoading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="size-5" />
                  </>
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  Back to login
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                  Enter verification code
                </h1>
                <p className="mt-2 text-sm leading-5 text-gray-500">
                  We&apos;ve sent a 6-digit code to your email{" "}
                  <span className="font-semibold text-gray-800">{email}</span>{" "}
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="text-xs font-semibold text-spotq-orange hover:underline ml-1 cursor-pointer"
                  >
                    (Change)
                  </button>
                </p>
              </div>

              <div className="mt-8">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleComplete}
                  length={6}
                  disabled={isLoading || isResendLoading}
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
                      disabled={isResendLoading}
                      className="font-semibold text-spotq-orange hover:text-spotq-orange/80 hover:underline disabled:opacity-50 cursor-pointer"
                    >
                      {isResendLoading ? "Sending..." : "Resend"}
                    </button>
                  </>
                )}
              </div>

              <Button
                type="button"
                onClick={handleVerify}
                disabled={otp.length !== 6 || isLoading || isResendLoading}
                className="mt-5 w-full h-12 rounded-xl bg-spotq-orange text-white hover:bg-spotq-orange/90 disabled:bg-spotq-orange/60 transition-all font-semibold flex items-center justify-center gap-2 shadow-sm active:translate-y-[1px] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Account</span>
                    <ShieldCheck className="size-5" />
                  </>
                )}
              </Button>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  Back to login
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
