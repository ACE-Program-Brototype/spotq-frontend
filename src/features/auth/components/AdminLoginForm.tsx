import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminLogin } from "@/features/auth/hooks/useAdminLogin";
import { type LoginFormValues, loginSchema } from "@/features/auth/schemas/login.schema";
import { cn } from "@/lib/utils/cn";

export function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="admin-email"
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
            id="admin-email"
            type="email"
            autoComplete="email"
            placeholder="admin@spotq.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "admin-email-error" : undefined}
            className="h-9 rounded-none border-0 bg-transparent pl-7 pr-0 text-sm shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p id="admin-email-error" role="alert" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="admin-password"
            className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase"
          >
            Key
          </Label>
          <Link
            to="/admin/forgot-password"
            className="text-[11px] font-normal text-muted-foreground transition-colors hover:text-foreground hover:no-underline"
          >
            Forgot key?
          </Link>
        </div>
        <div
          className={cn(
            "relative flex items-center border-b border-border/80 pb-1 transition-colors focus-within:border-foreground",
            errors.password && "border-destructive focus-within:border-destructive",
          )}
        >
          <Lock className="absolute left-0 size-4 text-muted-foreground" aria-hidden="true" />
          <Input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "admin-password-error" : undefined}
            className="h-9 rounded-none border-0 bg-transparent pl-7 pr-8 text-sm shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
            {...register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p id="admin-password-error" role="alert" className="text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="mt-4 h-12 w-full rounded-full text-xs font-bold tracking-widest uppercase transition-transform active:scale-[0.99]"
        aria-label="Sign in to admin dashboard"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}

export default AdminLoginForm;
