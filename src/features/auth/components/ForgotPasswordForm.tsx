import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { FormField, FormInput, SubmitButton } from "@/components/common/form";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/features/auth/schemas/forgot-password.schema";

export function ForgotPasswordForm() {
  const { mutate: sendResetCode, isPending } = useForgotPassword();

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
    sendResetCode(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <FormField
        id="forgot-email"
        label="Email Address"
        error={errors.email?.message}
        labelClassName="text-sm font-semibold text-gray-700"
      >
        <FormInput
          id="forgot-email"
          type="email"
          autoComplete="email"
          placeholder="e.g. foodlover@example.com"
          disabled={isPending}
          error={errors.email?.message}
          leadingIcon={<Mail className="size-5 text-gray-400" aria-hidden="true" />}
          className="h-12 rounded-xl bg-spotq-cream pl-11 pr-4 border-spotq-border focus-visible:border-spotq-orange focus-visible:ring-spotq-orange/50 text-gray-900 placeholder:text-gray-400"
          {...register("email")}
        />
      </FormField>

      <SubmitButton
        size="lg"
        isLoading={isPending}
        loadingText="Sending Reset Code..."
        className="w-full h-12 rounded-xl bg-spotq-orange text-white hover:bg-spotq-orange/90 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:translate-y-[1px]"
      >
        <span>Send Reset Code</span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </SubmitButton>

      <div className="pt-2 text-center">
        <Link
          to={CUSTOMER_ROUTES.AUTH.LOGIN}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Back to Login</span>
        </Link>
      </div>
    </form>
  );
}
