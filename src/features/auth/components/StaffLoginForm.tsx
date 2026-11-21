import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { STAFF_ROUTES } from "@/app/router/routes.constants";
import { FormField, FormInput, PasswordField, SubmitButton } from "@/components/common/form";
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

  const onFormSubmit = (data: LoginFormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-5">
      <FormField id="staff-email" label="Email Address" error={errors.email?.message}>
        <FormInput
          id="staff-email"
          type="email"
          autoComplete="email"
          placeholder="name@restaurant.com"
          disabled={isLoading}
          error={errors.email?.message}
          leadingIcon={<Mail className="size-4 text-[#918780]" aria-hidden="true" />}
          className={cn(
            "h-11 rounded-md border-[#d9cbc2] bg-[#fffdfb] pl-10 pr-3 text-sm",
            "placeholder:text-[#aaa09a]",
            "focus-visible:border-[#b84b00] focus-visible:ring-2 focus-visible:ring-[#b84b00]/15",
            errors.email && "border-destructive focus-visible:border-destructive",
          )}
          {...register("email")}
        />
      </FormField>

      <FormField
        id="staff-password"
        label="Password"
        error={errors.password?.message}
        labelAction={
          <Link
            to={STAFF_ROUTES.FORGOT_PASSWORD}
            className="text-xs font-medium text-[#a94600] transition-colors hover:text-[#863800] hover:underline"
          >
            Forgot password?
          </Link>
        }
      >
        <PasswordField
          id="staff-password"
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={isLoading}
          error={errors.password?.message}
          leadingIcon={<Lock className="size-4 text-[#918780]" aria-hidden="true" />}
          className={cn(
            "h-11 rounded-md border-[#d9cbc2] bg-[#fffdfb] pl-10 pr-11 text-sm",
            "placeholder:text-[#aaa09a]",
            "focus-visible:border-[#b84b00] focus-visible:ring-2 focus-visible:ring-[#b84b00]/15",
            errors.password && "border-destructive focus-visible:border-destructive",
          )}
          {...register("password")}
        />
      </FormField>

      <SubmitButton
        isLoading={isLoading}
        loadingText="Signing in..."
        className={cn(
          "h-11 w-full rounded-md",
          "bg-[#b84b00] text-sm font-semibold text-white",
          "hover:bg-[#9d3f00]",
          "focus-visible:ring-2 focus-visible:ring-[#b84b00]/30",
          "active:translate-y-px",
        )}
      >
        Continue
      </SubmitButton>
    </form>
  );
}
