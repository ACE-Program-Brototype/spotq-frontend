import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import { type RegisterFormValues, registerSchema } from "../schemas/register.schema";

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void> | void;
  isLoading: boolean;
}

export const RegisterForm = ({ onSubmit, isLoading }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="fullName" error={!!errors.fullName}>
          Full Name
        </Label>

        <div className="relative flex items-center">
          <User className="hidden md:block absolute left-3.5 size-5 text-gray-400 pointer-events-none" />
          <Input
            id="fullName"
            type="text"
            placeholder="e.g. Alex Johnson"
            disabled={isLoading}
            className={cn(
              "h-12 rounded-xl bg-spotq-cream pl-4 md:pl-11 pr-4 border-spotq-border focus-visible:border-spotq-orange focus-visible:ring-spotq-orange/50",
              errors.fullName && "border-destructive focus-visible:ring-destructive/30",
            )}
            {...register("fullName")}
          />
        </div>

        {errors.fullName && (
          <p className="text-xs text-destructive mt-1.5" role="alert">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" error={!!errors.email}>
          Email Address
        </Label>

        <div className="relative flex items-center">
          <Mail className="hidden md:block absolute left-3.5 size-5 text-gray-400 pointer-events-none" />
          <Input
            id="email"
            type="email"
            placeholder="e.g. alex@example.com"
            disabled={isLoading}
            className={cn(
              "h-12 rounded-xl bg-spotq-cream pl-4 md:pl-11 pr-11 border-spotq-border focus-visible:border-spotq-orange focus-visible:ring-spotq-orange/50",
              errors.email && "border-destructive focus-visible:ring-destructive/30",
            )}
            {...register("email")}
          />
          <span className="block md:hidden absolute right-3.5 text-gray-400 font-medium text-base select-none pointer-events-none">
            @
          </span>
        </div>

        {errors.email && (
          <p className="text-xs text-destructive mt-1.5" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" error={!!errors.phoneNumber}>
          Phone Number
        </Label>

        <div className="flex gap-2">
          <div className="flex h-12 shrink-0 items-center rounded-xl border border-spotq-border bg-spotq-cream px-3 text-sm font-medium text-gray-600">
            +91
          </div>

          <div className="relative flex-1 flex items-center">
            <Phone className="hidden md:block absolute left-3.5 size-5 text-gray-400 pointer-events-none" />
            <Input
              id="phoneNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="9876543210"
              disabled={isLoading}
              className={cn(
                "h-12 rounded-xl bg-spotq-cream pl-4 md:pl-11 pr-4 border-spotq-border focus-visible:border-spotq-orange focus-visible:ring-spotq-orange/50",
                errors.phoneNumber && "border-destructive focus-visible:ring-destructive/30",
              )}
              {...register("phoneNumber", {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                },
              })}
            />
          </div>
        </div>

        {errors.phoneNumber && (
          <p className="text-xs text-destructive mt-1.5" role="alert">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" error={!!errors.password}>
          Password
        </Label>

        <div className="relative flex items-center">
          <Lock className="hidden md:block absolute left-3.5 size-5 text-gray-400 pointer-events-none" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            disabled={isLoading}
            className={cn(
              "h-12 rounded-xl bg-spotq-cream pl-4 md:pl-11 pr-11 border-spotq-border focus-visible:border-spotq-orange focus-visible:ring-spotq-orange/50",
              errors.password && "border-destructive focus-visible:ring-destructive/30",
            )}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 p-1 rounded-full hover:bg-gray-100/50 transition-colors cursor-pointer text-gray-400 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>

        {errors.password && (
          <p className="text-xs text-destructive mt-1.5" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" error={!!errors.confirmPassword}>
          Confirm Password
        </Label>

        <div className="relative flex items-center">
          <Lock className="hidden md:block absolute left-3.5 size-5 text-gray-400 pointer-events-none" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            disabled={isLoading}
            className={cn(
              "h-12 rounded-xl bg-spotq-cream pl-4 md:pl-11 pr-11 border-spotq-border focus-visible:border-spotq-orange focus-visible:ring-spotq-orange/50",
              errors.confirmPassword && "border-destructive focus-visible:ring-destructive/30",
            )}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 p-1 rounded-full hover:bg-gray-100/50 transition-colors cursor-pointer text-gray-400 focus:outline-none"
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>

        {confirmPassword.length > 0 && passwordsMatch && !errors.confirmPassword && (
          <div className="flex items-center gap-1.5 text-xs text-green-600">
            <Check className="size-3.5" />
            <span>Passwords match</span>
          </div>
        )}

        {errors.confirmPassword && (
          <p className="text-xs text-destructive mt-1.5" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <input
          id="termsAccepted"
          type="checkbox"
          {...register("termsAccepted")}
          className="mt-1 size-4 rounded border-gray-300 text-spotq-orange focus:ring-spotq-orange"
        />

        <label htmlFor="termsAccepted" className="text-sm leading-5 text-gray-600 cursor-pointer">
          I agree to the{" "}
          <button
            type="button"
            onClick={() => navigate("/terms-and-conditions")}
            className="font-semibold text-spotq-orange hover:text-spotq-orange/80 cursor-pointer"
          >
            Terms and Conditions
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={() => navigate("/privacy-policy")}
            className="font-semibold text-spotq-orange hover:text-spotq-orange/80 cursor-pointer"
          >
            Privacy Policy
          </button>
          .
        </label>
      </div>

      {errors.termsAccepted && (
        <p className="text-sm text-red-500">{errors.termsAccepted.message}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isLoading}
        className="w-full h-12 rounded-xl bg-spotq-orange text-white hover:bg-spotq-orange/90 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:translate-y-[1px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            <span>Registering...</span>
          </>
        ) : (
          <>
            <span>Register</span>
            <span className="text-lg leading-none">→</span>
          </>
        )}
      </Button>
    </form>
  );
};
