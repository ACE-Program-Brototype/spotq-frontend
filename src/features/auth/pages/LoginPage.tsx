import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
// SpotQ Logo Import
import spotqLogo from "@/assets/logos/spotq-logo.png";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";

// Validation schema strictly requiring valid email and password
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, setAuth, rememberMe, setRememberMe } = useAuthStore();
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
      rememberMe: rememberMe,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (isLoading) return;
    setIsLoading(true);

    // Save rememberMe selection in store
    setRememberMe(values.rememberMe);

    try {
      const response = await authService.login({
        email: values.email,
        password: values.password,
      });

      if (response.success && response.data) {
        toast.success("Login successful!");
        setAuth(response.data.user, response.data.accessToken);
        navigate("/", { replace: true });
      } else {
        toast.error(response.message || "Something went wrong.");
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
            toast.error("Invalid email or password.");
          } else if (errCode === "ACCOUNT_BLOCKED") {
            toast.error("Your account has been blocked.");
          } else if (errCode === "ACCOUNT_INACTIVE") {
            toast.error("Your account is inactive.");
          } else {
            toast.error(apiErr.message || "Login failed. Please try again.");
          }
        } catch {
          if (error.response.status === 401) {
            toast.error("Invalid email or password.");
          } else if (error.response.status === 403) {
            toast.error("Your account is suspended/inactive.");
          } else if (error.response.status === 503) {
            toast.error("Something went wrong. Please try again.");
          } else {
            toast.error("An unexpected error occurred. Please try again.");
          }
        }
      } else if (error.message?.includes("Failed to fetch")) {
        toast.error("Unable to connect. Please check your connection and try again.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoogleSignIn = () => {
    toast.info("Google Sign-In is coming soon!");
  };

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
            <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="text-xs text-white/95 font-medium">
                Table Booking & Queue Skipper
              </span>
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

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2.5">
              <Checkbox id="rememberMe" disabled={isLoading} {...register("rememberMe")} />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium text-gray-600 cursor-pointer select-none leading-none"
              >
                Remember me for 30 days
              </label>
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
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 rounded-xl border border-spotq-border hover:bg-gray-50 text-gray-700 transition-colors font-medium flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              aria-label="Google logo"
              role="img"
            >
              <title>Google logo</title>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="hidden md:inline">Google</span>
            <span className="inline md:hidden">Sign up with Google</span>
          </Button>

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
