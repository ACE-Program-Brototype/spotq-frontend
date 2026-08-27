import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useOtpTimer } from "@/features/auth/hooks/useOtpTimer";
import { useResendOtp } from "@/features/auth/hooks/useResendOtp";
import { useVerifyOtp } from "@/features/auth/hooks/useVerifyOtp";
import {
  type VerifyOtpFormValues,
  verifyOtpSchema,
} from "@/features/auth/schemas/verify-otp.schema";

interface VerifyOtpFormProps {
  initialEmail?: string;
}

export function VerifyOtpForm({ initialEmail }: VerifyOtpFormProps) {
  const location = useLocation();
  const email = initialEmail || (location.state as { email?: string } | null)?.email || "";

  const { seconds, startTimer } = useOtpTimer({ email, defaultSeconds: 60 });
  const { mutate: verifyUserOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendUserOtp, isPending: isResending } = useResendOtp();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  const handleResend = () => {
    if (seconds > 0 || isResending || !email) return;
    resendUserOtp(
      { email },
      {
        onSuccess: () => {
          startTimer(60);
        },
      },
    );
  };

  const onSubmit = (data: VerifyOtpFormValues) => {
    verifyUserOtp({ email, otp: data.otp });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* OTP Input Group */}
      <div className="space-y-3">
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
              disabled={isVerifying}
              containerClassName="w-full justify-between"
            >
              <InputOTPGroup className="w-full justify-between gap-2 sm:gap-3">
                <InputOTPSlot
                  index={0}
                  className="h-14 w-12 sm:w-14 rounded-2xl bg-spotq-cream border border-spotq-border text-2xl font-bold text-gray-900 transition-all data-[active=true]:border-spotq-orange data-[active=true]:ring-2 data-[active=true]:ring-spotq-orange/20 shadow-none"
                />
                <InputOTPSlot
                  index={1}
                  className="h-14 w-12 sm:w-14 rounded-2xl bg-spotq-cream border border-spotq-border text-2xl font-bold text-gray-900 transition-all data-[active=true]:border-spotq-orange data-[active=true]:ring-2 data-[active=true]:ring-spotq-orange/20 shadow-none"
                />
                <InputOTPSlot
                  index={2}
                  className="h-14 w-12 sm:w-14 rounded-2xl bg-spotq-cream border border-spotq-border text-2xl font-bold text-gray-900 transition-all data-[active=true]:border-spotq-orange data-[active=true]:ring-2 data-[active=true]:ring-spotq-orange/20 shadow-none"
                />
                <InputOTPSlot
                  index={3}
                  className="h-14 w-12 sm:w-14 rounded-2xl bg-spotq-cream border border-spotq-border text-2xl font-bold text-gray-900 transition-all data-[active=true]:border-spotq-orange data-[active=true]:ring-2 data-[active=true]:ring-spotq-orange/20 shadow-none"
                />
                <InputOTPSlot
                  index={4}
                  className="h-14 w-12 sm:w-14 rounded-2xl bg-spotq-cream border border-spotq-border text-2xl font-bold text-gray-900 transition-all data-[active=true]:border-spotq-orange data-[active=true]:ring-2 data-[active=true]:ring-spotq-orange/20 shadow-none"
                />
                <InputOTPSlot
                  index={5}
                  className="h-14 w-12 sm:w-14 rounded-2xl bg-spotq-cream border border-spotq-border text-2xl font-bold text-gray-900 transition-all data-[active=true]:border-spotq-orange data-[active=true]:ring-2 data-[active=true]:ring-spotq-orange/20 shadow-none"
                />
              </InputOTPGroup>
            </InputOTP>
          )}
        />

        {errors.otp && (
          <p role="alert" className="text-xs text-destructive text-center mt-1.5">
            {errors.otp.message}
          </p>
        )}
      </div>

      {/* Resend Code Section */}
      <div className="flex items-center justify-center text-sm text-gray-500">
        <span>Didn't receive a code? </span>
        {seconds > 0 ? (
          <span className="font-semibold text-spotq-orange ml-1">Resend in {seconds}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || !email}
            className="font-semibold text-spotq-orange hover:text-spotq-orange/80 transition-colors ml-1 cursor-pointer disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Resend"}
          </button>
        )}
      </div>

      {/* Verify Account Button */}
      <Button
        type="submit"
        size="lg"
        disabled={isVerifying}
        className="w-full h-12 rounded-xl bg-spotq-orange text-white hover:bg-spotq-orange/90 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:translate-y-[1px]"
      >
        {isVerifying ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            <span>Verifying Account...</span>
          </>
        ) : (
          <>
            <span>Verify Account</span>
            <ShieldCheck className="size-5" aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}

export default VerifyOtpForm;
