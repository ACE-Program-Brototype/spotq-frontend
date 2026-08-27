import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/features/auth/schemas/forgot-password.schema";
import { cn } from "@/lib/utils/cn";

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
      {/* Email Address field */}
      <div className="space-y-2">
        <Label
          htmlFor="forgot-email"
          error={!!errors.email}
          className="text-sm font-semibold text-gray-700"
        >
          Email Address
        </Label>
        <div className="relative flex items-center">
          <Mail
            className="absolute left-3.5 size-5 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="e.g. foodlover@example.com"
            disabled={isPending}
            className={cn(
              "h-12 rounded-xl bg-spotq-cream pl-11 pr-4 border-spotq-border focus-visible:border-spotq-orange focus-visible:ring-spotq-orange/50 text-gray-900 placeholder:text-gray-400",
              errors.email && "border-destructive focus-visible:ring-destructive/30",
            )}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive mt-1.5" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="w-full h-12 rounded-xl bg-spotq-orange text-white hover:bg-spotq-orange/90 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:translate-y-[1px]"
      >
        {isPending ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            <span>Sending Reset Code...</span>
          </>
        ) : (
          <>
            <span>Send Reset Code</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </Button>

      {/* Back to Login */}
      <div className="pt-2 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Back to Login</span>
        </Link>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
