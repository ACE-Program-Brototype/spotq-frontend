import { ArrowLeft } from "lucide-react";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import spotqLogo from "@/assets/logos/spotq-logo.png";
import { AuthDivider, AuthHeroPanel, GoogleLoginButton, LoginForm } from "../components";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { useGoogleLoginMutation } from "../hooks/use-auth-mutations";
import { useLogin } from "../hooks/use-login";
import type { LoginFormValues } from "../schemas/login.schema";
import { useAuthStore } from "../store/auth.store";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const { handleLogin, isLoading: isLoginLoading } = useLogin();
  const googleLoginMutation = useGoogleLoginMutation();
  const isLoading = isLoginLoading || googleLoginMutation.isPending;

  const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const onSubmit = async (values: LoginFormValues) => {
    if (isLoading) return;
    await handleLogin(values);
  };

  const handleGoogleSuccess = useCallback(
    async (response: { credential: string }) => {
      try {
        const res = await googleLoginMutation.mutateAsync({
          idToken: response.credential,
        });

        if (res.success && res.data) {
          toast.success(AUTH_MESSAGES.GOOGLE_SUCCESS);
          setAuth({ ...res.data.user, role: "CUSTOMER" }, res.data.accessToken);
          navigate(destination, { replace: true });
        } else {
          toast.error(res.message || AUTH_MESSAGES.GOOGLE_FAILED);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : AUTH_MESSAGES.GOOGLE_FAILED;
        toast.error(message);
      }
    },
    [setAuth, navigate, googleLoginMutation, destination],
  );

  return (
    <div className="flex min-h-screen w-full select-none bg-background text-foreground antialiased font-sans">
      <AuthHeroPanel />

      <div className="w-full md:w-1/2 flex flex-col justify-between bg-white relative">
        <header className="flex items-center px-4 h-14 border-b border-gray-100 md:hidden select-none">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors mr-3"
            aria-label="Go back"
          >
            <ArrowLeft className="size-6 text-foreground/80" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">Login</h2>
        </header>

        <div className="w-full max-w-md mx-auto px-6 py-12 md:py-16 my-auto flex flex-col justify-center gap-8">
          <div className="flex justify-center md:hidden">
            <img src={spotqLogo} alt="SpotQ Logo" className="h-12 w-auto object-contain" />
          </div>

          <div className="text-center md:text-left space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Login to your account
            </h2>
            <p className="text-sm text-gray-500">
              <span className="hidden md:inline">Access your bookings and favorite spots</span>
              <span className="inline md:hidden">Welcome back! Please enter your details.</span>
            </p>
          </div>

          <LoginForm onSubmit={onSubmit} isLoading={isLoading} />

          <AuthDivider />

          <GoogleLoginButton onSuccess={handleGoogleSuccess} disabled={isLoading} />

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-bold text-spotq-orange hover:text-spotq-orange/80 transition-colors cursor-pointer"
            >
              <span className="hidden md:inline">Register now</span>
              <span className="inline md:hidden">Register</span>
            </button>
          </p>
        </div>

        <div className="h-6 md:hidden" />
      </div>
    </div>
  );
}
