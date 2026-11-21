import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { ADMIN_ROUTES } from "@/app/router/routes.constants";
import { FormField, PasswordField, SubmitButton } from "@/components/common/form";
import { useAdminResetPassword } from "@/features/auth/hooks/useAdminResetPassword";
import {
  type AdminResetPasswordFormValues,
  adminResetPasswordSchema,
} from "@/features/auth/schemas/reset-password.schema";

export function AdminResetPasswordForm() {
  const { mutate: resetPassword, isPending } = useAdminResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminResetPasswordFormValues>({
    resolver: zodResolver(adminResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: AdminResetPasswordFormValues) => {
    resetPassword({ password: data.password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FormField
        id="admin-new-password"
        label="New Key"
        error={errors.password?.message}
        labelClassName="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase"
      >
        <PasswordField
          id="admin-new-password"
          autoComplete="new-password"
          placeholder="••••••••"
          disabled={isPending}
          error={errors.password?.message}
          leadingIcon={<Lock className="size-4 text-muted-foreground" aria-hidden="true" />}
          className="h-9 rounded-none border-0 border-b border-border/80 bg-transparent pl-7 pr-8 text-sm shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:border-foreground"
          {...register("password")}
        />
      </FormField>

      <FormField
        id="admin-confirm-password"
        label="Confirm Key"
        error={errors.confirmPassword?.message}
        labelClassName="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase"
      >
        <PasswordField
          id="admin-confirm-password"
          autoComplete="new-password"
          placeholder="••••••••"
          disabled={isPending}
          error={errors.confirmPassword?.message}
          leadingIcon={<Lock className="size-4 text-muted-foreground" aria-hidden="true" />}
          className="h-9 rounded-none border-0 border-b border-border/80 bg-transparent pl-7 pr-8 text-sm shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:border-foreground"
          {...register("confirmPassword")}
        />
      </FormField>

      <SubmitButton
        size="lg"
        isLoading={isPending}
        loadingText="Updating Key…"
        className="mt-4 h-12 w-full rounded-full text-xs font-bold tracking-widest uppercase transition-transform active:scale-[0.99]"
        aria-label="Update key"
      >
        Update Key
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

export default AdminResetPasswordForm;
