import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Circle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/features/auth/schemas/reset-password.schema";
import { cn } from "@/lib/utils/cn";

export function ResetPasswordForm() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: resetUserPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";

  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(passwordValue);

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetUserPassword({ password: data.password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="space-y-2">
        <Label
          htmlFor="customer-new-password"
          error={!!errors.password}
          className="text-sm font-semibold text-gray-700"
        >
          New Password
        </Label>
        <div className="relative flex items-center">
          <Input
            id="customer-new-password"
            type={showNewPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            disabled={isPending}
            className={cn(
              "h-12 rounded-xl bg-spotq-cream pl-4 pr-11 border-spotq-border focus-visible:border-spotq-orange focus-visible:ring-spotq-orange/50 text-gray-900 placeholder:text-gray-400",
              errors.password && "border-destructive focus-visible:ring-destructive/30",
            )}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3.5 p-1 rounded-full hover:bg-gray-100/50 transition-colors cursor-pointer text-gray-400 focus:outline-none"
            aria-label={showNewPassword ? "Hide password" : "Show password"}
          >
            {showNewPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive mt-1.5" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="customer-confirm-password"
          error={!!errors.confirmPassword}
          className="text-sm font-semibold text-gray-700"
        >
          Confirm Password
        </Label>
        <div className="relative flex items-center">
          <Input
            id="customer-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            disabled={isPending}
            className={cn(
              "h-12 rounded-xl bg-spotq-cream pl-4 pr-11 border-spotq-border focus-visible:border-spotq-orange focus-visible:ring-spotq-orange/50 text-gray-900 placeholder:text-gray-400",
              errors.confirmPassword && "border-destructive focus-visible:ring-destructive/30",
            )}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 p-1 rounded-full hover:bg-gray-100/50 transition-colors cursor-pointer text-gray-400 focus:outline-none"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive mt-1.5" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2 py-1 text-xs sm:text-sm text-gray-600">
        <div className="flex items-center gap-2">
          {hasMinLength ? (
            <CheckCircle2 className="size-4 text-gray-900 fill-gray-900 text-white" />
          ) : (
            <Circle className="size-4 text-gray-400" />
          )}
          <span className={cn(hasMinLength ? "text-gray-900 font-medium" : "text-gray-500")}>
            At least 8 characters long
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasSpecialChar ? (
            <CheckCircle2 className="size-4 text-gray-900 fill-gray-900 text-white" />
          ) : (
            <Circle className="size-4 text-gray-400" />
          )}
          <span className={cn(hasSpecialChar ? "text-gray-900 font-medium" : "text-gray-500")}>
            Include a special character
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasUppercase && hasLowercase && hasNumber ? (
            <CheckCircle2 className="size-4 text-gray-900 fill-gray-900 text-white" />
          ) : (
            <Circle className="size-4 text-gray-400" />
          )}
          <span
            className={cn(
              hasUppercase && hasLowercase && hasNumber
                ? "text-gray-900 font-medium"
                : "text-gray-500",
            )}
          >
            Include uppercase, lowercase, and a number
          </span>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="w-full h-12 rounded-xl bg-spotq-orange text-white hover:bg-spotq-orange/90 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:translate-y-[1px]"
      >
        {isPending ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            <span>Updating Password...</span>
          </>
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
}

export default ResetPasswordForm;
