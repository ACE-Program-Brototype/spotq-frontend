import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { ADMIN_ROUTES } from "@/app/router/routes.constants";
import { FormField, FormInput, SubmitButton } from "@/components/common/form";
import { useAdminForgotPassword } from "@/features/auth/hooks/useAdminForgotPassword";
import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/features/auth/schemas/forgot-password.schema";

export function AdminForgotPasswordForm() {
  const { mutate: sendOtp, isPending } = useAdminForgotPassword();

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FormField
        id="admin-forgot-email"
        label="Identity"
        error={errors.email?.message}
        labelClassName="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase"
      >
        <FormInput
          id="admin-forgot-email"
          type="email"
          autoComplete="email"
          placeholder="admin@spotq.com"
          disabled={isPending}
          error={errors.email?.message}
          leadingIcon={<Mail className="size-4 text-muted-foreground" aria-hidden="true" />}
          className="h-9 rounded-none border-0 border-b border-border/80 bg-transparent pl-7 pr-0 text-sm shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:border-foreground"
          {...register("email")}
        />
      </FormField>

      <SubmitButton
        size="lg"
        isLoading={isPending}
        loadingText="Sending Code…"
        className="mt-4 h-12 w-full rounded-full text-xs font-bold tracking-widest uppercase transition-transform active:scale-[0.99]"
        aria-label="Send verification code"
      >
        Send Verification Code
      </SubmitButton>

      <div className="pt-2 text-center">
        <Link
          to={ADMIN_ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground hover:no-underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to Sign In
        </Link>
      </div>
    </form>
  );
}

export default AdminForgotPasswordForm;
