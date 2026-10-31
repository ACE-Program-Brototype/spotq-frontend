import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormField, PasswordField, SubmitButton } from "@/components/common/form";
import { useStaffResetPassword } from "@/features/auth/hooks/useStaffResetPassword";
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/features/auth/schemas/reset-password.schema";

export function StaffResetPasswordForm() {
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
      <FormField
        id="staff-new-password"
        label="New Password"
        hint="Must be at least 8 characters."
        hintId="staff-password-hint"
        error={errors.password?.message}
        labelClassName="text-xs font-semibold text-gray-700"
      >
        <PasswordField
          id="staff-new-password"
          autoComplete="new-password"
          placeholder="••••••••"
          disabled={isPending}
          error={errors.password?.message}
          leadingIcon={<Lock className="size-4 text-gray-400" aria-hidden="true" />}
          className="h-11 rounded-lg border-gray-300 bg-white pl-9 pr-10 text-sm placeholder:text-gray-400 focus-visible:border-[#9E460E] focus-visible:ring-[#9E460E]/15"
          {...register("password")}
        />
      </FormField>

      <FormField
        id="staff-confirm-password"
        label="Confirm New Password"
        error={errors.confirmPassword?.message}
        labelClassName="text-xs font-semibold text-gray-700"
      >
        <PasswordField
          id="staff-confirm-password"
          autoComplete="new-password"
          placeholder="••••••••"
          disabled={isPending}
          error={errors.confirmPassword?.message}
          leadingIcon={<Lock className="size-4 text-gray-400" aria-hidden="true" />}
          className="h-11 rounded-lg border-gray-300 bg-white pl-9 pr-10 text-sm placeholder:text-gray-400 focus-visible:border-[#9E460E] focus-visible:ring-[#9E460E]/15"
          {...register("confirmPassword")}
        />
      </FormField>

      <SubmitButton
        isLoading={isPending}
        loadingText="Resetting Password…"
        className="mt-2 h-11 w-full rounded-lg bg-[#9E460E] hover:bg-[#853406] text-white text-sm font-medium transition-colors"
        aria-label="Reset Password"
      >
        <span>Reset Password</span>
        <ArrowRight className="ml-2 size-4" aria-hidden="true" />
      </SubmitButton>
    </form>
  );
}

export default StaffResetPasswordForm;
