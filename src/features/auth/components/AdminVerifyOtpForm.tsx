import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useAdminResendOtp } from "@/features/auth/hooks/useAdminResendOtp";
import { useAdminVerifyOtp } from "@/features/auth/hooks/useAdminVerifyOtp";
import { useOtpTimer } from "@/features/auth/hooks/useOtpTimer";
import {
  type VerifyOtpFormValues,
  verifyOtpSchema,
} from "@/features/auth/schemas/verify-otp.schema";

interface AdminVerifyOtpFormProps {
  initialEmail?: string;
}

export function AdminVerifyOtpForm({ initialEmail }: AdminVerifyOtpFormProps) {
  const location = useLocation();
  const email = initialEmail || (location.state as { email?: string } | null)?.email || "";

  const { seconds, startTimer } = useOtpTimer({ email, defaultSeconds: 60 });
  const { mutate: verifyOtp, isPending: isVerifying } = useAdminVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useAdminResendOtp();

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
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="admin-otp"
            className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase"
          >
            Security Code
          </Label>
          {email && <span className="text-[11px] text-muted-foreground/80">{email}</span>}
        </div>

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
              <InputOTPGroup className="w-full justify-between gap-2 sm:gap-4">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />

        {errors.otp && (
          <p role="alert" className="text-xs text-destructive">
            {errors.otp.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isVerifying}
        className="mt-4 h-12 w-full rounded-full text-xs font-bold tracking-widest uppercase transition-transform active:scale-[0.99]"
        aria-label="Verify code"
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

      <div className="flex items-center justify-center text-xs text-muted-foreground">
        <span>Didn{"'"}t receive code? </span>
        {seconds > 0 ? (
          <span className="font-medium text-foreground">Resend in {seconds}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || !email}
            className="font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-50"
          >
            {isResending ? "Sending…" : "Resend code"}
          </button>
        )}
      </div>

      <div className="pt-2 text-center">
        <Link
          to="/admin/forgot-password"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground hover:no-underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to Forgot Key
        </Link>
      </div>
    </form>
  );
}

export default AdminVerifyOtpForm;
