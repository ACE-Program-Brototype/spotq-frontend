import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStaffResetPassword } from "@/features/auth/hooks/useStaffResetPassword";
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/features/auth/schemas/reset-password.schema";
import { cn } from "@/lib/utils/cn";

export function StaffResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: resetPassword, isPending } = useStaffResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPassword({ password: data.password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 text-left">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="staff-new-password" className="text-xs font-semibold text-gray-700">
          New Password
        </Label>
        <div
          className={cn(
            "relative flex items-center rounded-lg border border-gray-300 bg-white transition-colors focus-within:border-[#9E460E] focus-within:ring-2 focus-within:ring-[#9E460E]/15",
            errors.password &&
              "border-destructive focus-within:border-destructive focus-within:ring-destructive/15",
          )}
        >
          <Lock className="absolute left-3 size-4 text-gray-400" aria-hidden="true" />
          <Input
            id="staff-new-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "staff-password-error" : "staff-password-hint"}
            className="h-11 rounded-lg border-0 bg-transparent pl-9 pr-10 text-sm placeholder:text-gray-400 focus-visible:ring-0 shadow-none"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-0.5 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <p id="staff-password-hint" className="text-[11px] text-gray-500">
          Must be at least 8 characters.
        </p>
        {errors.password && (
          <p id="staff-password-error" role="alert" className="text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="staff-confirm-password" className="text-xs font-semibold text-gray-700">
          Confirm New Password
        </Label>
        <div
          className={cn(
            "relative flex items-center rounded-lg border border-gray-300 bg-white transition-colors focus-within:border-[#9E460E] focus-within:ring-2 focus-within:ring-[#9E460E]/15",
            errors.confirmPassword &&
              "border-destructive focus-within:border-destructive focus-within:ring-destructive/15",
          )}
        >
          <Lock className="absolute left-3 size-4 text-gray-400" aria-hidden="true" />
          <Input
            id="staff-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "staff-confirm-password-error" : undefined}
            className="h-11 rounded-lg border-0 bg-transparent pl-9 pr-10 text-sm placeholder:text-gray-400 focus-visible:ring-0 shadow-none"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 p-0.5 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="staff-confirm-password-error" role="alert" className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-11 w-full rounded-lg bg-[#9E460E] hover:bg-[#853406] text-white text-sm font-medium transition-colors inline-flex items-center justify-center gap-1.5"
        aria-label="Reset Password"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
            Resetting Password…
          </>
        ) : (
          <>
            <span>Reset Password</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}

export default StaffResetPasswordForm;
