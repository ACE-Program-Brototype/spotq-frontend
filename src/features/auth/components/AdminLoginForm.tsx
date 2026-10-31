import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { ADMIN_ROUTES } from "@/app/router/routes.constants";
import { FormField, FormInput, PasswordField, SubmitButton } from "@/components/common/form";
import { useAdminLogin } from "@/features/auth/hooks/useAdminLogin";
import { type LoginFormValues, loginSchema } from "@/features/auth/schemas/login.schema";
import { cn } from "@/lib/utils/cn";

export function AdminLoginForm() {
  const { mutate: login, isPending } = useAdminLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FormField
        id="admin-email"
        label="Identity"
        error={errors.email?.message}
        className="flex flex-col gap-2 space-y-0"
      >
        <div
          className={cn(
            "relative flex items-center border-b border-border/80 pb-1 transition-colors focus-within:border-foreground",
            errors.email && "border-destructive focus-within:border-destructive",
          )}
        >
          <FormInput
            id="admin-email"
            type="email"
            autoComplete="email"
            placeholder="admin@spotq.com"
            disabled={isPending}
            error={errors.email?.message}
            leadingIcon={<Mail className="size-4 text-muted-foreground" aria-hidden="true" />}
            className="h-9 rounded-none border-0 bg-transparent pl-7 pr-0 text-sm shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
            {...register("email")}
          />
        </div>
      </FormField>

      <FormField
        id="admin-password"
        label="Key"
        error={errors.password?.message}
        className="flex flex-col gap-2 space-y-0"
        labelAction={
          <Link
            to={ADMIN_ROUTES.FORGOT_PASSWORD}
            className="text-[11px] font-normal text-muted-foreground transition-colors hover:text-foreground hover:no-underline"
          >
            Forgot key?
          </Link>
        }
      >
        <div
          className={cn(
            "relative flex items-center border-b border-border/80 pb-1 transition-colors focus-within:border-foreground",
            errors.password && "border-destructive focus-within:border-destructive",
          )}
        >
          <PasswordField
            id="admin-password"
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={isPending}
            error={errors.password?.message}
            leadingIcon={<Lock className="size-4 text-muted-foreground" aria-hidden="true" />}
            className="h-9 rounded-none border-0 bg-transparent pl-7 pr-8 text-sm shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
            {...register("password")}
          />
        </div>
      </FormField>

      <SubmitButton
        size="lg"
        isLoading={isPending}
        loadingText="Signing in…"
        className="mt-4 h-12 w-full rounded-full text-xs font-bold tracking-widest uppercase transition-transform active:scale-[0.99]"
        aria-label="Sign in to admin dashboard"
      >
        Sign In
      </SubmitButton>
    </form>
  );
}

export default AdminLoginForm;
