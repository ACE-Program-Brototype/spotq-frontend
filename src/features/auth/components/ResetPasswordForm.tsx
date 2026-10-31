import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Circle } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormField, PasswordField, SubmitButton } from "@/components/common/form";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/features/auth/schemas/reset-password.schema";
import { cn } from "@/lib/utils/cn";

export function ResetPasswordForm() {
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
      <FormField
        id="customer-new-password"
        label="New Password"
        error={errors.password?.message}
        labelClassName="text-sm font-semibold text-gray-700"
      >
        <PasswordField
          id="customer-new-password"
          autoComplete="new-password"
          placeholder="••••••••"
          disabled={isPending}
          error={errors.password?.message}
          className="h-12 rounded-xl bg-spotq-cream pl-4 pr-11 border-spotq-border focus-visible:border-spotq-orange focus-visible:ring-spotq-orange/50 text-gray-900 placeholder:text-gray-400"
          {...register("password")}
        />
      </FormField>

      <FormField
        id="customer-confirm-password"
        label="Confirm Password"
        error={errors.confirmPassword?.message}
        labelClassName="text-sm font-semibold text-gray-700"
      >
        <PasswordField
          id="customer-confirm-password"
          autoComplete="new-password"
          placeholder="••••••••"
          disabled={isPending}
          error={errors.confirmPassword?.message}
          className="h-12 rounded-xl bg-spotq-cream pl-4 pr-11 border-spotq-border focus-visible:border-spotq-orange focus-visible:ring-spotq-orange/50 text-gray-900 placeholder:text-gray-400"
          {...register("confirmPassword")}
        />
      </FormField>

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

      <SubmitButton
        size="lg"
        isLoading={isPending}
        loadingText="Updating Password..."
        className="w-full h-12 rounded-xl bg-spotq-orange text-white hover:bg-spotq-orange/90 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:translate-y-[1px]"
      >
        Update Password
      </SubmitButton>
    </form>
  );
}

export default ResetPasswordForm;
