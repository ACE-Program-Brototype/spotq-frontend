import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LoginFormValues, loginSchema } from "../schemas/login.schema";

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
  isLoading: boolean;
}

export const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const navigate = useNavigate();
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Email field */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="email" error={!!errors.email}>
            Email Address
          </Label>
        </div>
        <Input
          id="email"
          type="email"
          placeholder="e.g. alex@example.com"
          error={!!errors.email}
          leftIcon={<Mail className="hidden md:block size-5 text-gray-400" />}
          rightIcon={
            <span className="block md:hidden text-gray-400 font-medium text-base select-none">
              @
            </span>
          }
          disabled={isLoading}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive mt-1.5" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" error={!!errors.password}>
            Password
          </Label>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-xs font-semibold text-spotq-orange hover:text-spotq-orange/80 transition-colors"
          >
            Forgot Password?
          </button>
        </div>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          error={!!errors.password}
          leftIcon={<Lock className="hidden md:block size-5 text-gray-400" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 -mr-1.5 rounded-full hover:bg-gray-100/50 transition-colors cursor-pointer text-gray-400 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          }
          disabled={isLoading}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-destructive mt-1.5" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        disabled={isLoading}
        className="w-full h-12 rounded-xl bg-spotq-orange text-white hover:bg-spotq-orange/90 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:translate-y-[1px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            <span>Logging in...</span>
          </>
        ) : (
          <>
            <span>Login</span>
            <span className="text-lg leading-none">→</span>
          </>
        )}
      </Button>
    </form>
  );
};
