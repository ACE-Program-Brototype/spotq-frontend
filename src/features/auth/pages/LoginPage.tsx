import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (res: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: {
              theme?: string;
              size?: string;
              width?: string;
              text?: string;
              shape?: string;
            },
          ) => void;
        };
      };
    };
  }
}

import { toast } from "sonner";
// SpotQ Logo Import
import spotqLogo from "@/assets/logos/spotq-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { type LoginFormValues, loginSchema } from "../schemas/login.schema";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, setAuth, setRememberMe } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // If already authenticated, redirect to home screen
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

  const onSubmit = async (values: LoginFormValues) => {
    if (isLoading) return;
    setIsLoading(true);

    // Save rememberMe selection in store (always remember user)
    setRememberMe(true);

    try {
      const response = await authService.login({
        email: values.email,
        password: values.password,
      });

      if (response.success && response.data) {
        toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
        setAuth(response.data.user, response.data.accessToken);
        navigate("/", { replace: true });
      } else {
        toast.error(response.message || AUTH_MESSAGES.GENERIC_ERROR);
      }
    } catch (err: unknown) {
      const error = err as Error & { response?: Response };
      // Map API errors to friendly user messages
      if (error.response) {
        try {
          const apiErr = (await error.response.json()) as {
            error?: string;
            message?: string;
          };
          const errCode = apiErr.error;

          if (errCode === "INVALID_CREDENTIALS") {
            toast.error(AUTH_MESSAGES.INVALID_CREDENTIALS);
          } else if (errCode === "ACCOUNT_BLOCKED") {
            toast.error(AUTH_MESSAGES.ACCOUNT_BLOCKED);
          } else if (errCode === "ACCOUNT_INACTIVE") {
            toast.error(AUTH_MESSAGES.ACCOUNT_INACTIVE);
          } else {
            toast.error(apiErr.message || AUTH_MESSAGES.LOGIN_FAILED);
          }
        } catch {
          if (error.response.status === 401) {
            toast.error(AUTH_MESSAGES.INVALID_CREDENTIALS);
          } else if (error.response.status === 403) {
            toast.error(AUTH_MESSAGES.ACCOUNT_SUSPENDED);
          } else if (error.response.status === 503) {
            toast.error(AUTH_MESSAGES.GENERIC_ERROR);
          } else {
            toast.error(AUTH_MESSAGES.UNEXPECTED_ERROR);
          }
        }
      } else if (error.message?.includes("Failed to fetch")) {
        toast.error(AUTH_MESSAGES.CONNECTION_ERROR);
      } else {
        toast.error(AUTH_MESSAGES.GENERIC_ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoogleCredentialResponse = React.useCallback(
    async (response: { credential: string }) => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        const res = await authService.googleLogin({
          idToken: response.credential,
        });

        if (res.success && res.data) {
          toast.success(AUTH_MESSAGES.GOOGLE_SUCCESS);

          const normalizedUser = {
            id: res.data.user.id,
            fullname: res.data.user.full_name,
            email: res.data.user.email,
            phone: "", // Google does not supply phone number
            status: res.data.user.status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setAuth(normalizedUser, res.data.access_token);
          navigate("/", { replace: true });
        } else {
          toast.error(res.message || AUTH_MESSAGES.GOOGLE_FAILED);
        }
      } catch (err: unknown) {
        const error = err as Error & { response?: Response };
        if (error.response) {
          try {
            const apiErr = (await error.response.json()) as { message?: string };
            toast.error(apiErr.message || AUTH_MESSAGES.GOOGLE_FAILED);
          } catch {
            toast.error(AUTH_MESSAGES.GOOGLE_TRY_AGAIN);
          }
        } else {
          toast.error(AUTH_MESSAGES.CONNECTION_ERROR);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, setAuth, navigate],
  );

  React.useEffect(() => {
    const initGoogleSignIn = () => {
      const google = window.google;
      if (google?.accounts?.id) {
        google.accounts.id.initialize({
          client_id:
            import.meta.env.VITE_GOOGLE_CLIENT_ID ||
            "your-google-client-id.apps.googleusercontent.com",
          callback: handleGoogleCredentialResponse,
        });
        google.accounts.id.renderButton(document.getElementById("google-signin-button"), {
          theme: "outline",
          size: "large",
          width: "360", // matches mobile and desktop form widths
          text: "signup_with",
          shape: "rectangular",
        });
      }
    };

    const timer = setInterval(() => {
      if (window.google?.accounts?.id) {
        initGoogleSignIn();
        clearInterval(timer);
      }
    }, 500);

    return () => clearInterval(timer);
  }, [handleGoogleCredentialResponse]);

  return (
    <div className="flex min-h-screen w-full select-none bg-background text-foreground antialiased font-sans">
      {/* LEFT PANEL: Visible on desktop only (split screen layout) */}
      <div className="hidden md:flex md:w-1/2 bg-spotq-orange text-white p-12 flex-col justify-between relative overflow-hidden select-none">
        {/* Brand Logo & Name Header */}
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-xl p-2 shadow-md">
            <img src={spotqLogo} alt="SpotQ Logo" className="h-6 w-auto" />
          </div>
          <span className="font-bold text-xl tracking-wide">SpotQ</span>
        </div>

        {/* Center welcome text and high-fidelity graphics */}
        <div className="space-y-8 max-w-md my-auto">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight lg:text-5xl">
              Welcome back, foodie.
            </h1>
            <p className="text-white/80 text-sm leading-relaxed">
              The table is set, and your spot is waiting. Sign in to skip the queue and dive
              straight into your next culinary adventure.
            </p>
          </div>

          {/* Floating graphic card element */}
          <div className="w-full aspect-[4/3] rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl relative group/card transition-all duration-300 hover:scale-[1.02]">
            <div className="size-24 rounded-full bg-white/20 flex items-center justify-center border border-white/30 animate-pulse">
              <User className="size-12 text-white" />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-white/60">
          © {new Date().getFullYear()} SpotQ Platform. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL / FORM AREA: Visible on all devices */}
      <div className="w-full md:w-1/2 flex flex-col justify-between bg-white relative">
        {/* Mobile top bar navigation header */}
        <header className="flex items-center px-4 h-14 border-b border-gray-100 md:hidden select-none">
          <button
            type="button"
            onClick={handleBack}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors mr-3"
            aria-label="Go back"
          >
            <ArrowLeft className="size-6 text-foreground/80" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">Login</h2>
        </header>

        {/* Content body container */}
        <div className="w-full max-w-md mx-auto px-6 py-12 md:py-16 my-auto flex flex-col justify-center gap-8">
          {/* Mobile brand logo block */}
          <div className="flex justify-center md:hidden">
            <img src={spotqLogo} alt="SpotQ Logo" className="h-12 w-auto object-contain" />
          </div>

          {/* Main titles */}
          <div className="text-center md:text-left space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Login to your account
            </h2>
            <p className="text-sm text-gray-500">
              <span className="hidden md:inline">Access your bookings and favorite spots</span>
              <span className="inline md:hidden">Welcome back! Please enter your details.</span>
            </p>
          </div>

          {/* Form */}
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
                leftIcon={
                  // Icon on left for desktop, omitted/handled differently in mobile
                  <Mail className="hidden md:block size-5 text-gray-400" />
                }
                rightIcon={
                  // @ symbol suffix for mobile view
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

          {/* Social login separator */}
          <div className="relative flex items-center my-2 select-none">
            <div className="flex-grow border-t border-gray-150"></div>
            <span className="flex-shrink mx-4 text-xs text-gray-400 font-medium lowercase">
              <span className="hidden md:inline">Or continue with</span>
              <span className="inline md:hidden">or</span>
            </span>
            <div className="flex-grow border-t border-gray-150"></div>
          </div>

          {/* Google Sign In Button */}
          <div className="w-full flex justify-center items-center h-12">
            <div id="google-signin-button" className="w-full flex justify-center"></div>
          </div>

          {/* Footer link */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-bold text-spotq-orange hover:text-spotq-orange/80 transition-colors"
            >
              <span className="hidden md:inline">Register now</span>
              <span className="inline md:hidden">Register</span>
            </button>
          </p>
        </div>

        {/* Mobile footer spacing */}
        <div className="h-6 md:hidden"></div>
      </div>
    </div>
  );
}
