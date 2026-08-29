import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useOtpTimer } from "@/features/auth/hooks/useOtpTimer";
import { useStaffResendOtp } from "@/features/auth/hooks/useStaffResendOtp";
import { useStaffVerifyOtp } from "@/features/auth/hooks/useStaffVerifyOtp";
import {
  type VerifyOtpFormValues,
  verifyOtpSchema,
} from "@/features/auth/schemas/verify-otp.schema";

interface StaffVerifyOtpFormProps {
  initialEmail?: string;
}

export function StaffVerifyOtpForm({ initialEmail }: StaffVerifyOtpFormProps) {
  const location = useLocation();
  const email = initialEmail || (location.state as { email?: string } | null)?.email || "";

  const { seconds, startTimer } = useOtpTimer({
    email,
    defaultSeconds: 60,
    prefix: "spotq_staff_otp_expiry",
  });
  const { mutate: verifyOtp, isPending: isVerifying } = useStaffVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useStaffResendOtp();

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
    resendOtp(
      { email },
      {
        onSuccess: () => {
          startTimer(60);
        },
      },
    );
  };

  const onSubmit = (data: VerifyOtpFormValues) => {
    verifyOtp({ email, otp: data.otp });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {/* 6-Digit OTP Group */}
      <div className="flex flex-col items-center gap-3">
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
              disabled={isVerifying}
              containerClassName="w-full justify-center"
            >
              <InputOTPGroup className="flex justify-center gap-2 sm:gap-2.5">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-12 w-11 sm:h-13 sm:w-12 rounded-lg border border-gray-300 bg-white text-lg font-semibold text-gray-900 shadow-none transition-all data-[active=true]:border-[#9E460E] data-[active=true]:ring-2 data-[active=true]:ring-[#9E460E]/20"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />

        {errors.otp && (
          <p role="alert" className="text-xs text-destructive text-center">
            {errors.otp.message}
          </p>
        )}
      </div>

      {/* Verify Button */}
      <Button
        type="submit"
        disabled={isVerifying}
        className="h-11 w-full rounded-lg bg-[#9E460E] hover:bg-[#853406] text-white text-sm font-medium transition-colors"
        aria-label="Verify Code"
      >
        {isVerifying ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
            Verifying Code…
          </>
        ) : (
          "Verify Code"
        )}
      </Button>

      {/* Resend OTP */}
      <div className="text-center text-xs text-gray-500">
        <span>Didn't receive the code? </span>
        {seconds > 0 ? (
          <span className="font-medium text-gray-700">Resend in {seconds}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || !email}
            className="font-semibold text-[#9E460E] hover:underline disabled:opacity-50 cursor-pointer"
          >
            {isResending ? "Sending…" : "Resend"}
          </button>
        )}
      </div>
    </form>
  );
}

export default StaffVerifyOtpForm;
