import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminForgotPassword } from "@/features/auth/hooks/useAdminForgotPassword";
import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/features/auth/schemas/forgot-password.schema";
import { cn } from "@/lib/utils/cn";

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
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="admin-forgot-email"
          className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase"
        >
          Identity
        </Label>
        <div
          className={cn(
            "relative flex items-center border-b border-border/80 pb-1 transition-colors focus-within:border-foreground",
            errors.email && "border-destructive focus-within:border-destructive",
          )}
        >
          <Mail className="absolute left-0 size-4 text-muted-foreground" aria-hidden="true" />
          <Input
            id="admin-forgot-email"
            type="email"
            autoComplete="email"
            placeholder="admin@spotq.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "admin-forgot-email-error" : undefined}
            className="h-9 rounded-none border-0 bg-transparent pl-7 pr-0 text-sm shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p id="admin-forgot-email-error" role="alert" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="mt-4 h-12 w-full rounded-full text-xs font-bold tracking-widest uppercase transition-transform active:scale-[0.99]"
        aria-label="Send verification code"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
            Sending Code…
          </>
        ) : (
          "Send Verification Code"
        )}
      </Button>

      <div className="pt-2 text-center">
        <Link
          to="/admin/login"
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
