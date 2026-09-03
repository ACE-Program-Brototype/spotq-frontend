import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LoginFormValues, loginSchema } from "@/features/auth/schemas/login.schema";
import { cn } from "@/lib/utils/cn";

export interface StaffLoginFormProps {
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

export default function StaffLoginForm({
  onSubmit = async () => {},
  isLoading = false,
}: StaffLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="staff-email" className="text-xs font-medium text-[#514943]">
          Email Address
        </Label>

        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#918780]"
            aria-hidden="true"
          />

          <Input
            id="staff-email"
            type="email"
            autoComplete="email"
            placeholder="name@restaurant.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "staff-email-error" : undefined}
            className={cn(
              "h-11 rounded-md border-[#d9cbc2] bg-[#fffdfb] pl-10 pr-3 text-sm",
              "placeholder:text-[#aaa09a]",
              "focus-visible:border-[#b84b00] focus-visible:ring-2 focus-visible:ring-[#b84b00]/15",
              errors.email && "border-destructive focus-visible:border-destructive",
            )}
            {...register("email")}
          />
        </div>

        {errors.email && (
          <p id="staff-email-error" role="alert" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="staff-password" className="text-xs font-medium text-[#514943]">
            Password
          </Label>

          <Link
            to="/staff/forgot-password"
            className="text-xs font-medium text-[#a94600] transition-colors hover:text-[#863800] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#918780]"
            aria-hidden="true"
          />

          <Input
            id="staff-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "staff-password-error" : undefined}
            className={cn(
              "h-11 rounded-md border-[#d9cbc2] bg-[#fffdfb] pl-10 pr-11 text-sm",
              "placeholder:text-[#aaa09a]",
              "focus-visible:border-[#b84b00] focus-visible:ring-2 focus-visible:ring-[#b84b00]/15",
              errors.password && "border-destructive focus-visible:border-destructive",
            )}
            {...register("password")}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 size-7 -translate-y-1/2 text-[#918780] hover:bg-transparent hover:text-[#514943]"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>

        {errors.password && (
          <p id="staff-password-error" role="alert" className="text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className={cn(
          "h-11 w-full rounded-md",
          "bg-[#b84b00] text-sm font-semibold text-white",
          "hover:bg-[#9d3f00]",
          "focus-visible:ring-2 focus-visible:ring-[#b84b00]/30",
          "active:translate-y-px",
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
            Signing in...
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </form>
  );
}
