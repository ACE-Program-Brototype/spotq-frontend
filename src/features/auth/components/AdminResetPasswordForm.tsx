import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminResetPassword } from "@/features/auth/hooks/useAdminResetPassword";
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/features/auth/schemas/reset-password.schema";
import { cn } from "@/lib/utils/cn";

export function AdminResetPasswordForm() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: resetPassword, isPending } = useAdminResetPassword();

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
    mode: "onChange",
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPassword({ password: data.password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {/* New Key field */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="admin-new-password"
          className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase"
        >
          New Key
        </Label>
        <div
          className={cn(
            "relative flex items-center border-b border-border/80 pb-1 transition-colors focus-within:border-foreground",
            errors.password && "border-destructive focus-within:border-destructive",
          )}
        >
          <Lock className="absolute left-0 size-4 text-muted-foreground" aria-hidden="true" />
          <Input
            id="admin-new-password"
            type={showNewPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "admin-new-password-error" : undefined}
            className="h-9 rounded-none border-0 bg-transparent pl-7 pr-8 text-sm shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
            {...register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setShowNewPassword((prev) => !prev)}
            aria-label={showNewPassword ? "Hide password" : "Show password"}
            className="absolute right-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            {showNewPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p id="admin-new-password-error" role="alert" className="text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm New Key field */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="admin-confirm-password"
          className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase"
        >
          Confirm Key
        </Label>
        <div
          className={cn(
            "relative flex items-center border-b border-border/80 pb-1 transition-colors focus-within:border-foreground",
            errors.confirmPassword && "border-destructive focus-within:border-destructive",
          )}
        >
          <Lock className="absolute left-0 size-4 text-muted-foreground" aria-hidden="true" />
          <Input
            id="admin-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "admin-confirm-password-error" : undefined}
            className="h-9 rounded-none border-0 bg-transparent pl-7 pr-8 text-sm shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
            {...register("confirmPassword")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            className="absolute right-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p id="admin-confirm-password-error" role="alert" className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="mt-4 h-12 w-full rounded-full text-xs font-bold tracking-widest uppercase transition-transform active:scale-[0.99]"
        aria-label="Update key"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
            Updating Key…
          </>
        ) : (
          "Update Key"
        )}
      </Button>

      {/* Back to Sign In */}
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

export default AdminResetPasswordForm;
