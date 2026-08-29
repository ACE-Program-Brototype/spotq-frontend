import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStaffForgotPassword } from "@/features/auth/hooks/useStaffForgotPassword";
import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/features/auth/schemas/forgot-password.schema";
import { cn } from "@/lib/utils/cn";

export function StaffForgotPasswordForm() {
  const { mutate: sendOtp, isPending } = useStaffForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    sendOtp(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Email Address */}
      <div className="flex flex-col gap-1.5 text-left">
        <Label htmlFor="staff-forgot-email" className="text-xs font-semibold text-gray-700">
          Email Address
        </Label>
        <div
          className={cn(
            "relative flex items-center rounded-lg border border-gray-300 bg-white transition-colors focus-within:border-[#9E460E] focus-within:ring-2 focus-within:ring-[#9E460E]/15",
            errors.email &&
              "border-destructive focus-within:border-destructive focus-within:ring-destructive/15",
          )}
        >
          <Mail className="absolute left-3 size-4 text-gray-400" aria-hidden="true" />
          <Input
            id="staff-forgot-email"
            type="email"
            autoComplete="email"
            placeholder="e.g., manager@spotq.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "staff-forgot-email-error" : undefined}
            className="h-11 rounded-lg border-0 bg-transparent pl-9 pr-3 text-sm placeholder:text-gray-400 focus-visible:ring-0 shadow-none"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p id="staff-forgot-email-error" role="alert" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="h-11 w-full rounded-lg bg-[#9E460E] hover:bg-[#853406] text-white text-sm font-medium transition-colors"
        aria-label="Send Reset Code"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
            Sending Code…
          </>
        ) : (
          "Send Reset Code"
        )}
      </Button>

      {/* Back to login */}
      <div className="pt-1 text-center">
        <Link
          to="/staff/login"
          className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to login
        </Link>
      </div>
    </form>
  );
}

export default StaffForgotPasswordForm;
