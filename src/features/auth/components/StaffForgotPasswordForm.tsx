import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { STAFF_ROUTES } from "@/app/router/routes.constants";
import { FormField, FormInput, SubmitButton } from "@/components/common/form";
import { useStaffForgotPassword } from "@/features/auth/hooks/useStaffForgotPassword";
import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/features/auth/schemas/forgot-password.schema";

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
      <FormField
        id="staff-forgot-email"
        label="Email Address"
        error={errors.email?.message}
        labelClassName="text-xs font-semibold text-gray-700"
      >
        <FormInput
          id="staff-forgot-email"
          type="email"
          autoComplete="email"
          placeholder="e.g., manager@spotq.com"
          disabled={isPending}
          error={errors.email?.message}
          leadingIcon={<Mail className="size-4 text-gray-400" aria-hidden="true" />}
          className="h-11 rounded-lg border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus-visible:border-[#9E460E] focus-visible:ring-[#9E460E]/15"
          {...register("email")}
        />
      </FormField>

      <SubmitButton
        isLoading={isPending}
        loadingText="Sending Code…"
        className="h-11 w-full rounded-lg bg-[#9E460E] hover:bg-[#853406] text-white text-sm font-medium transition-colors"
        aria-label="Send Reset Code"
      >
        Send Reset Code
      </SubmitButton>

      <div className="pt-1 text-center">
        <Link
          to={STAFF_ROUTES.LOGIN}
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
