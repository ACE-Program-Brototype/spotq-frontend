import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { FormField, FormInput, PasswordField, SubmitButton } from "@/components/common/form";
import { cn } from "@/lib/utils/cn";
import { type LoginFormValues, loginSchema } from "../schemas/login.schema";

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
  isLoading: boolean;
}

export const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const navigate = useNavigate();

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
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" noValidate>
      <FormField id="email" label="Email Address" error={errors.email?.message}>
        <div className="relative flex items-center">
          <FormInput
            id="email"
            type="email"
            placeholder="e.g. alex@example.com"
            disabled={isLoading}
            leadingIcon={<Mail className="hidden md:block size-5 text-gray-400" />}
            error={errors.email?.message}
            className={cn(
              "h-12 rounded-xl bg-spotq-cream pl-4 md:pl-11 pr-11 border-spotq-border focus-visible:border-spotq-orange focus-visible:ring-spotq-orange/50",
            )}
            {...register("email")}
          />
          <span className="block md:hidden absolute right-3.5 text-gray-400 font-medium text-base select-none pointer-events-none">
            @
          </span>
        </div>
      </FormField>

      <FormField
        id="password"
        label="Password"
        error={errors.password?.message}
        labelAction={
          <button
            type="button"
            onClick={() => navigate(CUSTOMER_ROUTES.AUTH.FORGOT_PASSWORD)}
            className="text-xs font-semibold text-spotq-orange hover:text-spotq-orange/80 transition-colors"
          >
            Forgot Password?
          </button>
        }
      >
        <PasswordField
          id="password"
          placeholder="••••••••"
          disabled={isLoading}
          leadingIcon={<Lock className="hidden md:block size-5 text-gray-400" />}
          error={errors.password?.message}
          className={cn(
            "h-12 rounded-xl bg-spotq-cream pl-4 md:pl-11 border-spotq-border focus-visible:border-spotq-orange focus-visible:ring-spotq-orange/50",
          )}
          {...register("password")}
        />
      </FormField>

      <SubmitButton
        size="lg"
        isLoading={isLoading}
        loadingText="Logging in..."
        className="w-full h-12 rounded-xl bg-spotq-orange text-white hover:bg-spotq-orange/90 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:translate-y-[1px]"
      >
        <span>Login</span>
        <span className="text-lg leading-none">→</span>
      </SubmitButton>
    </form>
  );
};

export default LoginForm;
